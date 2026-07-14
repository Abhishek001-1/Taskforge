from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Session

from app.core.config import settings


class Base(DeclarativeBase):
    pass


def normalize_database_url(raw: str) -> str:
    url = raw.replace("postgresql://", "postgresql+psycopg://", 1)
    parsed = make_url(url)
    if parsed.drivername.startswith("postgresql") and (not parsed.password or str(parsed.host).startswith("@")):
        raise RuntimeError(
            "DATABASE_URL is malformed. Put the real password after `postgres:` "
            "and percent-encode special characters like @, #, %, /, or :."
        )
    return url


engine = create_engine(normalize_database_url(settings.database_url), pool_pre_ping=True)


def get_session() -> Generator[Session]:
    with Session(engine) as session:
        yield session
