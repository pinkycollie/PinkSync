#!/bin/bash
set -e  # Exit on any error
echo "🚀 Starting MBTQ Platform - All Services"
echo "========================================"

# Check for port conflicts
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use!"
        lsof -i :$1
        return 1
    fi
    return 0
}

echo "Checking for port conflicts..."
check_port 80 || exit 1
check_port 443 || exit 1

echo "✅ Ports available"

# Start services
echo "Starting Docker Compose..."
docker-compose -f docker-compose.master.yml up -d

echo ""
echo "✅ All services started!"
echo ""
echo "Access points:"
echo "  Main Platform: https://localhost/"
echo "  DeafAuth:      https://localhost/auth/"
echo "  PinkFlow:      https://localhost/pinkflow/"
echo "  AI Services:   https://localhost/ai/"
echo ""
echo "Check status: docker-compose -f docker-compose.master.yml ps"
echo "View logs:    docker-compose -f docker-compose.master.yml logs -f"
echo "Stop all:     docker-compose -f docker-compose.master.yml down"
