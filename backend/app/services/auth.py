from __future__ import annotations

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import create_token, hash_password, verify_password
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import AuthOut, UserOut


def _make_auth(user: User) -> AuthOut:
    token = create_token(user.id, user.email)
    return AuthOut(
        token=token,
        user=UserOut(id=user.id, email=user.email, name=user.name, provider=user.provider),
    )


def signup(db: Session, email: str, password: str, name: str) -> AuthOut:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    user = User(email=email, hashed_password=hash_password(password), name=name, provider="local")
    db.add(user)
    db.commit()
    db.refresh(user)
    return _make_auth(user)


def login(db: Session, email: str, password: str) -> AuthOut:
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.hashed_password:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    return _make_auth(user)


def google_auth(db: Session, credential: str) -> AuthOut:
    """Verify Google ID token and create-or-login the user."""
    # Verify the token with Google's tokeninfo endpoint
    try:
        resp = httpx.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}", timeout=10)
        if resp.status_code != 200:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Google token")
        payload = resp.json()
    except httpx.HTTPError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Failed to verify Google token")

    # Validate audience matches our client ID
    if settings.google_client_id and payload.get("aud") != settings.google_client_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token audience mismatch")

    email = payload.get("email")
    if not email:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Google token missing email")

    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            name=payload.get("name", ""),
            provider="google",
            hashed_password=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return _make_auth(user)
