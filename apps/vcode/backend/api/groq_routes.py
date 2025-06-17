"""
Groq AI API Routes for VCode
Handles all Groq AI integration endpoints
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
import asyncio

from services.groq_integration import groq_processor
from auth.jwt_handler import verify_token
from utils.deaf_accessibility import create_visual_feedback

router = APIRouter(prefix="/groq", tags=["Groq AI Integration"])

@router.post("/process-audio")
async def process_audio_with_groq(
    audio: UploadFile = File(...),
    meeting_type: str = "general",
    accessibility_mode: bool = True,
    current_user: dict = Depends(verify_token)
):
    """Process audio file with Groq Whisper for transcription"""
    
    try:
        # Read audio data
        audio_data = await audio.read()
        
        # Process with Groq
        result = await groq_processor.process_meeting_audio(
            audio_data=audio_data,
            meeting_type=meeting_type,
            accessibility_mode=accessibility_mode
        )
        
        if result["status"] == "success":
            return JSONResponse({
                "status": "success",
                "transcription": result["transcription"],
                "meeting_type": meeting_type,
                "accessibility_enhanced": accessibility_mode,
                "visual_feedback": create_visual_feedback("mic", "green", "pulse", False)
            })
        else:
            raise HTTPException(status_code=400, detail=result)
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "error": str(e),
                "visual_feedback": create_visual_feedback("alert-circle", "red", "shake", True)
            }
        )

@router.post("/assistance")
async def get_meeting_assistance(
    request_data: Dict[str, Any],
    current_user: dict = Depends(verify_token)
):
    """Get real-time meeting assistance from Groq AI"""
    
    try:
        current_transcript = request_data.get("current_transcript", "")
        meeting_context = request_data.get("meeting_context", {})
        user_query = request_data.get("user_query")
        
        # Get assistance from Groq
        result = await groq_processor.real_time_meeting_assistance(
            current_transcript=current_transcript,
            meeting_context=meeting_context,
            user_query=user_query
        )
        
        if result["status"] == "success":
            return JSONResponse({
                "status": "success",
                "assistance": result["assistance"],
                "timestamp": result["timestamp"],
                "accessibility_optimized": result["accessibility_optimized"],
                "visual_feedback": create_visual_feedback("brain", "blue", "pulse", False)
            })
        else:
            raise HTTPException(status_code=400, detail=result)
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "error": str(e),
                "visual_feedback": create_visual_feedback("brain-x", "red", "shake", True)
            }
        )

@router.post("/analyze-meeting")
async def analyze_meeting_content(
    request_data: Dict[str, Any],
    current_user: dict = Depends(verify_token)
):
    """Analyze complete meeting content with Groq AI"""
    
    try:
        transcript = request_data.get("transcript", "")
        meeting_type = request_data.get("meeting_type", "general")
        participants = request_data.get("participants", [])
        accessibility_requirements = request_data.get("accessibility_requirements", {})
        
        # Analyze with Groq
        result = await groq_processor.analyze_meeting_content(
            transcript=transcript,
            meeting_type=meeting_type,
            participants=participants,
            accessibility_requirements=accessibility_requirements
        )
        
        if result["status"] == "success":
            return JSONResponse({
                "status": "success",
                "analysis": result["analysis"],
                "model_used": result["model_used"],
                "meeting_type": meeting_type,
                "accessibility_compliant": result["accessibility_compliant"],
                "visual_feedback": create_visual_feedback("search", "green", "pulse", False)
            })
        else:
            raise HTTPException(status_code=400, detail=result)
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "error": str(e),
                "visual_feedback": create_visual_feedback("search-x", "red", "shake", True)
            }
        )

@router.post("/generate-evidence")
async def generate_vcode_evidence(
    request_data: Dict[str, Any],
    current_user: dict = Depends(verify_token)
):
    """Generate VCode evidence package using Groq AI"""
    
    try:
        meeting_data = request_data.get("meeting_data", {})
        legal_requirements = request_data.get("legal_requirements", {})
        
        # Generate evidence with Groq
        result = await groq_processor.generate_vcode_evidence(
            meeting_data=meeting_data,
            legal_requirements=legal_requirements
        )
        
        if result["status"] == "success":
            return JSONResponse({
                "status": "success",
                "evidence_package": result["evidence_package"],
                "evidence_id": f"vcode_{result['generated_at'].replace(':', '-')}",
                "generated_at": result["generated_at"],
                "legal_compliant": result["legal_compliant"],
                "accessibility_verified": result["accessibility_verified"],
                "visual_feedback": create_visual_feedback("shield-check", "green", "pulse", False)
            })
        else:
            raise HTTPException(status_code=400, detail=result)
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "error": str(e),
                "visual_feedback": create_visual_feedback("shield-x", "red", "shake", True)
            }
        )

@router.get("/health")
async def groq_health_check():
    """Check Groq AI service health"""
    
    try:
        # Test Groq connection
        test_response = groq_processor.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": "Health check"}],
            max_tokens=10
        )
        
        return JSONResponse({
            "status": "healthy",
            "groq_api": "connected",
            "models_available": list(groq_processor.models.values()),
            "accessibility_features": "enabled",
            "deaf_first_optimized": True
        })
        
    except Exception as e:
        return JSONResponse({
            "status": "unhealthy",
            "error": str(e),
            "groq_api": "disconnected"
        }, status_code=503)

@router.get("/models")
async def list_available_models():
    """List available Groq models for different use cases"""
    
    return JSONResponse({
        "models": groq_processor.models,
        "use_cases": {
            "transcription": "Real-time audio transcription with accessibility enhancements",
            "analysis": "Meeting content analysis and agreement detection",
            "medical": "Medical consultation analysis with HIPAA considerations",
            "legal": "Legal meeting analysis with evidence generation",
            "technical": "Technical discussion analysis and documentation"
        },
        "accessibility_features": [
            "ASL interpretation support",
            "Visual feedback generation",
            "Deaf-friendly response formatting",
            "High contrast text processing",
            "Cultural competency awareness"
        ]
    })
