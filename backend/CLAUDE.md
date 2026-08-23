# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FastAPI backend for `expenseplain`, one half of a monorepo (`../frontend` is the
Next.js app). Python 3.10, SQLAlchemy 2.0 ORM over MySQL, JWT-based auth with
email OTP signup. No test suite or lint config exists yet.

## Commands

```bash
source .venv/bin/activate          # venv already created
pip install -r requirements.txt

uvicorn app.main:app --reload      # http://localhost:8000, http://localhost:8000/docs

./scripts/init_db.sh               # create the MySQL database + app user (prompts for root password)
```

There is no test runner, linter, or formatter configured in this project — don't
assume `pytest`/`ruff`/`black` exist here.

Config is loaded from `backend/.env` via `app/core/config.py` (`pydantic-settings`);
copy `.env.example` to get started. `Settings` refuses to boot with the default
`jwt_secret` when `environment != "development"`.

## Architecture

Layering is strict and one-directional: **routes → services → models**. Routes
(`app/api/routes/`) only parse/validate the request and shape the response;
all business logic (validation errors, state transitions, commits) lives in
`app/services/`. Never put DB queries or HTTPException logic directly in a
route handler — follow the pattern in `app/api/routes/auth.py` /
`app/services/auth.py`.

- `app/main.py` — app factory; on `lifespan` startup it calls
  `Base.metadata.create_all` to reconcile tables (no Alembic/migrations —
  schema changes are additive model edits). Every model must be imported here
  (see the `UserAuth` import) so it registers on `Base.metadata` before that
  runs.
- `app/api/router.py` — aggregates per-resource route modules under `/api`.
  Add a new resource by creating `app/api/routes/<resource>.py` and including
  its router here.
- `app/api/deps.py` — shared FastAPI dependencies, notably `get_current_user`
  (bearer-token auth guard).
- `app/core/config.py` — the single `Settings` object (`get_settings()`,
  `lru_cache`d). All env-driven values flow through here, not `os.environ`.
- `app/core/security.py` — bcrypt hashing and JWT issuing/decoding. JWTs carry
  a `purpose` claim (`TOKEN_PURPOSE_ACCESS` vs `TOKEN_PURPOSE_SET_PASSWORD`) so
  a token minted for one step of the auth flow can't be replayed for another.
- `app/db/base.py` — declarative `Base` plus `utcnow()`. All timestamps are
  naive UTC (MySQL `DATETIME` carries no tz) — always use `utcnow()`, never
  `datetime.now()`/`datetime.utcnow()`, to avoid aware/naive comparison bugs.
- `app/db/session.py` — engine + `get_db()` per-request session dependency.
- `app/services/email.py` — outbound mail. With `SMTP_HOST` unset, mail is
  logged instead of sent — this is the normal local-dev path, not a stub to
  replace.

### Signup/auth flow

Signup is a three-step state machine tracked entirely on the `UserAuth` row
(`app/models/user_auth.py`) — no separate OTP table:

1. `POST /api/auth/signup` (or `/resend-otp`) — `issue_otp` creates/refreshes
   the row with a hashed OTP and emails the plaintext code. The row is only
   committed *after* the email send succeeds, so a delivery failure never
   strands an unusable code.
2. `POST /api/auth/verify-otp` — `verify_otp` checks the hash, enforces
   `otp_max_attempts` and expiry, then clears the OTP fields and returns a
   short-lived JWT (`TOKEN_PURPOSE_SET_PASSWORD`) — the password step trusts
   this token, not the request body, for identity.
3. `POST /api/auth/set-password` — exchanges that token for a bcrypt password
   hash and flips `is_verified = True`.

`POST /api/auth/login` and `get_current_user` (`TOKEN_PURPOSE_ACCESS` JWT) are
the ongoing-session side. Security details worth preserving when touching this
code:

- `login` always calls `verify_secret` (against a dummy hash if the user
  doesn't exist) so response timing doesn't leak whether an email is registered.
- Secrets over 72 bytes are rejected before hashing (`MAX_SECRET_BYTES` in
  `core/security.py`) because bcrypt silently truncates past that length.
- A missing bearer token must 401, not FastAPI's default 403 — this is why
  `deps.py` uses `HTTPBearer(auto_error=False)` and raises its own
  `HTTPException`.
