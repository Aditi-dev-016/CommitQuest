from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


@router.get("/leaderboard", response_model=dict)
async def leaderboard(
    scope:    str = Query("global"),
    guild_id: str | None = Query(None),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": []}


@router.get("/xp-log", response_model=dict)
async def xp_log(
    page: int = Query(1, ge=1),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": [], "meta": {"page": page, "per_page": 20, "total": 0, "total_pages": 0}}
