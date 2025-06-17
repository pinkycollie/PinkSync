#!/bin/bash

# Complete PinkSync Ecosystem Deployment Script
set -e

echo "🚀 Starting complete PinkSync ecosystem deployment..."

# Configuration
PROJECT_ID=${1:-"pinksync-ecosystem-prod"}
ENVIRONMENT=${2:-"prod"}
REGION=${3:-"us-central1"}

# Validate required environment variables
if [ -z "$DB_PASSWORD" ]; then
  echo "❌ DB_PASSWORD environment variable is required"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET environment variable is required"
  exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ OPENAI_API_KEY environment variable is required"
  exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Environment: $ENVIRONMENT"
echo "  Region: $REGION"
echo "  Domains: pinksync.io, auth.pinksync.io, trust.pinksync.io, app.pinksync.io, api.pinksync.io, docs.pinksync.io"

# Set GCP project
gcloud config set project $PROJECT_ID

# Run the TypeScript deployment script
echo "🔧 Running deployment automation..."
npx ts-node infrastructure/scripts/production-deploy.ts $PROJECT_ID $ENVIRONMENT $REGION

echo "✅ Deployment completed!"
echo ""
echo "🔗 Your PinkSync ecosystem is now available at:"
echo "  Main Site: https://pinksync.io"
echo "  Application: https://app.pinksync.io"
echo "  Authentication: https://auth.pinksync.io"
echo "  Trust System: https://trust.pinksync.io"
echo "  API Gateway: https://api.pinksync.io"
echo "  Documentation: https://docs.pinksync.io"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain registrar's name servers (see output above)"
echo "2. Wait 5-10 minutes for SSL certificates to become active"
echo "3. Test all endpoints for functionality"
echo "4. Set up monitoring and alerting"
echo ""
echo "🔍 Monitor deployment status:"
echo "  kubectl get pods -n pinksync"
echo "  kubectl get services -n pinksync"
echo "  kubectl get ingress -n pinksync"
