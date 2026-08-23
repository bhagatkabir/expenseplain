"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

/**
 * Gate for pages that require a logged-in user (e.g. /dashboard). The API
 * hands out a plain bearer token with no cookie, so there's nothing for
 * server-side middleware to check — the guard has to run client-side, after
 * useAuth has had a chance to read the stored token and confirm it with
 * /auth/me.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500 dark:text-zinc-400">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
