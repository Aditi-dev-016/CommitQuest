from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor

router = APIRouter()

GITHUB_REPO_RE = r"^https?://github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)/?$"


class AnalyzeRequest(BaseModel):
    url: str


@router.post("/analyze", response_model=dict)
async def submit_analysis(
    body: AnalyzeRequest,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    import re
    match = re.match(GITHUB_REPO_RE, body.url)
    if not match:
        raise HTTPException(status_code=422, detail="Invalid GitHub repository URL")

    # TODO: Check Redis cache, enqueue Celery task if miss
    job_id = "mock-job-id"
    return {"data": {"job_id": job_id, "cached": False}}


@router.get("/analyze/{job_id}", response_model=dict)
async def poll_analysis(
    job_id: str,
    contributor: Contributor = Depends(get_current_contributor),
):
    # TODO: Poll Celery task status
    return {"data": {"status": "pending", "result": None}}


@router.get("/analyze/report/{owner}/{repo}", response_model=dict)
async def get_report(
    owner: str,
    repo: str,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    # TODO: Serve from Redis / DB cache
    raise HTTPException(status_code=404, detail="Report not found")


@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    from app.services.contributor.schemas import ContributorOut
    return {
        "data": {
            "contributor":       ContributorOut.model_validate(contributor),
            "active_quests":     [],
            "recommended_repos": [],
            "recent_achievements": [],
            "world_map":         [],
        }
    }
