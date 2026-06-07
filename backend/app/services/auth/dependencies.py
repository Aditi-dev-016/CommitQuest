from fastapi import Cookie, Header, HTTPException
from app.core.firebase import verify_firebase_token

async def get_current_user(
    session_token: str | None = Cookie(default=None),
    authorization: str | None = Header(default=None),
) -> dict:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    elif session_token:
        token = session_token

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        decoded_token = verify_firebase_token(token)
        return {
            "uid": decoded_token.get("uid"),
            "id": decoded_token.get("uid"), # Compatibility with routers expecting contributor.id
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name", "Contributor"),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid session token: {str(e)}")

# Compatibility with existing routes
get_current_contributor = get_current_user
