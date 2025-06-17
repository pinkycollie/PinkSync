# Cloud Run service for your backend API
resource "google_cloud_run_service" "api_service" {
  name     = "deaf-auth-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello" # Replace with your image
        
        # Free tier optimization: Set memory and CPU limits
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
        
        ports {
          container_port = 8080
        }
        
        env {
          name  = "NODE_ENV"
          value = "production"
        }
      }
      
      # Free tier optimization: Set concurrency
      container_concurrency = 100
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# VPC Access Connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "deaf-auth-connector"
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.deaf_auth_network.name
  region        = var.region
}

# IAM policy for Cloud Run
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.api_service.name
  location = google_cloud_run_service.api_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
