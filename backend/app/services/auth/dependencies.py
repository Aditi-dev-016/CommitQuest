from fastapi import Cookie, Header, HTTPException
from firebase_admin import auth as firebase_auth

async def get_current_contributor(
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
        decoded_token = firebase_auth.verify_id_token(token)
        return {
            "id": decoded_token.get("uid"),
            "username": decoded_token.get("name") or decoded_token.get("email", "contributor"),
            "email": decoded_token.get("email"),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid session token: {str(e)}")
