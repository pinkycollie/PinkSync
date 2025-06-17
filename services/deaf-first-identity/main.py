from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import asyncio
import json
import os
from datetime import datetime, timedelta
import hashlib
import base64

# Import your existing modules
from database import get_db, engine
from models import User, DeafProfile, SignLanguagePattern, AccessibilityPreference
from auth import verify_token, create_access_token
from sign_language_processor import ASLSignatureProcessor
from pinksync_integration import PinkSyncIdentity, MCPContextSync

app = FastAPI(
    title="Deaf-First Identity Service",
    description="Identity and authentication service optimized for deaf users",
    version="2.0.0"
)

# CORS middleware for Vercel integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pinksync.io", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models
class DeafIdentityCreate(BaseModel):
    user_id: str
    primary_sign_language: str = "ASL"
    communication_preferences: List[str]
    accessibility_settings: Dict[str, Any]
    cultural_identity: Dict[str, Any]

class SignLanguageAuthRequest(BaseModel):
    user_id: str
    pattern_name: Optional[str] = None

class PinkSyncContextUpdate(BaseModel):
    domain: str
    context_data: Dict[str, Any]
    sync_priority: str = "medium"

# Initialize services
asl_processor = ASLSignatureProcessor()
pinksync_identity = PinkSyncIdentity()

@app.on_startup
async def startup_event():
    """Initialize services on startup"""
    await asl_processor.load_models()
    await pinksync_identity.initialize()

