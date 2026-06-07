"""GitHub webhook HMAC-SHA256 signature verification."""
import hashlib
import hmac
from fastapi import HTTPException, Request
from app.config import settings


async def verify_github_signature(request: Request) -> bytes:
    """Verify the X-Hub-Signature-256 header and return the raw body."""
    signature_header = request.headers.get("X-Hub-Signature-256", "")
    body = await request.body()

    if not signature_header.startswith("sha256="):
        raise HTTPException(status_code=400, detail="Missing signature")

    expected = "sha256=" + hmac.new(
        settings.jwt_secret.encode(),   # Use a dedicated webhook secret in prod
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(signature_header, expected):
        raise HTTPException(status_code=401, detail="Invalid signature")

    return body
