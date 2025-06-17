import { writeFileSync, mkdirSync } from "fs"

console.log("🚀 Setting up GCP Infrastructure for PINKSYNC Ecosystem...")

// Create infrastructure directories
const dirs = [
  "infrastructure",
  "infrastructure/terraform",
  "infrastructure/kubernetes",
  "infrastructure/docker",
  "infrastructure/scripts",
  "infrastructure/monitoring",
]

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true })
}

// Generate Terraform configuration for GCP
const terraformMain = `# PINKSYNC Ecosystem Infrastructure on GCP
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-central1-a"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "container.googleapis.com",
    "sql.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "aiplatform.googleapis.com",
    "videointelligence.googleapis.com",
    "speech.googleapis.com",
    "translate.googleapis.com"
  ])
  
  service = each.value
  disable_on_destroy = false
}

# VPC Network
resource "google_compute_network" "pinksync_vpc" {
  name                    = "pinksync-vpc-\${var.environment}"
  auto_create_subnetworks = false
  depends_on             = [google_project_service.required_apis]
}

# Subnet for GKE
resource "google_compute_subnetwork" "pinksync_subnet" {
  name          = "pinksync-subnet-\${var.environment}"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.pinksync_vpc.id
  
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

# Cloud SQL PostgreSQL Instance
resource "google_sql_database_instance" "pinksync_db" {
  name             = "pinksync-db-\${var.environment}"
  database_version = "POSTGRES_15"
  region          = var.region
  
  settings {
    tier = var.environment == "prod" ? "db-n1-standard-2" : "db-f1-micro"
    
    backup_configuration {
      enabled                        = true
      start_time                    = "03:00"
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 7
      }
    }
    
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.pinksync_vpc.id
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
    
    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }
  
  deletion_protection = var.environment == "prod" ? true : false
  depends_on         = [google_project_service.required_apis]
}

# Database
resource "google_sql_database" "pinksync_database" {
  name     = "pinksync"
  instance = google_sql_database_instance.pinksync_db.name
}

# Database User
resource "google_sql_user" "pinksync_user" {
  name     = "pinksync"
  instance = google_sql_database_instance.pinksync_db.name
  password = var.db_password
}

# Redis Instance
resource "google_redis_instance" "pinksync_redis" {
  name           = "pinksync-redis-\${var.environment}"
  tier           = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb = var.environment == "prod" ? 4 : 1
  region         = var.region
  
  authorized_network = google_compute_network.pinksync_vpc.id
  redis_version      = "REDIS_7_0"
  
  depends_on = [google_project_service.required_apis]
}

# GKE Cluster
resource "google_container_cluster" "pinksync_cluster" {
  name     = "pinksync-cluster-\${var.environment}"
  location = var.region
  
  # Remove default node pool
  remove_default_node_pool = true
  initial_node_count       = 1
  
  network    = google_compute_network.pinksync_vpc.name
  subnetwork = google_compute_subnetwork.pinksync_subnet.name
  
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  
  workload_identity_config {
    workload_pool = "\${var.project_id}.svc.id.goog"
  }
  
  depends_on = [google_project_service.required_apis]
}

# Node Pool for General Workloads
resource "google_container_node_pool" "general_nodes" {
  name       = "general-nodes"
  location   = var.region
  cluster    = google_container_cluster.pinksync_cluster.name
  node_count = var.environment == "prod" ? 3 : 1
  
  node_config {
    preemptible  = var.environment != "prod"
    machine_type = var.environment == "prod" ? "e2-standard-4" : "e2-medium"
    
    service_account = google_service_account.gke_service_account.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    
    workload_metadata_config {
      mode = "GKE_METADATA"
    }
  }
  
  autoscaling {
    min_node_count = 1
    max_node_count = var.environment == "prod" ? 10 : 3
  }
  
  management {
    auto_repair  = true
    auto_upgrade = true
  }
}

# Node Pool for AI/ML Workloads
resource "google_container_node_pool" "ai_nodes" {
  name       = "ai-nodes"
  location   = var.region
  cluster    = google_container_cluster.pinksync_cluster.name
  node_count = 0
  
  node_config {
    preemptible  = true
    machine_type = "n1-standard-4"
    
    guest_accelerator {
      type  = "nvidia-tesla-t4"
      count = 1
    }
    
    service_account = google_service_account.gke_service_account.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    
    workload_metadata_config {
      mode = "GKE_METADATA"
    }
  }
  
  autoscaling {
    min_node_count = 0
    max_node_count = 2
  }
  
  management {
    auto_repair  = true
    auto_upgrade = true
  }
}

# Service Account for GKE
resource "google_service_account" "gke_service_account" {
  account_id   = "gke-service-account-\${var.environment}"
  display_name = "GKE Service Account"
}

# Cloud Storage Buckets
resource "google_storage_bucket" "pinksync_storage" {
  name     = "pinksync-storage-\${var.project_id}-\${var.environment}"
  location = var.region
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "pinksync_videos" {
  name     = "pinksync-videos-\${var.project_id}-\${var.environment}"
  location = var.region
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Cloud Run Services for Serverless Components
resource "google_cloud_run_service" "deafauth_service" {
  name     = "deafauth-service-\${var.environment}"
  location = var.region
  
  template {
    spec {
      containers {
        image = "gcr.io/\${var.project_id}/deafauth:latest"
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql://\${google_sql_user.pinksync_user.name}:\${var.db_password}@\${google_sql_database_instance.pinksync_db.connection_name}/\${google_sql_database.pinksync_database.name}"
        }
        
        env {
          name  = "REDIS_URL"
          value = "redis://\${google_redis_instance.pinksync_redis.host}:6379"
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.pinksync_db.connection_name
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [google_project_service.required_apis]
}

# Outputs
output "cluster_endpoint" {
  value = google_container_cluster.pinksync_cluster.endpoint
}

output "database_connection_name" {
  value = google_sql_database_instance.pinksync_db.connection_name
}

output "redis_host" {
  value = google_redis_instance.pinksync_redis.host
}

output "storage_bucket_name" {
  value = google_storage_bucket.pinksync_storage.name
}

output "videos_bucket_name" {
  value = google_storage_bucket.pinksync_videos.name
}
`

