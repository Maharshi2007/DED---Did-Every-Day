# 📋 Task Plan — B.L.A.S.T. Phases

> Living checklist of all phases, goals, and sub-tasks.

---

## Phase 0: Initialization ✅
- [x] Create `gemini.md` (Project Constitution)
- [x] Create `task_plan.md` (this file)
- [x] Create `findings.md`
- [x] Create `progress.md`
- [x] Create directory structure (`architecture/`, `tools/`, `.tmp/`)

## Phase 1: B — Blueprint (Vision & Logic)
- [ ] Ask 5 Discovery Questions
- [ ] Receive and record answers
- [ ] Define Input Data Schema in `gemini.md`
- [ ] Define Output Data Schema in `gemini.md`
- [ ] Record Behavioral Rules in `gemini.md`
- [ ] Research: Search for helpful resources/repos
- [ ] Record findings in `findings.md`
- [ ] Get user approval on Blueprint

## Phase 2: L — Link (Connectivity)
- [ ] Identify all external service integrations
- [ ] Verify API keys / `.env` credentials
- [ ] Build handshake scripts in `tools/`
- [ ] Confirm all connections are live

## Phase 3: A — Architect (3-Layer Build)
- [ ] Write SOPs in `architecture/`
- [ ] Build deterministic tools in `tools/`
- [ ] Test each tool atomically
- [ ] Integration testing

## Phase 4: S — Stylize (Refinement & UI)
- [ ] Format delivery payload
- [ ] Build UI/dashboard (if applicable)
- [ ] Present to user for feedback

## Phase 4: Polish & Extras
- [x] Dev server running (http://localhost:8080)
- [ ] Visual testing & bug fixes
- [ ] Weekly email report tool (Python)
- [ ] Update gemini.md maintenance log

## Phase 5: Cloud Sync & Standalone App
- [ ] Set up database schemas and SQL definitions
- [ ] Build `js/sync.js` (Offline-first bidirectional sync manager)
- [ ] Build `js/settings.js` & Update nav (Settings panel + Supabase credentials + test connection)
- [ ] Integrate service worker and `manifest.json` (PWA capability)
- [ ] Setup Electron configuration (`main.js`, `package.json`)

## Phase 6: T — Trigger (Deployment)
- [ ] Deploy to production/cloud
- [ ] Set up automation triggers
- [ ] Finalize Maintenance Log in `gemini.md`
