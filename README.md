# Gising Pa?

*"Hindi ka lang nag-iisang gising."* (You're not the only one awake.)

An anonymous, real-time map of late-night thoughts across the Philippines. Post a short thought (senti, academic, family, career or personal) and it appears as a pin on the map for everyone, live. Posting is only open from **10pm to 3am, Philippine time**, the hours people tend to overthink.

## Features

- **Live map.** New thoughts appear on everyone's map the moment they're posted, through a Supabase Realtime subscription, with no refresh.
- **Philippines only.** The Leaflet map is bounded to the Philippines with a mask over everything outside it, on a custom dark MapTiler style.
- **Category pins** with their own color and emoji, so you can see at a glance what the country is up at night about.
- **Weather ambience** that matches the real current weather in Manila, from Open-Meteo.
- **Senti mood music** through a Spotify embed.
- **A friendly "closed" state** outside 10pm–3am.

## How it's kept safe and anonymous

- **No accounts, nothing to trace.** Posts aren't tied to any user.
- **The time window is enforced by the database, not just the UI.** A Postgres function checks the current hour in `Asia/Manila`, and the row-level security policy for inserts only passes inside 10pm–3am. Editing the frontend can't get around it.
- **Posts can't be edited or deleted** from the client: row-level security only grants anonymous users read and insert.
- **Categories are validated in the database** with a check constraint, not only in the form.

The schema and policies are in [`supabase-schema.sql`](supabase-schema.sql).

## Tech stack

React 19 + Vite · Leaflet (react-leaflet) · Supabase (Postgres, Realtime, row-level security) · Open-Meteo · MapTiler · Vercel

## Running it locally

1. Create a Supabase project and run `supabase-schema.sql` in its SQL editor. Enable Realtime on the `thoughts` table.
2. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_MAPTILER_KEY=your-maptiler-key
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

Outside 10pm–3am Philippine time the app shows its closed state and the database refuses new posts, so test during those hours or temporarily adjust `is_gising_hours()` in your own project.

---

By [Brandon Dylan Narito](https://brandonnarito.com)
