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
    api = FastAPI(title="TaskForge API", version="1.0.0")
    api.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin, "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    api.include_router(auth_router)
    api.include_router(router)
    return api


app = create_app()
