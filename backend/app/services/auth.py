"""Signup / OTP / login logic, kept out of the route handlers."""

import logging
from datetime import timedelta

import jwt
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    TOKEN_PURPOSE_ACCESS,
    TOKEN_PURPOSE_SET_PASSWORD,
    create_token,
    decode_token,
    generate_otp,
    hash_secret,
    verify_secret,
)
from app.db.base import utcnow
from app.models import UserAuth
from app.services.email import EmailDeliveryError, send_otp_email

logger = logging.getLogger(__name__)

INVALID_OTP_DETAIL = "Invalid or expired verification code"


def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_user_by_email(db: Session, email: str) -> UserAuth | None:
    return db.scalar(select(UserAuth).where(UserAuth.email == normalize_email(email)))


def get_user_by_id(db: Session, user_id: int) -> UserAuth | None:
    return db.get(UserAuth, user_id)


def _clear_otp(user: UserAuth) -> None:
    user.otp_hash = None
    user.otp_expires_at = None
    user.otp_attempts = 0


def issue_otp(db: Session, email: str) -> UserAuth:
    """Create or refresh the signup OTP for `email` and email it out.

    The row is only committed once the email has been handed to SMTP, so a
    delivery failure never leaves behind a code the user cannot receive.
    """
    settings = get_settings()
    email = normalize_email(email)
    user = get_user_by_email(db, email)

    if user and user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Try logging in instead.",
        )

    now = utcnow()
    if user and user.otp_last_sent_at:
        wait = timedelta(seconds=settings.otp_resend_cooldown_seconds) - (
            now - user.otp_last_sent_at
        )
        if wait > timedelta(0):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"A code was just sent. Try again in {int(wait.total_seconds()) + 1} seconds.",
            )

    if user is None:
        user = UserAuth(email=email)
        db.add(user)

    otp = generate_otp()
    user.otp_hash = hash_secret(otp)
    user.otp_expires_at = now + timedelta(minutes=settings.otp_ttl_minutes)
    user.otp_attempts = 0
    user.otp_last_sent_at = now
    user.otp_verified_at = None

    try:
        db.flush()
    except IntegrityError:  # concurrent signup for the same email
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Try logging in instead.",
        ) from None

    try:
        send_otp_email(user.email, otp, settings.otp_ttl_minutes)
    except EmailDeliveryError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not send the verification email. Please try again.",
        ) from None

    db.commit()
    return user


def verify_otp(db: Session, email: str, otp: str) -> tuple[str, int]:
    """Consume the OTP and hand back a short-lived token for setting a password."""
    settings = get_settings()
    user = get_user_by_email(db, email)

    if user is None or user.otp_hash is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=INVALID_OTP_DETAIL
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Try logging in instead.",
        )

    now = utcnow()
    if user.otp_expires_at is None or user.otp_expires_at <= now:
        _clear_otp(user)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=INVALID_OTP_DETAIL
        )

    if user.otp_attempts >= settings.otp_max_attempts:
        _clear_otp(user)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. Request a new code.",
        )

    user.otp_attempts += 1
    if not verify_secret(otp, user.otp_hash):
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=INVALID_OTP_DETAIL
        )

    _clear_otp(user)
    user.otp_verified_at = now
    db.commit()

    return create_token(
        subject=str(user.id),
        purpose=TOKEN_PURPOSE_SET_PASSWORD,
        ttl_minutes=settings.verification_token_ttl_minutes,
    )


def set_password(db: Session, verification_token: str, password: str) -> UserAuth:
    """Finish signup: store the bcrypt hash of the password the user chose."""
    try:
        payload = decode_token(verification_token, TOKEN_PURPOSE_SET_PASSWORD)
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification session is invalid or has expired. Start again.",
        ) from None

    user = get_user_by_id(db, int(payload["sub"]))
    if user is None or user.otp_verified_at is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification session is invalid or has expired. Start again.",
        )

    # Also stops a verification token from being replayed to reset a password.
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Try logging in instead.",
        )

    user.password_hash = hash_secret(password)
    user.is_verified = True
    user.otp_verified_at = None
    user.otp_last_sent_at = None
    db.commit()
    return user


def login(db: Session, email: str, password: str) -> tuple[str, int]:
    settings = get_settings()
    user = get_user_by_email(db, email)

    # Runs even when the user is missing so the response time does not reveal
    # whether the email is registered.
    password_ok = verify_secret(password, user.password_hash if user else None)

    if user is None or not user.is_verified or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return create_token(
        subject=str(user.id),
        purpose=TOKEN_PURPOSE_ACCESS,
        ttl_minutes=settings.access_token_ttl_minutes,
    )
