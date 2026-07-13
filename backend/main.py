from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import JSON, String, create_engine
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./careeros.db"
    frontend_origin: str = "http://localhost:5173"
    api_host: str = "127.0.0.1"
    api_port: int = 8000


class Base(DeclarativeBase): pass


class AppState(Base):
    __tablename__ = "app_state"
    id: Mapped[str] = mapped_column(String, primary_key=True, default="default")
    data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)


class StateIn(BaseModel):
    days: dict[str, Any] = Field(default_factory=dict)
    settings: dict[str, Any] = Field(default_factory=dict)


def db_url(raw: str) -> str:
    url = raw.replace("postgresql://", "postgresql+psycopg://", 1)
    parsed = make_url(url)
    if parsed.drivername.startswith("postgresql") and (not parsed.password or parsed.host.startswith("@")):
        raise RuntimeError("DATABASE_URL is malformed. Put the real Supabase password after `postgres:` and percent-encode special characters like @, #, %, /, or :.")
    return url


cfg = Settings()
engine = create_engine(db_url(cfg.database_url), pool_pre_ping=True)
Base.metadata.create_all(engine)
app = FastAPI(title="CareerOS API")
app.add_middleware(CORSMiddleware, allow_origins=[cfg.frontend_origin, "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health(): return {"ok": True}


@app.get("/state")
def get_state():
    with Session(engine) as db:
        row = db.get(AppState, "default")
        return row.data if row else {"days": {}, "settings": {}}


def upsert_state(db: Session, data: dict[str, Any]):
    table = AppState.__table__
    if db.bind and db.bind.dialect.name == "postgresql":
        stmt = pg_insert(table).values(id="default", data=data)
    else:
        stmt = sqlite_insert(table).values(id="default", data=data)
    db.execute(stmt.on_conflict_do_update(index_elements=[table.c.id], set_={"data": data}))
    db.commit()


@app.put("/state")
def put_state(payload: StateIn):
    with Session(engine) as db:
        upsert_state(db, payload.model_dump())
        return {"ok": True}


@app.post("/state/import")
def import_state(payload: StateIn): return put_state(payload)


@app.delete("/state")
def reset_state():
    with Session(engine) as db:
        row = db.get(AppState, "default")
        if not row: raise HTTPException(404, "No state found")
        db.delete(row); db.commit()
        return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=cfg.api_host, port=cfg.api_port, reload=True)
