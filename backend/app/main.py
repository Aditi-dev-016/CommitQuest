from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.repository.router import router as repository_router
from app.services.issues.router import router as issues_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="ContribQuest AI Service",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(repository_router,   prefix="/v1",               tags=["repository"])
    app.include_router(issues_router,       prefix="/v1/issues",        tags=["issues"])

    return app


app = create_app()
