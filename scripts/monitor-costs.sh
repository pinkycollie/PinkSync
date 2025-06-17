#!/bin/bash

# Cost Monitoring Script for Free-Tier Optimization

PROJECT_ID="auth-458419"

echo "💰 Checking GCP Free Tier Usage..."

# Check Compute Engine usage
echo "🖥️  Compute Engine Usage:"
gcloud compute instances list --project=$PROJECT_ID --format="table(name,zone,status,machineType)"

# Check Cloud Run usage
echo "🏃 Cloud Run Services:"
gcloud run services list --project=$PROJECT_ID --format="table(SERVICE,REGION,URL)"

# Check network usage
echo "🌐 Network Resources:"
gcloud compute networks list --project=$PROJECT_ID --format="table(name,subnet_mode,bgp_routing_mode)"

# Check firewall rules
echo "🔥 Firewall Rules:"
gcloud compute firewall-rules list --project=$PROJECT_ID --format="table(name,direction,priority,sourceRanges,allowed)"

# Billing information (requires billing API)
echo "💳 Setting up billing alerts..."
echo "Visit: https://console.cloud.google.com/billing/budgets?project=$PROJECT_ID"
echo "Set up budget alerts for \$1, \$5, and \$10 to monitor free-tier usage."
