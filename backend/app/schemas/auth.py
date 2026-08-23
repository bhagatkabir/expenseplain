from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import MAX_SECRET_BYTES


class _PasswordMixin(BaseModel):
    password: str = Field(min_length=8, description="At least 8 characters, at most 72 bytes")

    @field_validator("password")
    @classmethod
    def _within_bcrypt_limit(cls, value: str) -> str:
        if len(value.encode("utf-8")) > MAX_SECRET_BYTES:
            raise ValueError(f"Password must be at most {MAX_SECRET_BYTES} bytes")
        return value


class SignupRequest(BaseModel):
    email: EmailStr


class ResendOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=10, pattern=r"^\d+$")


class SetPasswordRequest(_PasswordMixin):
    verification_token: str


class LoginRequest(_PasswordMixin):
    email: EmailStr


class MessageResponse(BaseModel):
    message: str


class VerifyOtpResponse(BaseModel):
    message: str
    verification_token: str
    expires_in: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}
