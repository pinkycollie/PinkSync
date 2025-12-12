#!/bin/bash
set -e  # Exit on any error
echo "🔐 Generating Self-Signed SSL Certificates for Development"
echo "==========================================================="

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=MBTQ/CN=localhost"

echo ""
echo "✅ SSL certificates generated in ./ssl/"
echo ""
echo "Files created:"
echo "  - ssl/cert.pem (certificate)"
echo "  - ssl/key.pem (private key)"
echo ""
echo "⚠️  These are self-signed certificates for DEVELOPMENT only!"
echo "   Browsers will show a security warning. This is expected."
echo ""
