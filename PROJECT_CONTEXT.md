# Gising Pa? — Project Context

## What this is
"Gising Pa?" ("Still awake?") is an anonymous, real-time thought-sharing web app scoped to the **Philippines only**. Users can post short anonymous thoughts, which appear as live pop-ups/pins on a stylized map of the Philippines. It's built around the late-night hours (10pm–3am PH time) when people tend to overthink, vent, or reflect.

**Tagline:** "Hindi ka lang nag-iisang gising." ("You're not the only one awake.")

## Scope of content
Not limited to romance/"senti" posts. Covers a wide range of what people carry at night:
- Senti / love-related thoughts
- Academic pressure
- Personal problems
- Family problems
- Career pressure

Posts should be taggable/categorized by this kind of theme (exact category list still open to refinement).

## Core concept / UX
- Users submit a short anonymous thought via a simple form.
- The thought appears as a real-time pop-up/pin on a map of the Philippines (not necessarily tied to exact GPS location — general area is enough given it's anonymous).
- Map has cartoonish/customized styling (not default OSM look).
- Background music plays during "senti" moments for atmosphere.
- Real-time weather ambience reflects actual PH weather conditions.
- Submissions (and possibly viewing) are restricted to **10pm–3am Philippine time** — this is a core identity feature of the app, not just a UI restriction. Ideally enforced at the database level (not just client-side), so it can't be bypassed by editing frontend code.

## Tech stack (decided)
- **Frontend:** React + Vite
- **Map:** Leaflet via react-leaflet
- **Backend:** Supabase (Postgres DB, Realtime, Edge Functions, Auth if ever needed)
- **Weather data:** Open-Meteo API
- **Hosting:** Vercel

## Current build status
- Vite + React project scaffolded at `D:\Projects\gising-pa`, git initialized, ESLint (default Vite config) in place.
- Dependencies installed: `leaflet`, `react-leaflet`, `@supabase/supabase-js`.
- Supabase project created (region: Singapore/Asia-Pacific).
- `.env` set up with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, confirmed gitignored.
- `src/supabaseClient.js` created and connection confirmed working (SELECT + INSERT tested successfully against a `thoughts` table).
- `thoughts` table exists in Supabase; a `supabase-schema.sql` file tracks its schema. GRANT permissions were fixed to allow client access.
- Leftover test row needs cleanup (may already be done).

## Not yet done (next steps, roughly in order)
1. Enable Row Level Security (RLS) on `thoughts` with policies: anon can SELECT and INSERT, no UPDATE/DELETE from client.
2. Enable Supabase Realtime on `thoughts` so new posts appear live without refresh.
3. Build the base Leaflet map component, scoped/bounded to the Philippines, with custom (non-default) styling.
4. Build the actual submission form UI (content + category) wired to Supabase insert.
5. Implement the 10pm–3am PH time-gate, enforced at the database level (CHECK constraint or trigger/Edge Function comparing timestamps in Asia/Manila time), plus a friendly "closed" state in the UI outside those hours.
6. Weather ambience integration via Open-Meteo, tied to real PH weather.
7. Background music/audio for "senti" category posts.
8. Cartoonish/custom map styling pass (replace default OSM tiles/look).
9. Deploy to Vercel.

## Design/tone notes
- The whole product voice is casual, Taglish, like a text from a friend at 2am — not clinical or corporate.
- Anonymity and emotional safety are core to the concept — no accounts, no way to trace a post back to a person, no edit/delete from the client side once posted.
- The 10pm–3am window isn't just a technical gate — it's part of the emotional framing of the app (it "wakes up" at night).

## Known context for whoever/whatever picks this up
This project belongs to Brandon, a 4th year Computer Science student, built as a personal/side project (not a rushed timeline — prioritize doing things properly over doing them fast). He's using Claude Code inside VS Code for hands-on implementation (files, terminal commands, debugging) and a separate Claude chat for planning, naming, copywriting, and architecture decisions. Keep explanations clear and step-by-step where relevant, since some tooling/concepts (e.g. RLS, env vars, Vite-specific syntax) may be new.
