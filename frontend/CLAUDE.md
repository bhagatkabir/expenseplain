# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

There is no test runner configured in this project.

## Before writing code

Per `AGENTS.md` (which `CLAUDE.md` includes above and which overrides default assumptions): this Next.js version (16.3.2) may differ from training data. Check `node_modules/next/dist/docs/` for the relevant guide before relying on remembered Next.js APIs/conventions, and heed deprecation notices there.

## Architecture

This is the frontend for **ExpensePlain**, an expense tracker. It's a Next.js App Router app that talks to a separate FastAPI backend (sibling `backend/` directory, not part of this package) — `backend/app/api/routes` and `backend/app/schemas` are the source of truth this frontend mirrors.

### Auth flow

Signup is a 3-step, multi-request flow (see `src/hooks/queries/use-auth-queries.ts`, one hook per backend endpoint):
1. `POST /auth/signup` — register an email; backend emails a one-time code.
2. `POST /auth/verify-otp` — exchange the code for a short-lived verification token (`resend-otp` is available mid-flow, 60s cooldown enforced server-side).
3. `POST /auth/set-password` — set a password using that token; activates the account.

Login is a single `POST /auth/login` exchanging email/password for a bearer `access_token`.

The API issues a plain bearer token with **no cookie**, which shapes the rest of the client-side auth design:
- `src/lib/api-client.ts` is a thin `fetch` wrapper (`apiClient.get`/`post`) that attaches `Authorization: Bearer <token>` and normalizes both FastAPI's plain `{ detail: string }` errors and pydantic's list-shaped 422 validation errors into a single `ApiError`.
- `src/hooks/queries/use-auth-queries.ts` wraps every auth call in a react-query hook — **components call these hooks, never `apiClient`/`fetch` directly**.
- `src/hooks/use-auth.tsx` (`AuthProvider`/`useAuth`) owns the session: the token is persisted in `localStorage` and read via `useSyncExternalStore` (so first client render matches SSR — server snapshot is always "no token" — avoiding hydration mismatches and a manual effect-driven `setState`). It cross-tab-syncs via the `storage` event, and calls `/auth/me` to hydrate the user and validate the token, logging out automatically if `/auth/me` errors (expired/revoked token).
- Because there's no cookie, there is **no server-side/middleware route protection**. `src/components/protected-route.tsx` (`ProtectedRoute`) is a client-side gate wrapping pages like `/dashboard`: it shows a loading state until `useAuth` resolves, then redirects to `/login` if unauthenticated.
- `src/lib/auth-types.ts` mirrors `backend/app/schemas/auth.py` request/response shapes — keep the two in sync when either changes.

### App structure

- `src/app/` — App Router routes. Multi-step forms (signup, login) live as client components colocated with their route (`signup-form.tsx`, `login-form.tsx`), with the route's `page.tsx` kept as a server component for metadata.
- `src/components/` — shared UI: `site-header`/`site-footer`, `theme-toggle`, `protected-route`, `providers` (wraps the app in `QueryClientProvider` + `AuthProvider`).
- `src/hooks/` — `use-auth.tsx` (session) and `hooks/queries/` (all react-query data hooks).
- `src/lib/` — `api-client.ts` (fetch wrapper) and `*-types.ts` (types mirroring backend schemas).

### Theming

Dark/light theme is applied via a `data-theme` attribute on `<html>`, not the `class` strategy. To avoid a flash of the wrong theme, an inline script in `src/app/layout.tsx` (`beforeInteractive`) sets `data-theme` from `localStorage` (falling back to `prefers-color-scheme`) before hydration. This logic is duplicated in three places that must stay in sync: the inline script in `layout.tsx`, the CSS fallback in `globals.css`, and the toggle logic in `theme-toggle.tsx`.

### Config

- `NEXT_PUBLIC_API_URL` — base URL of the FastAPI backend (default `http://localhost:8000`); see `.env.example`.
- Path alias `@/*` → `src/*` (`tsconfig.json`).
