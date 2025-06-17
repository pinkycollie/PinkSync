from typing import Dict, List, Optional, Any
import asyncio
from datetime import datetime, timedelta
import json

from database.connection import get_db
from utils.redis_client import get_redis
from models.user import UserPreferences
from utils.ai_client import get_openai_client

class DeafServices:
    """Service class for deaf-specific functionality"""
    
    @staticmethod
    async def get_user_preferences(user_id: str) -> UserPreferences:
        """Get user accessibility preferences from cache or database"""
        redis = await get_redis()
        
        # Try cache first
        cached_prefs = await redis.get(f"user:{user_id}:preferences")
        if cached_prefs:
            return UserPreferences(**json.loads(cached_prefs))
        
        # Fallback to database
        db = await get_db()
        query = "SELECT preferences FROM users WHERE id = $1"
        result = await db.fetchrow(query, user_id)
        
        if result and result['preferences']:
            preferences = UserPreferences(**result['preferences'])
            # Cache for future use
            await redis.setex(
                f"user:{user_id}:preferences", 
                3600, 
                json.dumps(preferences.dict())
            )
            return preferences
        
        # Return default preferences
        return UserPreferences()
    
    @staticmethod
    async def update_user_preferences(
        user_id: str, 
        preferences_update: Dict[str, Any]
    ) -> UserPreferences:
        """Update user accessibility preferences"""
        db = await get_db()
        redis = await get_redis()
        
        # Get current preferences
        current_prefs = await DeafServices.get_user_preferences(user_id)
        
        # Update with new values
        updated_data = current_prefs.dict()
        updated_data.update(preferences_update)
        updated_prefs = UserPreferences(**updated_data)
        
        # Update database
        query = """
            UPDATE users 
            SET preferences = $1, updated_at = $2 
            WHERE id = $3
        """
        await db.execute(
            query, 
            json.dumps(updated_prefs.dict()), 
            datetime.utcnow(), 
            user_id
        )
        
        # Update cache
        await redis.setex(
            f"user:{user_id}:preferences", 
            3600, 
            json.dumps(updated_prefs.dict())
        )
        
        return updated_prefs
    
    @staticmethod
    async def generate_deaf_interface(
        platform: str,
        accessibility_features: List[str],
        ui_components: Dict[str, Any],
        interaction_modes: List[str],
        user_preferences: UserPreferences
    ) -> Dict[str, Any]:
        """Generate optimized interface components for deaf users"""
        
        # Base interface configuration
        interface_config = {
            "components": {},
            "styles": {},
            "animations": {}
        }
        
        # Apply high contrast if enabled
        if user_preferences.high_contrast:
            interface_config["styles"]["color_scheme"] = "high_contrast"
            interface_config["styles"]["border_width"] = "2px"
            interface_config["styles"]["focus_ring"] = "4px solid #FFD700"
        
        # Apply large text if enabled
        if user_preferences.large_text:
            interface_config["styles"]["font_size_multiplier"] = 1.5
            interface_config["styles"]["line_height"] = 1.6
            interface_config["styles"]["button_padding"] = "16px 24px"
        
        # Reduce animations if requested
        if user_preferences.animation_reduction:
            interface_config["animations"]["duration"] = "0.1s"
            interface_config["animations"]["easing"] = "linear"
        else:
            interface_config["animations"]["duration"] = "0.3s"
            interface_config["animations"]["easing"] = "ease-out"
        
        # Platform-specific optimizations
        if platform == "mobile":
            interface_config["components"]["touch_targets"] = {
                "min_size": "44px",
                "spacing": "8px"
            }
            interface_config["components"]["vibration"] = user_preferences.vibration_feedback
        
        # Visual feedback components
        interface_config["components"]["visual_feedback"] = {
            "success_color": "#10B981",
            "error_color": "#EF4444", 
            "warning_color": "#F59E0B",
            "info_color": "#3B82F6",
            "icons": {
                "success": "check-circle",
                "error": "x-circle",
                "warning": "alert-triangle",
                "info": "info"
            }
        }
        
        # Sign language specific components
        if "sign_language_support" in accessibility_features:
            interface_config["components"]["sign_language"] = {
                "preferred_language": user_preferences.sign_language,
                "video_controls": {
                    "playback_speed": [0.5, 0.75, 1.0, 1.25, 1.5],
                    "loop_sections": True,
                    "frame_by_frame": True
                }
            }
        
        return interface_config
    
    @staticmethod
    async def process_onboarding_step(
        user_id: str,
        step: str,
        data: Dict[str, Any],
        preferences: Optional[UserPreferences] = None
    ) -> Dict[str, Any]:
        """Process ASL-first onboarding steps"""
        
        redis = await get_redis()
        db = await get_db()
        
        # Get current onboarding progress
        progress_key = f"onboarding:{user_id}"
        current_progress = await redis.get(progress_key)
        
        if current_progress:
            progress_data = json.loads(current_progress)
        else:
            progress_data = {
                "completed_steps": [],
                "current_step": "welcome",
                "progress_percentage": 0
            }
        
        # Define onboarding flow
        onboarding_steps = [
            "welcome",
            "accessibility_preferences", 
            "sign_language_selection",
            "interface_customization",
            "tutorial_completion",
            "profile_setup",
            "verification_intro"
        ]
        
        # Process current step
        if step == "accessibility_preferences" and preferences:
            await DeafServices.update_user_preferences(user_id, preferences.dict())
            progress_data["accessibility_configured"] = True
        
        elif step == "sign_language_selection":
            sign_language = data.get("sign_language", "asl")
            await DeafServices.update_user_preferences(
                user_id, 
                {"sign_language": sign_language}
            )
            progress_data["sign_language_selected"] = sign_language
        
        elif step == "interface_customization":
            ui_preferences = data.get("ui_preferences", {})
            await DeafServices.update_user_preferences(user_id, ui_preferences)
            progress_data["interface_customized"] = True
        
        # Update progress
        if step not in progress_data["completed_steps"]:
            progress_data["completed_steps"].append(step)
        
        # Calculate progress percentage
        progress_data["progress_percentage"] = (
            len(progress_data["completed_steps"]) / len(onboarding_steps)
        ) * 100
        
        # Determine next step
        try:
            current_index = onboarding_steps.index(step)
            if current_index < len(onboarding_steps) - 1:
                next_step = onboarding_steps[current_index + 1]
                progress_data["current_step"] = next_step
            else:
                progress_data["completed"] = True
                progress_data["current_step"] = "completed"
        except ValueError:
            progress_data["current_step"] = "welcome"
        
        # Save progress
        await redis.setex(progress_key, 86400, json.dumps(progress_data))  # 24 hours
        
        return {
            "next_step": progress_data.get("current_step"),
            "completed": progress_data.get("completed", False),
            "progress": progress_data["progress_percentage"]
        }
    
    @staticmethod
    async def sync_user_preferences(
        user_id: str,
        device_id: str,
        preferences: UserPreferences,
        timestamp: str
    ) -> Dict[str, Any]:
        """Synchronize user preferences across devices"""
        
        redis = await get_redis()
        
        # Get current preferences timestamp
        current_timestamp_key = f"user:{user_id}:preferences:timestamp"
        current_timestamp = await redis.get(current_timestamp_key)
        
        sync_result = {
            "synced": True,
            "timestamp": datetime.utcnow().isoformat(),
            "conflicts": []
        }
        
        # Check for conflicts (simple timestamp comparison)
        if current_timestamp:
            current_dt = datetime.fromisoformat(current_timestamp)
            new_dt = datetime.fromisoformat(timestamp)
            
            if new_dt < current_dt:
                # Incoming preferences are older, potential conflict
                sync_result["conflicts"].append({
                    "field": "timestamp",
                    "message": "Incoming preferences are older than current"
                })
        
        # Update preferences (latest wins for now)
        await DeafServices.update_user_preferences(user_id, preferences.dict())
        
        # Update timestamp
        await redis.setex(current_timestamp_key, 86400, sync_result["timestamp"])
        
        # Track device sync
        device_sync_key = f"user:{user_id}:devices:{device_id}"
        await redis.setex(device_sync_key, 86400, json.dumps({
            "last_sync": sync_result["timestamp"],
            "preferences_version": sync_result["timestamp"]
        }))
        
        return sync_result
    
    @staticmethod
    async def get_asl_recognition_status() -> Dict[str, Any]:
        """Get ASL recognition service status"""
        
        # This would integrate with your AI/ML services
        return {
            "available": True,
            "languages": ["asl", "bsl", "isl"],
            "accuracy": 0.95,
            "avg_processing_time": "2.3s",
            "models": {
                "asl": "v2.1.0",
                "bsl": "v1.8.0", 
                "isl": "v1.5.0"
            }
        }
    
    @staticmethod
    async def analyze_asl_content(
        video_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Analyze video content for ASL signs and generate insights"""
        
        # This would integrate with your AI/ML pipeline
        # For now, return mock data
        
        redis = await get_redis()
        
        # Check if analysis is already cached
        analysis_key = f"video:{video_id}:asl_analysis"
        cached_analysis = await redis.get(analysis_key)
        
        if cached_analysis:
            return json.loads(cached_analysis)
        
        # Mock analysis result (replace with actual AI processing)
        analysis_result = {
            "signs": [
                {"sign": "hello", "confidence": 0.95, "timestamp": "00:00:02"},
                {"sign": "thank_you", "confidence": 0.88, "timestamp": "00:00:15"},
                {"sign": "help", "confidence": 0.92, "timestamp": "00:00:28"}
            ],
            "confidence": 0.92,
            "language": "asl",
            "transcript": "Hello, thank you for your help with this project.",
            "key_phrases": ["hello", "thank you", "help", "project"],
            "processing_time": "3.2s",
            "model_version": "asl_v2.1.0"
        }
        
        # Cache the result
        await redis.setex(analysis_key, 1800, json.dumps(analysis_result))  # 30 minutes
        
        return analysis_result
