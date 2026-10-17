
import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Use Render Secret File online, and the local JSON file on your computer.
RENDER_SECRET_FILE = Path("/etc/secrets/serviceAccountKey.json")
LOCAL_SECRET_FILE = BASE_DIR / "serviceAccountKey.json"

if RENDER_SECRET_FILE.exists():
    SERVICE_ACCOUNT_FILE = RENDER_SECRET_FILE
else:
    SERVICE_ACCOUNT_FILE = LOCAL_SECRET_FILE

if not SERVICE_ACCOUNT_FILE.exists():
    raise FileNotFoundError(
        f"Firebase service account file not found: {SERVICE_ACCOUNT_FILE}"
    )

if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_FILE))

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": "todolist25-8f563.firebasestorage.app"
        }
    )

db = firestore.client()
bucket = storage.bucket()
