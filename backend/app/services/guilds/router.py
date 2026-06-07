from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


class PostMessageRequest(BaseModel):
    body: str


@router.get("", response_model=dict)
async def list_guilds(
    q:    str | None = Query(None),
    tag:  str | None = Query(None),
    sort: str        = Query("trending"),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": []}


@router.get("/{guild_id}", response_model=dict)
async def get_guild(
    guild_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Guild not found")


@router.post("/{guild_id}/join", response_model=dict)
async def join_guild(
    guild_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Guild not found")


@router.get("/{guild_id}/messages", response_model=dict)
async def list_messages(
    guild_id: str,
    page: int = Query(1, ge=1),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": [], "meta": {"page": page, "per_page": 50, "total": 0, "total_pages": 0}}


@router.post("/{guild_id}/messages", response_model=dict, status_code=201)
async def post_message(
    guild_id: str,
    body: PostMessageRequest,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Guild not found")
