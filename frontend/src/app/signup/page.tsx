import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sign up — ExpensePlain",
  description: "Create your free ExpensePlain account.",
};

const perks = [
  "Track unlimited expenses",
  "Monthly budgets by category",
  "No credit card required",
];

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start tracking your spending in under a minute.
          </p>

          <ul className="mt-5 space-y-2">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                {perk}
              </li>
            ))}
          </ul>

          <form className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jordan Lee"
                className="mt-1.5 w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-white/15"
              />
            </div>
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
              Create free account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
