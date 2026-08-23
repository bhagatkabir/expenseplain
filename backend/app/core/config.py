from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "expenseplain-api"
    environment: str = "development"
    cors_origins: str = "http://localhost:3000"

    # MySQL
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "expenseplain"

    # JWT
    jwt_secret: str = "dev-only-insecure-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_ttl_minutes: int = 60
    verification_token_ttl_minutes: int = 15

    # OTP
    otp_ttl_minutes: int = 10
    otp_max_attempts: int = 5
    otp_resend_cooldown_seconds: int = 60

    # SMTP — leave smtp_host empty to print OTP emails to the log instead
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "no-reply@expenseplain.local"
    smtp_starttls: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def database_url(self) -> str:
        from urllib.parse import quote_plus

        password = quote_plus(self.mysql_password)
        return (
            f"mysql+pymysql://{self.mysql_user}:{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}?charset=utf8mb4"
        )

    @model_validator(mode="after")
    def _reject_default_secret_outside_dev(self) -> "Settings":
        if self.environment != "development" and self.jwt_secret == "dev-only-insecure-secret-change-me":
            raise ValueError("JWT_SECRET must be set to a real value outside development")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
