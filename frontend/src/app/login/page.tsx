import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Log in — ExpensePlain",
  description: "Log in to your ExpensePlain account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Log in to keep track of where your money is going.
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-white/15"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-white/15"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
            >
              Log in
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
      </main>

      <SiteFooter />
    </div>
  );
}
