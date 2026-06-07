"""Orchestrates GitHub API + AI analysis for a repository."""
import re
import json
from datetime import datetime, timedelta, timezone

from app.integrations.github.client import GitHubClient
from app.integrations.ai.gemini_client import analyze_repository

GITHUB_URL_RE = re.compile(r"^https?://github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)/?$")
CACHE_TTL_SECONDS = 24 * 60 * 60  # 24 hours


def parse_github_url(url: str) -> tuple[str, str] | None:
    m = GITHUB_URL_RE.match(url)
    if not m:
        return None
    return m.group(1), m.group(2)


async def run_analysis(owner: str, repo: str) -> dict:
    """Run full repo analysis. Returns structured result dict."""
    async with GitHubClient() as gh:
        repo_data = await gh.get_repo(owner, repo)
        issues    = await gh.get_issues(owner, repo, per_page=50)
        langs     = await gh.get_languages(owner, repo)

    tech_stack = list(langs.keys())[:8]

    # Count good-first-issue / help-wanted
    gfi_count = sum(
        1 for i in issues
        if any(l["name"].lower() in ("good first issue", "good-first-issue") for l in i.get("labels", []))
    )
    hw_count = sum(
        1 for i in issues
        if any(l["name"].lower() in ("help wanted", "help-wanted") for l in i.get("labels", []))
    )

    ai_result = await analyze_repository(repo_data, issues)

    return {
        "repository": {
            "github_id":       repo_data["id"],
            "owner":           owner,
            "name":            repo,
            "full_name":       repo_data["full_name"],
            "description":     repo_data.get("description"),
            "html_url":        repo_data["html_url"],
            "primary_language":repo_data.get("language"),
            "star_count":      repo_data["stargazers_count"],
            "fork_count":      repo_data["forks_count"],
            "open_issue_count":repo_data["open_issues_count"],
            "is_archived":     repo_data.get("archived", False),
        },
        "beginner_score":         _composite_score(ai_result),
        "documentation_score":    ai_result.get("documentation_score", 50),
        "complexity_score":       ai_result.get("complexity_score", 50),
        "setup_difficulty_score": ai_result.get("setup_difficulty_score", 50),
        "community_score":        ai_result.get("community_score", 50),
        "summary_text":           ai_result.get("summary_text", ""),
        "tech_stack":             tech_stack,
        "good_first_issue_count": gfi_count,
        "help_wanted_count":      hw_count,
        "expires_at":             (datetime.now(timezone.utc) + timedelta(seconds=CACHE_TTL_SECONDS)).isoformat(),
    }


def _composite_score(ai: dict) -> int:
    """Weighted composite from sub-scores."""
    doc   = ai.get("documentation_score", 50)
    cmplx = 100 - ai.get("complexity_score", 50)        # lower complexity = friendlier
    setup = 100 - ai.get("setup_difficulty_score", 50)  # lower setup difficulty = friendlier
    comm  = ai.get("community_score", 50)
    return round(doc * 0.3 + cmplx * 0.25 + setup * 0.2 + comm * 0.25)
