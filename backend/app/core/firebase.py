import os
import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from typing import Dict, Any

# Initialize firebase admin
try:
    firebase_admin.get_app()
except ValueError:
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        try:
            firebase_admin.initialize_app()
        except Exception:
            # Local testing fallback
            cred = credentials.AnonymousCredentials() if hasattr(credentials, 'AnonymousCredentials') else None
            firebase_admin.initialize_app(cred)

# Firestore Client Singleton
_firestore_db = None

def get_firestore_db() -> firestore.firestore.Client:
    global _firestore_db
    if _firestore_db is None:
        _firestore_db = firestore.client()
    return _firestore_db

get_firestore_client = get_firestore_db

def verify_firebase_token(token: str) -> Dict[str, Any]:
    """Verify incoming Firebase ID token using firebase-admin SDK."""
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Firebase token verification failed: {str(e)}")
