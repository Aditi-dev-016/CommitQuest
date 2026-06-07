"""Achievement unlock evaluation engine."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.contributor.models import Contributor


# Achievement definitions: slug → {condition_type, threshold}
ACHIEVEMENTS = [
    {"slug": "first-commit",    "name": "First Commit",      "tier": "bronze",  "condition": {"type": "xp_total",       "threshold": 1}},
    {"slug": "first-pr",        "name": "First PR",          "tier": "bronze",  "condition": {"type": "pr_submitted",    "threshold": 1}},
    {"slug": "first-merge",     "name": "First Merge",       "tier": "silver",  "condition": {"type": "pr_merged",       "threshold": 1}},
    {"slug": "streak-7",        "name": "7-Day Streak",      "tier": "bronze",  "condition": {"type": "streak",          "threshold": 7}},
    {"slug": "streak-30",       "name": "30-Day Streak",     "tier": "silver",  "condition": {"type": "streak",          "threshold": 30}},
    {"slug": "streak-100",      "name": "Century Streak",    "tier": "gold",    "condition": {"type": "streak",          "threshold": 100}},
    {"slug": "xp-1000",         "name": "XP Milestone 1k",  "tier": "bronze",  "condition": {"type": "xp_total",        "threshold": 1000}},
    {"slug": "xp-5000",         "name": "XP Milestone 5k",  "tier": "silver",  "condition": {"type": "xp_total",        "threshold": 5000}},
    {"slug": "xp-10000",        "name": "XP Milestone 10k", "tier": "gold",    "condition": {"type": "xp_total",        "threshold": 10000}},
    {"slug": "explorer",        "name": "Repo Explorer",     "tier": "bronze",  "condition": {"type": "repos_explored",  "threshold": 5}},
    {"slug": "bug-hunter",      "name": "Bug Hunter",        "tier": "silver",  "condition": {"type": "bugs_fixed",      "threshold": 3}},
    {"slug": "doc-hero",        "name": "Doc Hero",          "tier": "bronze",  "condition": {"type": "docs_contributed","threshold": 2}},
    {"slug": "guild-member",    "name": "Guild Member",      "tier": "bronze",  "condition": {"type": "guilds_joined",   "threshold": 1}},
    {"slug": "mentor",          "name": "Mentor",            "tier": "silver",  "condition": {"type": "helpful_replies", "threshold": 5}},
    {"slug": "prolific",        "name": "Prolific",          "tier": "gold",    "condition": {"type": "pr_merged",       "threshold": 10}},
    {"slug": "level-5",         "name": "Level 5",           "tier": "bronze",  "condition": {"type": "level",          "threshold": 5}},
    {"slug": "level-10",        "name": "Level 10",          "tier": "silver",  "condition": {"type": "level",          "threshold": 10}},
    {"slug": "level-25",        "name": "Level 25",          "tier": "gold",    "condition": {"type": "level",          "threshold": 25}},
    {"slug": "level-50",        "name": "Level 50",          "tier": "legendary","condition": {"type": "level",         "threshold": 50}},
    {"slug": "path-complete",   "name": "Path Complete",     "tier": "silver",  "condition": {"type": "paths_completed","threshold": 1}},
]


async def check_achievements(
    db: AsyncSession,
    contributor: Contributor,
    event_type: str,
    event_data: dict,
) -> list[dict]:
    """
    Evaluate achievement conditions for a contributor after an event.
    Returns list of newly unlocked achievement dicts.
    """
    from app.services.gamification.models import ContributionHistory
    from sqlalchemy import func

    # Build current stats snapshot
    stats = {
        "xp_total":        contributor.total_xp,
        "level":           contributor.current_level,
        "streak":          contributor.streak_count,
        "pr_submitted":    event_data.get("pr_submitted_total", 0),
        "pr_merged":       event_data.get("pr_merged_total", 0),
        "repos_explored":  event_data.get("repos_explored_total", 0),
        "bugs_fixed":      event_data.get("bugs_fixed_total", 0),
        "docs_contributed":event_data.get("docs_contributed_total", 0),
        "guilds_joined":   event_data.get("guilds_joined_total", 0),
        "helpful_replies": event_data.get("helpful_replies_total", 0),
        "paths_completed": event_data.get("paths_completed_total", 0),
    }

    # Get already-unlocked achievement slugs
    # (simplified: would normally query contributor_achievements table)
    unlocked_slugs: set[str] = set(event_data.get("already_unlocked", []))

    newly_unlocked = []
    for ach in ACHIEVEMENTS:
        if ach["slug"] in unlocked_slugs:
            continue
        condition = ach["condition"]
        value = stats.get(condition["type"], 0)
        if value >= condition["threshold"]:
            newly_unlocked.append(ach)

    return newly_unlocked
