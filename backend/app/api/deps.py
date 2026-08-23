"""Shared FastAPI dependencies."""

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import TOKEN_PURPOSE_ACCESS, decode_token
from app.db.session import get_db
from app.models import UserAuth
from app.services import auth as auth_service

# auto_error=False so a missing header raises our own 401 rather than a 403.
bearer_scheme = HTTPBearer(auto_error=False)

_CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> UserAuth:
    if credentials is None:
        raise _CREDENTIALS_ERROR

    try:
        payload = decode_token(credentials.credentials, TOKEN_PURPOSE_ACCESS)
    except jwt.InvalidTokenError:
        raise _CREDENTIALS_ERROR from None

    user = auth_service.get_user_by_id(db, int(payload["sub"]))
    if user is None or not user.is_verified:
        raise _CREDENTIALS_ERROR
    return user
