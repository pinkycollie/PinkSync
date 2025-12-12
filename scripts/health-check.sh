#!/bin/bash
set -e

echo "🔍 MBTQ Platform - Health Check & Auto-Test"
echo "============================================"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is responding
check_service() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    
    # Try to connect with timeout
    if response=$(curl -k -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_code" ] || [ "$response" -eq 200 ] || [ "$response" -eq 301 ] || [ "$response" -eq 302 ]; then
            echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
            return 0
        else
            echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${RED}✗ UNREACHABLE${NC}"
        return 1
    fi
}

# Function to check Docker service
check_docker_service() {
    local container=$1
    local name=$2
    
    echo -n "Checking container $name... "
    
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
        if [ "$status" = "running" ]; then
            echo -e "${GREEN}✓ RUNNING${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ $status${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ NOT FOUND${NC}"
        return 1
    fi
}

# Function to test accessibility features
test_accessibility() {
    local url=$1
    echo -n "Testing accessibility headers... "
    
    headers=$(curl -k -s -I "$url" 2>/dev/null)
    
    # Check for accessibility-related headers
    if echo "$headers" | grep -qi "Access-Control-Allow"; then
        echo -e "${GREEN}✓ CORS enabled${NC}"
    else
        echo -e "${YELLOW}⚠ No CORS headers${NC}"
    fi
}

echo ""
echo "📦 Phase 1: Docker Container Status"
echo "──────────────────────────────────"

CONTAINER_FAILURES=0
check_docker_service "master-nginx" "nginx" || ((CONTAINER_FAILURES++))
check_docker_service "pinksync-nextjs" "PinkSync" || ((CONTAINER_FAILURES++))
check_docker_service "deafauth-deno" "DeafAuth" || ((CONTAINER_FAILURES++))
check_docker_service "pinkflow-fastapi" "PinkFlow" || ((CONTAINER_FAILURES++))
check_docker_service "pinkflowai-flask" "PinkFlowAI" || ((CONTAINER_FAILURES++))
check_docker_service "pinkyai-api" "PinkyAI" || ((CONTAINER_FAILURES++))
check_docker_service "business-magician" "Business Magician" || ((CONTAINER_FAILURES++))

echo ""
echo "🌐 Phase 2: Service Endpoint Testing"
echo "──────────────────────────────────"

ENDPOINT_FAILURES=0

# Check if services are accessible via nginx
if docker ps | grep -q "master-nginx"; then
    BASE_URL="https://localhost"
    
    check_service "Main Platform (PinkSync)" "$BASE_URL/" || ((ENDPOINT_FAILURES++))
    check_service "DeafAuth API" "$BASE_URL/auth/health" || check_service "DeafAuth API (alt)" "$BASE_URL/auth/" || ((ENDPOINT_FAILURES++))
    check_service "PinkFlow API" "$BASE_URL/pinkflow/health" || check_service "PinkFlow API (alt)" "$BASE_URL/pinkflow/" || ((ENDPOINT_FAILURES++))
    check_service "PinkFlowAI" "$BASE_URL/ai/health" || check_service "PinkFlowAI (alt)" "$BASE_URL/ai/" || ((ENDPOINT_FAILURES++))
    check_service "PinkyAI API" "$BASE_URL/pinkyai/health" || check_service "PinkyAI API (alt)" "$BASE_URL/pinkyai/" || ((ENDPOINT_FAILURES++))
    check_service "Business Magician" "$BASE_URL/magician/health" || check_service "Business Magician (alt)" "$BASE_URL/magician/" || ((ENDPOINT_FAILURES++))
    check_service "Health Check" "$BASE_URL/health" || ((ENDPOINT_FAILURES++))
else
    echo -e "${YELLOW}⚠ nginx not running, checking direct service ports...${NC}"
    
    # Check services on their direct ports
    check_service "PinkSync (direct)" "http://localhost:3000" || ((ENDPOINT_FAILURES++))
    check_service "DeafAuth (direct)" "http://localhost:8001" || ((ENDPOINT_FAILURES++))
    check_service "PinkFlow (direct)" "http://localhost:8002" || ((ENDPOINT_FAILURES++))
    check_service "PinkFlowAI (direct)" "http://localhost:5000" || ((ENDPOINT_FAILURES++))
    check_service "PinkyAI (direct)" "http://localhost:8003" || ((ENDPOINT_FAILURES++))
    check_service "Business Magician (direct)" "http://localhost:8080" || ((ENDPOINT_FAILURES++))
fi

echo ""
echo "♿ Phase 3: Accessibility Features Test"
echo "────────────────────────────────────────"

if docker ps | grep -q "master-nginx"; then
    test_accessibility "https://localhost/"
    test_accessibility "https://localhost/auth/"
    test_accessibility "https://localhost/pinkflow/"
fi

echo ""
echo "📊 Phase 4: Port Conflict Check"
echo "──────────────────────────────"

check_port_conflicts() {
    local port=$1
    local expected=$2
    
    echo -n "Port $port... "
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        process=$(lsof -Pi :$port -sTCP:LISTEN | tail -n 1 | awk '{print $1}')
        if [ "$process" = "$expected" ]; then
            echo -e "${GREEN}✓ $process (expected)${NC}"
        else
            echo -e "${YELLOW}⚠ $process (check if correct)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Not in use${NC}"
    fi
}

check_port_conflicts 80 "nginx"
check_port_conflicts 443 "nginx"
check_port_conflicts 3000 "node"
check_port_conflicts 8001 "deno"
check_port_conflicts 8002 "python"
check_port_conflicts 5000 "python"
check_port_conflicts 8003 "python"
check_port_conflicts 8080 "node"

echo ""
echo "═══════════════════════════════════════"
echo "📋 SUMMARY"
echo "═══════════════════════════════════════"

TOTAL_FAILURES=$((CONTAINER_FAILURES + ENDPOINT_FAILURES))

if [ $CONTAINER_FAILURES -eq 0 ]; then
    echo -e "Containers:  ${GREEN}✓ All containers running${NC}"
else
    echo -e "Containers:  ${RED}✗ $CONTAINER_FAILURES failed${NC}"
fi

if [ $ENDPOINT_FAILURES -eq 0 ]; then
    echo -e "Endpoints:   ${GREEN}✓ All endpoints accessible${NC}"
else
    echo -e "Endpoints:   ${RED}✗ $ENDPOINT_FAILURES failed${NC}"
fi

echo ""

if [ $TOTAL_FAILURES -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  $TOTAL_FAILURES issues detected${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  • Check logs: docker-compose -f docker-compose.master.yml logs -f"
    echo "  • Restart services: ./scripts/start-all.sh"
    echo "  • View status: docker-compose -f docker-compose.master.yml ps"
    exit 1
fi
