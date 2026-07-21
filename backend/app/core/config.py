# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./taskforge.db"
    frontend_origin: str = "http://localhost:5173"
    api_host: str = "127.0.0.1"
    api_port: int = 8000

    # JWT
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 7

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # OpenRouter AI
    openrouter_api_key: str = ""


settings = Settings()
