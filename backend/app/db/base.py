from datetime import datetime, timezone

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base shared by every ORM model."""


def utcnow() -> datetime:
    """Naive UTC timestamp.

    MySQL DATETIME columns carry no timezone, so every timestamp in this app is
    stored and compared as naive UTC to avoid aware/naive mix-ups.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)
