import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard — ExpensePlain",
  description: "Your ExpensePlain dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col px-6 py-16">
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      </main>

      <SiteFooter />
    </div>
  );
}
