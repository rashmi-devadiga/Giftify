import firebase_admin
from firebase_admin import credentials, firestore, storage
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

SERVICE_ACCOUNT_FILE = BASE_DIR / "serviceAccountKey.json"

if not firebase_admin._apps:

    cred = credentials.Certificate(
        str(SERVICE_ACCOUNT_FILE)
    )

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": "todolist25-8f563.firebasestorage.app"
        }
    )

db = firestore.client()

bucket = storage.bucket()