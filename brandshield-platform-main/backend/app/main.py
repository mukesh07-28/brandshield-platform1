from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.companies import router as companies_router
from app.api.social_accounts import router as social_accounts_router
from app.api.official_apps import router as official_apps_router
from app.api.threats import router as threats_router
from app.api.evidence import router as evidence_router

from app.core.database import Base, engine

from app.models.company import Company
from app.models.social_account import OfficialSocialAccount
from app.models.official_app import OfficialApp
from app.models.threat import Threat
from app.models.evidence import ThreatEvidence


app = FastAPI(
    title="BrandShield AI",
    description="Digital Risk Protection Platform",
    version="1.0.0"
)


# Allow the Vite development server and configured production frontend to call the API.
configured_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
)

frontend_origins = [
    origin.strip()
    for origin in configured_origins.split(",")
    if origin.strip()
]

# Vercel provides VERCEL_URL for preview/production deployments.
for vercel_host_var in ("VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"):
    vercel_host = os.getenv(vercel_host_var)
    if vercel_host:
        vercel_origin = (
            vercel_host
            if vercel_host.startswith(("http://", "https://"))
            else f"https://{vercel_host}"
        )
        if vercel_origin not in frontend_origins:
            frontend_origins.append(vercel_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# REGISTER API ROUTES
# ============================================================

app.include_router(companies_router)
app.include_router(social_accounts_router)
app.include_router(official_apps_router)
app.include_router(threats_router)
app.include_router(evidence_router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "BrandShield AI Backend is Running!"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }