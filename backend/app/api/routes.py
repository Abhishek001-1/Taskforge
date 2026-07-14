from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_session
from app.schemas import DayIn, StateIn
from app.services import delete_state, read_state, upsert_day, upsert_state

router = APIRouter()


@router.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@router.get("/state")
def get_state(db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    return read_state(db, claims["sub"])


@router.put("/state")
def put_state(payload: StateIn, db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    upsert_state(db, claims["sub"], payload.model_dump())
    return {"ok": True}


@router.post("/state/import")
def import_state(payload: StateIn, db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    upsert_state(db, claims["sub"], payload.model_dump())
    return {"ok": True}


@router.delete("/state")
def reset_state(db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    if not delete_state(db, claims["sub"]):
        raise HTTPException(404, "No state found")
    return {"ok": True}


@router.get("/days/{date}")
def get_day(date: str, db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    day = read_state(db, claims["sub"]).get("days", {}).get(date)
    if not day:
        raise HTTPException(404, "Day not found")
    return day


@router.put("/days/{date}")
def put_day(date: str, payload: DayIn, db: Session = Depends(get_session), claims: dict = Depends(get_current_user)):
    data = payload.model_dump(exclude_none=True)
    data.pop("date", None)
    return upsert_day(db, claims["sub"], date, data)
