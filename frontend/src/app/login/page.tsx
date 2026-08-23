import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in — ExpensePlain",
  description: "Log in to your ExpensePlain account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <LoginForm />
      </main>

      <SiteFooter />
    </div>
  );
}
