# GapBurn

**SIH 2026 · Problem statement SIH26044**  
Ministry of Ayush · All India Institute of Ayurveda (AIIA)

Academia–industry collaboration for **skill mapping, internships, and placement**.

GapBurn is a role-based Career Digital Twin platform. It turns student evidence (documents, projects, assessments, faculty checks) into an explainable skill profile, shows the gap against industry roles, and connects that profile to internships, jobs, and institution analytics.

> The name **GapBurn** means closing — *burning* — the skill gap between what students can prove and what industry actually hires for.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Purpose](#purpose)
3. [Objectives](#objectives)
4. [How it works](#how-it-works)
5. [Core workflow](#core-workflow)
6. [Roles and functionality](#roles-and-functionality)
7. [Demo story (seed data)](#demo-story-seed-data)
8. [Tech stack](#tech-stack)
9. [Architecture](#architecture)
10. [Run on localhost](#run-on-localhost)
11. [Demo accounts](#demo-accounts)
12. [Environment variables](#environment-variables)
13. [Project structure](#project-structure)
14. [What this repo includes (and does not)](#what-this-repo-includes-and-does-not)
15. [Suggested demo walkthrough](#suggested-demo-walkthrough)

---

## Project overview

Ayurveda and allied health students collect a lot of proof — OPD hours, certificates, posters, ethics modules — but hiring partners still see a generic resume. Institutions see placement numbers, not *which skills are missing*. Faculty verify work in isolation. Industry posts roles without a shared skill language.

GapBurn puts those four sides on one map:

| Concept | Meaning in the product |
|---|---|
| **Career Digital Twin** | Living profile of skills + evidence + scores for one student |
| **Skill DNA** | Skills with level, confidence, and a verification ladder |
| **Skill gap** | Difference vs a target role template (e.g. Ayurveda Clinical Research Associate) |
| **Explainable match** | Internship/job score broken into overlap, verification, assessments, projects |

This folder (`client/`) is the **working React demo**. Demo mode is on by default: no MongoDB, no API keys, no backend process.

---

## Purpose

- Give **students** a verified, evidence-backed skill profile instead of unverified claims.
- Give **industry** role skill profiles, internships/jobs/assignments, and a candidate pipeline with match breakdowns.
- Give **faculty** a queue to verify skills and projects so industry can trust the twin.
- Give **institutions** supply-vs-demand and placement views so curriculum and interventions are data-backed.
- Give **admins** user and audit control for a multi-role SIH demo.

---

## Objectives

1. Convert documents and coursework into **Skill DNA** with confidence and verification status.
2. Show **gaps vs a target industry role**, not a single opaque employability score.
3. Recommend a **learning path** and **industry-style projects** that close the largest gaps.
4. Match students to internships and jobs with an **explainable score**.
5. Close the loop with **faculty/industry verification** and **institution analytics**.
6. Stay **demo-ready for judges**: five seeded logins, zero backend setup.

---

## How it works

1. A user signs in as one of five roles. The UI is role-gated (`ProtectedRoute` + `RoleRoute`).
2. Screens call `src/api/*.js`. Those wrappers unwrap `{ success, data }`.
3. Axios either:
   - **Demo (default):** `demoApi` handles the same paths in the browser, persisted in `localStorage` (`gapburn_demo_state`), or
   - **Live:** forwards to `VITE_API_URL` (Vite proxies `/api` → `http://localhost:5000` when a server exists).
4. Scoring helpers live in `src/utils/scoreCalculator.js`:
   - Skill levels: Beginner 25 → Intermediate 50 → Advanced 75 → Expert 100
   - **Gap** = required level score − current level score (floor at 0)
   - **Match** ≈ 45% skill overlap + 20% verification + 20% assessments + 15% projects

**Verification ladder** (trust increases downward):

1. Self Reported  
2. AI Extracted  
3. Faculty Verified  
4. Industry Verified  

---

## Core workflow

```
Student evidence (resume, certificate, project, assessment)
        ↓
AI / demo skill extraction (filename + canned OCR in demo)
        ↓
Skill DNA (evidence graph + confidence)
        ↓
Career Digital Twin
        ↓
Gap vs target role (industry skill template)
        ↓
Learning path + AI industry project
        ↓
Assessment + faculty / industry verification
        ↓
Updated twin
        ↓
Explainable internship / job matching
        ↓
Applications pipeline → institution placement analytics
```

That loop is the product. Each role sees a different slice of the same data.

---

## Roles and functionality

### 1. Student (`/student`)

Persona in seed data: **Aarav Mehta**, BAMS, AIIA — target role *Ayurveda Clinical Research Associate*.

| Screen | What they can do |
|---|---|
| Dashboard | Readiness, twin score, completeness, shortcuts into the loop |
| Career Twin | View Skill DNA, evidence graph, add a self-reported skill |
| Documents | Upload (demo OCR), confirm extracted skills |
| Timeline | Career events; add / edit milestones |
| Skill Gaps | Current vs required level for the target role |
| Simulator | Alternate tracks and estimated readiness lift |
| Learning Path | Course / project / assessment / certification items |
| Projects | Portfolio projects + “AI generate” industry mini-project |
| Assessments | Take demo assessments (scored in the demo store) |
| Portfolio | Combined profile, skills, projects, documents |
| Internships / Jobs | Browse with match score + breakdown; apply |
| Applications | Track Applied → Shortlisted → Interview → Selected / Rejected / Completed |

### 2. Industry (`/industry`)

Persona: **Nisha Kapoor**, **Ayush Research Labs**.

| Screen | What they can do |
|---|---|
| Dashboard | Open roles and pipeline snapshot |
| New Internship / New Job | Publish opportunities with required skills |
| Assignment | Short industry tasks students can practise against |
| Applicants | Pipeline; update application status |
| Skill Radar | Student skill confidence vs role requirements |
| Role Profile | Edit the industry skill profile for a hiring role |

### 3. Academician / Faculty (`/faculty`)

Persona: **Dr. Kavita Sharma**, Associate Professor, Kayachikitsa, AIIA.

| Screen | What they can do |
|---|---|
| Dashboard | Mentorship and verification overview |
| Students | List students; add or remove student accounts |
| Verification | Approve / reject pending skills and projects |
| Mentorship | Goals and meeting notes for assigned mentees |

### 4. Institution admin (`/institution`)

Persona: **Registrar AIIA**.

| Screen | What they can do |
|---|---|
| Dashboard | Cohort readiness and headline analytics |
| Industry | Catalog of industry partners / roles |
| Supply vs Demand | Skill heatmap: what the college supplies vs what industry asks |
| Placements | Funnel, packages, recruiters, placement records |

### 5. Super admin (`/admin`)

| Screen | What they can do |
|---|---|
| Dashboard | Platform snapshot |
| Add | Create Student, Industry, or Faculty users (credentials returned in demo) |
| Users | List users; toggle active / inactive |
| Audit Logs | Mutation-style audit rows for the demo |

Public pages: landing (`/`), login, register. Wrong-role URLs redirect to that user’s home.

---

## Demo story (seed data)

The default demo is one connected story, not empty screens:

- Student skills mix **self / AI / faculty / industry** verification.
- Gaps vs CRA template highlight **GCP / Clinical Trials** and **Pharmacovigilance**.
- Two internships + one junior CRA job with match breakdowns.
- Learning path items and one **AI-generated project** waiting for faculty verification.
- Documents include a resume (confirmed) and a GCP certificate (AI extracted, pending confirm).
- Faculty queue has pending project + skill verification.
- Institution analytics include supply/demand and placement records.

Theme: teal + saffron (Ayush-inspired). Optional theme switcher: Forest, Ocean, Violet, Graphite.

---

## Tech stack

| Tool | Use |
|---|---|
| React 19 + Vite | UI and dev server (`http://localhost:5173`) |
| React Router | Role-based routes |
| Axios | HTTP + demo adapter |
| TanStack Query | Server/demo state |
| Zustand | Auth session |
| React Hook Form | Forms |
| Tailwind CSS 4 | Layout and theme tokens |
| Recharts | Radar, bars, funnel, heatmap |
| Lucide + date-fns | Icons and dates |

---

## Architecture

```
Pages (role UIs)
  → src/api/*  (only HTTP surface)
    → axiosInstance  (+ JWT Bearer from tokenService)
         ├── VITE_USE_DEMO=true  →  demoApi + demoData  →  localStorage
         └── VITE_USE_DEMO=false →  Express API (not in this folder)
```

`App.jsx` is providers only (Query, Auth, Theme, Notifications). All routes live in `src/routes/AppRouter.jsx`.

---

## Run on localhost

**Requirements:** Node.js 20+ and npm.

From the **repository root**:

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

On macOS / Linux:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

| Script | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |

If something looks stale after an old demo, clear site data for localhost or remove `localStorage` key `gapburn_demo_state` and refresh.

---

## Demo accounts

| Role | Email | Password | Lands on |
|---|---|---|---|
| Student | `student@gapburn.dev` | `Student@123` | `/student` |
| Industry | `industry@gapburn.dev` | `Industry@123` | `/industry` |
| Faculty | `faculty@gapburn.dev` | `Faculty@123` | `/faculty` |
| Institution | `institution@gapburn.dev` | `Institution@123` | `/institution` |
| Super Admin | `admin@gapburn.dev` | `Admin@123` | `/admin` |

Login page also has **one-click demo chips** for these accounts.

---

## Environment variables

Copy `client/.env.example` to `client/.env` (`.env` is gitignored).

| Variable | Default | Meaning |
|---|---|---|
| `VITE_USE_DEMO` | `true` | Browser demo store; no backend |
| `VITE_API_URL` | `/api` | Axios base URL when demo is off |

To point at a future Express server:

```
VITE_USE_DEMO=false
VITE_API_URL=/api
```

Vite already proxies `/api` to `http://localhost:5000`.

---

## Project structure

```
client/
├── public/
├── src/
│   ├── api/              Axios modules + demoApi adapter
│   ├── components/       Common UI, charts, layout, skill-twin, forms
│   ├── context/          Auth, notifications, theme
│   ├── data/demoData.js  Seed users, skills, opportunities, analytics
│   ├── hooks/
│   ├── pages/            Landing + one folder per role
│   ├── routes/           AppRouter, ProtectedRoute, RoleRoute
│   ├── services/         tokenService (localStorage)
│   ├── store/            Zustand auth
│   └── utils/            constants, formatters, scoreCalculator
├── .env.example
├── package.json
└── vite.config.js
```

---

## What this repo includes (and does not)

**Included:** full five-role UI, demo API with the same path shapes as the spec, seed data for an SIH walkthrough, theming.

**Not included in this client pass (by design):**

- Real Express / MongoDB / JWT signing  
- Real Anthropic/OpenAI or OCR vendors (demo fallback only)  
- Durable file storage (uploads are metadata in the demo store)

Those belong to a later backend phase. API modules are already shaped so a server can replace `demoApi` without rewriting pages.

---

## Suggested demo walkthrough

1. Open the landing page — branding and the evidence → gap → path → match story.
2. Log in as **Student**. Twin → Documents → Gaps → Learning path → Internships (read the match breakdown) → Apply.
3. Log in as **Faculty**. Verification queue — approve the pending project/skill.
4. Log in as **Industry**. Role profile / radar → Applicants → change status.
5. Log in as **Institution**. Supply vs demand and placements.
6. Log in as **Admin**. Users and audit log.

That is the intended judge path: one skill story, five perspectives.
