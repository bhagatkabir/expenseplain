import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-background/80 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <LogoMark className="h-4 w-4" />
          </span>
          ExpensePlain
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex dark:text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-foreground sm:block dark:text-zinc-300"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
          >
            Sign up free
          </Link>
        </div>
      </div>
    </header>
  );
}
