# Vercel serverless entrypoint for the BrandShield FastAPI backend.
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402

# Vercel's Python runtime detects the FastAPI/ASGI application above.
