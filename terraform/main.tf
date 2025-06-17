# Configure the Google Cloud Provider
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# VPC Network
resource "google_compute_network" "deaf_auth_network" {
  name                    = "deaf-auth-network"
  auto_create_subnetworks = false
  routing_mode           = "REGIONAL"
  
  # Cost optimization: Delete default routes
  delete_default_routes_on_create = false
}

# Subnet
resource "google_compute_subnetwork" "deaf_auth_subnet" {
  name          = "deaf-auth-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.deaf_auth_network.id
  
  # Enable private Google access for free-tier optimization
  private_ip_google_access = true
}

# Firewall rules for cost-effective security
resource "google_compute_firewall" "allow_internal" {
  name    = "deaf-auth-allow-internal"
  network = google_compute_network.deaf_auth_network.name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/24"]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "deaf-auth-allow-ssh"
  network = google_compute_network.deaf_auth_network.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh-allowed"]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "deaf-auth-allow-http-https"
  network = google_compute_network.deaf_auth_network.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "8080"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]
}
