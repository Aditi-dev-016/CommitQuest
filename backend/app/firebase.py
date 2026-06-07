import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize firebase admin
try:
    firebase_admin.get_app()
except ValueError:
    # Try loading from service account path if provided in environment
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to application default credentials (ADC) or mock-friendly default initialization
        try:
            firebase_admin.initialize_app()
        except Exception:
            # Safe local testing fallback
            cred = credentials.AnonymousCredentials() if hasattr(credentials, 'AnonymousCredentials') else None
            firebase_admin.initialize_app(cred)

def get_firestore_client():
    return firestore.client()
