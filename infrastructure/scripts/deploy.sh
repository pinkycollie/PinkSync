#!/bin/bash

# PINKSYNC Ecosystem Deployment Script
set -e

echo "🚀 Deploying PINKSYNC Ecosystem to GCP..."

# Configuration
PROJECT_ID=${1:-"your-project-id"}
ENVIRONMENT=${2:-"dev"}
REGION=${3:-"us-central1"}

echo "Project: $PROJECT_ID"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"

# Set GCP project
gcloud config set project $PROJECT_ID

# Build and push Docker images
echo "📦 Building and pushing Docker images..."

# Build DeafAuth
docker build -t gcr.io/$PROJECT_ID/deafauth:latest -f infrastructure/docker/Dockerfile.deafauth .
docker push gcr.io/$PROJECT_ID/deafauth:latest

# Build PinkSync Frontend
docker build -t gcr.io/$PROJECT_ID/pinksync-frontend:latest -f infrastructure/docker/Dockerfile.frontend .
docker push gcr.io/$PROJECT_ID/pinksync-frontend:latest

# Build PinkSync API
docker build -t gcr.io/$PROJECT_ID/pinksync-api:latest -f infrastructure/docker/Dockerfile.api .
docker push gcr.io/$PROJECT_ID/pinksync-api:latest

# Build FibonRose
docker build -t gcr.io/$PROJECT_ID/fibonrose:latest -f infrastructure/docker/Dockerfile.fibonrose .
docker push gcr.io/$PROJECT_ID/fibonrose:latest

# Deploy infrastructure with Terraform
echo "🏗️ Deploying infrastructure..."
cd infrastructure/terraform
terraform init
terraform plan -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT"
terraform apply -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT" -auto-approve

# Get cluster credentials
echo "🔑 Getting cluster credentials..."
gcloud container clusters get-credentials pinksync-cluster-$ENVIRONMENT --region=$REGION

# Apply Kubernetes manifests
echo "☸️ Deploying to Kubernetes..."
cd ../kubernetes

# Replace placeholders in manifests
sed -i "s/PROJECT_ID/$PROJECT_ID/g" *.yaml
sed -i "s/\${ENVIRONMENT}/$ENVIRONMENT/g" *.yaml

# Apply manifests
kubectl apply -f namespace.yaml
kubectl apply -f deafauth-deployment.yaml
kubectl apply -f pinksync-deployment.yaml
kubectl apply -f fibonrose-deployment.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/deafauth-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/pinksync-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/fibonrose-deployment -n pinksync

# Get service endpoints
echo "🌐 Service endpoints:"
kubectl get services -n pinksync

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Access your services:"
echo "PinkSync Frontend: http://$(kubectl get service pinksync-frontend-service -n pinksync -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
echo "DeafAuth API: http://$(kubectl get service deafauth-service -n pinksync -o jsonpath='{.spec.clusterIP}')"
echo "FibonRose API: http://$(kubectl get service fibonrose-service -n pinksync -o jsonpath='{.spec.clusterIP}')"
