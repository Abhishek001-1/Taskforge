from __future__ import annotations

from copy import deepcopy
from typing import Any

from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from app.models import AppState

DEFAULT_STATE: dict[str, Any] = {"days": {}, "settings": {}}
STATE_ID = "default"
DAY_KEYS = ("dsa", "system", "ai", "hr", "misc")


def read_state(db: Session) -> dict[str, Any]:
    row = db.get(AppState, STATE_ID)
    return deepcopy(row.data) if row else deepcopy(DEFAULT_STATE)


def upsert_state(db: Session, data: dict[str, Any]) -> None:
    table = AppState.__table__
    insert = pg_insert if db.bind and db.bind.dialect.name == "postgresql" else sqlite_insert
    stmt = insert(table).values(id=STATE_ID, data=data)
    db.execute(stmt.on_conflict_do_update(index_elements=[table.c.id], set_={"data": data}))
    db.commit()


def delete_state(db: Session) -> bool:
    row = db.get(AppState, STATE_ID)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


def _merge_day(current: dict[str, Any] | None, patch: dict[str, Any], date: str) -> dict[str, Any]:
    base = {
        "date": date,
        "dsa": {"solved": 0, "target": 5, "difficulty": "Medium", "platform": "LeetCode", "notes": ""},
        "system": {"title": "", "url": "", "read": False, "notes": ""},
        "ai": {"topic": "LLMs", "title": "", "url": "", "completed": False, "notes": ""},
        "hr": {"question": "", "practiced": False, "confidence": "Medium"},
        "misc": {"completed": False, "notes": ""},
        "notes": "",
    }
    if current:
        for key in DAY_KEYS:
            base[key] = {**base[key], **(current.get(key) or {})}
        base["notes"] = current.get("notes", "")
        base["date"] = current.get("date", date)

    for key in DAY_KEYS:
        if key in patch and isinstance(patch[key], dict):
            base[key] = {**base[key], **patch[key]}
    if "notes" in patch and patch["notes"] is not None:
        base["notes"] = patch["notes"]
    base["date"] = date
    return base


def upsert_day(db: Session, date: str, patch: dict[str, Any]) -> dict[str, Any]:
    state = read_state(db)
    days = dict(state.get("days") or {})
    merged = _merge_day(days.get(date), patch, date)
    days[date] = merged
    state["days"] = days
    upsert_state(db, state)
    return merged
