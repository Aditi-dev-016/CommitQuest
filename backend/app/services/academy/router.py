from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()


class CompleteLessonRequest(BaseModel):
    quiz_answers: Optional[List[int]] = None


@router.get("/paths", response_model=dict)
async def list_paths(
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": []}


@router.get("/paths/{path_id}", response_model=dict)
async def get_path(
    path_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    raise HTTPException(status_code=404, detail="Path not found")


@router.get("/paths/{path_id}/lessons", response_model=dict)
async def list_lessons(
    path_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {"data": []}


@router.post("/lessons/{lesson_id}/complete", response_model=dict)
async def complete_lesson(
    lesson_id: str,
    body: CompleteLessonRequest,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # TODO: Mark lesson complete, award XP, check path completion
    raise HTTPException(status_code=404, detail="Lesson not found")
