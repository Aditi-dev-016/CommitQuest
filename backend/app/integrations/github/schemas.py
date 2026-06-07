from pydantic import BaseModel
from typing import Optional


class GitHubRepo(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str]
    html_url: str
    stargazers_count: int
    forks_count: int
    open_issues_count: int
    language: Optional[str]
    pushed_at: Optional[str]
    archived: bool = False


class GitHubIssue(BaseModel):
    number: int
    title: str
    body: Optional[str]
    html_url: str
    state: str
    labels: list[dict]
    user: dict
    created_at: str
    updated_at: str
