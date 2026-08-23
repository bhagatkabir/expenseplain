"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLoginMutation } from "@/hooks/queries/use-auth-queries";
import { ApiError } from "@/lib/api-client";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-white/15";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Already signed in? Skip straight to the protected route.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    try {
      const { access_token } = await loginMutation.mutateAsync({
        email,
        password,
      });
      login(access_token);
      router.push("/dashboard");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Could not log you in. Try again."
      );
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-3xl tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Log in to keep track of where your money is going.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClasses}
          />
        </div>

        {formError && (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:hover:bg-zinc-200"
        >
          {loginMutation.isPending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
