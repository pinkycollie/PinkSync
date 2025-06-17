"""
Role-based Access Control with Deaf Accessibility
Manages user roles and permissions across all platform components
"""

from enum import Enum
from typing import Dict, List, Optional
import json

class UserRole(Enum):
    ADMIN = "admin"
    CREATOR = "creator" 
    COACH = "coach"
    BUSINESS_OWNER = "business_owner"
    CLIENT = "client"
    DEAF_ADVOCATE = "deaf_advocate"

class PlatformAccess(Enum):
    PINKSYNC = "pinksync"
    MAGICIANS_360 = "360magicians"
    MBTQ_FINANCIAL = "mbtq_financial"
    PERSONAL_BUSINESS = "personal_business"
    ADMIN_PORTAL = "admin_portal"
    VR_SERVICE = "vr_service"

class RoleManager:
    """Manages user roles and platform access with deaf accessibility focus"""
    
    def __init__(self):
        self.role_permissions = {
            UserRole.ADMIN: {
                "platforms": list(PlatformAccess),
                "deaf_features": ["full_asl_admin", "accessibility_controls", "visual_admin_tools"],
                "permissions": ["read", "write", "delete", "admin"]
            },
            UserRole.CREATOR: {
                "platforms": [PlatformAccess.PINKSYNC, PlatformAccess.PERSONAL_BUSINESS],
                "deaf_features": ["asl_content_creation", "visual_editing_tools", "deaf_audience_analytics"],
                "permissions": ["read", "write"]
            },
            UserRole.COACH: {
                "platforms": [PlatformAccess.VR_SERVICE, PlatformAccess.PINKSYNC],
                "deaf_features": ["asl_coaching_tools", "visual_progress_tracking", "deaf_client_support"],
                "permissions": ["read", "write"]
            },
            UserRole.BUSINESS_OWNER: {
                "platforms": [PlatformAccess.MAGICIANS_360, PlatformAccess.PERSONAL_BUSINESS],
                "deaf_features": ["asl_business_resources", "visual_analytics", "deaf_customer_tools"],
                "permissions": ["read", "write"]
            },
            UserRole.CLIENT: {
                "platforms": [PlatformAccess.MBTQ_FINANCIAL, PlatformAccess.MAGICIANS_360],
                "deaf_features": ["asl_support", "visual_interfaces", "vibration_alerts"],
                "permissions": ["read"]
            },
            UserRole.DEAF_ADVOCATE: {
                "platforms": list(PlatformAccess),
                "deaf_features": ["accessibility_auditing", "asl_resource_management", "deaf_community_tools"],
                "permissions": ["read", "accessibility_admin"]
            }
        }
    
    def get_user_permissions(self, role: UserRole) -> Dict:
        """Get permissions for a specific user role"""
        return self.role_permissions.get(role, {})
    
    def can_access_platform(self, role: UserRole, platform: PlatformAccess) -> bool:
        """Check if role can access specific platform"""
        permissions = self.get_user_permissions(role)
        return platform in permissions.get("platforms", [])
    
    def get_deaf_features(self, role: UserRole) -> List[str]:
        """Get deaf accessibility features available to role"""
        permissions = self.get_user_permissions(role)
        return permissions.get("deaf_features", [])
    
    def generate_role_based_interface(self, role: UserRole, platform: PlatformAccess) -> Dict:
        """Generate interface configuration based on role and platform"""
        if not self.can_access_platform(role, platform):
            return {"access": "denied", "reason": "insufficient_permissions"}
        
        permissions = self.get_user_permissions(role)
        deaf_features = self.get_deaf_features(role)
        
        return {
            "access": "granted",
            "role": role.value,
            "platform": platform.value,
            "permissions": permissions.get("permissions", []),
            "deaf_features": deaf_features,
            "interface_config": {
                "visual_priority": True,
                "asl_support": "asl_support" in deaf_features,
                "high_contrast": True,
                "vibration_feedback": True,
                "audio_independence": True
            }
        }
