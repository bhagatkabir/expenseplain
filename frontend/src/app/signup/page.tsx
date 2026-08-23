import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up — ExpensePlain",
  description: "Create your free ExpensePlain account.",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <SignupForm />
      </main>

      <SiteFooter />
    </div>
  );
}