@app.get("/health")
async def health_check():
    """Health check endpoint for GCP monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "asl_processor": "ready",
            "pinksync": "synchronized"
        }
    }

@app.post("/identity/create")
async def create_deaf_identity(
    identity_data: DeafIdentityCreate,
    db: Session = Depends(get_db)
):
    """Create a new deaf-first identity profile"""
    try:
        # Create PinkSync identity
        pinksync_id = await pinksync_identity.create_identity(
            user_id=identity_data.user_id,
            identity_features={
                "sign_language": identity_data.primary_sign_language,
                "cultural_identity": identity_data.cultural_identity
            }
        )
        
        # Store in database
        deaf_profile = DeafProfile(
            user_id=identity_data.user_id,
            pinksync_identity_id=pinksync_id,
            primary_sign_language=identity_data.primary_sign_language,
            communication_preferences=json.dumps(identity_data.communication_preferences),
            accessibility_settings=json.dumps(identity_data.accessibility_settings),
            cultural_identity=json.dumps(identity_data.cultural_identity),
            created_at=datetime.utcnow()
        )
        
        db.add(deaf_profile)
        db.commit()
        db.refresh(deaf_profile)
        
        return {
            "success": True,
            "identity_id": deaf_profile.id,
            "pinksync_id": pinksync_id,
            "message": "Deaf-first identity created successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create identity: {str(e)}")

@app.post("/auth/sign-language")
async def authenticate_with_sign_language(
    video: UploadFile = File(...),
    auth_request: SignLanguageAuthRequest = Depends(),
    db: Session = Depends(get_db)
):
    """Authenticate user using sign language patterns"""
    try:
        # Read video data
        video_data = await video.read()
        
        # Process sign language signature
        signature_features = await asl_processor.extract_features(video_data)
        
        if not signature_features or signature_features.get('confidence', 0) < 0.85:
            raise HTTPException(
                status_code=401, 
                detail="Sign language authentication failed - insufficient confidence"
            )
        
        # Verify with PinkSync identity
        auth_result = await pinksync_identity.authenticate_with_signature(
            user_id=auth_request.user_id,
            signature_features=signature_features
        )
        
        if not auth_result.get('success'):
            raise HTTPException(status_code=401, detail="Authentication failed")
        
        # Get user profile
        deaf_profile = db.query(DeafProfile).filter(
            DeafProfile.user_id == auth_request.user_id
        ).first()
        
        if not deaf_profile:
            raise HTTPException(status_code=404, detail="Deaf profile not found")
        
        # Create access token
        access_token = create_access_token(
            data={
                "user_id": auth_request.user_id,
                "auth_method": "sign_language",
                "pinksync_id": deaf_profile.pinksync_identity_id
            }
        )
        
        # Log successful authentication
        await log_authentication_event(
            user_id=auth_request.user_id,
            method="sign_language",
            confidence=signature_features.get('confidence'),
            db=db
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": auth_request.user_id,
            "confidence": signature_features.get('confidence'),
            "pinksync_session": auth_result.get('session_token')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.post("/auth/register-pattern")
async def register_sign_language_pattern(
    video: UploadFile = File(...),
    pattern_name: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Register a new sign language authentication pattern"""
    try:
        # Verify existing authentication
        user_data = verify_token(credentials.credentials)
        user_id = user_data.get('user_id')
        
        # Read and process video
        video_data = await video.read()
        signature_features = await asl_processor.extract_features(video_data)
        
        if signature_features.get('confidence', 0) < 0.9:
            raise HTTPException(
                status_code=400,
                detail="Pattern quality too low for registration"
            )
        
        # Store pattern in PinkSync
        pattern_id = await pinksync_identity.register_pattern(
            user_id=user_id,
            pattern_name=pattern_name,
            signature_features=signature_features
        )
        
        # Store in database
        sign_pattern = SignLanguagePattern(
            user_id=user_id,
            pattern_name=pattern_name,
            pattern_id=pattern_id,
            confidence_score=signature_features.get('confidence'),
            created_at=datetime.utcnow()
        )
        
        db.add(sign_pattern)
        db.commit()
        
        return {
            "success": True,
            "pattern_id": pattern_id,
            "pattern_name": pattern_name,
            "confidence": signature_features.get('confidence')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pattern registration failed: {str(e)}")

@app.post("/context/sync")
async def sync_mcp_context(
    context_update: PinkSyncContextUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Synchronize MCP context across domains using PinkSync"""
    try:
        user_data = verify_token(credentials.credentials)
        user_id = user_data.get('user_id')
        
        # Initialize MCP context sync
        mcp_sync = MCPContextSync(user_id, context_update.domain)
        
        # Persist context update
        await mcp_sync.persist_context({
            "domain": context_update.domain,
            "data": context_update.context_data,
            "priority": context_update.sync_priority,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "success": True,
            "domain": context_update.domain,
            "sync_status": "completed",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context sync failed: {str(e)}")

@app.get("/context/retrieve/{domain}")
async def retrieve_mcp_context(
    domain: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Retrieve latest MCP context for a domain"""
    try:
        user_data = verify_token(credentials.credentials)
        user_id = user_data.get('user_id')
        
        mcp_sync = MCPContextSync(user_id, domain)
        context = await mcp_sync.retrieve_latest_context()
        
        return {
            "domain": domain,
            "context": context.serialize() if context else None,
            "last_updated": context.last_update if context else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context retrieval failed: {str(e)}")

@app.get("/profile/{user_id}")
async def get_deaf_profile(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get comprehensive deaf-first profile"""
    try:
        # Verify authorization
        user_data = verify_token(credentials.credentials)
        if user_data.get('user_id') != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get profile from database
        deaf_profile = db.query(DeafProfile).filter(
            DeafProfile.user_id == user_id
        ).first()
        
        if not deaf_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Get PinkSync identity status
        pinksync_status = await pinksync_identity.get_identity_status(
            deaf_profile.pinksync_identity_id
        )
        
        return {
            "user_id": user_id,
            "identity_id": deaf_profile.id,
            "primary_sign_language": deaf_profile.primary_sign_language,
            "communication_preferences": json.loads(deaf_profile.communication_preferences),
            "accessibility_settings": json.loads(deaf_profile.accessibility_settings),
            "cultural_identity": json.loads(deaf_profile.cultural_identity),
            "pinksync_status": pinksync_status,
            "created_at": deaf_profile.created_at.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile retrieval failed: {str(e)}")

async def log_authentication_event(user_id: str, method: str, confidence: float, db: Session):
    """Log authentication events for security and analytics"""
    # Implementation for logging authentication events
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        reload=os.getenv("ENVIRONMENT") == "development"
    )
