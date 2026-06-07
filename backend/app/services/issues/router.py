from fastapi import APIRouter, Depends, Query, HTTPException
from app.services.auth.dependencies import get_current_contributor
from app.core.firebase import get_firestore_client
from app.integrations.ai.gemini_client import explain_issue as ai_explain

router = APIRouter()


@router.get("", response_model=dict)
async def list_issues(
    difficulty: str | None = Query(None),
    language:   str | None = Query(None),
    label:      str | None = Query(None),
    repo:       str | None = Query(None),
    page:       int        = Query(1, ge=1),
    per_page:   int        = Query(20, ge=1, le=100),
    contributor: dict = Depends(get_current_contributor),
):
    db = get_firestore_client()
    ref = db.collection("issues")
    
    # Stream and filter issues in memory to avoid needing complex composite Firestore indexes
    docs = ref.stream()
    issues = []
    for d in docs:
        data = d.to_dict()
        if data.get("state") != "open":
            continue
        if difficulty and difficulty != "unknown" and data.get("difficulty") != difficulty:
            continue
        if label == "good_first_issue" and not data.get("is_good_first_issue"):
            continue
        if label == "help_wanted" and not data.get("is_help_wanted"):
            continue
        if repo and data.get("repository_id") != repo.lower():
            continue
        issues.append(data)
        
    start = (page - 1) * per_page
    end = start + per_page
    paginated = issues[start:end]

    return {
        "data": paginated,
        "meta": {"page": page, "per_page": per_page, "total": len(issues), "total_pages": (len(issues) // per_page) + 1},
    }


@router.get("/{issue_id}", response_model=dict)
async def get_issue(
    issue_id: str,
    contributor: dict = Depends(get_current_contributor),
):
    db = get_firestore_client()
    doc_snap = db.collection("issues").document(issue_id).get()
    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"data": doc_snap.to_dict()}


@router.get("/{issue_id}/explain", response_model=dict)
async def explain_issue(
    issue_id: str,
    contributor: dict = Depends(get_current_contributor),
):
    db = get_firestore_client()
    
    # Check if explanation already exists
    explain_snap = db.collection("issue_explanations").document(issue_id).get()
    if explain_snap.exists:
        return {"data": explain_snap.to_dict()}

    # Fetch issue details
    doc_snap = db.collection("issues").document(issue_id).get()
    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue = doc_snap.to_dict()

    # Generate explanation with AI
    ai_data = await ai_explain(
        issue_title=issue["title"],
        issue_body=issue.get("body", ""),
        repo_name=issue["repository_id"],
    )

    explanation = {
        "issue_id": issue_id,
        "plain_english": ai_data.get("plain_english", ""),
        "files_involved": ai_data.get("files_involved", []),
        "skills_needed": ai_data.get("skills_needed", []),
        "suggested_steps": ai_data.get("suggested_steps", ""),
    }
    
    db.collection("issue_explanations").document(issue_id).set(explanation)
    
    return {"data": explanation}
