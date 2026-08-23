import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "License — ExpensePlain",
  description: "License information for ExpensePlain.",
};

export default function LicensePage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-4xl tracking-tight">License</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: August 23, 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <p>
            &copy; 2026 ExpensePlain. All rights reserved. ExpensePlain is
            proprietary software; this page is a placeholder and should be
            replaced with the license that actually applies to your project
            before shipping.
          </p>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              Account holders
            </h2>
            <p className="mt-2">
              Creating an account grants you a personal, non-transferable
              license to use ExpensePlain to track your own expenses, subject
              to the{" "}
              <a href="/terms" className="underline underline-offset-4">
                Terms &amp; Conditions
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">
              Open-source components
            </h2>
            <p className="mt-2">
              ExpensePlain is built with open-source software, including
              Next.js, React, and Tailwind CSS, each used under its own
              respective license.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
