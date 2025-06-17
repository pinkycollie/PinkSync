#!/bin/bash

echo "🚀 Setting up DEAF FIRST Platform - Complete Monorepo Structure"

# Create main directory structure
mkdir -p deaf-first-monorepo

cd deaf-first-monorepo

# Apps directory - User-facing applications
echo "📱 Creating apps directory structure..."
mkdir -p apps/360magicians/{frontend,backend}
mkdir -p apps/pinksync/{frontend,backend}
mkdir -p apps/mbtq-financial/{frontend,backend,video-chat}
mkdir -p apps/personal-business/{frontend,backend}
mkdir -p apps/admin-portal/dashboard

# Services directory - Shared microservices
echo "⚙️ Creating services directory structure..."
mkdir -p services/ai-service/{prompt-templates,model-interfaces,recommendation-engine}
mkdir -p services/user-service/{authentication,profiles}
mkdir -p services/content-service/{upload,transcription,analytics}
mkdir -p services/vr-service/{coach-tools,scene-management}

# Core directory - Shared core functionality
echo "🔧 Creating core directory structure..."
mkdir -p core/schemas
mkdir -p core/utils
mkdir -p core/shared/{templates,static,components,translations}

# Connectors directory - Integration connectors
echo "🔌 Creating connectors directory structure..."
mkdir -p connectors/{pinksync_neural,financial_apis,vr_systems}

# Config directory - Configuration management
echo "⚙️ Creating config directory structure..."
mkdir -p config/environments

# Docs directory - Documentation
echo "📚 Creating docs directory structure..."
mkdir -p docs/{asl_videos,developer_guides,user_guides}

# Infrastructure directory - Infrastructure as code
echo "🏗️ Creating infrastructure directory structure..."
mkdir -p infrastructure/{docker,kubernetes,ci_cd}

# Tools directory - Developer tools
echo "🛠️ Creating tools directory structure..."
mkdir -p tools/{cli,scripts}

echo "✅ Complete monorepo structure created successfully!"
echo "📁 Directory structure ready for DEAF FIRST Platform development"
