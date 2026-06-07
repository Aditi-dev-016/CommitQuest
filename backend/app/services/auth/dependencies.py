from fastapi import Cookie, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.service import decode_jwt
from app.services.contributor.models import Contributor


async def get_current_contributor(
    session_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> Contributor:
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_jwt(session_token)
    contributor_id = payload.get("sub")

    stmt = select(Contributor).where(Contributor.id == contributor_id)
    result = await db.execute(stmt)
    contributor = result.scalar_one_or_none()

    if contributor is None:
        raise HTTPException(status_code=401, detail="Contributor not found")

    return contributor
