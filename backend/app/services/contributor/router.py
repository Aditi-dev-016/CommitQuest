from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.dependencies import get_current_contributor
from app.services.contributor.models import Contributor
from app.services.contributor.schemas import ContributorOut, ContributorUpdate

router = APIRouter()


@router.get("/me", response_model=dict)
async def get_me(contributor: Contributor = Depends(get_current_contributor)):
    return {"data": ContributorOut.model_validate(contributor)}


@router.patch("/me", response_model=dict)
async def update_me(
    body: ContributorUpdate,
    contributor: Contributor = Depends(get_current_contributor),
    db: AsyncSession = Depends(get_db),
):
    if body.display_name is not None:
        contributor.display_name = body.display_name
    if body.bio is not None:
        contributor.bio = body.bio
    await db.flush()
    return {"data": ContributorOut.model_validate(contributor)}


@router.get("/{username}", response_model=dict)
async def get_by_username(username: str, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    from fastapi import HTTPException
    stmt = select(Contributor).where(Contributor.username == username)
    result = await db.execute(stmt)
    contributor = result.scalar_one_or_none()
    if not contributor:
        raise HTTPException(status_code=404, detail="Contributor not found")
    return {"data": ContributorOut.model_validate(contributor)}