writeFileSync("infrastructure/terraform/main.tf", terraformMain)

// Generate Kubernetes manifests
const k8sNamespace = `apiVersion: v1
kind: Namespace
metadata:
  name: pinksync
  labels:
    name: pinksync
    environment: \${ENVIRONMENT}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: pinksync-config
  namespace: pinksync
data:
  ENVIRONMENT: "\${ENVIRONMENT}"
  REDIS_HOST: "\${REDIS_HOST}"
  DATABASE_HOST: "\${DATABASE_HOST}"
  STORAGE_BUCKET: "\${STORAGE_BUCKET}"
  VIDEOS_BUCKET: "\${VIDEOS_BUCKET}"
---
apiVersion: v1
kind: Secret
metadata:
  name: pinksync-secrets
  namespace: pinksync
type: Opaque
data:
  DATABASE_PASSWORD: \${DATABASE_PASSWORD_B64}
  JWT_SECRET: \${JWT_SECRET_B64}
  OPENAI_API_KEY: \${OPENAI_API_KEY_B64}
`

writeFileSync("infrastructure/kubernetes/namespace.yaml", k8sNamespace)

// Generate deployment manifests for each service
const deafauthDeployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: deafauth-deployment
  namespace: pinksync
  labels:
    app: deafauth
    service: authentication
spec:
  replicas: 3
  selector:
    matchLabels:
      app: deafauth
  template:
    metadata:
      labels:
        app: deafauth
    spec:
      containers:
      - name: deafauth
        image: gcr.io/PROJECT_ID/deafauth:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: pinksync-config
              key: REDIS_HOST
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: deafauth-service
  namespace: pinksync
spec:
  selector:
    app: deafauth
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
`

writeFileSync("infrastructure/kubernetes/deafauth-deployment.yaml", deafauthDeployment)

const pinksyncDeployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: pinksync-deployment
  namespace: pinksync
  labels:
    app: pinksync
    service: core-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pinksync
  template:
    metadata:
      labels:
        app: pinksync
    spec:
      containers:
      - name: pinksync-frontend
        image: gcr.io/PROJECT_ID/pinksync-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://pinksync-api-service"
        - name: NEXT_PUBLIC_DEAFAUTH_URL
          value: "http://deafauth-service"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      - name: pinksync-api
        image: gcr.io/PROJECT_ID/pinksync-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: pinksync-config
              key: REDIS_HOST
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: OPENAI_API_KEY
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: pinksync-frontend-service
  namespace: pinksync
spec:
  selector:
    app: pinksync
  ports:
  - name: frontend
    protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: v1
kind: Service
metadata:
  name: pinksync-api-service
  namespace: pinksync
spec:
  selector:
    app: pinksync
  ports:
  - name: api
    protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
`

