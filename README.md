# claude-tut

Monorepo with a FastAPI backend and a Next.js frontend.

```
backend/    FastAPI app (Python 3.10, uvicorn)
frontend/   Next.js 16 app (TypeScript, App Router, Tailwind v4)
```

## Backend

```bash
cd backend
source .venv/bin/activate          # venv is already created
pip install -r requirements.txt    # already installed
uvicorn app.main:app --reload      # http://localhost:8000
```

- `GET /` — service banner
- `GET /api/health` — health check
- `GET /docs` — interactive OpenAPI docs

Config comes from `backend/.env` (see `.env.example`); `CORS_ORIGINS` is a
comma-separated list and already allows `http://localhost:3000`.

Layout:

```
backend/app/main.py            app factory, CORS, router mounting
backend/app/core/config.py     pydantic-settings Settings
backend/app/api/router.py      aggregates route modules under /api
backend/app/api/routes/        one module per resource (health.py)
```

## Frontend

```bash
cd frontend
npm run dev                    # http://localhost:3000
```

The backend base URL is read from `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Running both

Two terminals: `uvicorn app.main:app --reload` in `backend/`, `npm run dev` in `frontend/`.
