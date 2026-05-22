// ============================================================
// DED — Sync Engine (Offline-First)
//
// Architecture:
//   Write → localStorage (instant) → queue → Supabase (async)
//   Startup → pull from Supabase → merge with local → update local
//
// Conflict resolution: last-write-wins (by logged_at timestamp)
// ============================================================

const SyncEngine = (() => {
  const QUEUE_KEY = 'ded_sync_queue';
  const LAST_SYNC_KEY = 'ded_last_sync';
  let _syncStatus = 'unknown'; // 'synced' | 'syncing' | 'offline' | 'unknown' | 'local-only'
  let _listeners = [];
  let _syncTimer = null;

  // --- Table mappings (localStorage key → Supabase table) ---
  const TABLE_MAP = {
    'gate_syllabus':   { table: 'gate_syllabus_progress', keyField: 'subtopic_id', type: 'object-map' },
    'gate_daily':      { table: 'gate_daily_entries',     keyField: 'date',         type: 'date-map' },
    'football_daily':  { table: 'football_daily_entries',  keyField: 'date',         type: 'date-map' },
    'gym_daily':       { table: 'gym_daily_entries',       keyField: 'date',         type: 'date-map' },
  };

  // ============================================================
  // Status management
  // ============================================================
  function getStatus() { return _syncStatus; }

  function _setStatus(status) {
    if (_syncStatus !== status) {
      _syncStatus = status;
      _listeners.forEach(fn => fn(status));
      _updateStatusIndicator();
    }
  }

  function onStatusChange(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(f => f !== fn); };
  }

  function _updateStatusIndicator() {
    const el = document.getElementById('sync-status');
    if (!el) return;

    const icons = {
      'synced':     { dot: '🟢', text: 'Synced' },
      'syncing':    { dot: '🟡', text: 'Syncing...' },
      'offline':    { dot: '🔴', text: 'Offline' },
      'local-only': { dot: '⚪', text: 'Local Only' },
      'unknown':    { dot: '⚫', text: '' },
    };

    const icon = icons[_syncStatus] || icons['unknown'];
    el.innerHTML = `<span class="sync-dot">${icon.dot}</span><span class="sync-text">${icon.text}</span>`;
    el.className = `sync-status sync-status--${_syncStatus}`;
  }

  // ============================================================
  // Sync Queue — stores pending writes when offline
  // ============================================================
  function _getQueue() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch { return []; }
  }

  function _saveQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  function _enqueue(storeKey, entryKey, data) {
    const queue = _getQueue();
    // Deduplicate — replace existing entry for same storeKey+entryKey
    const idx = queue.findIndex(q => q.storeKey === storeKey && q.entryKey === entryKey);
    const item = {
      storeKey,
      entryKey,
      data,
      queued_at: new Date().toISOString()
    };

    if (idx >= 0) {
      queue[idx] = item;
    } else {
      queue.push(item);
    }
    _saveQueue(queue);
  }

  // ============================================================
  // Write to Supabase
  // ============================================================
  async function _pushToSupabase(storeKey, entryKey, data) {
    const mapping = TABLE_MAP[storeKey];
    if (!mapping) return false;

    const client = SupabaseClient.getClient();
    if (!client) return false;

    try {
      let row;
      if (mapping.type === 'object-map') {
        // Gate syllabus: each key is a subtopic_id with a status value
        row = {
          [mapping.keyField]: entryKey,
          status: data,
          updated_at: new Date().toISOString()
        };
      } else {
        // Date-keyed entries: spread the data object
        row = { ...data };
        // Ensure the key field is set
        row[mapping.keyField] = entryKey;
        // Clean up any nested objects that need JSONB
        if (row.supplements && typeof row.supplements === 'object') {
          row.supplements = row.supplements;
        }
      }

      const { error } = await client
        .from(mapping.table)
        .upsert(row, { onConflict: mapping.keyField });

      if (error) {
        console.warn(`Sync push error (${mapping.table}):`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Sync push failed:', err);
      return false;
    }
  }

  // ============================================================
  // Flush the queue — push all pending writes to Supabase
  // ============================================================
  async function flushQueue() {
    const queue = _getQueue();
    if (queue.length === 0) return;

    const client = SupabaseClient.getClient();
    if (!client) return;

    _setStatus('syncing');
    const remaining = [];

    for (const item of queue) {
      const success = await _pushToSupabase(item.storeKey, item.entryKey, item.data);
      if (!success) {
        remaining.push(item);
      }
    }

    _saveQueue(remaining);

    if (remaining.length === 0) {
      _setStatus('synced');
    } else {
      _setStatus('offline');
    }
  }

  // ============================================================
  // Pull from Supabase — startup sync
  // ============================================================
  async function pullFromCloud() {
    const config = window.__DED_CONFIG || {};
    if (config.SYNC_MODE === 'local') {
      _setStatus('local-only');
      return;
    }

    const client = SupabaseClient.getClient();
    if (!client) {
      _setStatus(SupabaseClient.isConfigured() ? 'offline' : 'local-only');
      return;
    }

    _setStatus('syncing');

    try {
      // Pull each table and merge with local data
      for (const [storeKey, mapping] of Object.entries(TABLE_MAP)) {
        await _pullTable(client, storeKey, mapping);
      }

      // After pull, flush any queued local writes
      await flushQueue();

      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      _setStatus('synced');
      console.log('☁️ Cloud sync complete');
    } catch (err) {
      console.warn('Cloud pull failed:', err);
      _setStatus('offline');
    }
  }

  async function _pullTable(client, storeKey, mapping) {
    const PREFIX = 'ded_';

    try {
      const { data: rows, error } = await client
        .from(mapping.table)
        .select('*');

      if (error) {
        console.warn(`Pull error (${mapping.table}):`, error.message);
        return;
      }

      if (!rows || rows.length === 0) return;

      // Get current local data
      const localKey = PREFIX + storeKey;
      let localData;
      try {
        localData = JSON.parse(localStorage.getItem(localKey) || '{}');
      } catch { localData = {}; }

      if (mapping.type === 'object-map') {
        // Gate syllabus progress: { subtopic_id: status_string }
        rows.forEach(row => {
          const key = row[mapping.keyField];
          const cloudUpdated = row.updated_at ? new Date(row.updated_at) : new Date(0);
          // For object-map, local doesn't store timestamps per-key,
          // so cloud wins if we don't have it locally, or if data differs
          // (queue entries for this key would have been flushed already)
          if (!localData[key]) {
            localData[key] = row.status;
          }
          // If there's a queued write for this key, local wins (handled by flushQueue)
        });
      } else {
        // Date-keyed entries: merge by logged_at timestamp
        rows.forEach(row => {
          const key = row[mapping.keyField]; // date string
          const cloudEntry = { ...row };
          const localEntry = localData[key];

          if (!localEntry) {
            // Cloud has data we don't — take it
            localData[key] = cloudEntry;
          } else {
            // Both have data — last write wins
            const localTime = localEntry.logged_at ? new Date(localEntry.logged_at) : new Date(0);
            const cloudTime = cloudEntry.logged_at ? new Date(cloudEntry.logged_at) : new Date(0);
            if (cloudTime > localTime) {
              localData[key] = cloudEntry;
            }
            // else local is newer — will be pushed during flushQueue
          }
        });
      }

      // Save merged data back to localStorage
      localStorage.setItem(localKey, JSON.stringify(localData));
    } catch (err) {
      console.warn(`Pull table error (${mapping.table}):`, err);
    }
  }

  // ============================================================
  // Write — called by Store module
  //   Writes to localStorage immediately, queues for Supabase
  // ============================================================
  function write(storeKey, entryKey, data) {
    const config = window.__DED_CONFIG || {};
    if (config.SYNC_MODE === 'local') return;

    // Queue for cloud sync
    _enqueue(storeKey, entryKey, data);

    // Try to push immediately (non-blocking)
    _pushToSupabase(storeKey, entryKey, data)
      .then(success => {
        if (success) {
          // Remove from queue on success
          const queue = _getQueue().filter(
            q => !(q.storeKey === storeKey && q.entryKey === entryKey)
          );
          _saveQueue(queue);
          _setStatus('synced');
        } else {
          _setStatus('offline');
        }
      })
      .catch(() => {
        _setStatus('offline');
      });
  }

  // ============================================================
  // Batch write — for syllabus progress (writes whole object)
  // ============================================================
  function writeSyllabusStatus(subtopicId, status) {
    write('gate_syllabus', subtopicId, status);
  }

  // ============================================================
  // Init — called on app startup
  // ============================================================
  async function init() {
    const config = window.__DED_CONFIG || {};

    // Initialize the Supabase client
    SupabaseClient.init();

    if (config.SYNC_MODE === 'local' || !SupabaseClient.isConfigured()) {
      _setStatus(SupabaseClient.isConfigured() ? 'offline' : 'local-only');
      return;
    }

    // Pull cloud data and merge
    await pullFromCloud();

    // Set up periodic sync (every 60 seconds)
    _syncTimer = setInterval(async () => {
      const queue = _getQueue();
      if (queue.length > 0) {
        await flushQueue();
      }
    }, 60000);

    // Sync on visibility change (user comes back to tab/app)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const queue = _getQueue();
        if (queue.length > 0) {
          flushQueue();
        }
      }
    });

    // Sync when coming back online
    window.addEventListener('online', () => {
      console.log('🌐 Back online — syncing...');
      flushQueue();
    });

    window.addEventListener('offline', () => {
      _setStatus('offline');
    });
  }

  // ============================================================
  // Public API
  // ============================================================
  return {
    init,
    write,
    writeSyllabusStatus,
    flushQueue,
    pullFromCloud,
    getStatus,
    onStatusChange,
  };
})();

window.SyncEngine = SyncEngine;
