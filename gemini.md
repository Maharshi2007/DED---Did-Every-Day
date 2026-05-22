# 📜 Project Constitution — `gemini.md`

> **This file is LAW.** All schemas, rules, and architectural invariants are defined here.
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## 🔷 Project Identity

- **Project Name:** DED — Did Every Day
- **North Star:** A personal life dashboard with 3 custom fields (GATE prep, Football, Gym) + a unified home dashboard with AI weekly reports.
- **Status:** `PHASE 1 — BLUEPRINT (Approved — Building)`

---

## 📐 Data Schemas

### 1. GATE Field Schema

#### GATE Subject Schema
```json
{
  "id": "string (slug)",
  "name": "string",
  "topics": [
    {
      "id": "string (slug)",
      "name": "string",
      "subtopics": [
        {
          "id": "string (slug)",
          "name": "string",
          "status": "not_started | in_progress | completed | revision",
          "completed_at": "ISO 8601 | null",
          "notes": "string | null"
        }
      ]
    }
  ]
}
```

#### GATE Daily Entry Schema
```json
{
  "date": "YYYY-MM-DD",
  "dtd_journal": "string (Did Today Diary)",
  "rating_did_your_best": "integer (1-5)",
  "rating_can_be_better": "integer (1-5)",
  "topics_studied": ["subtopic_id", "..."],
  "logged_at": "ISO 8601"
}
```

### 2. Football Field Schema

#### Football Match Schema (from API)
```json
{
  "match_id": "integer",
  "competition": "string",
  "home_team": "string",
  "away_team": "string",
  "home_crest": "string (url)",
  "away_crest": "string (url)",
  "utc_date": "ISO 8601",
  "status": "SCHEDULED | LIVE | FINISHED",
  "score_home": "integer | null",
  "score_away": "integer | null"
}
```

#### Football Daily Entry Schema
```json
{
  "date": "YYYY-MM-DD",
  "matches_available": ["match_id", "..."],
  "matches_watched": ["match_id", "..."],
  "rating_day": "integer (1-5)",
  "logged_at": "ISO 8601"
}
```

### 3. Gym Field Schema

#### Gym Daily Entry Schema
```json
{
  "date": "YYYY-MM-DD",
  "went_to_gym": "boolean",
  "muscles_trained": ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abs", "cardio"],
  "supplements": {
    "protein": "boolean",
    "creatine": "boolean",
    "omega_3": "boolean"
  },
  "rating_day": "integer (1-5)",
  "logged_at": "ISO 8601"
}
```

### 4. Home Dashboard (Computed Payload)
```json
{
  "date": "YYYY-MM-DD",
  "gate": {
    "overall_progress_pct": "float",
    "subjects_completed": "integer",
    "subjects_total": "integer",
    "avg_best_rating_7d": "float",
    "streak_days": "integer",
    "days_until_exam": "integer"
  },
  "football": {
    "matches_watched_7d": "integer",
    "matches_available_7d": "integer",
    "avg_rating_7d": "float"
  },
  "gym": {
    "gym_days_7d": "integer",
    "current_streak": "integer",
    "supplements_adherence_pct": "float",
    "avg_rating_7d": "float"
  }
}
```

### 5. Weekly Email Report Schema
```json
{
  "subject": "DED Weekly Report — Week of May 22, 2026",
  "to": "maharshinimbark2007@gmail.com",
  "body_html": "<html>... GATE progress, football recaps, gym consistency ...</html>"
}
```

---

## ⚖️ Behavioral Rules

1. Keep it simple — no complex rule engines.
2. Single user — no authentication layer.
3. One-click interactions — toggles, star ratings, quick journal.
4. Dark theme by default with per-field accent theming.
5. Data never deleted — soft archival only.
6. Football data from free API (football-data.org, free key).
7. Email reports are AI-generated summaries (weekly).
8. All free services only — no paid APIs or hosting.

---

## 🏛️ Architectural Invariants

1. All business logic is deterministic (Python scripts in `tools/`).
2. All intermediate files go to `.tmp/`.
3. SOPs in `architecture/` are updated BEFORE code changes.
4. Environment secrets live in `.env` only.
5. No code is written until schemas are confirmed.
6. **Dev mode:** Local JSON for fast iteration.
7. **Prod mode:** Supabase (PostgreSQL) — free tier.
8. **Sync mode:** Hybrid (offline-first). localStorage as instant cache, async sync to Supabase.
9. Google Sheets is a secondary export target.
10. Frontend: Vanilla HTML/CSS/JS — single page app with routing.
11. GATE syllabus is hardcoded (GATE CS 2027 standard syllabus).
12. **PWA:** Progressive Web App for desktop + Android (service worker + manifest).

---

## 🔧 Integrations

| Service | Purpose | Status | Notes |
|---------|---------|--------|-------|
| football-data.org | Match schedules & scores | ⏳ Pending | Free tier, 10 req/min, covers PL/CL/WC/La Liga/Bundesliga |
| Supabase | Production DB (PostgreSQL) | ✅ Active | Free tier, project `tjdzppqelnucyfybiqkw`, hybrid sync |
| Google Sheets API | Data export/mirror | ⏳ Pending | Service account |
| Gmail (SMTP) | Weekly AI reports | ⏳ Pending | App password |

---

## 📋 Maintenance Log

| Date | Change | Author |
|------|--------|--------|
| 2026-05-22 | Project initialized. Protocol 0 complete. | System Pilot |
| 2026-05-22 | Discovery complete. Schemas defined. Blueprint drafted. | System Pilot |
| 2026-05-22 | Major pivot: 3-field system (GATE, Football, Gym) + Home dashboard. Schemas redefined. | System Pilot |
| 2026-05-22 | Cloud DB: Supabase integrated with offline-first sync engine. PWA: manifest + service worker + mobile CSS added. | System Pilot |