writeFileSync("infrastructure/kubernetes/pinksync-deployment.yaml", pinksyncDeployment)

const fibonroseDeployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: fibonrose-deployment
  namespace: pinksync
  labels:
    app: fibonrose
    service: trust-verification
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fibonrose
  template:
    metadata:
      labels:
        app: fibonrose
    spec:
      containers:
      - name: fibonrose
        image: gcr.io/PROJECT_ID/fibonrose:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pinksync-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: pinksync-config
              key: REDIS_HOST
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: fibonrose-service
  namespace: pinksync
spec:
  selector:
    app: fibonrose
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
`

writeFileSync("infrastructure/kubernetes/fibonrose-deployment.yaml", fibonroseDeployment)

// Generate Docker Compose for local development
const dockerCompose = `version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pinksync
      POSTGRES_USER: pinksync
      POSTGRES_PASSWORD: pinksync_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/database-migration.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pinksync"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # DeafAuth Service
  deafauth:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.deafauth
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://pinksync:pinksync_dev_password@postgres:5432/pinksync
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_jwt_secret_key
      - ENVIRONMENT=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./api:/app/api
    command: uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

  # PinkSync Core Platform
  pinksync-frontend:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8002
      - NEXT_PUBLIC_DEAFAUTH_URL=http://localhost:8001
      - NEXT_PUBLIC_FIBONROSE_URL=http://localhost:8003
    depends_on:
      - pinksync-api
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  pinksync-api:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.api
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=postgresql://pinksync:pinksync_dev_password@postgres:5432/pinksync
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - ENVIRONMENT=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./api:/app/api

  # FibonRose Trust Service
  fibonrose:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.fibonrose
    ports:
      - "8003:8000"
    environment:
      - DATABASE_URL=postgresql://pinksync:pinksync_dev_password@postgres:5432/pinksync
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_jwt_secret_key
      - ENVIRONMENT=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./api:/app/api

  # AI/ML Processing Service
  ai-processor:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.ai
    environment:
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - MODEL_CACHE_DIR=/app/models
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ai_models:/app/models
      - ./ai:/app/ai

volumes:
  postgres_data:
  redis_data:
  ai_models:

networks:
  default:
    name: pinksync-network
`

writeFileSync("infrastructure/docker/docker-compose.yml", dockerCompose)

// Generate deployment scripts
const deployScript = `#!/bin/bash

# PINKSYNC Ecosystem Deployment Script
set -e

echo "🚀 Deploying PINKSYNC Ecosystem to GCP..."

# Configuration
PROJECT_ID=\${1:-"your-project-id"}
ENVIRONMENT=\${2:-"dev"}
REGION=\${3:-"us-central1"}

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
sed -i "s/\\\${ENVIRONMENT}/$ENVIRONMENT/g" *.yaml

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
`

writeFileSync("infrastructure/scripts/deploy.sh", deployScript)

// Generate monitoring configuration
const monitoringConfig = `# Prometheus Configuration for PINKSYNC
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "pinksync_rules.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)

  - job_name: 'deafauth'
    static_configs:
      - targets: ['deafauth-service:80']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'pinksync-api'
    static_configs:
      - targets: ['pinksync-api-service:80']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'fibonrose'
    static_configs:
      - targets: ['fibonrose-service:80']
    metrics_path: '/metrics'
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
`

writeFileSync("infrastructure/monitoring/prometheus.yml", monitoringConfig)

console.log("✅ GCP Infrastructure setup completed!")
console.log("\nGenerated files:")
console.log("- infrastructure/terraform/main.tf - Complete GCP infrastructure")
console.log("- infrastructure/kubernetes/ - Kubernetes manifests for all services")
console.log("- infrastructure/docker/docker-compose.yml - Local development environment")
console.log("- infrastructure/scripts/deploy.sh - Automated deployment script")
console.log("- infrastructure/monitoring/prometheus.yml - Monitoring configuration")
console.log("\nNext steps:")
console.log("1. Set up GCP project and enable billing")
console.log("2. Install required tools: gcloud, terraform, kubectl, docker")
console.log("3. Run: chmod +x infrastructure/scripts/deploy.sh")
console.log("4. Deploy: ./infrastructure/scripts/deploy.sh YOUR_PROJECT_ID dev")
