from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ResumeOut(BaseModel):
    id: str
    filename: str
    analysis: dict[str, Any] | None = None
    created_at: datetime
    updated_at: datetime


class SuggestionItem(BaseModel):
    title: str
    category: str  # e.g. "DSA", "System Design", "AI/ML", "HR", "Project", "Backend"
    description: str
    estimated_minutes: int


class SuggestionsOut(BaseModel):
    suggestions: list[SuggestionItem]
