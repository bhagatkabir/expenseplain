"""Password/OTP hashing and JWT issuing."""

import secrets
from datetime import timedelta
from typing import Any

import bcrypt
import jwt

from app.core.config import get_settings
from app.db.base import utcnow

# bcrypt truncates anything past 72 bytes, so we reject longer secrets outright.
MAX_SECRET_BYTES = 72

# Compared against when no user row exists, so a missing account costs the same
# time as a wrong password.
_DUMMY_HASH = bcrypt.hashpw(b"dummy-password-for-timing", bcrypt.gensalt()).decode()

TOKEN_PURPOSE_ACCESS = "access"
TOKEN_PURPOSE_SET_PASSWORD = "set_password"


def hash_secret(secret: str) -> str:
    """Hash a password or OTP with bcrypt."""
    return bcrypt.hashpw(secret.encode("utf-8"), bcrypt.gensalt()).decode()


def verify_secret(secret: str, hashed: str | None) -> bool:
    """Check a password or OTP against its hash, in constant-ish time."""
    candidate = hashed or _DUMMY_HASH
    try:
        matches = bcrypt.checkpw(secret.encode("utf-8"), candidate.encode("utf-8"))
    except ValueError:
        return False
    return matches and hashed is not None


def generate_otp(digits: int = 6) -> str:
    """Cryptographically random numeric OTP, zero padded."""
    upper = 10**digits
    return str(secrets.randbelow(upper)).zfill(digits)


def create_token(subject: str, purpose: str, ttl_minutes: int) -> tuple[str, int]:
    """Return a signed JWT and its lifetime in seconds."""
    settings = get_settings()
    issued_at = utcnow()
    expires_at = issued_at + timedelta(minutes=ttl_minutes)
    payload = {
        "sub": subject,
        "purpose": purpose,
        "iat": issued_at,
        "exp": expires_at,
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token, ttl_minutes * 60


def decode_token(token: str, expected_purpose: str) -> dict[str, Any]:
    """Decode a JWT, raising jwt.InvalidTokenError if it is not usable here."""
    settings = get_settings()
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    if payload.get("purpose") != expected_purpose:
        raise jwt.InvalidTokenError("Token was issued for a different purpose")
    if not payload.get("sub"):
        raise jwt.InvalidTokenError("Token is missing a subject")
    return payload
