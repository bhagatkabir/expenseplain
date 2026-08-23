"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ReceiptIcon } from "@/components/icons";

export function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">
            Welcome back{user ? `, ${user.email}` : ""}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This is your protected dashboard — only signed-in accounts can see
            it.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          Log out
        </button>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
          <ReceiptIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No expenses tracked yet</h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Your account is verified and ready to go. Expense tracking, budgets,
          and reports will live here.
        </p>
      </div>
    </div>
  );
}
