from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.services.auth.router import router as auth_router
from app.services.contributor.router import router as contributor_router
from app.services.repository.router import router as repository_router
from app.services.issues.router import router as issues_router
from app.services.quests.router import router as quests_router
from app.services.gamification.router import router as gamification_router
from app.services.academy.router import router as academy_router
from app.services.guilds.router import router as guilds_router
from app.services.notifications.router import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="ContribQuest API",
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

    app.include_router(auth_router,         prefix="/v1/auth",          tags=["auth"])
    app.include_router(contributor_router,  prefix="/v1/contributors",  tags=["contributors"])
    app.include_router(repository_router,   prefix="/v1",               tags=["repository"])
    app.include_router(issues_router,       prefix="/v1/issues",        tags=["issues"])
    app.include_router(quests_router,       prefix="/v1/quests",        tags=["quests"])
    app.include_router(gamification_router, prefix="/v1/gamification",  tags=["gamification"])
    app.include_router(academy_router,      prefix="/v1/academy",       tags=["academy"])
    app.include_router(guilds_router,       prefix="/v1/guilds",        tags=["guilds"])
    app.include_router(notifications_router,prefix="/v1/notifications", tags=["notifications"])

    return app


app = create_app()
