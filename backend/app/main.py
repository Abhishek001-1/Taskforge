from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_routes import auth_router
from app.api.routes import router
from app.core.config import settings
from app.core.database import Base, engine


def create_app() -> FastAPI:
    try:
        Base.metadata.create_all(engine)
    except Exception as exc:
        import logging
        logging.warning("Could not run create_all at startup (DB may be temporarily unreachable): %s", exc)
    # Support comma-separated origins: "http://localhost:5173,https://taskforgeapp.vercel.app"
    origins = [o.strip() for o in settings.frontend_origin.split(",") if o.strip()]
    origins.append("http://127.0.0.1:5173")  # always allow local dev
    origins.append("http://localhost:5173")
    api = FastAPI(title="TaskForge API", version="1.0.0")
    api.add_middleware(
        CORSMiddleware,
        allow_origins=list(set(origins)),
        # Also allow all Vercel preview/branch deployments for this project
        allow_origin_regex=r"https://taskforge.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    api.include_router(auth_router)
    api.include_router(router)
    return api


app = create_app()
