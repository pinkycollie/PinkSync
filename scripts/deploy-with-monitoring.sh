#!/bin/bash

# Complete deployment script with Redis and monitoring
set -e

echo "🚀 Deploying PinkSync ecosystem with Redis and monitoring..."

# Configuration
PROJECT_ID=${1:-"pinksync-ecosystem-prod"}
ENVIRONMENT=${2:-"prod"}
REGION=${3:-"us-central1"}

echo "📋 Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Environment: $ENVIRONMENT"
echo "  Region: $REGION"
echo "  Redis: Upstash (bright-shiner-48489.upstash.io)"

# Validate environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "OPENAI_API_KEY" "REDIS_TOKEN")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ $var environment variable is required"
    exit 1
  fi
done

# Set GCP project
gcloud config set project $PROJECT_ID

# Generate production configuration
echo "⚙️ Generating production configuration..."
npx ts-node infrastructure/scripts/production-config.ts

# Deploy infrastructure
echo "🏗️ Deploying infrastructure..."
cd infrastructure/terraform
terraform init
terraform plan -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT"
terraform apply -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT" -auto-approve
cd ../..

# Build and push images
echo "📦 Building and pushing images..."
docker build -t gcr.io/$PROJECT_ID/deafauth:latest -f infrastructure/docker/Dockerfile.deafauth .
docker build -t gcr.io/$PROJECT_ID/pinksync-frontend:latest -f infrastructure/docker/Dockerfile.frontend .
docker build -t gcr.io/$PROJECT_ID/pinksync-api:latest -f infrastructure/docker/Dockerfile.api .
docker build -t gcr.io/$PROJECT_ID/fibonrose:latest -f infrastructure/docker/Dockerfile.fibonrose .
docker build -t gcr.io/$PROJECT_ID/pinksync-docs:latest -f infrastructure/docker/Dockerfile.docs .

docker push gcr.io/$PROJECT_ID/deafauth:latest
docker push gcr.io/$PROJECT_ID/pinksync-frontend:latest
docker push gcr.io/$PROJECT_ID/pinksync-api:latest
docker push gcr.io/$PROJECT_ID/fibonrose:latest
docker push gcr.io/$PROJECT_ID/pinksync-docs:latest

# Get cluster credentials
echo "🔑 Getting cluster credentials..."
gcloud container clusters get-credentials pinksync-cluster-$ENVIRONMENT --region=$REGION

# Create secrets with Redis configuration
echo "🔐 Creating Kubernetes secrets..."
kubectl create secret generic pinksync-secrets \
  --from-literal=DATABASE_URL="postgresql://pinksync:$DB_PASSWORD@pinksync-db-$ENVIRONMENT:5432/pinksync" \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY" \
  --from-literal=DEAF_AUTH_API_KEY="df_t7zxjxgnnan1ytuvhyoj4e" \
  --from-literal=REDIS_URL="redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379" \
  --from-literal=REDIS_TOKEN="$REDIS_TOKEN" \
  -n pinksync --dry-run=client -o yaml | kubectl apply -f -

# Deploy monitoring stack
echo "📊 Deploying monitoring stack..."
kubectl apply -f infrastructure/monitoring/complete-monitoring.yaml

# Deploy Redis configuration
echo "🔴 Deploying Redis configuration..."
kubectl apply -f infrastructure/kubernetes/redis-config.yaml

# Deploy main application
echo "☸️ Deploying main application..."
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/deafauth-deployment.yaml
kubectl apply -f infrastructure/kubernetes/pinksync-deployment.yaml
kubectl apply -f infrastructure/kubernetes/fibonrose-deployment.yaml
kubectl apply -f infrastructure/kubernetes/ingress.yaml

# Wait for deployments
echo "⏳ Waiting for deployments..."
kubectl wait --for=condition=available --timeout=300s deployment/deafauth-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/pinksync-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/fibonrose-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring

# Test Redis connection
echo "🔴 Testing Redis connection..."
kubectl run redis-test --image=redis:7-alpine --rm -i --tty -- redis-cli -h bright-shiner-48489.upstash.io -p 6379 -a Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA ping

# Get service information
echo "🌐 Service endpoints:"
kubectl get services -n pinksync
kubectl get services -n monitoring

# Get monitoring URLs
GRAFANA_IP=$(kubectl get service grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
PROMETHEUS_IP=$(kubectl get service prometheus -n monitoring -o jsonpath='{.spec.clusterIP}')

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Access your services:"
echo "  Main Site: https://pinksync.io"
echo "  Application: https://app.pinksync.io"
echo "  Authentication: https://auth.pinksync.io"
echo "  Trust System: https://trust.pinksync.io"
echo "  API Gateway: https://api.pinksync.io"
echo "  Documentation: https://docs.pinksync.io"
echo ""
echo "📊 Monitoring:"
echo "  Grafana: http://$GRAFANA_IP:3000 (admin/pinksync_admin_2024)"
echo "  Prometheus: http://$PROMETHEUS_IP:9090"
echo ""
echo "🔴 Redis:"
echo "  Host: bright-shiner-48489.upstash.io:6379"
echo "  Status: Connected and tested"
echo ""
echo "📋 Next steps:"
echo "1. Update domain registrar with GCP name servers"
echo "2. Wait for SSL certificates to become active"
echo "3. Configure monitoring alerts"
echo "4. Test all API endpoints"
