from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


@router.get("", response_model=dict)
async def list_issues(
    difficulty: str | None = Query(None),
    language:   str | None = Query(None),
    label:      str | None = Query(None),
    repo:       str | None = Query(None),
    page:       int        = Query(1, ge=1),
    per_page:   int        = Query(20, ge=1, le=100),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # TODO: Query issues table with filters
    return {"data": [], "meta": {"page": page, "per_page": per_page, "total": 0, "total_pages": 0}}


@router.get("/{issue_id}", response_model=dict)
async def get_issue(
    issue_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Issue not found")


@router.get("/{issue_id}/explain", response_model=dict)
async def explain_issue(
    issue_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # TODO: Check cache, call Gemini API if miss
    raise HTTPException(status_code=404, detail="Issue not found")
