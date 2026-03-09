# portfolio-website

Simple portfolio website built with standard HTML, CSS, and JavaScript.

## Stack
- Frontend: Vercel (static site)
- Backend API: Railway (Express)
- Database/Auth: Supabase

## Current structure
- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `backend/` (API bootstrap)
- `supabase/schema.sql` (schema + RLS starter)

## Backend quick start
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Supabase quick start
- Run SQL in `supabase/schema.sql` in the Supabase SQL editor.
- Add your email to `ADMIN_EMAILS` in `backend/.env`.

## Frontend API wiring
- Open `index.html` and set `data-api-base-url` on the `<body>` tag:
  - Example: `data-api-base-url="https://your-railway-app.up.railway.app"`
- For local testing, keep backend running on `http://localhost:8080` and set:
  - `data-api-base-url="http://localhost:8080"`

## Deploy checklist
- Railway:
  - Create service from `backend/`
  - Add env vars from `backend/.env.example`
- Vercel:
  - Deploy project root as static site
  - Update `index.html` `data-api-base-url` to Railway production URL
- Supabase:
  - Run `supabase/schema.sql`
  - Create at least one featured project row (`featured = true`)

## Daily git flow
```bash
git add .
git commit -m "day X: short progress note"
git push
```

