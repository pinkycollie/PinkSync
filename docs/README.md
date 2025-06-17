# DEAF FIRST Platform Documentation

Welcome to the comprehensive documentation for the DEAF FIRST Platform - a revolutionary monorepo architecture designed specifically for deaf accessibility.

## 🎯 Platform Overview

The DEAF FIRST Platform is built on the principle that accessibility should be the foundation, not an afterthought. Every component, service, and interface is designed with deaf users as the primary consideration.

## 📁 Directory Structure

### Apps (`/apps/`)
- **360magicians/** - Business services platform with ASL support
- **pinksync/** - Neural network platform with visual processing
- **mbtq-financial/** - Financial services with ASL video banking
- **personal-business/** - Deaf entrepreneur business portal
- **admin-portal/** - Cross-platform administration tools

### Services (`/services/`)
- **ai-service/** - GPT workflows with ASL processing
- **user-service/** - Authentication with visual verification
- **content-service/** - ASL transcription and content management
- **vr-service/** - VR environments with haptic feedback

### Core (`/core/`)
- **schemas/** - Central data structure definitions
- **utils/** - Shared utilities for deaf accessibility
- **shared/** - Reusable components and templates

## 🚀 Quick Start

1. **Setup the monorepo structure:**
   \`\`\`bash
   npm run setup
   \`\`\`

2. **Install all dependencies:**
   \`\`\`bash
   npm run install-all
   \`\`\`

3. **Start all services:**
   \`\`\`bash
   npm start
   \`\`\`

4. **Start individual services:**
   \`\`\`bash
   npm run pinksync      # PinkSync Neural Network
   npm run 360magicians  # 360 Magicians Business
   npm run mbtq          # MBTQ Financial
   npm run business      # Personal Business
   npm run admin         # Admin Portal
   \`\`\`

## ♿ Accessibility Features

- **WCAG AAA Compliance** - Exceeds accessibility standards
- **Native ASL Support** - Built-in sign language interpretation
- **Visual-First Design** - No audio dependencies
- **High Contrast Themes** - Optimized for visual clarity
- **Vibration Feedback** - Haptic communication support
- **Screen Reader Optimization** - Full assistive technology support

## 🏗️ Architecture Principles

1. **Deaf-First Design** - Accessibility is the foundation
2. **Modular Independence** - Services operate independently
3. **Shared Core** - Common utilities ensure consistency
4. **Visual Priority** - Interface design prioritizes visual communication
5. **AI Integration** - Intelligent assistance with deaf optimization

## 📊 Service Ports

- **360 Magicians Frontend**: http://localhost:3001
- **PinkSync Frontend**: http://localhost:3002
- **MBTQ Financial Frontend**: http://localhost:3003
- **Personal Business Frontend**: http://localhost:3004
- **Admin Portal**: http://localhost:3005
- **AI Service**: http://localhost:8001
- **User Service**: http://localhost:8002
- **Content Service**: http://localhost:8003
- **VR Service**: http://localhost:8004

## 🔧 Development

Each service includes comprehensive accessibility testing and deaf-first optimization tools. All components are designed to work seamlessly together while maintaining independence.

For detailed documentation on each service, see the respective directories in `/docs/`.
