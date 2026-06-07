from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.redis_client import get_redis
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor
from app.services.issues.models import Issue, IssueAnalysis
from app.services.issues.schemas import IssueOut, IssueExplanationOut

import json

router = APIRouter()

EXPLAIN_CACHE_TTL = 60 * 60  # 1 hour


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
    stmt = select(Issue).where(Issue.state == "open")

    if difficulty and difficulty != "unknown":
        stmt = stmt.where(Issue.difficulty == difficulty)
    if label == "good_first_issue":
        stmt = stmt.where(Issue.is_good_first_issue.is_(True))
    elif label == "help_wanted":
        stmt = stmt.where(Issue.is_help_wanted.is_(True))

    stmt = stmt.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(stmt)
    issues = result.scalars().all()

    return {
        "data": [IssueOut.model_validate(i) for i in issues],
        "meta": {"page": page, "per_page": per_page, "total": len(issues), "total_pages": 1},
    }


@router.get("/{issue_id}", response_model=dict)
async def get_issue(
    issue_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Issue).where(Issue.id == issue_id)
    result = await db.execute(stmt)
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"data": IssueOut.model_validate(issue)}


@router.get("/{issue_id}/explain", response_model=dict)
async def explain_issue(
    issue_id: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # Check cache first
    redis = get_redis()
    cache_key = f"issue_explain:{issue_id}"
    cached = await redis.get(cache_key)
    if cached:
        return {"data": json.loads(cached)}

    # Load issue from DB
    stmt = select(Issue).where(Issue.id == issue_id)
    result = await db.execute(stmt)
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # Check if we have an existing analysis
    stmt2 = select(IssueAnalysis).where(IssueAnalysis.issue_id == issue.id)
    result2 = await db.execute(stmt2)
    existing = result2.scalar_one_or_none()

    if existing:
        out = IssueExplanationOut.model_validate(existing)
        await redis.setex(cache_key, EXPLAIN_CACHE_TTL, out.model_dump_json())
        return {"data": out}

    # Generate with AI
    from app.integrations.ai.gemini_client import explain_issue as ai_explain
    ai_data = await ai_explain(
        issue_title=issue.title,
        issue_body=issue.body or "",
        repo_name=str(issue.repository_id),
    )

    analysis = IssueAnalysis(
        issue_id=issue.id,
        plain_english=ai_data.get("plain_english", ""),
        files_involved=ai_data.get("files_involved", []),
        skills_needed=ai_data.get("skills_needed", []),
        suggested_steps=ai_data.get("suggested_steps", ""),
    )
    db.add(analysis)
    await db.flush()

    out = IssueExplanationOut.model_validate(analysis)
    await redis.setex(cache_key, EXPLAIN_CACHE_TTL, out.model_dump_json())
    return {"data": out}
