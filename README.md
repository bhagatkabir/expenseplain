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
backend/app/main.py            app factory, CORS, router mounting, create_all on startup
backend/app/core/config.py     pydantic-settings Settings
backend/app/core/security.py   bcrypt hashing, OTP generation, JWT issue/decode
backend/app/db/                declarative Base + engine/session
backend/app/models/            ORM models (user_auth)
backend/app/schemas/           request/response models
backend/app/services/          auth logic and SMTP delivery
backend/app/api/deps.py        get_current_user bearer dependency
backend/app/api/router.py      aggregates route modules under /api
backend/app/api/routes/        one module per resource (health.py, auth.py)
```

### Database

Local MySQL must be running (`brew services start mysql`). One-time setup —
creates the `expenseplain` database and its dedicated user from the credentials
in `backend/.env`, prompting for your MySQL root password:

```bash
cd backend
./scripts/init_db.sh
```

The `user_auth` table is created automatically on app startup.

| column | notes |
| --- | --- |
| `id` | primary key |
| `email` | unique, stored lowercased |
| `password_hash` | bcrypt; null until the user picks a password |
| `otp_hash` | bcrypt; cleared once used or expired |
| `otp_expires_at`, `otp_attempts`, `otp_last_sent_at`, `otp_verified_at` | OTP state |
| `is_verified` | true once signup completes |
| `created_at`, `updated_at` | timestamps |

### Auth

Signup is three steps; the code is emailed to the address being registered.

```bash
# 1. request a code
curl -X POST localhost:8000/api/auth/signup \
  -H 'content-type: application/json' -d '{"email":"you@example.com"}'

# 2. verify it -> returns a short-lived verification_token
curl -X POST localhost:8000/api/auth/verify-otp \
  -H 'content-type: application/json' -d '{"email":"you@example.com","otp":"123456"}'

# 3. choose a password -> account is created
curl -X POST localhost:8000/api/auth/set-password \
  -H 'content-type: application/json' \
  -d '{"verification_token":"<token>","password":"Sup3rSecret!"}'

# then log in -> returns a bearer access_token
curl -X POST localhost:8000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","password":"Sup3rSecret!"}'

curl localhost:8000/api/auth/me -H 'authorization: Bearer <access_token>'
```

`POST /api/auth/resend-otp` issues a fresh code (60s cooldown). Codes are
6 digits, expire after 10 minutes, and are invalidated after 5 wrong attempts.

With `SMTP_HOST` empty (the default) no mail is sent — the OTP is written to the
uvicorn log, which is what you want in local development. Set `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `SMTP_FROM` to deliver for real
(Gmail: `smtp.gmail.com:587` with an App Password).

## Frontend

```bash
cd frontend
npm run dev                    # http://localhost:3000
```

The backend base URL is read from `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Running both

Two terminals: `uvicorn app.main:app --reload` in `backend/`, `npm run dev` in `frontend/`.
