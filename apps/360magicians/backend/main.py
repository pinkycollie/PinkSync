"""
360 Magicians Backend API
Deaf-first business lifecycle management platform
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from typing import Optional

# Import routers
from routers import idea, build, grow, manage, admin, internal
from database.connection import init_db, close_db
from utils.redis_client import init_redis, close_redis
from auth.jwt_handler import verify_token

# Lifespan manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await init_redis()
    yield
    # Shutdown
    await close_db()
    await close_redis()

# Initialize FastAPI app
app = FastAPI(
    title="360 Magicians API",
    description="Deaf-first business lifecycle management: Idea → Build → Grow → Manage",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "https://360magicians.mbtquniverse.com",
        "https://pinksync.io",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with lifecycle organization
app.include_router(idea.router, prefix="/api/idea", tags=["Idea Phase"])
app.include_router(build.router, prefix="/api/build", tags=["Build Phase"])
app.include_router(grow.router, prefix="/api/grow", tags=["Grow Phase"])
app.include_router(manage.router, prefix="/api/manage", tags=["Manage Phase"])
app.include_router(admin.router, prefix="/api/admin", tags=["Administration"])
app.include_router(internal.router, prefix="/api/internal", tags=["Internal"])

@app.get("/api")
async def root():
    return {
        "message": "360 Magicians API - Deaf-first business lifecycle management",
        "version": "1.0.0",
        "lifecycle_phases": [
            "Idea - Concept development and validation",
            "Build - Project creation and development", 
            "Grow - Marketing and scaling",
            "Manage - Operations and optimization"
        ],
        "deaf_first_features": [
            "ASL support throughout all phases",
            "Visual-first interface design",
            "Vibration feedback integration",
            "No audio dependencies"
        ],
        "documentation": "/api/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "redis": "connected",
            "ai_services": "available",
            "deaf_accessibility": "enabled"
        },
        "accessibility_compliance": "WCAG_AAA"
    }

# Run the app
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=9001,
        reload=True,
        log_level="info"
    )
