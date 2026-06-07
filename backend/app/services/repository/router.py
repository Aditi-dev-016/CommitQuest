import re
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.redis_client import get_redis
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor
from app.services.contributor.schemas import ContributorOut
from app.services.repository.analyzer import parse_github_url, run_analysis, CACHE_TTL_SECONDS

router = APIRouter()

GITHUB_REPO_RE = re.compile(r"^https?://github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)/?$")


class AnalyzeRequest(BaseModel):
    url: str


def _cache_key(owner: str, repo: str) -> str:
    return f"repo_analysis:{owner.lower()}:{repo.lower()}"


@router.post("/analyze", response_model=dict)
async def submit_analysis(
    body: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    parsed = parse_github_url(body.url)
    if not parsed:
        raise HTTPException(status_code=422, detail="Invalid GitHub repository URL. Expected: https://github.com/owner/repo")

    owner, repo = parsed
    redis = get_redis()
    key   = _cache_key(owner, repo)

    cached = await redis.get(key)
    if cached:
        return {"data": {"job_id": None, "cached": True}}

    # Use a simple job_id based on owner/repo for polling
    job_id = f"{owner}__{repo}"
    # Run in background
    background_tasks.add_task(_run_and_cache, owner, repo, key, redis)

    return {"data": {"job_id": job_id, "cached": False}}


@router.get("/analyze/{owner}__{repo}", response_model=dict)
async def poll_analysis(
    owner: str,
    repo: str,
    contributor: Contributor = Depends(get_current_contributor),
):
    redis  = get_redis()
    key    = _cache_key(owner, repo)
    cached = await redis.get(key)

    if cached:
        result = json.loads(cached)
        return {"data": {"status": "complete", "result": result}}

    return {"data": {"status": "processing", "result": None}}


@router.get("/analyze/report/{owner}/{repo}", response_model=dict)
async def get_report(
    owner: str,
    repo: str,
    contributor: Contributor = Depends(get_current_contributor),
):
    redis  = get_redis()
    key    = _cache_key(owner, repo)
    cached = await redis.get(key)

    if not cached:
        raise HTTPException(status_code=404, detail="Report not found. Submit for analysis first.")

    return {"data": json.loads(cached)}


@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    return {
        "data": {
            "contributor":        ContributorOut.model_validate(contributor),
            "active_quests":      [],
            "recommended_repos":  [],
            "recent_achievements":[],
            "world_map":          [],
        }
    }


async def _run_and_cache(owner: str, repo: str, key: str, redis):
    """Background task: run analysis and store in Redis."""
    try:
        result = await run_analysis(owner, repo)
        await redis.setex(key, CACHE_TTL_SECONDS, json.dumps(result))
    except Exception:
        pass  # Analysis failed silently; polling will keep returning 'processing'
