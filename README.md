# TaskForge AI

TaskForge AI is an AI-powered interview preparation workspace for developers. It combines daily practice tracking, resume-aware coaching, progress analytics, and personalized goal suggestions so users can prepare for technical interviews with more focus and less guesswork.

## OpenAI Build Week Submission

**Hackathon:** OpenAI Build Week Challenge  
**Track:** Apps for your life  
**Project type:** Full-stack web app with AI-assisted goal planning  

TaskForge AI fits the **Apps for your life** track because it helps individuals manage a personal, recurring workflow: preparing for interviews while balancing daily learning, consistency, and resume-specific improvement areas.

## What It Does

- Tracks daily preparation across DSA, system design, AI/ML, HR practice, and custom tasks
- Uploads a PDF resume and extracts structured career signals
- Uses AI to identify skills, strengths, weak areas, projects, experience, and career summary
- Generates personalized daily interview-prep goals from resume analysis and recent activity
- Lets users add selected AI suggestions directly into today's goals
- Preserves completed and AI-added goals in daily history
- Shows progress stats, streaks, calendar history, charts, achievements, themes, and import/export support
- Supports account-based persistence with JWT authentication and database-backed state

## Why We Built It

Interview preparation often breaks down because developers have too many possible things to study and too little feedback on what matters most for their own profile. TaskForge AI turns that open-ended process into a daily operating system: track what you did, upload who you are on paper, and get practical next steps that match both.

The goal is not just to make another checklist. The goal is to help users make better preparation decisions every day.

## How It Works

1. A user signs up or logs in.
2. The dashboard tracks daily interview-prep work.
3. The user uploads a PDF resume.
4. The backend extracts resume text and sends it to the AI service for structured analysis.
5. TaskForge AI combines the resume analysis with recent tracker history.
6. The AI suggestion flow returns specific, time-bounded goals for the day.
7. The user selects the suggestions they want and adds them into today's plan.
8. Progress is saved and visible in history, charts, stats, and achievements.

## Key Features

### Resume-Aware AI Coaching

TaskForge AI analyzes a resume into structured fields such as skills, programming languages, frameworks, tools, projects, experience, education, domains, strengths, weaknesses, suggestions, and a career summary.

### Personalized Goal Suggestions

The app generates 5 to 10 daily goals using both resume analysis and the user's recent preparation activity. Suggestions include categories like DSA, system design, backend, AI/ML, HR, project work, and revision.

### Daily Tracking Workspace

Users can log progress across multiple preparation areas, review today's goals, and keep their preparation routine visible without needing a separate spreadsheet.

### History And Analytics

The app includes a history view, calendar-style review, progress statistics, streaks, charts, and achievement tracking so users can see consistency over time.

### Portable State

Users can import and export JSON state, making the app easier to test, demo, and migrate.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, Lucide React
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite for local development, PostgreSQL/Supabase compatible for deployment
- **Authentication:** Email/password auth, JWT sessions, Google OAuth support
- **AI:** Resume analysis and goal generation through an OpenRouter-compatible chat completions API

## Repository Structure

```txt
TaskForge/
  backend/
    app/
      api/         FastAPI route modules
      core/        config, auth, database setup
      models/      SQLAlchemy models
      schemas/     Pydantic request/response schemas
      services/    auth, state, and AI business logic
    main.py        backend entry point
    requirements.txt
  frontend/
    src/
      components/  reusable UI components
      contexts/    auth and tracker state contexts
      pages/       app pages
      services/    API clients
      utils/       helpers
    package.json
  images/          demo screenshots
```

## Local Setup

### Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- An OpenRouter API key or compatible hosted model key for AI features
- Optional: PostgreSQL or Supabase database URL for deployed persistence

The app can run locally with SQLite by default, so PostgreSQL is not required for basic local testing.

## Backend Setup

