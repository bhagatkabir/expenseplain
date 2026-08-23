"use client";

// Owns the client-side session: the bearer token (localStorage-backed) and
// the current user (fetched via /auth/me). The API issues plain bearer
// tokens with no cookie, so this is the one place that decides whether the
// app is "logged in" — ProtectedRoute and the header both read it.
//
// The token is read through useSyncExternalStore rather than useState+effect
// so the very first client render (during hydration) matches the server —
// getServerSnapshot always reports "no token" — and React itself handles
// re-rendering once the real value is available, no imperative setState
// needed on mount.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useClearAuthCache, useMeQuery } from "@/hooks/queries/use-auth-queries";
import type { UserResponse } from "@/lib/auth-types";

const TOKEN_STORAGE_KEY = "expenseplain.access_token";

const tokenListeners = new Set<() => void>();

function notifyTokenListeners() {
  tokenListeners.forEach((listener) => listener());
}

function subscribeToToken(listener: () => void) {
  tokenListeners.add(listener);
  // Keeps other tabs in sync when the token is set/cleared there.
  window.addEventListener("storage", listener);
  return () => {
    tokenListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getTokenSnapshot(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    // localStorage can be unavailable (private browsing, disabled storage).
    return null;
  }
}

function getServerTokenSnapshot(): string | null {
  return null;
}

type AuthContextValue = {
  token: string | null;
  user: UserResponse | undefined;
  isAuthenticated: boolean;
  /** True until we know for sure whether a stored token is valid. */
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(
    subscribeToToken,
    getTokenSnapshot,
    getServerTokenSnapshot
  );
  const clearAuthCache = useClearAuthCache();
  const meQuery = useMeQuery(token);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore — there's nothing else to clean up client-side.
    }
    notifyTokenListeners();
    clearAuthCache();
  }, [clearAuthCache]);

  const login = useCallback((nextToken: string) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } catch {
      // Storage failing just means the session won't survive a refresh;
      // it still works for the current page load.
    }
    notifyTokenListeners();
  }, []);

  // A token that /auth/me rejects (expired, revoked) is worse than no token
  // — drop it so the rest of the app treats this as a clean logged-out state
  // instead of spinning forever.
  useEffect(() => {
    if (token && meQuery.isError) {
      logout();
    }
  }, [token, meQuery.isError, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: meQuery.data,
      isAuthenticated: Boolean(token && meQuery.data),
      isLoading: Boolean(token) && meQuery.isPending,
      login,
      logout,
    }),
    [token, meQuery.data, meQuery.isPending, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
