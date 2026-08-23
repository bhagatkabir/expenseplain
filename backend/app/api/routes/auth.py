from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models import UserAuth
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    ResendOtpRequest,
    SetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
)
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


def _otp_sent_message(email: str) -> str:
    ttl = get_settings().otp_ttl_minutes
    return f"A verification code was sent to {email}. It expires in {ttl} minutes."


@router.post("/signup", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """Step 1 — register an email and mail it a one-time code."""
    user = auth_service.issue_otp(db, payload.email)
    return MessageResponse(message=_otp_sent_message(user.email))


@router.post("/resend-otp", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
def resend_otp(payload: ResendOtpRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """Send a fresh code, invalidating the previous one."""
    user = auth_service.issue_otp(db, payload.email)
    return MessageResponse(message=_otp_sent_message(user.email))


@router.post("/verify-otp", response_model=VerifyOtpResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)) -> VerifyOtpResponse:
    """Step 2 — exchange a valid code for a short-lived verification token."""
    token, expires_in = auth_service.verify_otp(db, payload.email, payload.otp)
    return VerifyOtpResponse(
        message="Code verified. Choose a password to finish signing up.",
        verification_token=token,
        expires_in=expires_in,
    )


@router.post("/set-password", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def set_password(payload: SetPasswordRequest, db: Session = Depends(get_db)) -> UserAuth:
    """Step 3 — the user picks a password; we store only its bcrypt hash."""
    return auth_service.set_password(db, payload.verification_token, payload.password)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    access_token, expires_in = auth_service.login(db, payload.email, payload.password)
    return TokenResponse(access_token=access_token, expires_in=expires_in)


@router.get("/me", response_model=UserResponse)
def me(current_user: UserAuth = Depends(get_current_user)) -> UserAuth:
    return current_user
