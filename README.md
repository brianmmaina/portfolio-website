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

## Daily git flow
```bash
git add .
git commit -m "day X: short progress note"
git push
```

