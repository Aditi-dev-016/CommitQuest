from pydantic import BaseModel
from app.services.contributor.schemas import ContributorOut


class GithubCallbackRequest(BaseModel):
    code: str
    state: str


class AuthResponse(BaseModel):
    token: str
    contributor: ContributorOut
