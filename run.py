#!/usr/bin/env python3
"""
DEAF FIRST Platform - Main Entry Point
Comprehensive monorepo launcher with deaf accessibility prioritization
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path
from config.settings import PLATFORM_CONFIG
from core.utils.deaf_accessibility import DeafAccessibilityChecker
from core.utils.access_control import RoleManager

class DeafFirstPlatform:
    def __init__(self):
        self.root_path = Path(__file__).parent
        self.accessibility_checker = DeafAccessibilityChecker()
        self.role_manager = RoleManager()
        
    def start_service(self, service_name, environment="development"):
        """Start a specific service with deaf accessibility checks"""
        print(f"🚀 Starting {service_name} with DEAF-FIRST accessibility...")
        
        # Pre-flight accessibility check
        if not self.accessibility_checker.verify_service_accessibility(service_name):
            print(f"❌ Accessibility check failed for {service_name}")
            return False
            
        service_configs = {
            "360magicians": {
                "frontend": "apps/360magicians/frontend",
                "backend": "apps/360magicians/backend",
                "port": 3001
            },
            "pinksync": {
                "frontend": "apps/pinksync/frontend", 
                "backend": "apps/pinksync/backend",
                "port": 3002
            },
            "mbtq-financial": {
                "frontend": "apps/mbtq-financial/frontend",
                "backend": "apps/mbtq-financial/backend", 
                "video-chat": "apps/mbtq-financial/video-chat",
                "port": 3003
            },
            "personal-business": {
                "frontend": "apps/personal-business/frontend",
                "backend": "apps/personal-business/backend",
                "port": 3004
            },
            "admin-portal": {
                "dashboard": "apps/admin-portal/dashboard",
                "port": 3005
            }
        }
        
        if service_name not in service_configs:
            print(f"❌ Unknown service: {service_name}")
            return False
            
        config = service_configs[service_name]
        
        # Start backend if exists
        if "backend" in config:
            backend_path = self.root_path / config["backend"]
            if backend_path.exists():
                print(f"🔧 Starting {service_name} backend...")
                subprocess.Popen([
                    "python", "-m", "uvicorn", "main:app", 
                    "--reload", "--host", "0.0.0.0", 
                    "--port", str(config["port"] + 1000)
                ], cwd=backend_path)
        
        # Start frontend
        if "frontend" in config:
            frontend_path = self.root_path / config["frontend"]
            if frontend_path.exists():
                print(f"🎨 Starting {service_name} frontend...")
                subprocess.Popen([
                    "npm", "run", "dev", "--", 
                    "--port", str(config["port"])
                ], cwd=frontend_path)
        
        # Start video chat if exists (MBTQ Financial)
        if "video-chat" in config:
            video_path = self.root_path / config["video-chat"]
            if video_path.exists():
                print(f"📹 Starting ASL video chat system...")
                subprocess.Popen([
                    "npm", "run", "start:video"
                ], cwd=video_path)
        
        print(f"✅ {service_name} started successfully!")
        print(f"🌐 Frontend: http://localhost:{config['port']}")
        if "backend" in config:
            print(f"🔧 Backend: http://localhost:{config['port'] + 1000}")
        
        return True
    
    def start_all_services(self):
        """Start all services in the correct order"""
        print("🚀 Starting DEAF FIRST Platform - All Services")
        
        # Start shared services first
        shared_services = [
            "ai-service",
            "user-service", 
            "content-service",
            "vr-service"
        ]
        
        for service in shared_services:
            self.start_shared_service(service)
        
        # Start application services
        app_services = [
            "pinksync",
            "360magicians", 
            "mbtq-financial",
            "personal-business",
            "admin-portal"
        ]
        
        for service in app_services:
            self.start_service(service)
        
        print("\n🎉 DEAF FIRST Platform fully operational!")
        print("📋 Service Status Dashboard: http://localhost:3005")
        
    def start_shared_service(self, service_name):
        """Start shared microservices"""
        service_path = self.root_path / "services" / service_name
        if service_path.exists():
            print(f"⚙️ Starting shared service: {service_name}")
            subprocess.Popen([
                "python", "-m", "uvicorn", "main:app", 
                "--reload", "--host", "0.0.0.0"
            ], cwd=service_path)

def main():
    parser = argparse.ArgumentParser(description="DEAF FIRST Platform Launcher")
    parser.add_argument("--service", help="Start specific service")
    parser.add_argument("--all", action="store_true", help="Start all services")
    parser.add_argument("--environment", default="development", help="Environment")
    
    args = parser.parse_args()
    
    platform = DeafFirstPlatform()
    
    if args.all:
        platform.start_all_services()
    elif args.service:
        platform.start_service(args.service, args.environment)
    else:
        print("🎯 DEAF FIRST Platform")
        print("Available commands:")
        print("  python run.py --all                    # Start all services")
        print("  python run.py --service pinksync       # Start PinkSync")
        print("  python run.py --service 360magicians   # Start 360 Magicians")
        print("  python run.py --service mbtq-financial # Start MBTQ Financial")
        print("  python run.py --service personal-business # Start Personal Business")
        print("  python run.py --service admin-portal   # Start Admin Portal")

if __name__ == "__main__":
    main()
