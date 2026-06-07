"""XP calculation, leveling, and streak management."""
from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.contributor.models import Contributor

XP_PER_LEVEL = 5000  # flat curve for MVP


def xp_to_level(total_xp: int) -> int:
    """Calculate level from total XP."""
    return max(1, total_xp // XP_PER_LEVEL + 1)


async def award_xp(
    db: AsyncSession,
    contributor: Contributor,
    amount: int,
    event_type: str,
    metadata: dict | None = None,
) -> int:
    """Award XP to a contributor. Returns new total_xp."""
    contributor.total_xp    += amount
    contributor.current_level = xp_to_level(contributor.total_xp)

    # Log to contribution history
    from app.services.gamification.models import ContributionHistory
    log = ContributionHistory(
        contributor_id=contributor.id,
        event_type=event_type,
        xp_earned=amount,
        metadata=metadata or {},
    )
    db.add(log)
    await db.flush()

    return contributor.total_xp


async def update_streak(db: AsyncSession, contributor: Contributor) -> int:
    """
    Update streak based on last_active_date.
    - Same day: no change
    - Consecutive day: +1
    - Gap > 1 day: reset to 1
    Returns updated streak_count.
    """
    today = date.today()
    last  = contributor.last_active_date

    if last is None or last < today - timedelta(days=1):
        # First activity or streak broken
        contributor.streak_count = 1
    elif last == today - timedelta(days=1):
        contributor.streak_count += 1
    # else: same day, no change

    contributor.last_active_date = today
    await db.flush()
    return contributor.streak_count
