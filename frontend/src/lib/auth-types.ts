// Mirrors backend/app/schemas/auth.py — keep in sync with that file.

export type MessageResponse = {
  message: string;
};

export type VerifyOtpResponse = {
  message: string;
  verification_token: string;
  expires_in: number;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type UserResponse = {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string;
};

export type SignupPayload = {
  email: string;
};

export type ResendOtpPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type SetPasswordPayload = {
  verification_token: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
