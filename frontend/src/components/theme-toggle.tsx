"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

// Both icons always render; which one is visible is decided purely by CSS
// (`dark:` matches the `data-theme` attribute on <html>, see globals.css).
// That means there's no client state to hydrate and no flash/mismatch.
function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage may be unavailable (e.g. private browsing) — the
    // toggle still works for the current page load.
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle day and night mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/[.06]"
    >
      <SunIcon className="h-4 w-4 dark:hidden" />
      <MoonIcon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
