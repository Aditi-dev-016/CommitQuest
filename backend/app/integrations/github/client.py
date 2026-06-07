"""Async GitHub API client using httpx."""
import httpx
from typing import Any

GITHUB_API = "https://api.github.com"


class GitHubClient:
    def __init__(self, token: str | None = None):
        headers: dict[str, str] = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self._client = httpx.AsyncClient(base_url=GITHUB_API, headers=headers, timeout=30.0)

    async def get_repo(self, owner: str, repo: str) -> dict[str, Any]:
        res = await self._client.get(f"/repos/{owner}/{repo}")
        res.raise_for_status()
        return res.json()

    async def get_issues(self, owner: str, repo: str, labels: str = "", per_page: int = 100) -> list[dict]:
        params: dict[str, Any] = {"state": "open", "per_page": per_page}
        if labels:
            params["labels"] = labels
        res = await self._client.get(f"/repos/{owner}/{repo}/issues", params=params)
        res.raise_for_status()
        return res.json()

    async def get_languages(self, owner: str, repo: str) -> dict[str, int]:
        res = await self._client.get(f"/repos/{owner}/{repo}/languages")
        res.raise_for_status()
        return res.json()

    async def get_contents(self, owner: str, repo: str, path: str = "") -> Any:
        res = await self._client.get(f"/repos/{owner}/{repo}/contents/{path}")
        res.raise_for_status()
        return res.json()

    async def aclose(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.aclose()
