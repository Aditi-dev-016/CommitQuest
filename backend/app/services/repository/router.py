import re
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel

from app.services.auth.dependencies import get_current_contributor
from app.services.repository.analyzer import parse_github_url, run_analysis
from app.core.firebase import get_firestore_client

router = APIRouter()

GITHUB_REPO_RE = re.compile(r"^https?://github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)/?$")


class AnalyzeRequest(BaseModel):
    url: str


@router.post("/analyze", response_model=dict)
async def submit_analysis(
    body: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    contributor: dict = Depends(get_current_contributor),
):
    parsed = parse_github_url(body.url)
    if not parsed:
        raise HTTPException(status_code=422, detail="Invalid GitHub repository URL. Expected: https://github.com/owner/repo")

    owner, repo = parsed
    db = get_firestore_client()
    doc_id = f"{owner}__{repo}".lower()
    doc_ref = db.collection("repository_analyses").document(doc_id)
    doc_snap = doc_ref.get()

    if doc_snap.exists:
        return {"data": {"job_id": None, "cached": True}}

    job_id = f"{owner}__{repo}"
    background_tasks.add_task(_run_and_save_to_firestore, owner, repo, doc_id)

    return {"data": {"job_id": job_id, "cached": False}}


@router.get("/analyze/{owner}__{repo}", response_model=dict)
async def poll_analysis(
    owner: str,
    repo: str,
    contributor: dict = Depends(get_current_contributor),
):
    db = get_firestore_client()
    doc_id = f"{owner}__{repo}".lower()
    doc_snap = db.collection("repository_analyses").document(doc_id).get()

    if doc_snap.exists:
        return {"data": {"status": "complete", "result": doc_snap.to_dict()}}

    return {"data": {"status": "processing", "result": None}}


@router.get("/analyze/report/{owner}/{repo}", response_model=dict)
async def get_report(
    owner: str,
    repo: str,
    contributor: dict = Depends(get_current_contributor),
):
    db = get_firestore_client()
    doc_id = f"{owner}__{repo}".lower()
    doc_snap = db.collection("repository_analyses").document(doc_id).get()

    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Report not found. Submit for analysis first.")

    return {"data": doc_snap.to_dict()}


@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    contributor: dict = Depends(get_current_contributor),
):
    # Fallback endpoint
    return {
        "data": {
            "contributor": {
                "id": contributor["id"],
                "username": contributor["username"],
                "display_name": contributor["username"],
                "avatar_url": "",
                "experience_level": "beginner",
                "total_xp": 0,
                "current_level": 1,
                "streak_count": 0,
                "created_at": "",
            },
            "active_quests": [],
            "recommended_repos": [],
            "recent_achievements": [],
            "world_map": [],
        }
    }


from app.integrations.github.client import GitHubClient

async def _run_and_save_to_firestore(owner: str, repo: str, doc_id: str):
    """Background task: run analysis and save directly to Cloud Firestore."""
    try:
        result = await run_analysis(owner, repo)
        db = get_firestore_client()
        db.collection("repository_analyses").document(doc_id).set(result)

        # Save issues to Firestore issues collection
        async with GitHubClient() as gh:
            issues = await gh.get_issues(owner, repo, per_page=50)
            for i in issues:
                issue_id = str(i["id"])
                labels = [lbl["name"] for lbl in i.get("labels", [])]
                db.collection("issues").document(issue_id).set({
                    "id": issue_id,
                    "repository_id": f"{owner}/{repo}".lower(),
                    "github_number": i["number"],
                    "title": i["title"],
                    "body": i.get("body", ""),
                    "html_url": i["html_url"],
                    "state": i["state"],
                    "labels": labels,
                    "difficulty": "easy" if any("easy" in l.lower() or "good" in l.lower() for l in labels) else "medium",
                    "is_good_first_issue": any(l.lower() in ("good first issue", "good-first-issue") for l in labels),
                    "is_help_wanted": any(l.lower() in ("help wanted", "help-wanted") for l in labels),
                    "author": i["user"]["login"] if i.get("user") else "anonymous",
                    "created_at": i.get("created_at", ""),
                })
    except Exception:
        pass
