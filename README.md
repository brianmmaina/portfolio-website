# portfolio-website

Simple portfolio website built with standard HTML, CSS, and JavaScript.

## Stack
- Frontend: Vercel (static site)
- Backend API: Railway (Express)
- Database/Auth: Supabase

## Current structure
- `index.html`
- `admin.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/js/admin.js`
- `backend/`
- `supabase/schema.sql`

## Backend quick start
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Frontend API wiring
- Open `index.html` and set `data-api-base-url` on the `<body>` tag.
- For local testing with backend on port 8080:
  - `data-api-base-url="http://localhost:8080"`

## Admin dashboard wiring
- Open `admin.html` and set these `<body>` attributes:
  - `data-api-base-url`
  - `data-supabase-url`
  - `data-supabase-anon-key`
- Create an admin user in Supabase Auth (email/password).
- Add that email to `ADMIN_EMAILS` in `backend/.env` (or Railway env vars).
- Use `admin.html` to create, edit, and delete projects.

## Supabase quick start
- Run SQL in `supabase/schema.sql` in the Supabase SQL editor.
- Create at least one project row with `featured = true`.

## Daily git flow
```bash
git add .
git commit -m "day X: short progress note"
git push
```

