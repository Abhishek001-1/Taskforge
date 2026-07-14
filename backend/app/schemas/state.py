from typing import Any

from pydantic import BaseModel, Field


class StateIn(BaseModel):
    days: dict[str, Any] = Field(default_factory=dict)
    settings: dict[str, Any] = Field(default_factory=dict)


class DayIn(BaseModel):
    date: str
    dsa: dict[str, Any] | None = None
    system: dict[str, Any] | None = None
    ai: dict[str, Any] | None = None
    hr: dict[str, Any] | None = None
    misc: dict[str, Any] | None = None
    notes: str | None = None
