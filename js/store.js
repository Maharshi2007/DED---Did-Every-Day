// ============================================================
// DED — Data Store (localStorage + cloud sync abstraction)
// All persistence goes through this module.
//
// Public API is unchanged from the original. Internally,
// writes now also go through SyncEngine for cloud sync.
// ============================================================

const Store = (() => {
  const PREFIX = 'ded_';

  // --- Core helpers ---
  function _key(name) {
    return PREFIX + name;
  }

  function _get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(_key(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn(`Store._get error for ${key}:`, e);
      return fallback;
    }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(_key(key), JSON.stringify(value));
    } catch (e) {
      console.error(`Store._set error for ${key}:`, e);
    }
  }

  // --- Date helpers ---
  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function dateStr(date) {
    return date.toISOString().split('T')[0];
  }

  // ============================================================
  // GATE Module
  // ============================================================
  const Gate = {
    // --- Syllabus Progress ---
    getSyllabusProgress() {
      return _get('gate_syllabus', {});
      // shape: { subtopic_id: 'not_started' | 'in_progress' | 'completed' | 'revision' }
    },

    setSubtopicStatus(subtopicId, status) {
      const progress = this.getSyllabusProgress();
      progress[subtopicId] = status;
      _set('gate_syllabus', progress);
      // Sync to cloud
      if (window.SyncEngine) {
        SyncEngine.writeSyllabusStatus(subtopicId, status);
      }
    },

    toggleSubtopic(subtopicId) {
      const progress = this.getSyllabusProgress();
      const current = progress[subtopicId] || 'not_started';
      const cycle = ['not_started', 'in_progress', 'completed'];
      const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
      progress[subtopicId] = cycle[nextIndex];
      _set('gate_syllabus', progress);
      // Sync to cloud
      if (window.SyncEngine) {
        SyncEngine.writeSyllabusStatus(subtopicId, cycle[nextIndex]);
      }
      return progress[subtopicId];
    },

    getOverallProgress() {
      const progress = this.getSyllabusProgress();
      let total = 0;
      let completed = 0;

      if (typeof GATE_SYLLABUS !== 'undefined') {
        GATE_SYLLABUS.forEach(subject => {
          subject.topics.forEach(topic => {
            topic.subtopics.forEach(st => {
              total++;
              if (progress[st.id] === 'completed') completed++;
            });
          });
        });
      }

      return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
    },

    getSubjectProgress(subjectId) {
      const progress = this.getSyllabusProgress();
      const subject = typeof GATE_SYLLABUS !== 'undefined'
        ? GATE_SYLLABUS.find(s => s.id === subjectId)
        : null;
      if (!subject) return { completed: 0, total: 0, pct: 0 };

      let total = 0, completed = 0;
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(st => {
          total++;
          if (progress[st.id] === 'completed') completed++;
        });
      });

      return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
    },

    // --- Daily Entries (DTD Journal + Ratings) ---
    getDailyEntry(date) {
      const entries = _get('gate_daily', {});
      return entries[date] || null;
    },

    saveDailyEntry(date, data) {
      const entries = _get('gate_daily', {});
      entries[date] = {
        ...entries[date],
        ...data,
        date,
        logged_at: new Date().toISOString()
      };
      _set('gate_daily', entries);
      // Sync to cloud
      if (window.SyncEngine) {
        SyncEngine.write('gate_daily', date, entries[date]);
      }
    },

    getAllDailyEntries() {
      return _get('gate_daily', {});
    },

    // --- Streak ---
    getStreak() {
      const entries = this.getAllDailyEntries();
      const dates = Object.keys(entries).sort().reverse();
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = dateStr(d);
        if (entries[ds] && entries[ds].dtd_journal && entries[ds].dtd_journal.trim().length > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      return streak;
    },

    getDaysUntilExam() {
      // GATE 2027 — typically first week of February
      const examDate = new Date('2027-02-01');
      const today = new Date();
      const diff = examDate - today;
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
  };

  // ============================================================
  // FOOTBALL Module
  // ============================================================
  const Football = {
    getDailyEntry(date) {
      const entries = _get('football_daily', {});
      return entries[date] || { matches_watched: [], rating_day: 0 };
    },

    saveDailyEntry(date, data) {
      const entries = _get('football_daily', {});
      entries[date] = {
        ...entries[date],
        ...data,
        date,
        logged_at: new Date().toISOString()
      };
      _set('football_daily', entries);
      // Sync to cloud
      if (window.SyncEngine) {
        SyncEngine.write('football_daily', date, entries[date]);
      }
    },

    toggleMatchWatched(date, matchId) {
      const entry = this.getDailyEntry(date);
      const watched = entry.matches_watched || [];
      const idx = watched.indexOf(matchId);
      if (idx >= 0) {
        watched.splice(idx, 1);
      } else {
        watched.push(matchId);
      }
      this.saveDailyEntry(date, { matches_watched: watched });
      return watched;
    },

    setRating(date, rating) {
      this.saveDailyEntry(date, { rating_day: rating });
    },

    getAllDailyEntries() {
      return _get('football_daily', {});
    },

    getWeeklyStats() {
      const entries = this.getAllDailyEntries();
      const today = new Date();
      let totalWatched = 0;
      let totalRating = 0;
      let daysWithRating = 0;

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = dateStr(d);
        const entry = entries[ds];
        if (entry) {
          totalWatched += (entry.matches_watched || []).length;
          if (entry.rating_day > 0) {
            totalRating += entry.rating_day;
            daysWithRating++;
          }
        }
      }

      return {
        watched_7d: totalWatched,
        avg_rating_7d: daysWithRating > 0 ? (totalRating / daysWithRating).toFixed(1) : '—'
      };
    },

    // Cache match data to reduce API calls
    getCachedMatches(date) {
      const cache = _get('football_cache', {});
      return cache[date] || null;
    },

    setCachedMatches(date, matches) {
      const cache = _get('football_cache', {});
      cache[date] = { matches, cached_at: new Date().toISOString() };
      // Keep only last 7 days in cache
      const keys = Object.keys(cache).sort();
      while (keys.length > 7) {
        delete cache[keys.shift()];
      }
      _set('football_cache', cache);
    }
  };

  // ============================================================
  // GYM Module
  // ============================================================
  const Gym = {
    getDailyEntry(date) {
      const entries = _get('gym_daily', {});
      return entries[date] || {
        went_to_gym: false,
        muscles_trained: [],
        supplements: { protein: false, creatine: false, omega_3: false },
        rating_day: 0
      };
    },

    saveDailyEntry(date, data) {
      const entries = _get('gym_daily', {});
      entries[date] = {
        ...entries[date],
        ...data,
        date,
        logged_at: new Date().toISOString()
      };
      _set('gym_daily', entries);
      // Sync to cloud
      if (window.SyncEngine) {
        SyncEngine.write('gym_daily', date, entries[date]);
      }
    },

    toggleGymAttendance(date) {
      const entry = this.getDailyEntry(date);
      const newVal = !entry.went_to_gym;
      this.saveDailyEntry(date, {
        went_to_gym: newVal,
        muscles_trained: newVal ? entry.muscles_trained : [],
      });
      return newVal;
    },

    toggleMuscle(date, muscle) {
      const entry = this.getDailyEntry(date);
      const muscles = entry.muscles_trained || [];
      const idx = muscles.indexOf(muscle);
      if (idx >= 0) {
        muscles.splice(idx, 1);
      } else {
        muscles.push(muscle);
      }
      this.saveDailyEntry(date, { muscles_trained: muscles });
      return muscles;
    },

    toggleSupplement(date, supplement) {
      const entry = this.getDailyEntry(date);
      const supplements = entry.supplements || { protein: false, creatine: false, omega_3: false };
      supplements[supplement] = !supplements[supplement];
      this.saveDailyEntry(date, { supplements });
      return supplements;
    },

    setRating(date, rating) {
      this.saveDailyEntry(date, { rating_day: rating });
    },

    getAllDailyEntries() {
      return _get('gym_daily', {});
    },

    getWeeklyStats() {
      const entries = this.getAllDailyEntries();
      const today = new Date();
      let gymDays = 0;
      let totalRating = 0;
      let daysWithRating = 0;
      let supplementDays = { protein: 0, creatine: 0, omega_3: 0 };
      const weekDays = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = dateStr(d);
        const entry = entries[ds];
        const dayName = d.toLocaleDateString('en', { weekday: 'short' }).toUpperCase();

        if (entry) {
          if (entry.went_to_gym) gymDays++;
          if (entry.rating_day > 0) {
            totalRating += entry.rating_day;
            daysWithRating++;
          }
          if (entry.supplements) {
            Object.keys(supplementDays).forEach(s => {
              if (entry.supplements[s]) supplementDays[s]++;
            });
          }
          weekDays.push({ day: dayName, went: !!entry.went_to_gym });
        } else {
          weekDays.push({ day: dayName, went: false });
        }
      }

      return {
        gym_days_7d: gymDays,
        avg_rating_7d: daysWithRating > 0 ? (totalRating / daysWithRating).toFixed(1) : '—',
        supplement_adherence: supplementDays,
        week_days: weekDays
      };
    },

    getStreak() {
      const entries = this.getAllDailyEntries();
      const today = new Date();
      let streak = 0;

      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = dateStr(d);
        if (entries[ds] && entries[ds].went_to_gym) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      return streak;
    }
  };

  // ============================================================
  // Global / Settings
  // ============================================================
  const Settings = {
    get(key, fallback) { return _get('settings_' + key, fallback); },
    set(key, value) { _set('settings_' + key, value); }
  };

  // --- Public API ---
  return { Gate, Football, Gym, Settings, todayStr, dateStr };
})();

// Expose globally
window.Store = Store;