From the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./taskforge.db
FRONTEND_ORIGIN=http://localhost:5173
API_HOST=127.0.0.1
API_PORT=8000
JWT_SECRET=replace-this-for-local-testing
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7
OPENROUTER_API_KEY=your_api_key_here
```

For Supabase or PostgreSQL, replace `DATABASE_URL` with:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres
```

Run the backend:

```powershell
python .\main.py
```

Health check:

```txt
http://127.0.0.1:8000/health
```

## Frontend Setup

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Run the frontend:

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

Optional local preview:

```powershell
npm run preview
```

## How Judges Can Test It

1. Start the backend with the `.env` values above.
2. Start the frontend with `npm run dev`.
3. Create an account from the login screen.
4. Add daily prep activity on the dashboard or tracking pages.
5. Upload a text-based PDF resume.
6. Generate AI suggestions.
7. Select one or more suggestions and add them to today's goals.
8. Review the saved goals in the dashboard, history, stats, and progress views.

For AI testing, use a normal text-based PDF resume. Scanned image-only PDFs are not supported because the current extractor uses PDF text extraction.

## Demo Video Outline

The submission demo video should be under 3 minutes and cover:

1. The problem: interview prep is scattered and hard to personalize.
2. The app flow: sign in, track daily work, upload resume, generate AI goals.
3. The AI result: show resume-aware suggestions and add them into today's plan.
4. The persistence loop: show history, stats, or achievements after saving progress.
5. The build story: explain how Codex and GPT-5.6 accelerated implementation.

## How Codex And GPT-5.6 Were Used

Codex was used as the main engineering partner for building and refining TaskForge AI. It helped inspect the existing codebase, connect frontend flows to backend routes, reason through state persistence, improve UI behavior, and prepare the project documentation for the Build Week submission.

GPT-5.6 was used for AI-assisted product and implementation decisions, including:

- Shaping the resume analysis schema into structured, judge-testable output
- Designing prompts for personalized interview-prep recommendations
- Connecting user activity history with resume-derived weak areas
- Iterating on the product story, feature scope, and demo narrative
- Improving README clarity around setup, testing, and hackathon evaluation criteria

Codex accelerated the workflow by turning broad product goals into concrete implementation steps, checking route and service boundaries, and keeping the submission requirements visible while the app evolved.

## API Overview

Core backend routes include:

- `GET /health` - backend health check
- `POST /auth/signup` - create account
- `POST /auth/login` - log in
- `GET /auth/me` - current authenticated user
- `GET /state` - load tracker state
- `PUT /state` - save tracker state
- `POST /state/import` - import tracker state
- `DELETE /state` - reset tracker state
- `GET /days/{date}` - get a single day
- `PUT /days/{date}` - update a single day
- `POST /ai/resume/upload` - upload and analyze PDF resume
- `GET /ai/resume` - fetch current user's resume analysis
- `DELETE /ai/resume` - delete uploaded resume
- `POST /ai/suggestions` - generate personalized AI goals

Authenticated routes require a bearer token returned from signup or login.

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite, PostgreSQL, or Supabase connection string |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS |
| `API_HOST` | Backend host |
| `API_PORT` | Backend port |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_ALGORITHM` | JWT signing algorithm |
| `JWT_EXPIRE_DAYS` | Session duration |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth secret |
| `OPENROUTER_API_KEY` | API key for AI resume analysis and suggestions |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL for the FastAPI backend |

## Notes And Limitations

- AI features require `OPENROUTER_API_KEY`.
- Resume upload currently supports PDF files under 5 MB.
- Scanned image-only PDFs are not supported.
- SQLite is suitable for local testing; PostgreSQL or Supabase is recommended for shared demos.
- If the repository is private, share access with `testing@devpost.com` and `build-week-event@openai.com` for judging.

## What's Next

- Add calendar and reminder integrations
- Add richer weak-area analytics
- Add learning-plan generation across multiple weeks
- Support scanned resume OCR
- Add hosted demo accounts or seeded sample data for faster judging
- Add more detailed completion tracking for AI-added goals
