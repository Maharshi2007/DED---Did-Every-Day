# 🔍 Findings — Research, Discoveries & Constraints

> All research results, API quirks, discovered constraints, and useful resources are logged here.

---

## Discovery Answers (2026-05-22)

### 🎯 North Star
A **personal life dashboard** with 3 custom fields:
1. **GATE** — CS exam prep tracker (syllabus, journal, ratings) inspired by TrackIt app
2. **Football** — Match tracker for top European leagues (inspired by FotMob/Sofascore)
3. **Gym** — Workout tracker with muscle groups and supplements

Plus a **unified Home dashboard** showing key metrics from all 3 fields.

### Architecture Decisions
- **Frontend:** Vanilla HTML/CSS/JS (single page app, hash routing)
- **Storage:** localStorage (dev) → Supabase later
- **Theme:** Dark theme matching provided design inspiration
- **Auth:** None (single user)
- **Cost:** $0 — all free services

---

## Research Notes

### TrackIt App (GATE Tracker Reference)
- Multi-level syllabus tracker with subjects → chapters → topics
- Progress percentage per subject and overall
- Preloaded GATE CS syllabus
- Also has Pomodoro timer and flashcards (skipped for MVP)

### GATE CS/IT Syllabus (2026/2027)
- 14 main subjects identified:
  1. General Aptitude, 2. Discrete Math, 3. Linear Algebra, 4. Calculus
  5. Probability & Statistics, 6. Digital Logic, 7. Computer Organization
  8. Programming & Data Structures, 9. Algorithms, 10. Theory of Computation
  11. Compiler Design, 12. Operating Systems, 13. Databases, 14. Computer Networks
- ~50 topics, ~120+ subtopics total
- Exam date: typically first week of February

### Football API (football-data.org)
- **Free tier:** 12 competitions including PL, La Liga, Bundesliga, Serie A, Ligue 1, CL, World Cup ✅
- **Rate limit:** 10 requests/minute
- **Auth:** Free API key required (X-Auth-Token header)
- **Key endpoints:**
  - `GET /v4/matches?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD` — matches by date
  - `GET /v4/competitions/{id}/matches` — competition matches
  - Filter: `?status=SCHEDULED` for upcoming
- **Limitation:** Scores delayed on free tier, no player data
- **Fallback:** Demo/generated match data for offline use

### Design Inspiration Analysis
- Dark charcoal background (#0d0d11)
- Bento grid layout (asymmetric card sizes)
- Monospace typography for headers (JetBrains Mono)
- Big metrics as hero elements
- Minimal accent colors
- Card-based with subtle borders

---

## Constraints & Gotchas

1. **npx not available** on this system — used Python http.server for dev server
2. **football-data.org requires registration** — built fallback demo data so app works without API key
3. **localStorage limit** — ~5MB, sufficient for this use case with text data only
4. **No Node.js** — keeping everything vanilla (no build step, no npm)
