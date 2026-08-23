import Link from "next/link";
import { LogoMark } from "@/components/icons";

const footerNav = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/license", label: "License" },
    ],
  },
];

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <LogoMark className="h-4 w-4" />
              </span>
              ExpensePlain
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Simple, clear expense tracking for people who want to know
              exactly where their money goes.
            </p>
          </div>

          {footerNav.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-zinc-400">
          <p>&copy; {year} ExpensePlain. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/license" className="hover:text-foreground">
              Licensed under the ExpensePlain License
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
