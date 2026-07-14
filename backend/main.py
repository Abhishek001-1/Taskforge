from app.core.config import settings
from app.main import app

__all__ = ["app", "settings"]

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.api_host, port=settings.api_port, reload=True)
