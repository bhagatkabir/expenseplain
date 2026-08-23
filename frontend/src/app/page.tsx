import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRightIcon,
  BellIcon,
  ChartIcon,
  CheckIcon,
  ReceiptIcon,
  ShieldIcon,
  SyncIcon,
  TagIcon,
  TargetIcon,
} from "@/components/icons";

const categories = [
  { label: "Groceries", amount: "$412", pct: 78, color: "bg-emerald-500" },
  { label: "Transport", amount: "$186", pct: 45, color: "bg-sky-500" },
  { label: "Subscriptions", amount: "$96", pct: 28, color: "bg-amber-500" },
  { label: "Dining out", amount: "$231", pct: 55, color: "bg-violet-500" },
];

const transactions = [
  { name: "Whole Foods Market", category: "Groceries", amount: "-$64.20" },
  { name: "Uber", category: "Transport", amount: "-$18.50" },
  { name: "Spotify", category: "Subscriptions", amount: "-$10.99" },
  { name: "Paycheck · Acme Inc", category: "Income", amount: "+$3,200.00" },
];

const highlights = [
  { icon: SyncIcon, label: "Auto-sync transactions" },
  { icon: ShieldIcon, label: "Bank-level encryption" },
  { icon: BellIcon, label: "Real-time budget alerts" },
  { icon: ChartIcon, label: "Exportable reports" },
];

const features = [
  {
    icon: ReceiptIcon,
    title: "Log expenses in seconds",
    description:
      "Snap a receipt or add a line item manually — ExpensePlain sorts it into the right category automatically.",
  },
  {
    icon: TargetIcon,
    title: "Set budgets that stick",
    description:
      "Create monthly budgets per category and get a heads-up before you're about to go over.",
  },
  {
    icon: TagIcon,
    title: "See where it really goes",
    description:
      "Clear breakdowns by category, merchant, and month — no spreadsheets, no guesswork.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-16 px-6 pt-16 pb-20 md:grid-cols-2 md:items-center md:pt-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
              Personal finance, simplified
            </span>

            <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Know exactly where
              <br />
              your money goes
            </h1>

            <p className="mt-6 max-w-md text-lg leading-7 text-zinc-600 dark:text-zinc-400">
              ExpensePlain tracks your spending, organizes it into budgets,
              and shows you clear, honest reports — so managing money stops
              feeling like a chore.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
              >
                Get started for free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
              >
                Log in
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                Free plan, forever
              </span>
            </div>
          </div>

          {/* Dashboard preview mock */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 z-10 w-56 rounded-2xl border border-black/5 bg-background p-4 shadow-xl dark:border-white/10">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Add expense
              </p>
              <div className="mt-2 rounded-lg border border-black/10 px-3 py-2 text-sm text-zinc-400 dark:border-white/15">
                Coffee with Sam
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-md bg-emerald-600/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Dining out
                </span>
                <span className="text-sm font-semibold">$6.50</span>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-background p-6 pt-14 shadow-2xl dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    This month
                  </p>
                  <p className="text-2xl font-semibold">$925.00</p>
                </div>
                <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  12% under budget
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {categories.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{c.label}</span>
                      <span className="font-medium text-foreground">
                        {c.amount}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${c.color}`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/10">
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Recent transactions
                </p>
                <ul className="space-y-2.5">
                  {transactions.map((t) => (
                    <li
                      key={t.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {t.category}
                        </p>
                      </div>
                      <span
                        className={
                          t.amount.startsWith("+")
                            ? "font-medium text-emerald-600"
                            : "font-medium"
                        }
                      >
                        {t.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights strip */}
        <section className="bg-foreground py-8 text-background">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
              >
                <h.icon className="h-5 w-5 shrink-0 opacity-80" />
                <span className="text-sm font-medium opacity-90">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              ExpensePlain keeps expense tracking plain and simple — three
              things, done well.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
