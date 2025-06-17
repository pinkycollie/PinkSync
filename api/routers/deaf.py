from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel

from models.user import User, UserPreferences, VisualFeedback
from models.video import Video, VideoProcessingStatus
from services.deaf_services import DeafServices
from auth.jwt_handler import verify_token
from utils.visual_feedback import create_visual_feedback

router = APIRouter()

class AccessibilityPreferencesUpdate(BaseModel):
    high_contrast: Optional[bool] = None
    large_text: Optional[bool] = None
    animation_reduction: Optional[bool] = None
    vibration_feedback: Optional[bool] = None
    sign_language: Optional[str] = None

class InterfaceGenerationRequest(BaseModel):
    platform: str
    accessibility_features: List[str]
    ui_components: dict
    interaction_modes: List[str]

class OnboardingRequest(BaseModel):
    step: str
    data: dict
    preferences: Optional[UserPreferences] = None

@router.get("/accessibility/preferences")
async def get_accessibility_preferences(
    current_user: User = Depends(verify_token)
):
    """Get user accessibility preferences"""
    try:
        preferences = await DeafServices.get_user_preferences(current_user.id)
        return {
            "status": "success",
            "data": preferences
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("server-crash", "red", "shake", True)
            }
        )

@router.put("/accessibility/preferences")
async def update_accessibility_preferences(
    preferences_update: AccessibilityPreferencesUpdate,
    current_user: User = Depends(verify_token)
):
    """Update user accessibility preferences"""
    try:
        updated_preferences = await DeafServices.update_user_preferences(
            current_user.id, 
            preferences_update.dict(exclude_unset=True)
        )
        
        return {
            "status": "success",
            "data": updated_preferences,
            "visual_feedback": create_visual_feedback("settings", "green", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("server-crash", "red", "shake", True)
            }
        )

@router.post("/interface-generation")
async def generate_interface(
    request: InterfaceGenerationRequest,
    current_user: User = Depends(verify_token)
):
    """Generate deaf-optimized interface components"""
    try:
        interface_components = await DeafServices.generate_deaf_interface(
            platform=request.platform,
            accessibility_features=request.accessibility_features,
            ui_components=request.ui_components,
            interaction_modes=request.interaction_modes,
            user_preferences=current_user.preferences
        )
        
        return {
            "status": "success",
            "data": {
                "components": interface_components.get("components", {}),
                "styles": interface_components.get("styles", {}),
                "animations": interface_components.get("animations", {})
            },
            "visual_feedback": create_visual_feedback("magic-wand", "blue", "sparkle", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("alert-circle", "orange", "pulse", True)
            }
        )

@router.post("/onboarding")
async def process_onboarding(
    request: OnboardingRequest,
    current_user: User = Depends(verify_token)
):
    """Handle ASL-first onboarding for new deaf users"""
    try:
        onboarding_result = await DeafServices.process_onboarding_step(
            user_id=current_user.id,
            step=request.step,
            data=request.data,
            preferences=request.preferences
        )
        
        return {
            "status": "success",
            "data": {
                "next_step": onboarding_result.get("next_step"),
                "completed": onboarding_result.get("completed", False),
                "progress": onboarding_result.get("progress", 0)
            },
            "visual_feedback": create_visual_feedback("user-check", "green", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("alert-circle", "orange", "pulse", True)
            }
        )

@router.post("/sync")
async def sync_preferences(
    device_id: str,
    preferences: UserPreferences,
    timestamp: str,
    current_user: User = Depends(verify_token)
):
    """Synchronize user preferences across devices"""
    try:
        sync_result = await DeafServices.sync_user_preferences(
            user_id=current_user.id,
            device_id=device_id,
            preferences=preferences,
            timestamp=timestamp
        )
        
        return {
            "status": "success",
            "data": {
                "synced": sync_result.get("synced", True),
                "timestamp": sync_result.get("timestamp"),
                "conflicts": sync_result.get("conflicts", [])
            },
            "visual_feedback": create_visual_feedback("refresh-cw", "blue", "spin", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("wifi-off", "red", "shake", True)
            }
        )

@router.get("/asl-recognition/status")
async def get_asl_recognition_status(
    current_user: User = Depends(verify_token)
):
    """Get ASL recognition service status"""
    try:
        status_info = await DeafServices.get_asl_recognition_status()
        
        return {
            "status": "success",
            "data": {
                "service_available": status_info.get("available", True),
                "supported_languages": status_info.get("languages", ["asl", "bsl", "isl"]),
                "accuracy_rate": status_info.get("accuracy", 0.95),
                "processing_time": status_info.get("avg_processing_time", "2.3s")
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("activity", "orange", "pulse", False)
            }
        )

@router.post("/asl-recognition/analyze")
async def analyze_asl_video(
    video_id: str,
    current_user: User = Depends(verify_token)
):
    """Analyze video for ASL content and generate insights"""
    try:
        analysis_result = await DeafServices.analyze_asl_content(
            video_id=video_id,
            user_id=current_user.id
        )
        
        return {
            "status": "success",
            "data": {
                "detected_signs": analysis_result.get("signs", []),
                "confidence_score": analysis_result.get("confidence", 0.0),
                "sign_language": analysis_result.get("language", "asl"),
                "transcript": analysis_result.get("transcript", ""),
                "key_phrases": analysis_result.get("key_phrases", [])
            },
            "visual_feedback": create_visual_feedback("eye", "blue", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("alert-triangle", "orange", "shake", True)
            }
        )
