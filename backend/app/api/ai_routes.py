"""AI routes — resume upload/analysis and goal suggestions."""

from __future__ import annotations

import io
import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_session
from app.models.resume import Resume
from app.schemas.ai import ResumeOut, SuggestionsOut
from app.services.ai import analyze_resume, generate_suggestions
from app.services.state import read_state

logger = logging.getLogger(__name__)

ai_router = APIRouter(prefix="/ai", tags=["ai"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def _extract_pdf_text(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyPDF2."""
    from PyPDF2 import PdfReader

    reader = PdfReader(io.BytesIO(pdf_bytes))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def _resume_to_out(resume: Resume) -> ResumeOut:
    return ResumeOut(
        id=resume.id,
        filename=resume.filename,
        analysis=resume.analysis,
        created_at=resume.created_at,
        updated_at=resume.updated_at,
    )


# ── Upload resume ────────────────────────────────────────────────────────────


@ai_router.post("/resume/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile,
    db: Session = Depends(get_session),
    claims: dict = Depends(get_current_user),
):
    """Upload a PDF resume, extract text, run AI analysis, store everything."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Only PDF files are accepted")

    pdf_bytes = await file.read()
    if len(pdf_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "File size must be under 5 MB")
    if len(pdf_bytes) == 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "File is empty")

    # Extract text
    try:
        extracted = _extract_pdf_text(pdf_bytes)
    except Exception as exc:
        logger.error("PDF extraction failed: %s", exc)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Could not read PDF — is it a valid PDF file?")

    if not extracted.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Could not extract text from PDF (scanned image PDFs are not supported)")

    # AI analysis
    try:
        analysis = await analyze_resume(extracted)
    except Exception as exc:
        logger.error("AI analysis failed: %s", exc)
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"AI analysis failed: {exc}")

    user_id = claims["sub"]

    # Upsert — delete existing resume for this user, then insert
    existing = db.query(Resume).filter(Resume.user_id == user_id).first()
    if existing:
        db.delete(existing)
        db.flush()

    resume = Resume(
        user_id=user_id,
        filename=file.filename,
        pdf_data=pdf_bytes,
        extracted_text=extracted,
        analysis=analysis,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return _resume_to_out(resume)


# ── Get resume ───────────────────────────────────────────────────────────────


@ai_router.get("/resume", response_model=ResumeOut)
def get_resume(
    db: Session = Depends(get_session),
    claims: dict = Depends(get_current_user),
):
    """Return the current user's resume analysis."""
    resume = db.query(Resume).filter(Resume.user_id == claims["sub"]).first()
    if not resume:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No resume uploaded")
    return _resume_to_out(resume)


# ── Delete resume ────────────────────────────────────────────────────────────


@ai_router.delete("/resume")
def delete_resume(
    db: Session = Depends(get_session),
    claims: dict = Depends(get_current_user),
):
    """Delete the current user's resume."""
    resume = db.query(Resume).filter(Resume.user_id == claims["sub"]).first()
    if not resume:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No resume found")
    db.delete(resume)
    db.commit()
    return {"ok": True}


# ── AI Suggestions ───────────────────────────────────────────────────────────


@ai_router.post("/suggestions", response_model=SuggestionsOut)
async def get_suggestions(
    db: Session = Depends(get_session),
    claims: dict = Depends(get_current_user),
):
    """Generate personalized goal suggestions from resume + tracker state."""
    user_id = claims["sub"]

    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume or not resume.analysis:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Upload and analyze your resume first before requesting suggestions",
        )

    tracker_state = read_state(db, user_id)

    try:
        suggestions = await generate_suggestions(resume.analysis, tracker_state)
    except Exception as exc:
        logger.error("AI suggestions failed: %s", exc)
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"AI suggestion generation failed: {exc}")

    return SuggestionsOut(suggestions=suggestions)
