# 📊 DED — Did Every Day

A personal life dashboard PWA tracking three pillars of daily growth:

| 📘 GATE Prep | ⚽ Football | 🏋️ Gym |
|:---:|:---:|:---:|
| CS 2027 syllabus tracker | Match schedules & watch log | Workout & supplement tracker |
| Topic progress heatmap | Live scores via football-data.org | Muscle group splits |
| Daily journal & ratings | Competition filtering | Streak tracking |

## 🌐 Live

**→ [https://Maharshi2007.github.io/DED-Did-Every-Day/](https://Maharshi2007.github.io/DED-Did-Every-Day/)**

## ✨ Features

- **Home Dashboard** — Unified view with 7-day stats, streaks, and progress across all three fields
- **GATE Tracker** — Full CS 2027 syllabus with subject → topic → subtopic drill-down, status tracking, and daily journal
- **Football Hub** — Live match data from football-data.org, competition filters, match watch logging
- **Gym Logger** — Muscle group tracking, supplement adherence, workout streaks
- **Offline-First PWA** — Installable on desktop & mobile, works without internet
- **Cloud Sync** — Supabase (PostgreSQL) for persistent storage with offline-first hybrid sync
- **Dark Theme** — Glassmorphism UI with per-field accent colors

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML / CSS / JS (no framework) |
| Database | Supabase (PostgreSQL, free tier) |
| Local Storage | localStorage (offline-first cache) |
| Sync | Hybrid — localStorage ↔ Supabase |
| Hosting | GitHub Pages (static) |
| PWA | Service Worker + Web App Manifest |

## 🚀 Setup

1. **Clone** the repo:
   ```bash
   git clone https://github.com/Maharshi2007/DED-Did-Every-Day.git
   cd DED-Did-Every-Day
   ```

2. **Open** `index.html` in a browser — that's it. No build step.

3. **(Optional) Supabase** — The app connects to a Supabase backend for cloud sync. The anon key in `js/config.js` is a **public** client key — this is by design per [Supabase docs](https://supabase.com/docs/guides/api/api-keys). Row Level Security (RLS) handles authorization.

## 📁 Project Structure

```
DED-Did-Every-Day/
├── index.html              # Single-page app shell
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline caching)
├── css/
│   ├── design-system.css   # Design tokens & base styles
│   ├── home.css            # Home dashboard styles
│   ├── gate.css            # GATE field styles
│   ├── football.css        # Football field styles
│   └── gym.css             # Gym field styles
├── js/
│   ├── config.js           # Supabase config
│   ├── supabase-client.js  # Supabase client wrapper
│   ├── sync-engine.js      # Offline-first sync engine
│   ├── store.js            # Data store (CRUD)
│   ├── gate-syllabus-data.js # GATE CS 2027 syllabus
│   ├── components.js       # Shared UI components
│   ├── home.js / gate.js / football.js / gym.js
│   └── app.js              # Router & app init
├── icons/                  # PWA icons
├── architecture/           # SOPs & DB schema
└── data/                   # Local data (dev mode)
```

## 📄 License

Personal project — not licensed for redistribution.
