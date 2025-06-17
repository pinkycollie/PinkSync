# PINKSYNC Ecosystem Deployment Guide

## Overview

This guide covers deploying the complete PINKSYNC ecosystem (PinkSync, DeafAuth, and FibonRose) to Google Cloud Platform using Kubernetes, with local development support via Docker Compose.

## Architecture

### Services
- **DeafAuth**: Authentication and user management service
- **PinkSync Core**: Main platform with Next.js frontend and FastAPI backend
- **FibonRose**: Trust verification and badge management service
- **AI Processor**: Machine learning and video processing service

### Infrastructure
- **GKE**: Kubernetes cluster for container orchestration
- **Cloud SQL**: PostgreSQL database with existing schema integration
- **Redis**: Caching and session management
- **Cloud Storage**: File and video storage
- **Cloud Run**: Serverless components

## Prerequisites

### Required Tools
\`\`\`bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Install kubectl
gcloud components install kubectl

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
\`\`\`

### GCP Setup
\`\`\`bash
# Create new project
gcloud projects create pinksync-ecosystem-prod

# Set billing account
gcloud billing projects link pinksync-ecosystem-prod --billing-account=YOUR_BILLING_ACCOUNT

# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable sql.googleapis.com
gcloud services enable redis.googleapis.com
\`\`\`

## Local Development

### Quick Start
\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/pinksync-platform.git
cd pinksync-platform

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Run database migration
docker-compose exec postgres psql -U pinksync -d pinksync -f /docker-entrypoint-initdb.d/init.sql

# Check service health
curl http://localhost:8001/health  # DeafAuth
curl http://localhost:8002/api/py/health  # PinkSync API
curl http://localhost:8003/health  # FibonRose
curl http://localhost:3000  # Frontend
\`\`\`

### Service URLs (Local)
- **Frontend**: http://localhost:3000
- **DeafAuth API**: http://localhost:8001
- **PinkSync API**: http://localhost:8002
- **FibonRose API**: http://localhost:8003
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Production Deployment

### 1. Infrastructure Setup
\`\`\`bash
# Navigate to terraform directory
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="project_id=pinksync-ecosystem-prod" -var="environment=prod"

# Apply infrastructure
terraform apply -var="project_id=pinksync-ecosystem-prod" -var="environment=prod"
\`\`\`

### 2. Automated Deployment
\`\`\`bash
# Make deployment script executable
chmod +x infrastructure/scripts/deploy.sh

# Deploy to production
./infrastructure/scripts/deploy.sh pinksync-ecosystem-prod prod us-central1

# Deploy to staging
./infrastructure/scripts/deploy.sh pinksync-ecosystem-staging staging us-central1
\`\`\`

### 3. Manual Deployment Steps

#### Build and Push Images
\`\`\`bash
# Set project
export PROJECT_ID=pinksync-ecosystem-prod

# Build all images
docker build -t gcr.io/$PROJECT_ID/deafauth:latest -f infrastructure/docker/Dockerfile.deafauth .
docker build -t gcr.io/$PROJECT_ID/pinksync-frontend:latest -f infrastructure/docker/Dockerfile.frontend .
docker build -t gcr.io/$PROJECT_ID/pinksync-api:latest -f infrastructure/docker/Dockerfile.api .
docker build -t gcr.io/$PROJECT_ID/fibonrose:latest -f infrastructure/docker/Dockerfile.fibonrose .

# Push to registry
docker push gcr.io/$PROJECT_ID/deafauth:latest
docker push gcr.io/$PROJECT_ID/pinksync-frontend:latest
docker push gcr.io/$PROJECT_ID/pinksync-api:latest
docker push gcr.io/$PROJECT_ID/fibonrose:latest
\`\`\`

#### Deploy to Kubernetes
\`\`\`bash
# Get cluster credentials
gcloud container clusters get-credentials pinksync-cluster-prod --region=us-central1

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/deafauth-deployment.yaml
kubectl apply -f infrastructure/kubernetes/pinksync-deployment.yaml
kubectl apply -f infrastructure/kubernetes/fibonrose-deployment.yaml

# Check deployment status
kubectl get deployments -n pinksync
kubectl get services -n pinksync
kubectl get pods -n pinksync

# Wait for all deployments to be ready
kubectl wait --for=condition=available --timeout=300s deployment/deafauth-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/pinksync-deployment -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment/fibonrose-deployment -n pinksync
\`\`\`

## Database Migration

### Run Migration on Existing Database
\`\`\`bash
# Connect to your existing database
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME

# Run the migration script
\i scripts/database-migration.sql

# Verify new tables
\dt

# Check existing data integration
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM videos;
SELECT COUNT(*) FROM trust_badges;
\`\`\`

### Migrate Existing Data
\`\`\`sql
-- Update existing profiles with PINKSYNC defaults
UPDATE profiles SET 
  sign_language = 'asl',
  accessibility_preferences = '{"high_contrast": false, "large_text": false, "animation_reduction": false, "vibration_feedback": true}',
  verification_status = 'pending',
  trust_score = 0
WHERE sign_language IS NULL;

-- Link existing deaf_creator records to profiles
UPDATE deaf_creator 
SET profile_id = profiles.id 
FROM profiles 
WHERE profiles.email IS NOT NULL;
\`\`\`

## Configuration Management

### Environment Variables
\`\`\`bash
# Production environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/pinksync"
export REDIS_URL="redis://redis-host:6379"
export JWT_SECRET="your-production-jwt-secret"
export OPENAI_API_KEY="your-openai-api-key"
export GOOGLE_CLOUD_PROJECT="pinksync-ecosystem-prod"
export STORAGE_BUCKET="pinksync-storage-prod"
export VIDEOS_BUCKET="pinksync-videos-prod"
\`\`\`

### Kubernetes Secrets
\`\`\`bash
# Create secrets
kubectl create secret generic pinksync-secrets \
  --from-literal=DATABASE_PASSWORD="your-db-password" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=OPENAI_API_KEY="your-openai-key" \
  -n pinksync

# Verify secrets
kubectl get secrets -n pinksync
\`\`\`

## Monitoring and Maintenance

### Health Checks
\`\`\`bash
# Check all service health
curl https://your-frontend-ip/api/health
curl https://deafauth-service/health
curl https://pinksync-api-service/api/py/health
curl https://fibonrose-service/health
\`\`\`

### Logs and Debugging
\`\`\`bash
# View logs for specific services
kubectl logs -f deployment/deafauth-deployment -n pinksync
kubectl logs -f deployment/pinksync-deployment -n pinksync
kubectl logs -f deployment/fibonrose-deployment -n pinksync

# Debug pod issues
kubectl describe pod POD_NAME -n pinksync
kubectl exec -it POD_NAME -n pinksync -- /bin/bash
\`\`\`

### Scaling
\`\`\`bash
# Scale deployments
kubectl scale deployment deafauth-deployment --replicas=5 -n pinksync
kubectl scale deployment pinksync-deployment --replicas=3 -n pinksync
kubectl scale deployment fibonrose-deployment --replicas=3 -n pinksync

# Enable horizontal pod autoscaling
kubectl autoscale deployment deafauth-deployment --cpu-percent=70 --min=2 --max=10 -n pinksync
\`\`\`

## Security Considerations

### Network Security
- All services communicate within the cluster network
- External access only through load balancers
- Database and Redis are not publicly accessible
- TLS encryption for all external traffic

### Data Protection
- Database encryption at rest
- Redis AUTH enabled in production
- Secrets stored in Kubernetes secrets
- Regular security updates for base images

### Access Control
- RBAC enabled on GKE cluster
- Service accounts with minimal permissions
- Network policies for pod-to-pod communication
- Regular security audits

## Backup and Disaster Recovery

### Database Backups
\`\`\`bash
# Automated backups are configured in Terraform
# Manual backup
gcloud sql backups create --instance=pinksync-db-prod

# Restore from backup
gcloud sql backups restore BACKUP_ID --restore-instance=pinksync-db-prod
\`\`\`

### Application Backups
\`\`\`bash
# Backup application data
kubectl create backup pinksync-backup --include-namespaces=pinksync

# Restore application
kubectl restore pinksync-backup
\`\`\`

## Troubleshooting

### Common Issues

#### Database Connection Issues
\`\`\`bash
# Check database connectivity
kubectl exec -it deployment/pinksync-deployment -n pinksync -- python -c "
import psycopg2
conn = psycopg2.connect('postgresql://user:pass@host:5432/pinksync')
print('Database connection successful')
"
\`\`\`

#### Redis Connection Issues
\`\`\`bash
# Test Redis connectivity
kubectl exec -it deployment/pinksync-deployment -n pinksync -- redis-cli -h redis-host ping
\`\`\`

#### Image Pull Issues
\`\`\`bash
# Check image pull secrets
kubectl get pods -n pinksync
kubectl describe pod POD_NAME -n pinksync

# Update image pull policy
kubectl patch deployment pinksync-deployment -n pinksync -p '{"spec":{"template":{"spec":{"containers":[{"name":"pinksync-frontend","imagePullPolicy":"Always"}]}}}}'
\`\`\`

### Performance Optimization

#### Database Optimization
\`\`\`sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_videos_created_at ON videos(created_at);
CREATE INDEX CONCURRENTLY idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX CONCURRENTLY idx_trust_badges_user_type ON trust_badges(user_id, badge_type);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM user_dashboard WHERE id = 'user-uuid';
\`\`\`

#### Redis Optimization
\`\`\`bash
# Monitor Redis performance
kubectl exec -it redis-pod -n pinksync -- redis-cli info memory
kubectl exec -it redis-pod -n pinksync -- redis-cli info stats
\`\`\`

## Cost Optimization

### Resource Right-Sizing
\`\`\`bash
# Monitor resource usage
kubectl top nodes
kubectl top pods -n pinksync

# Adjust resource requests/limits based on usage
kubectl patch deployment pinksync-deployment -n pinksync -p '{"spec":{"template":{"spec":{"containers":[{"name":"pinksync-api","resources":{"requests":{"memory":"256Mi","cpu":"250m"},"limits":{"memory":"512Mi","cpu":"500m"}}}]}}}}'
\`\`\`

### Storage Optimization
\`\`\`bash
# Set up lifecycle policies for Cloud Storage
gsutil lifecycle set storage-lifecycle.json gs://pinksync-videos-prod

# Monitor storage usage
gsutil du -sh gs://pinksync-storage-prod
gsutil du -sh gs://pinksync-videos-prod
\`\`\`

This comprehensive deployment guide ensures that your PINKSYNC ecosystem can be successfully deployed and maintained on GCP with proper integration of all three services: PinkSync, DeafAuth, and FibonRose.
