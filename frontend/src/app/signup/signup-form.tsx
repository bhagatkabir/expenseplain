"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  useLoginMutation,
  useResendOtpMutation,
  useSetPasswordMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "@/hooks/queries/use-auth-queries";
import { ApiError } from "@/lib/api-client";
import { CheckIcon } from "@/components/icons";

const perks = [
  "Track unlimited expenses",
  "Monthly budgets by category",
  "No credit card required",
];

type Step = "email" | "otp" | "password";

const STEP_ORDER: Step[] = ["email", "otp", "password"];
const RESEND_COOLDOWN_SECONDS = 60;

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-white/15";

export function SignupForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const signupMutation = useSignupMutation();
  const resendOtpMutation = useResendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const setPasswordMutation = useSetPasswordMutation();
  const loginMutation = useLoginMutation();

  // Already signed in? Nothing left to do here.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    try {
      const result = await signupMutation.mutateAsync({ email });
      setInfoMessage(result.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("otp");
    } catch (error) {
      setFormError(messageFrom(error, "Could not sign you up. Try again."));
    }
  }

  async function handleResend() {
    setFormError(null);
    try {
      const result = await resendOtpMutation.mutateAsync({ email });
      setInfoMessage(result.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setFormError(messageFrom(error, "Could not resend the code. Try again."));
    }
  }

  async function handleOtpSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    try {
      const result = await verifyOtpMutation.mutateAsync({ email, otp });
      setVerificationToken(result.verification_token);
      setInfoMessage(null);
      setStep("password");
    } catch (error) {
      setFormError(messageFrom(error, "That code didn't work. Try again."));
    }
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }
    if (!verificationToken) {
      setFormError("Verification session expired. Start again.");
      setStep("email");
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({
        verification_token: verificationToken,
        password,
      });
      // Account is active now — log the user straight in rather than
      // making them re-enter what they just typed.
      const tokenResponse = await loginMutation.mutateAsync({
        email,
        password,
      });
      login(tokenResponse.access_token);
      router.push("/dashboard");
    } catch (error) {
      setFormError(
        messageFrom(error, "Could not finish setting up your account.")
      );
    }
  }

  function handleUseDifferentEmail() {
    setStep("email");
    setOtp("");
    setVerificationToken(null);
    setFormError(null);
    setInfoMessage(null);
    setCooldown(0);
  }

  const stepNumber = STEP_ORDER.indexOf(step) + 1;

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-medium tracking-wide text-emerald-600 uppercase">
        Step {stepNumber} of {STEP_ORDER.length}
      </p>

      {step === "email" && (
        <>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start tracking your spending in under a minute.
          </p>

          <ul className="mt-5 space-y-2">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                {perk}
              </li>
            ))}
          </ul>

          <form className="mt-8 space-y-4" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClasses}
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:hover:bg-zinc-200"
            >
              {signupMutation.isPending ? "Sending code…" : "Create free account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </>
      )}

      {step === "otp" && (
        <>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {infoMessage ?? `We sent a verification code to ${email}.`}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="text-sm font-medium text-foreground">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                className={`${inputClasses} tracking-[0.3em]`}
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={verifyOtpMutation.isPending}
              className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:hover:bg-zinc-200"
            >
              {verifyOtpMutation.isPending ? "Verifying…" : "Verify code"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleUseDifferentEmail}
              className="text-zinc-600 underline underline-offset-4 dark:text-zinc-400"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendOtpMutation.isPending}
              className="font-medium text-foreground underline underline-offset-4 disabled:no-underline disabled:text-zinc-400 dark:disabled:text-zinc-600"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </>
      )}

      {step === "password" && (
        <>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">
            Choose a password
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Email verified. Set a password to finish creating your account.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClasses}
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                At least 8 characters.
              </p>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClasses}
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={setPasswordMutation.isPending || loginMutation.isPending}
              className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:hover:bg-zinc-200"
            >
              {setPasswordMutation.isPending || loginMutation.isPending
                ? "Finishing up…"
                : "Create account"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
