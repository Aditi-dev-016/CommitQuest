from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor
from app.services.quests.models import Quest, QuestProgress
from app.services.quests.schemas import QuestOut, QuestProgressOut
from app.services.gamification.service import award_xp, update_streak

router = APIRouter()


class SubmitQuestBody(BaseModel):
    pr_url: Optional[str] = None


@router.get("", response_model=dict)
async def list_quests(
    type:     str | None = Query(None),
    status:   str | None = Query(None),
    page:     int        = Query(1, ge=1),
    per_page: int        = Query(20, ge=1, le=100),
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Quest)
    if type:
        stmt = stmt.where(Quest.type == type)

    # Filter out expired daily quests
    now = datetime.now(timezone.utc)
    stmt = stmt.where(
        (Quest.active_until == None) | (Quest.active_until >= now)
    )
    stmt = stmt.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(stmt)
    quests = result.scalars().all()

    # Attach progress for this contributor
    if quests:
        ids = [q.id for q in quests]
        prog_stmt = select(QuestProgress).where(
            QuestProgress.contributor_id == contributor.id,
            QuestProgress.quest_id.in_(ids),
        )
        prog_result = await db.execute(prog_stmt)
        progress_map = {p.quest_id: p for p in prog_result.scalars().all()}
    else:
        progress_map = {}

    out = []
    for q in quests:
        q_dict = QuestOut.model_validate(q).model_dump()
        prog = progress_map.get(q.id)
        q_dict["progress"] = QuestProgressOut.model_validate(prog).model_dump() if prog else None
        out.append(q_dict)

    return {"data": out, "meta": {"page": page, "per_page": per_page, "total": len(out), "total_pages": 1}}


@router.get("/{quest_id}", response_model=dict)
async def get_quest(
    quest_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Quest).where(Quest.id == quest_id)
    result = await db.execute(stmt)
    quest = result.scalar_one_or_none()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    return {"data": QuestOut.model_validate(quest)}


@router.post("/{quest_id}/start", response_model=dict)
async def start_quest(
    quest_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # Check quest exists
    stmt = select(Quest).where(Quest.id == quest_id)
    result = await db.execute(stmt)
    quest = result.scalar_one_or_none()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    # Check prerequisite
    if quest.prerequisite_id:
        pre_stmt = select(QuestProgress).where(
            QuestProgress.contributor_id == contributor.id,
            QuestProgress.quest_id == quest.prerequisite_id,
            QuestProgress.status == "complete",
        )
        pre_result = await db.execute(pre_stmt)
        if not pre_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Prerequisite quest not completed")

    # Upsert progress record
    prog_stmt = select(QuestProgress).where(
        QuestProgress.contributor_id == contributor.id,
        QuestProgress.quest_id == quest.id,
    )
    prog_result = await db.execute(prog_stmt)
    progress = prog_result.scalar_one_or_none()

    if progress and progress.status in ("active", "complete"):
        return {"data": QuestProgressOut.model_validate(progress)}

    if not progress:
        progress = QuestProgress(
            contributor_id=contributor.id,
            quest_id=quest.id,
            status="active",
        )
        db.add(progress)
    else:
        progress.status = "active"

    await db.flush()
    return {"data": QuestProgressOut.model_validate(progress)}


@router.post("/{quest_id}/submit", response_model=dict)
async def submit_quest(
    quest_id: str,
    body: SubmitQuestBody,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Quest).where(Quest.id == quest_id)
    result = await db.execute(stmt)
    quest = result.scalar_one_or_none()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    prog_stmt = select(QuestProgress).where(
        QuestProgress.contributor_id == contributor.id,
        QuestProgress.quest_id == quest.id,
    )
    prog_result = await db.execute(prog_stmt)
    progress = prog_result.scalar_one_or_none()

    if not progress or progress.status not in ("active", "submitted"):
        raise HTTPException(status_code=400, detail="Quest not active")

    # If PR URL provided, mark as submitted; otherwise complete directly
    if body.pr_url:
        progress.status = "submitted"
        progress.pr_url = body.pr_url
        xp = 150  # PR submitted XP
    else:
        progress.status = "complete"
        progress.completed_at = datetime.now(timezone.utc)
        xp = quest.xp_reward

    progress.xp_awarded = xp
    await award_xp(db, contributor, xp, "quest_submit", {"quest_id": str(quest.id)})
    await update_streak(db, contributor)

    await db.flush()
    return {
        "data": QuestProgressOut.model_validate(progress),
        "xp_awarded": xp,
        "achievements_unlocked": [],
    }
