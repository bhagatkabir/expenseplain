import logging
from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)


@event.listens_for(engine, "connect", once=True)
def _log_first_connection(dbapi_connection, connection_record) -> None:
    """Fire the first time the pool actually opens a socket to MySQL.

    create_engine() itself never touches the network, so this is the earliest
    point we can confirm the database is reachable and credentials are valid.
    """
    logger.info(
        "Connected to MySQL database %r at %s:%s",
        settings.mysql_database,
        settings.mysql_host,
        settings.mysql_port,
    )


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    """FastAPI dependency yielding a request-scoped session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
