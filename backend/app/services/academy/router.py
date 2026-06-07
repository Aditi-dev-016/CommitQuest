from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor
from app.services.academy.models import LearningPath, Lesson, LessonProgress
from app.services.academy.schemas import LearningPathOut, LessonOut
from app.services.gamification.service import award_xp, update_streak

router = APIRouter()


class CompleteLessonRequest(BaseModel):
    quiz_answers: Optional[List[int]] = None


@router.get("/paths", response_model=dict)
async def list_paths(
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(LearningPath).order_by(LearningPath.order_index)
    result = await db.execute(stmt)
    paths = result.scalars().all()
    return {"data": [LearningPathOut.model_validate(p) for p in paths]}


@router.get("/paths/{path_id}", response_model=dict)
async def get_path(
    path_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(LearningPath).where(LearningPath.id == path_id)
    result = await db.execute(stmt)
    path = result.scalar_one_or_none()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    return {"data": LearningPathOut.model_validate(path)}


@router.get("/paths/{path_id}/lessons", response_model=dict)
async def list_lessons(
    path_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Lesson).where(Lesson.path_id == path_id).order_by(Lesson.order_index)
    result = await db.execute(stmt)
    lessons = result.scalars().all()

    # Attach completion status
    if lessons:
        ids = [l.id for l in lessons]
        prog_stmt = select(LessonProgress).where(
            LessonProgress.contributor_id == contributor.id,
            LessonProgress.lesson_id.in_(ids),
        )
        prog_result = await db.execute(prog_stmt)
        prog_map = {p.lesson_id: p for p in prog_result.scalars().all()}
    else:
        prog_map = {}

    out = []
    for lesson in lessons:
        d = LessonOut.model_validate(lesson).model_dump()
        prog = prog_map.get(lesson.id)
        d["completed_at"] = prog.completed_at.isoformat() if prog and prog.completed_at else None
        out.append(d)

    return {"data": out}


@router.post("/lessons/{lesson_id}/complete", response_model=dict)
async def complete_lesson(
    lesson_id: str,
    body: CompleteLessonRequest,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Lesson).where(Lesson.id == lesson_id)
    result = await db.execute(stmt)
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Check if already completed
    prog_stmt = select(LessonProgress).where(
        LessonProgress.contributor_id == contributor.id,
        LessonProgress.lesson_id == lesson.id,
    )
    prog_result = await db.execute(prog_stmt)
    progress = prog_result.scalar_one_or_none()

    if progress and progress.completed_at:
        return {"data": {"xp_awarded": 0, "already_completed": True}}

    # Quiz validation
    quiz_score = None
    if lesson.type == "quiz" and body.quiz_answers and lesson.quiz_data:
        questions = lesson.quiz_data.get("questions", [])
        correct = sum(
            1 for i, q in enumerate(questions)
            if i < len(body.quiz_answers) and body.quiz_answers[i] == q.get("correct_index")
        )
        quiz_score = round(correct / max(len(questions), 1) * 100)

    now = datetime.now(timezone.utc)
    if progress:
        progress.completed_at = now
        progress.quiz_score   = quiz_score
        progress.xp_awarded   = lesson.xp_reward
    else:
        progress = LessonProgress(
            contributor_id=contributor.id,
            lesson_id=lesson.id,
            completed_at=now,
            quiz_score=quiz_score,
            xp_awarded=lesson.xp_reward,
        )
        db.add(progress)

    await award_xp(db, contributor, lesson.xp_reward, "lesson_complete", {"lesson_id": str(lesson.id)})
    await update_streak(db, contributor)
    await db.flush()

    return {"data": {"xp_awarded": lesson.xp_reward, "quiz_score": quiz_score}}
