output "network_name" {
  description = "Name of the VPC network"
  value       = google_compute_network.deaf_auth_network.name
}

output "network_self_link" {
  description = "Self link of the VPC network"
  value       = google_compute_network.deaf_auth_network.self_link
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = google_compute_subnetwork.deaf_auth_subnet.name
}

output "subnet_cidr" {
  description = "CIDR range of the subnet"
  value       = google_compute_subnetwork.deaf_auth_subnet.ip_cidr_range
}
