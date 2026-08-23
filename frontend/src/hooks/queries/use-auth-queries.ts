"use client";

// Every network call for signup/login lives here as a react-query hook —
// components never call apiClient or fetch directly. Mirrors the endpoints
// in backend/app/api/routes/auth.py one-to-one.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  LoginPayload,
  MessageResponse,
  ResendOtpPayload,
  SetPasswordPayload,
  SignupPayload,
  TokenResponse,
  UserResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/lib/auth-types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/** Step 1 — register an email; the backend mails it a one-time code. */
export function useSignupMutation() {
  return useMutation({
    mutationFn: ({ email }: SignupPayload) =>
      apiClient.post<MessageResponse>("/auth/signup", { email }),
  });
}

/** Fresh code for an email already mid-signup; 60s cooldown enforced server-side. */
export function useResendOtpMutation() {
  return useMutation({
    mutationFn: ({ email }: ResendOtpPayload) =>
      apiClient.post<MessageResponse>("/auth/resend-otp", { email }),
  });
}

/** Step 2 — exchange the code for a short-lived verification token. */
export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({ email, otp }: VerifyOtpPayload) =>
      apiClient.post<VerifyOtpResponse>("/auth/verify-otp", { email, otp }),
  });
}

/** Step 3 — user picks a password; account is activated on success. */
export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: ({ verification_token, password }: SetPasswordPayload) =>
      apiClient.post<UserResponse>("/auth/set-password", {
        verification_token,
        password,
      }),
  });
}

/** Email + password → bearer access token. */
export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      apiClient.post<TokenResponse>("/auth/login", { email, password }),
  });
}

/** Current user for a bearer token; disabled until a token exists. */
export function useMeQuery(token: string | null) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => apiClient.get<UserResponse>("/auth/me", { token }),
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });
}

/** Drops any cached auth data — call on logout. */
export function useClearAuthCache() {
  const queryClient = useQueryClient();
  return () => queryClient.removeQueries({ queryKey: authKeys.all });
}
