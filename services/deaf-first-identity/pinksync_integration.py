import asyncio
import json
import hashlib
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import aioredis
import httpx
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

class PinkSyncIdentity:
    """PinkSync identity management for deaf-first authentication"""
    
    def __init__(self):
        self.redis_client = None
        self.encryption_key = None
        self.pinksync_endpoint = os.getenv("PINKSYNC_ENDPOINT", "https://api.pinksync.io")
        
    async def initialize(self):
        """Initialize PinkSync identity service"""
        # Connect to Redis for local caching
        self.redis_client = await aioredis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379")
        )
        
        # Initialize encryption
        self._setup_encryption()
        
    def _setup_encryption(self):
        """Setup encryption for sensitive data"""
        password = os.getenv("PINKSYNC_ENCRYPTION_KEY", "default-key").encode()
        salt = b'pinksync-deaf-first'  # In production, use random salt per user
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        self.encryption_key = Fernet(key)
    
    async def create_identity(self, user_id: str, identity_features: Dict[str, Any]) -> str:
        """Create a new PinkSync identity for deaf user"""
        try:
            # Generate unique identity ID
            identity_data = {
                "user_id": user_id,
                "features": identity_features,
                "created_at": datetime.utcnow().isoformat(),
                "type": "deaf_first_identity"
            }
            
            # Create identity hash
            identity_hash = hashlib.sha256(
                json.dumps(identity_data, sort_keys=True).encode()
            ).hexdigest()
            
            pinksync_id = f"deaf-{identity_hash[:16]}"
            
            # Encrypt and store identity data
            encrypted_data = self.encryption_key.encrypt(
                json.dumps(identity_data).encode()
            )
            
            # Store in Redis cache
            await self.redis_client.setex(
                f"identity:{pinksync_id}",
                timedelta(days=30).total_seconds(),
                encrypted_data
            )
            
            # Store in PinkSync network (simulated)
            await self._sync_to_pinksync_network(pinksync_id, identity_data)
            
            return pinksync_id
            
        except Exception as e:
            raise Exception(f"Failed to create PinkSync identity: {str(e)}")
    
    async def authenticate_with_signature(
        self, 
        user_id: str, 
        signature_features: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Authenticate user with sign language signature"""
        try:
            # Get stored patterns for user
            stored_patterns = await self._get_user_patterns(user_id)
            
            if not stored_patterns:
                return {"success": False, "reason": "No patterns registered"}
            
            # Compare signature with stored patterns
            best_match = await self._compare_signatures(signature_features, stored_patterns)
            
            if best_match["confidence"] >= 0.85:
                # Generate session token
                session_token = await self._generate_session_token(user_id)
                
                return {
                    "success": True,
                    "confidence": best_match["confidence"],
                    "pattern_matched": best_match["pattern_id"],
                    "session_token": session_token
                }
            else:
                return {
                    "success": False,
                    "reason": "Signature confidence too low",
                    "confidence": best_match["confidence"]
                }
                
        except Exception as e:
            return {"success": False, "reason": f"Authentication error: {str(e)}"}
    
    async def register_pattern(
        self, 
        user_id: str, 
        pattern_name: str, 
        signature_features: Dict[str, Any]
    ) -> str:
        """Register a new sign language pattern"""
        try:
            pattern_id = f"pattern-{user_id}-{hashlib.md5(pattern_name.encode()).hexdigest()[:8]}"
            
            pattern_data = {
                "pattern_id": pattern_id,
                "user_id": user_id,
                "pattern_name": pattern_name,
                "features": signature_features,
                "registered_at": datetime.utcnow().isoformat()
            }
            
            # Encrypt and store pattern
            encrypted_pattern = self.encryption_key.encrypt(
                json.dumps(pattern_data).encode()
            )
            
            await self.redis_client.setex(
                f"pattern:{pattern_id}",
                timedelta(days=365).total_seconds(),  # Patterns stored for 1 year
                encrypted_pattern
            )
            
            # Add to user's pattern list
            user_patterns_key = f"user_patterns:{user_id}"
            await self.redis_client.sadd(user_patterns_key, pattern_id)
            await self.redis_client.expire(user_patterns_key, timedelta(days=365).total_seconds())
            
            # Sync to PinkSync network
            await self._sync_to_pinksync_network(pattern_id, pattern_data)
            
            return pattern_id
            
        except Exception as e:
            raise Exception(f"Failed to register pattern: {str(e)}")
    
    async def get_identity_status(self, pinksync_id: str) -> Dict[str, Any]:
        """Get status of PinkSync identity"""
        try:
            # Check local cache first
            cached_data = await self.redis_client.get(f"identity:{pinksync_id}")
            
            if cached_data:
                decrypted_data = self.encryption_key.decrypt(cached_data)
                identity_data = json.loads(decrypted_data.decode())
                
                return {
                    "status": "active",
                    "last_sync": identity_data.get("last_sync"),
                    "created_at": identity_data.get("created_at"),
                    "sync_status": "synchronized"
                }
            else:
                return {
                    "status": "not_found",
                    "sync_status": "unknown"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def _get_user_patterns(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all registered patterns for a user"""
        try:
            pattern_ids = await self.redis_client.smembers(f"user_patterns:{user_id}")
            patterns = []
            
            for pattern_id in pattern_ids:
                pattern_data = await self.redis_client.get(f"pattern:{pattern_id.decode()}")
                if pattern_data:
                    decrypted_data = self.encryption_key.decrypt(pattern_data)
                    pattern = json.loads(decrypted_data.decode())
                    patterns.append(pattern)
            
            return patterns
            
        except Exception as e:
            raise Exception(f"Failed to get user patterns: {str(e)}")
    
    async def _compare_signatures(
        self, 
        new_signature: Dict[str, Any], 
        stored_patterns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compare new signature with stored patterns"""
        best_match = {"confidence": 0.0, "pattern_id": None}
        
        for pattern in stored_patterns:
            # Simple similarity calculation (in production, use ML model)
            similarity = await self._calculate_similarity(
                new_signature, 
                pattern["features"]
            )
            
            if similarity > best_match["confidence"]:
                best_match = {
                    "confidence": similarity,
                    "pattern_id": pattern["pattern_id"]
                }
        
        return best_match
    
    async def _calculate_similarity(
        self, 
        sig1: Dict[str, Any], 
        sig2: Dict[str, Any]
    ) -> float:
        """Calculate similarity between two signatures"""
        # Simplified similarity calculation
        # In production, this would use sophisticated ML algorithms
        
        if not sig1.get("features") or not sig2.get("features"):
            return 0.0
        
        # Mock similarity calculation
        return min(sig1.get("confidence", 0), sig2.get("confidence", 0)) * 0.9
    
    async def _generate_session_token(self, user_id: str) -> str:
        """Generate session token for authenticated user"""
        session_data = {
            "user_id": user_id,
            "issued_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        token = base64.urlsafe_b64encode(
            json.dumps(session_data).encode()
        ).decode()
        
        # Store session
        await self.redis_client.setex(
            f"session:{token}",
            timedelta(hours=24).total_seconds(),
            json.dumps(session_data)
        )
        
        return token
    
    async def _sync_to_pinksync_network(self, data_id: str, data: Dict[str, Any]):
        """Sync data to PinkSync network (simulated)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.pinksync_endpoint}/sync",
                    json={
                        "id": data_id,
                        "data": data,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    timeout=10.0
                )
                
                if response.status_code != 200:
                    # Log error but don't fail the operation
                    print(f"PinkSync network sync failed: {response.status_code}")
                    
        except Exception as e:
            # Log error but don't fail the operation
            print(f"PinkSync network sync error: {str(e)}")


class MCPContextSync:
    """MCP context synchronization using PinkSync"""
    
    def __init__(self, user_id: str, domain: str):
        self.user_id = user_id
        self.domain = domain
        self.redis_client = None
        self.context_key = f"mcp_context:{user_id}:{domain}"
        
    async def initialize(self):
        """Initialize MCP context sync"""
        self.redis_client = await aioredis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379")
        )
    
    async def persist_context(self, context_update: Dict[str, Any]):
        """Persist context update to PinkSync network"""
        if not self.redis_client:
            await self.initialize()
        
        try:
            # Store context update
            context_data = {
                "user_id": self.user_id,
                "domain": self.domain,
                "context": context_update,
                "timestamp": datetime.utcnow().isoformat(),
                "version": await self._get_next_version()
            }
            
            await self.redis_client.setex(
                self.context_key,
                timedelta(days=30).total_seconds(),
                json.dumps(context_data)
            )
            
            # Sync to PinkSync network
            await self._sync_context_to_network(context_data)
            
        except Exception as e:
            raise Exception(f"Failed to persist context: {str(e)}")
    
    async def retrieve_latest_context(self) -> Optional[Dict[str, Any]]:
        """Retrieve latest context from PinkSync network"""
        if not self.redis_client:
            await self.initialize()
        
        try:
            # Get from local cache first
            cached_context = await self.redis_client.get(self.context_key)
            
            if cached_context:
                return json.loads(cached_context.decode())
            
            # If not in cache, try to sync from network
            network_context = await self._sync_context_from_network()
            
            if network_context:
                # Cache the retrieved context
                await self.redis_client.setex(
                    self.context_key,
                    timedelta(days=30).total_seconds(),
                    json.dumps(network_context)
                )
                
            return network_context
            
        except Exception as e:
            raise Exception(f"Failed to retrieve context: {str(e)}")
    
    async def _get_next_version(self) -> int:
        """Get next version number for context"""
        version_key = f"{self.context_key}:version"
        current_version = await self.redis_client.get(version_key)
        
        if current_version:
            next_version = int(current_version.decode()) + 1
        else:
            next_version = 1
        
        await self.redis_client.set(version_key, next_version)
        return next_version
    
    async def _sync_context_to_network(self, context_data: Dict[str, Any]):
        """Sync context to PinkSync network"""
        # Simulated network sync
        pass
    
    async def _sync_context_from_network(self) -> Optional[Dict[str, Any]]:
        """Sync context from PinkSync network"""
        # Simulated network retrieval
        return None
