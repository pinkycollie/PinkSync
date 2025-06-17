"""
360 Magicians MCP Server Setup Script
Based on the FastAPI MCP pattern from tadata-org/fastapi_mcp
"""

import json
from typing import Dict, List, Any

def generate_mcp_manifest():
    """Generate MCP manifest for 360 Magicians pathways"""
    
    # Define the three pathways and their tools
    pathways = {
        "job": {
            "description": "Career development and job training pathway",
            "tools": [
                {
                    "name": "job_idea_intake",
                    "description": "Submit job-focused idea for career assessment",
                    "endpoint": "/api/idea/intake",
                    "method": "POST",
                    "parameters": {
                        "title": {"type": "string", "required": True},
                        "description": {"type": "string", "required": True},
                        "career_focus": {"type": "string", "required": True}
                    }
                },
                {
                    "name": "job_readiness_check", 
                    "description": "Check job readiness and skill assessment",
                    "endpoint": "/api/idea/readiness-check",
                    "method": "GET",
                    "parameters": {
                        "user_id": {"type": "string", "required": True}
                    }
                },
                {
                    "name": "job_vr_eligibility",
                    "description": "Check VR4Deaf job training eligibility", 
                    "endpoint": "/api/idea/vr/eligibility-check",
                    "method": "GET",
                    "parameters": {
                        "user_id": {"type": "string", "required": True}
                    }
                }
            ]
        },
        "business": {
            "description": "Business development and growth pathway",
            "tools": [
                {
                    "name": "business_project_init",
                    "description": "Initialize new business project",
                    "endpoint": "/api/build/project-init", 
                    "method": "POST",
                    "parameters": {
                        "project_name": {"type": "string", "required": True},
                        "business_type": {"type": "string", "required": True},
                        "target_market": {"type": "string", "required": True}
                    }
                },
                {
                    "name": "business_subscription_create",
                    "description": "Create business subscription plan",
                    "endpoint": "/api/grow/subscription/create",
                    "method": "POST", 
                    "parameters": {
                        "plan_name": {"type": "string", "required": True},
                        "price": {"type": "number", "required": True},
                        "features": {"type": "array", "required": True}
                    }
                },
                {
                    "name": "business_marketing_videos",
                    "description": "Generate marketing videos for business",
                    "endpoint": "/api/grow/marketing/videos",
                    "method": "POST",
                    "parameters": {
                        "business_id": {"type": "string", "required": True},
                        "video_type": {"type": "string", "required": True},
                        "duration": {"type": "number", "required": False}
                    }
                }
            ]
        },
        "self": {
            "description": "Personal development and self-improvement pathway", 
            "tools": [
                {
                    "name": "self_user_profile",
                    "description": "Create and manage personal user profile",
                    "endpoint": "/api/idea/user-profile",
                    "method": "POST",
                    "parameters": {
                        "name": {"type": "string", "required": True},
                        "goals": {"type": "array", "required": True},
                        "interests": {"type": "array", "required": False}
                    }
                },
                {
                    "name": "self_progress_track",
                    "description": "Track personal development progress",
                    "endpoint": "/api/manage/progress/track",
                    "method": "GET",
                    "parameters": {
                        "user_id": {"type": "string", "required": True},
                        "timeframe": {"type": "string", "required": False}
                    }
                },
                {
                    "name": "self_ai_chat",
                    "description": "Personal AI assistant for self-development",
                    "endpoint": "/api/manage/ai/chat",
                    "method": "POST",
                    "parameters": {
                        "message": {"type": "string", "required": True},
                        "context": {"type": "string", "required": False}
                    }
                }
            ]
        }
    }
    
    # Generate MCP manifest
    mcp_manifest = {
        "name": "360-magicians-mcp",
        "version": "1.0.0", 
        "description": "360 Magicians MCP Server - Job, Business, and Self pathways",
        "server": {
            "url": "https://api.mbtquniverse.com",
            "auth": {
                "oauth2": True,
                "web3_wallet": True,
                "api_key": True
            }
        },
        "pathways": pathways,
        "tools": []
    }
    
    # Flatten all tools into main tools array
    for pathway_name, pathway_data in pathways.items():
        for tool in pathway_data["tools"]:
            tool["pathway"] = pathway_name
            mcp_manifest["tools"].append(tool)
    
    return mcp_manifest

def generate_fastapi_mcp_config():
    """Generate FastAPI MCP configuration similar to tadata-org/fastapi_mcp"""
    
    config = {
        "fastapi_mcp": {
            "server_name": "360-magicians-mcp",
            "description": "360 Magicians API exposed as MCP tools",
            "version": "1.0.0",
            "base_url": "https://api.mbtquniverse.com",
            "auth": {
                "enabled": True,
                "methods": ["oauth2", "api_key", "web3_wallet"]
            },
            "pathways": {
                "job": {
                    "prefix": "/job",
                    "description": "Career and job training tools",
                    "color": "#3B82F6"
                },
                "business": {
                    "prefix": "/business", 
                    "description": "Business development tools",
                    "color": "#10B981"
                },
                "self": {
                    "prefix": "/self",
                    "description": "Personal development tools", 
                    "color": "#8B5CF6"
                }
            },
            "features": {
                "web3_integration": True,
                "hybrid_storage": True,
                "ai_processing": True,
                "vr4deaf_support": True
            }
        }
    }
    
    return config

def main():
    """Main setup function"""
    print("🚀 Setting up 360 Magicians MCP Server...")
    
    # Generate MCP manifest
    print("📋 Generating MCP manifest...")
    manifest = generate_mcp_manifest()
    
    print(f"✅ Generated manifest with {len(manifest['tools'])} tools across 3 pathways:")
    for pathway_name, pathway_data in manifest['pathways'].items():
        tool_count = len(pathway_data['tools'])
        print(f"   - {pathway_name.capitalize()}: {tool_count} tools")
    
    # Generate FastAPI MCP config
    print("\n⚙️  Generating FastAPI MCP configuration...")
    config = generate_fastapi_mcp_config()
    
    print("✅ Configuration generated with features:")
    for feature, enabled in config['fastapi_mcp']['features'].items():
        status = "✓" if enabled else "✗"
        print(f"   {status} {feature.replace('_', ' ').title()}")
    
    # Save configurations
    print("\n💾 Saving configuration files...")
    
    with open('mcp_manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    print("   - mcp_manifest.json")
    
    with open('fastapi_mcp_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    print("   - fastapi_mcp_config.json")
    
    print("\n🎉 360 Magicians MCP Server setup complete!")
    print("\n📖 Next steps:")
    print("   1. Install fastapi-mcp: pip install fastapi-mcp")
    print("   2. Configure authentication endpoints")
    print("   3. Deploy MCP server alongside your existing API")
    print("   4. Test tools with Claude, Cursor, or other MCP clients")
    
    return manifest, config

if __name__ == "__main__":
    manifest, config = main()
