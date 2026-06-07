from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


@router.get("", response_model=dict)
async def list_notifications(
    page: int = Query(1, ge=1),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": [], "meta": {"page": page, "per_page": 20, "total": 0, "total_pages": 0}}


@router.post("/{notification_id}/read", response_model=dict)
async def mark_read(
    notification_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": {"success": True}}
