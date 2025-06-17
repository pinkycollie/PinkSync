from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import os
from typing import Optional

# Import routers
from routers import deaf, job, business, vr4deaf, auth
from database.connection import init_db, close_db
from utils.redis_client import init_redis, close_redis

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
    title="PINKSYNC API",
    description="Deaf-first AI-powered platform for vocational, entrepreneurial, and rehabilitation workflows",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/py/docs",
    redoc_url="/api/py/redoc",
    openapi_url="/api/py/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://pinksync.io",
        "https://pinksync.mbtquniverse.com",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/py/auth", tags=["Authentication"])
app.include_router(deaf.router, prefix="/api/py/deaf", tags=["Deaf Services"])
app.include_router(job.router, prefix="/api/py/job", tags=["Job Readiness"])
app.include_router(business.router, prefix="/api/py/business", tags=["Business Development"])
app.include_router(vr4deaf.router, prefix="/api/py/vr4deaf", tags=["Vocational Rehabilitation"])

@app.get("/api/py")
async def root():
    return {
        "message": "PINKSYNC API - Deaf-first. AI-powered. Future-ready.",
        "version": "2.0.0",
        "services": [
            "DeafAuth - Authentication and user management",
            "PinkSync - Accessibility and interface transformation", 
            "FibonRose - Trust verification and badges",
            "VR4Deaf - Vocational rehabilitation services"
        ],
        "documentation": "/api/py/docs"
    }

@app.get("/api/py/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "redis": "connected",
            "ai_services": "available"
        }
    }

# Run the app
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
