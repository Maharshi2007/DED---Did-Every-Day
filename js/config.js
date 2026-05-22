// ============================================================
// DED — Configuration
// Supabase credentials and sync mode.
// ============================================================

window.__DED_CONFIG = {
  // Supabase project credentials
  SUPABASE_URL: 'https://tjdzppqelnucyfybiqkw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZHpwcHFlbG51Y3lmeWJpcWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU3NDgsImV4cCI6MjA5NTAyMTc0OH0.74XUFB-rCBCCQMbIbJUAwT-LVp50Dr6WvS4tIBtoOdU',

  // Sync mode:
  //   'local'  — localStorage only (no cloud)
  //   'cloud'  — Supabase only (requires internet)
  //   'hybrid' — localStorage + Supabase sync (recommended)
  SYNC_MODE: 'hybrid',
};
