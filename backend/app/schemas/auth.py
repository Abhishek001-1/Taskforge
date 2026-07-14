from pydantic import BaseModel, EmailStr


class SignupIn(BaseModel):
    email: str
    password: str
    name: str = ""


class LoginIn(BaseModel):
    email: str
    password: str


class GoogleAuthIn(BaseModel):
    credential: str  # Google ID token from GSI client


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    provider: str


class AuthOut(BaseModel):
    token: str
    user: UserOut
