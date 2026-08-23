"""Outbound email.

With no SMTP_HOST configured the message is logged instead of sent, so the OTP
flow is usable in local development without a mail server.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class EmailDeliveryError(RuntimeError):
    """Raised when SMTP is configured but the message could not be handed off."""


def send_email(to: str, subject: str, body: str) -> None:
    settings = get_settings()

    if not settings.smtp_host:
        logger.warning(
            "SMTP not configured; email to %s not sent.\nSubject: %s\n%s", to, subject, body
        )
        return

    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_starttls:
                smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
    except (smtplib.SMTPException, OSError) as exc:
        logger.exception("Failed to send email to %s", to)
        raise EmailDeliveryError(str(exc)) from exc


def send_otp_email(to: str, otp: str, ttl_minutes: int) -> None:
    settings = get_settings()
    body = (
        f"Your {settings.app_name} verification code is: {otp}\n\n"
        f"It expires in {ttl_minutes} minutes. "
        "If you did not request this code you can ignore this email.\n"
    )
    send_email(to, f"{settings.app_name} verification code", body)
