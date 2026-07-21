# TaskForge AI

TaskForge AI is an AI-powered goal tracking and interview preparation platform for developers. It combines daily progress tracking, resume-based AI suggestions, and history review so users can learn consistently and prepare smarter.

## What It Does

- Tracks daily DSA, system design, AI/ML, HR, and miscellaneous prep goals
- Uploads and analyzes a resume to personalize AI recommendations
- Generates AI goal suggestions based on resume and preparation activity
- Adds selected AI suggestions directly into today's goals
- Shows today's added AI goals on the dashboard
- Keeps added goals visible in the history tab for daily review
- Supports progress stats, streaks, calendar history, themes, and JSON import/export

## Project Story

### Inspiration

We built TaskForge AI to help developers stay consistent with interview preparation without feeling overwhelmed. Instead of only tracking tasks manually, the app uses AI to suggest meaningful next steps based on the user's resume and current activity.

### How It Works

Users log daily prep work, upload a resume, and request AI suggestions. TaskForge AI generates personalized goals, lets users select the ones they want, saves them into today's goal section, and preserves them in history for future review.

### What We Built

- A focused dashboard for today's progress
- Resume upload and AI analysis
- AI goal suggestion modal with selectable recommendations
- Today's AI goals card that appears only when goals are added
- History view that shows everything saved for a selected date
- Backend sync with local persistence support

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, Lucide React
- Backend: Python, FastAPI, SQLAlchemy, Postgres/Supabase
- AI: Resume analysis and personalized goal generation APIs

## Backend Setup

```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres
FRONTEND_ORIGIN=http://localhost:5173
API_HOST=127.0.0.1
API_PORT=8001
OPENROUTER_API_KEY=YOUR_API_KEY
```

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

## Build

```powershell
cd frontend
npm run build
```

## What's Next

- Smarter goal prioritization
- Calendar and reminder integrations
- More detailed preparation analytics
- Personalized learning plans based on weak areas
- Better completion tracking for AI-added goals
