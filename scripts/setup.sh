#!/bin/bash

# GCP + Vercel Infrastructure Setup Script
# This script sets up your infrastructure while staying within free-tier limits

set -e

PROJECT_ID="auth-458419"
REGION="us-central1"

echo "🚀 Setting up GCP + Vercel Infrastructure..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "📋 Setting GCP project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable compute.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable vpcaccess.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Initialize Terraform
echo "🏗️  Initializing Terraform..."
cd terraform
terraform init

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan -var="project_id=$PROJECT_ID" -var="region=$REGION"

# Apply the configuration
echo "🚀 Applying Terraform configuration..."
terraform apply -var="project_id=$PROJECT_ID" -var="region=$REGION" -auto-approve

echo "✅ Infrastructure setup complete!"
echo "📊 Check your GCP console to verify the resources."
echo "💰 Monitor your usage to stay within free-tier limits."
