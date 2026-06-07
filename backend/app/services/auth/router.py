from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth.schemas import GithubCallbackRequest, AuthResponse
from app.services.auth.service import exchange_github_code, get_github_user, get_or_create_contributor, create_jwt
from app.services.contributor.schemas import ContributorOut

router = APIRouter()


@router.post("/github/callback", response_model=dict)
async def github_callback(
    body: GithubCallbackRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    token_data   = await exchange_github_code(body.code)
    github_user  = await get_github_user(token_data["access_token"])
    contributor  = await get_or_create_contributor(db, github_user)
    jwt          = create_jwt(str(contributor.id))

    response.set_cookie(
        key="session_token",
        value=jwt,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=30 * 24 * 60 * 60,
        path="/",
    )

    return {"data": {"token": jwt, "contributor": ContributorOut.model_validate(contributor)}}


@router.post("/logout", status_code=204)
async def logout(response: Response):
    response.delete_cookie("session_token")
