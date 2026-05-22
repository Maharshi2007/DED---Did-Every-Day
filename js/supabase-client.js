// ============================================================
// DED — Supabase Client
// Initializes the Supabase JS client (loaded via CDN).
// ============================================================

const SupabaseClient = (() => {
  let _client = null;
  let _isConfigured = false;

  function init() {
    const config = window.__DED_CONFIG || {};

    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      console.warn('⚠️ Supabase credentials not configured. Running in local-only mode.');
      _isConfigured = false;
      return null;
    }

    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('⚠️ Supabase JS library not loaded. Running in local-only mode.');
      _isConfigured = false;
      return null;
    }

    try {
      _client = window.supabase.createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY
      );
      _isConfigured = true;
      console.log('✅ Supabase client initialized');
      return _client;
    } catch (err) {
      console.error('❌ Supabase init failed:', err);
      _isConfigured = false;
      return null;
    }
  }

  function getClient() {
    if (!_client && _isConfigured === false) {
      // Try to init if not yet done
      init();
    }
    return _client;
  }

  function isConfigured() {
    return _isConfigured;
  }

  async function isOnline() {
    if (!_client) return false;
    try {
      // Quick health check — select 1 row from any table
      const { error } = await _client
        .from('gate_daily_entries')
        .select('date')
        .limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  return { init, getClient, isConfigured, isOnline };
})();

window.SupabaseClient = SupabaseClient;
