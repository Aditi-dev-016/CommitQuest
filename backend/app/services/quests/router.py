from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


@router.get("", response_model=dict)
async def list_quests(
    type:     str | None = Query(None),
    status:   str | None = Query(None),
    page:     int        = Query(1, ge=1),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": [], "meta": {"page": page, "per_page": 20, "total": 0, "total_pages": 0}}


@router.get("/{quest_id}", response_model=dict)
async def get_quest(
    quest_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Quest not found")


@router.post("/{quest_id}/start", response_model=dict)
async def start_quest(
    quest_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # TODO: Create quest_progress record, check prerequisites
    raise HTTPException(status_code=404, detail="Quest not found")


@router.post("/{quest_id}/submit", response_model=dict)
async def submit_quest(
    quest_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Quest not found")
