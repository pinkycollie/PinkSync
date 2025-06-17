// Domain and DNS configuration for PinkSync ecosystem on GCP
import { writeFileSync } from "fs"

const domainConfig = {
  mainDomain: "pinksync.io",
  subdomains: {
    auth: "auth.pinksync.io", // DeafAUTH service
    trust: "trust.pinksync.io", // FibonRose trust system
    app: "app.pinksync.io", // Main application
    api: "api.pinksync.io", // API gateway
    docs: "docs.pinksync.io", // Documentation
    vcode: "vcode.pinksync.io", // VCode generation and management
  },
  gcpServices: {
    loadBalancer: "pinksync-lb",
    sslCertificate: "pinksync-ssl-cert",
    dnsZone: "pinksync-zone",
  },
}

// Generate Terraform configuration for domain setup
const terraformDomains = `# Domain and SSL configuration for PinkSync on GCP
resource "google_dns_managed_zone" "pinksync_zone" {
  name        = "pinksync-zone"
  dns_name    = "pinksync.io."
  description = "DNS zone for PinkSync ecosystem"
  
  dnssec_config {
    state = "on"
  }
}

# SSL Certificate for all subdomains
resource "google_compute_managed_ssl_certificate" "pinksync_ssl" {
  name = "pinksync-ssl-cert"
  
  managed {
    domains = [
      "pinksync.io",
      "auth.pinksync.io",
      "trust.pinksync.io", 
      "app.pinksync.io",
      "api.pinksync.io",
      "docs.pinksync.io",
      "vcode.pinksync.io"
    ]
  }
}

# Global Load Balancer
resource "google_compute_global_address" "pinksync_ip" {
  name = "pinksync-global-ip"
}

# Backend services for each subdomain
resource "google_compute_backend_service" "pinksync_app_backend" {
  name        = "pinksync-app-backend"
  port_name   = "http"
  protocol    = "HTTP"
  timeout_sec = 30
  
  backend {
    group = google_container_cluster.pinksync_cluster.node_pool[0].instance_group_urls[0]
  }
  
  health_checks = [google_compute_health_check.pinksync_health_check.id]
}

resource "google_compute_backend_service" "deafauth_backend" {
  name        = "deafauth-backend"
  port_name   = "http"
  protocol    = "HTTP"
  timeout_sec = 30
  
  backend {
    group = google_container_cluster.pinksync_cluster.node_pool[0].instance_group_urls[0]
  }
  
  health_checks = [google_compute_health_check.deafauth_health_check.id]
}

resource "google_compute_backend_service" "fibonrose_backend" {
  name        = "fibonrose-backend"
  port_name   = "http"
  protocol    = "HTTP"
  timeout_sec = 30
  
  backend {
    group = google_container_cluster.pinksync_cluster.node_pool[0].instance_group_urls[0]
  }
  
  health_checks = [google_compute_health_check.fibonrose_health_check.id]
}

# Health checks
resource "google_compute_health_check" "pinksync_health_check" {
  name = "pinksync-health-check"
  
  http_health_check {
    port         = 3000
    request_path = "/api/health"
  }
}

resource "google_compute_health_check" "deafauth_health_check" {
  name = "deafauth-health-check"
  
  http_health_check {
    port         = 8001
    request_path = "/health"
  }
}

resource "google_compute_health_check" "fibonrose_health_check" {
  name = "fibonrose-health-check"
  
  http_health_check {
    port         = 8003
    request_path = "/health"
  }
}

# URL Map for routing
resource "google_compute_url_map" "pinksync_url_map" {
  name            = "pinksync-url-map"
  default_service = google_compute_backend_service.pinksync_app_backend.id
  
  host_rule {
    hosts        = ["app.pinksync.io", "pinksync.io"]
    path_matcher = "app-matcher"
  }
  
  host_rule {
    hosts        = ["auth.pinksync.io"]
    path_matcher = "auth-matcher"
  }
  
  host_rule {
    hosts        = ["trust.pinksync.io"]
    path_matcher = "trust-matcher"
  }
  
  host_rule {
    hosts        = ["api.pinksync.io"]
    path_matcher = "api-matcher"
  }
  
  path_matcher {
    name            = "app-matcher"
    default_service = google_compute_backend_service.pinksync_app_backend.id
  }
  
  path_matcher {
    name            = "auth-matcher"
    default_service = google_compute_backend_service.deafauth_backend.id
  }
  
  path_matcher {
    name            = "trust-matcher"
    default_service = google_compute_backend_service.fibonrose_backend.id
  }
  
  path_matcher {
    name            = "api-matcher"
    default_service = google_compute_backend_service.pinksync_app_backend.id
    
    path_rule {
      paths   = ["/api/deaf-auth/*"]
      service = google_compute_backend_service.deafauth_backend.id
    }
    
    path_rule {
      paths   = ["/api/fibonrose/*"]
      service = google_compute_backend_service.fibonrose_backend.id
    }
  }
}

# HTTPS Proxy
resource "google_compute_target_https_proxy" "pinksync_https_proxy" {
  name             = "pinksync-https-proxy"
  url_map          = google_compute_url_map.pinksync_url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.pinksync_ssl.id]
}

# Global forwarding rule
resource "google_compute_global_forwarding_rule" "pinksync_forwarding_rule" {
  name       = "pinksync-forwarding-rule"
  target     = google_compute_target_https_proxy.pinksync_https_proxy.id
  port_range = "443"
  ip_address = google_compute_global_address.pinksync_ip.address
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "pinksync_http_redirect" {
  name = "pinksync-http-redirect"
  
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "pinksync_http_proxy" {
  name    = "pinksync-http-proxy"
  url_map = google_compute_url_map.pinksync_http_redirect.id
}

resource "google_compute_global_forwarding_rule" "pinksync_http_forwarding_rule" {
  name       = "pinksync-http-forwarding-rule"
  target     = google_compute_target_http_proxy.pinksync_http_proxy.id
  port_range = "80"
  ip_address = google_compute_global_address.pinksync_ip.address
}

# DNS Records
resource "google_dns_record_set" "pinksync_a_record" {
  name = google_dns_managed_zone.pinksync_zone.dns_name
  type = "A"
  ttl  = 300
  
  managed_zone = google_dns_managed_zone.pinksync_zone.name
  rrdatas      = [google_compute_global_address.pinksync_ip.address]
}

resource "google_dns_record_set" "pinksync_subdomains" {
  for_each = toset(["auth", "trust", "app", "api", "docs", "vcode"])
  
  name = "\${each.key}.\${google_dns_managed_zone.pinksync_zone.dns_name}"
  type = "CNAME"
  ttl  = 300
  
  managed_zone = google_dns_managed_zone.pinksync_zone.name
  rrdatas      = [google_dns_managed_zone.pinksync_zone.dns_name]
}

# Outputs
output "global_ip_address" {
  value = google_compute_global_address.pinksync_ip.address
}

output "dns_name_servers" {
  value = google_dns_managed_zone.pinksync_zone.name_servers
}

output "ssl_certificate_status" {
  value = google_compute_managed_ssl_certificate.pinksync_ssl.managed[0].status
}
`

writeFileSync("infrastructure/terraform/domains.tf", terraformDomains)

console.log("✅ Domain configuration created for GCP deployment")

export { domainConfig }
