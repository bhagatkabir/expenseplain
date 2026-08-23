import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — ExpensePlain",
  description: "The terms and conditions for using ExpensePlain.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-4xl tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: August 23, 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <p>
            These are placeholder Terms &amp; Conditions for the ExpensePlain
            demo application. Replace this page with your reviewed legal
            terms before using ExpensePlain with real users or real financial
            data.
          </p>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              1. Using ExpensePlain
            </h2>
            <p className="mt-2">
              By creating an account, you agree to use ExpensePlain only for
              lawful personal or business expense tracking, and to keep your
              login credentials secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              2. Your data
            </h2>
            <p className="mt-2">
              Expenses, budgets, and account details you enter belong to you.
              See the{" "}
              <a href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </a>{" "}
              for details on how this data is stored and used.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              3. No financial advice
            </h2>
            <p className="mt-2">
              ExpensePlain helps you track and organize spending. It does not
              provide financial, tax, or investment advice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              4. Changes
            </h2>
            <p className="mt-2">
              These terms may be updated from time to time. Continued use of
              ExpensePlain after a change means you accept the updated terms.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
