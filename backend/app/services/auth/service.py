import httpx
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException

from app.config import settings
from app.database import AsyncSession
from app.services.contributor.models import Contributor
from sqlalchemy import select


GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL  = "https://api.github.com/user"


async def exchange_github_code(code: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id":     settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code":          code,
            },
        )
    data = res.json()
    if "access_token" not in data:
        raise HTTPException(status_code=400, detail="GitHub OAuth failed")
    return data


async def get_github_user(access_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            GITHUB_USER_URL,
            headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
        )
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch GitHub user")
    return res.json()


async def get_or_create_contributor(db: AsyncSession, github_user: dict) -> Contributor:
    stmt = select(Contributor).where(Contributor.github_id == github_user["id"])
    result = await db.execute(stmt)
    contributor = result.scalar_one_or_none()

    if contributor is None:
        contributor = Contributor(
            github_id=github_user["id"],
            username=github_user.get("login", ""),
            display_name=github_user.get("name") or github_user.get("login", ""),
            email=github_user.get("email"),
            avatar_url=github_user.get("avatar_url", ""),
            github_url=github_user.get("html_url", ""),
        )
        db.add(contributor)
        await db.flush()

    return contributor


def create_jwt(contributor_id: str) -> str:
    payload = {
        "sub": str(contributor_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.jwt_expiry_days),
        "iat": datetime.now(timezone.utc),
    }
    return pyjwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_jwt(token: str) -> dict:
    try:
        return pyjwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
