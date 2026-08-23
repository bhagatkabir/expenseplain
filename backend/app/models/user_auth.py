from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserAuth(Base):
    """Credentials and signup-OTP state for one account."""

    __tablename__ = "user_auth"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    # Null until the user picks a password at the end of the signup flow.
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Null once an OTP has been consumed or expired.
    otp_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    otp_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    otp_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    otp_last_sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    otp_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<UserAuth id={self.id} email={self.email!r} verified={self.is_verified}>"
