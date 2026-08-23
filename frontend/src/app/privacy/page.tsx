import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — ExpensePlain",
  description: "How ExpensePlain handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-4xl tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: August 23, 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <p>
            This is a placeholder Privacy Policy for the ExpensePlain demo
            application. Replace it with a reviewed policy before storing
            real user or financial data.
          </p>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              1. What we collect
            </h2>
            <p className="mt-2">
              Account details (name, email), and the expenses, categories,
              and budgets you enter into ExpensePlain.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              2. How we use it
            </h2>
            <p className="mt-2">
              To show you your spending, budgets, and reports, and to keep
              your account secure. We do not sell your data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              3. Data retention
            </h2>
            <p className="mt-2">
              Your data is kept for as long as your account is active. You
              can request deletion of your account and data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              4. Contact
            </h2>
            <p className="mt-2">
              Questions about this policy can be directed to the ExpensePlain
              team.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
