"""
Idea Phase Router - 360 Magicians
Handles idea intake, validation, and path selection
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel

from models.idea import IdeaIntake, IdeaResponse, ReadinessCheck, PathSelection
from services.idea_services import IdeaServices
from auth.jwt_handler import verify_token
from utils.deaf_accessibility import create_visual_feedback

router = APIRouter()

class VRReferralRequest(BaseModel):
    user_id: str
    disability_type: str
    employment_goal: str
    current_skills: List[str]
    preferred_communication: str = "asl"

class UserProfile(BaseModel):
    name: str
    email: str
    deaf_status: bool
    preferred_communication: str
    business_interests: List[str]
    experience_level: str

@router.post("/intake")
async def idea_intake(
    idea: IdeaIntake,
    current_user: dict = Depends(verify_token)
):
    """Submit new business idea with deaf accessibility consideration"""
    try:
        # Process idea with deaf-first analysis
        result = await IdeaServices.process_idea_intake(
            idea=idea,
            user_id=current_user.get("user_id"),
            deaf_first_analysis=True
        )
        
        return {
            "status": "success",
            "data": result,
            "visual_feedback": create_visual_feedback("lightbulb", "blue", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("alert-circle", "red", "shake", True)
            }
        )

@router.get("/readiness-check")
async def readiness_check(
    idea_id: Optional[str] = None,
    current_user: dict = Depends(verify_token)
):
    """Check business idea readiness with accessibility scoring"""
    try:
        readiness = await IdeaServices.assess_idea_readiness(
            idea_id=idea_id,
            user_id=current_user.get("user_id"),
            include_accessibility_score=True
        )
        
        return {
            "status": "success",
            "data": readiness,
            "visual_feedback": create_visual_feedback("check-circle", "green", "pulse", False)
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

@router.post("/path-selection")
async def path_selection(
    path_data: PathSelection,
    current_user: dict = Depends(verify_token)
):
    """Select development path (startup, project, company, DAO)"""
    try:
        path_result = await IdeaServices.select_development_path(
            path_data=path_data,
            user_id=current_user.get("user_id"),
            deaf_accessibility_priority=True
        )
        
        return {
            "status": "success",
            "data": path_result,
            "visual_feedback": create_visual_feedback("map", "blue", "fade", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("alert-triangle", "orange", "pulse", True)
            }
        )

@router.post("/assessment-results")
async def assessment_results(
    assessment_data: dict,
    current_user: dict = Depends(verify_token)
):
    """Submit and process idea assessment results"""
    try:
        results = await IdeaServices.process_assessment_results(
            assessment_data=assessment_data,
            user_id=current_user.get("user_id")
        )
        
        return {
            "status": "success",
            "data": results,
            "visual_feedback": create_visual_feedback("clipboard-check", "green", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("clipboard-x", "red", "shake", True)
            }
        )

@router.get("/vr/eligibility-check")
async def vr_eligibility_check(
    current_user: dict = Depends(verify_token)
):
    """Check VR (Vocational Rehabilitation) eligibility for deaf users"""
    try:
        eligibility = await IdeaServices.check_vr_eligibility(
            user_id=current_user.get("user_id"),
            deaf_status=current_user.get("deaf_status", False)
        )
        
        return {
            "status": "success",
            "data": eligibility,
            "visual_feedback": create_visual_feedback("user-check", "blue", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("user-x", "red", "shake", True)
            }
        )

@router.post("/vr/referral-request")
async def vr_referral_request(
    referral: VRReferralRequest,
    current_user: dict = Depends(verify_token)
):
    """Submit VR referral request for deaf entrepreneurs"""
    try:
        referral_result = await IdeaServices.submit_vr_referral(
            referral_data=referral,
            user_id=current_user.get("user_id")
        )
        
        return {
            "status": "success",
            "data": referral_result,
            "visual_feedback": create_visual_feedback("send", "green", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("send-x", "red", "shake", True)
            }
        )

@router.post("/user-profile")
async def create_user_profile(
    profile: UserProfile,
    current_user: dict = Depends(verify_token)
):
    """Create or update user profile with deaf accessibility preferences"""
    try:
        profile_result = await IdeaServices.create_user_profile(
            profile_data=profile,
            user_id=current_user.get("user_id")
        )
        
        return {
            "status": "success",
            "data": profile_result,
            "visual_feedback": create_visual_feedback("user-plus", "green", "pulse", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "message": str(e),
                "visual_feedback": create_visual_feedback("user-minus", "red", "shake", True)
            }
        )
