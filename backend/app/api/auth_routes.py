from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_session
from app.models.user import User
from app.schemas.auth import AuthOut, GoogleAuthIn, LoginIn, SignupIn, UserOut
from app.services.auth import google_auth, login, signup

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/signup", response_model=AuthOut)
def signup_route(body: SignupIn, db: Session = Depends(get_session)):
    return signup(db, body.email, body.password, body.name)


@auth_router.post("/login", response_model=AuthOut)
def login_route(body: LoginIn, db: Session = Depends(get_session)):
    return login(db, body.email, body.password)


@auth_router.post("/google", response_model=AuthOut)
def google_route(body: GoogleAuthIn, db: Session = Depends(get_session)):
    return google_auth(db, body.credential)


@auth_router.get("/me", response_model=UserOut)
def me_route(claims: dict = Depends(get_current_user), db: Session = Depends(get_session)):
    user = db.get(User, claims["sub"])
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return UserOut(id=user.id, email=user.email, name=user.name, provider=user.provider)
