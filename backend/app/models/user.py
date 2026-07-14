from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, default="")
    hashed_password: Mapped[str | None] = mapped_column(String, nullable=True)  # null for OAuth-only
    provider: Mapped[str] = mapped_column(String, default="local")  # "local" | "google"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
