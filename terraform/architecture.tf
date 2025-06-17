# Enhanced infrastructure for deaf authentication platform

# API Gateway using Cloud Endpoints
resource "google_endpoints_service" "deaf_auth_api" {
  service_name   = "deaf-auth-api.endpoints.${var.project_id}.cloud.goog"
  project        = var.project_id
  
  openapi_config = file("${path.module}/openapi.yaml")
}

# Cloud Run services for core functionality
resource "google_cloud_run_service" "sign_language_auth" {
  name     = "sign-language-auth"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/sign-language-auth:latest"
        
        resources {
          limits = {
            cpu    = "2000m"  # Higher CPU for video processing
            memory = "2Gi"    # More memory for ML models
          }
        }
        
        ports {
          container_port = 8080
        }
        
        env {
          name  = "GOOGLE_CLOUD_PROJECT"
          value = var.project_id
        }
        
        env {
          name  = "FIRESTORE_DATABASE"
          value = google_firestore_database.main.name
        }
      }
      
      container_concurrency = 10  # Lower concurrency for video processing
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "5"  # Cost control
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
        "run.googleapis.com/execution-environment" = "gen2"
      }
    }
  }
}

resource "google_cloud_run_service" "accessibility_api" {
  name     = "accessibility-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/accessibility-api:latest"
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "1Gi"
          }
        }
        
        ports {
          container_port = 8080
        }
      }
      
      container_concurrency = 50
    }
  }
}

# Firestore for user data and accessibility preferences
resource "google_firestore_database" "main" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
}

# Cloud Storage for video/media processing
resource "google_storage_bucket" "media_processing" {
  name     = "${var.project_id}-media-processing"
  location = var.region
  
  # Cost optimization
  storage_class = "STANDARD"
  
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

# Cloud Functions for lightweight processing
resource "google_cloudfunctions_function" "visual_notification" {
  name        = "visual-notification"
  description = "Handles visual notifications for deaf users"
  runtime     = "nodejs18"

  available_memory_mb   = 256  # Free tier optimization
  source_archive_bucket = google_storage_bucket.functions_source.name
  source_archive_object = google_storage_bucket_object.function_source.name
  trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.notifications.name
  }
  entry_point = "handleVisualNotification"
}

# Pub/Sub for real-time notifications
resource "google_pubsub_topic" "notifications" {
  name = "visual-notifications"
}

# Cloud SQL for structured data (if needed)
resource "google_sql_database_instance" "main" {
  name             = "deaf-auth-db"
  database_version = "POSTGRES_14"
  region           = var.region
  
  settings {
    tier = "db-f1-micro"  # Free tier eligible
    
    backup_configuration {
      enabled = true
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.deaf_auth_network.id
    }
  }
  
  deletion_protection = false
}
