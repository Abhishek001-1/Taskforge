from typing import Any

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AppState(Base):
    __tablename__ = "app_state"

    id: Mapped[str] = mapped_column(String, primary_key=True, default="default")
    data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
