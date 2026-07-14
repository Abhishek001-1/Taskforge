# TaskForge

TaskForge is a daily interview preparation tracker for software engineers. It includes a React + TypeScript + Vite frontend and a FastAPI backend with Supabase/Postgres persistence.

## Features

- Daily checklist for DSA, System Design, AI Learning, and HR prep
- Dashboard, progress charts, history calendar, achievements, and statistics
- Light/dark/system theme
- LocalStorage persistence with backend sync
- JSON import/export and PWA/offline basics

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, Recharts, Framer Motion, Lucide React
- Backend: Python, FastAPI, SQLAlchemy, Postgres/Supabase

## Backend Setup

```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@db.votloavgmdpreagjstaq.supabase.co:5432/postgres
FRONTEND_ORIGIN=http://localhost:5173
API_HOST=127.0.0.1
API_PORT=8001
```

If your password contains special characters, URL encode them. Example: `@` becomes `%40`.

Run backend:

```powershell
python .\main.py
```

Health check:

```txt
http://127.0.0.1:8001/health
```

## Frontend Setup

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8001
```

Run frontend:

```powershell
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Production Build

```powershell
cd frontend
npm run build
```

## Notes

- The app keeps working offline through LocalStorage.
- Backend sync writes the full tracker state into the `app_state` table.
- Use `Settings > Export JSON` before resetting data.
