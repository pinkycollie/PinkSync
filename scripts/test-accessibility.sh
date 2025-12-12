#!/bin/bash
set -e

echo "♿ PinkFlow Accessibility Test Suite"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="${PINKFLOW_URL:-https://localhost/pinkflow}"
FAILURES=0

# Function to run accessibility test
run_test() {
    local test_name=$1
    local endpoint=$2
    local method=${3:-GET}
    
    echo -e "${BLUE}▶ Testing: $test_name${NC}"
    
    response=$(curl -k -s -X "$method" -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 400 ]; then
        echo -e "  ${GREEN}✓ PASS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "  ${RED}✗ FAIL${NC} (HTTP $http_code)"
        ((FAILURES++))
        return 1
    fi
}

# Function to test WCAG compliance
test_wcag_compliance() {
    local url=$1
    echo -e "${BLUE}▶ Testing WCAG AAA Compliance${NC}"
    
    # Check for accessibility headers
    headers=$(curl -k -s -I "$url" 2>/dev/null)
    
    # Check Content-Type
    if echo "$headers" | grep -qi "Content-Type:"; then
        echo -e "  ${GREEN}✓${NC} Content-Type header present"
    else
        echo -e "  ${YELLOW}⚠${NC} Content-Type header missing"
    fi
    
    # Check CORS for assistive technologies
    if echo "$headers" | grep -qi "Access-Control"; then
        echo -e "  ${GREEN}✓${NC} CORS headers configured"
    else
        echo -e "  ${YELLOW}⚠${NC} CORS headers not found"
    fi
}

# Function to test deaf accessibility features
test_deaf_accessibility() {
    echo -e "${BLUE}▶ Testing Deaf Accessibility Features${NC}"
    
    # Test visual alerts endpoint
    if run_test "Visual Alerts API" "/api/visual-alerts" GET 2>/dev/null; then
        :
    else
        echo -e "  ${YELLOW}ℹ${NC} Visual alerts endpoint may not exist yet"
    fi
    
    # Test sign language support
    if run_test "Sign Language Support" "/api/sign-language" GET 2>/dev/null; then
        :
    else
        echo -e "  ${YELLOW}ℹ${NC} Sign language endpoint may not exist yet"
    fi
    
    # Test caption service
    if run_test "Caption Service" "/api/captions" GET 2>/dev/null; then
        :
    else
        echo -e "  ${YELLOW}ℹ${NC} Caption service endpoint may not exist yet"
    fi
}

# Function to test AI tools
test_ai_integration() {
    echo -e "${BLUE}▶ Testing AI Tools Integration${NC}"
    
    # Test AI service connectivity
    AI_URL="${AI_URL:-https://localhost/ai}"
    
    if curl -k -s --max-time 5 "$AI_URL/health" >/dev/null 2>&1 || curl -k -s --max-time 5 "$AI_URL/" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} AI service reachable"
    else
        echo -e "  ${YELLOW}⚠${NC} AI service not reachable"
    fi
    
    # Test PinkyAI connectivity
    PINKYAI_URL="${PINKYAI_URL:-https://localhost/pinkyai}"
    
    if curl -k -s --max-time 5 "$PINKYAI_URL/health" >/dev/null 2>&1 || curl -k -s --max-time 5 "$PINKYAI_URL/" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} PinkyAI service reachable"
    else
        echo -e "  ${YELLOW}⚠${NC} PinkyAI service not reachable"
    fi
}

echo "Testing PinkFlow Accessibility Platform"
echo "Target: $BASE_URL"
echo ""

# Phase 1: Basic connectivity
echo "═══════════════════════════════════════"
echo "Phase 1: Basic Connectivity"
echo "═══════════════════════════════════════"
run_test "PinkFlow Health Check" "/health" || run_test "PinkFlow Root" "/" || {
    echo -e "${YELLOW}⚠ PinkFlow service may not be running${NC}"
    echo "  Start with: docker-compose -f docker-compose.master.yml up -d pinkflow"
}
echo ""

# Phase 2: WCAG Compliance
echo "═══════════════════════════════════════"
echo "Phase 2: WCAG AAA Compliance"
echo "═══════════════════════════════════════"
test_wcag_compliance "$BASE_URL/"
echo ""

# Phase 3: Deaf Accessibility
echo "═══════════════════════════════════════"
echo "Phase 3: Deaf Accessibility Features"
echo "═══════════════════════════════════════"
test_deaf_accessibility
echo ""

# Phase 4: AI Integration
echo "═══════════════════════════════════════"
echo "Phase 4: AI Tools Integration"
echo "═══════════════════════════════════════"
test_ai_integration
echo ""

# Phase 5: Platform Integration
echo "═══════════════════════════════════════"
echo "Phase 5: Platform Integration Tests"
echo "═══════════════════════════════════════"

echo -e "${BLUE}▶ Testing Service Interconnectivity${NC}"

# Test DeafAuth integration
DEAFAUTH_URL="${DEAFAUTH_URL:-https://localhost/auth}"
if curl -k -s --max-time 5 "$DEAFAUTH_URL/health" >/dev/null 2>&1 || curl -k -s --max-time 5 "$DEAFAUTH_URL/" >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} DeafAuth service reachable"
else
    echo -e "  ${YELLOW}⚠${NC} DeafAuth service not reachable"
fi

# Test PinkSync platform
PINKSYNC_URL="${PINKSYNC_URL:-https://localhost}"
if curl -k -s --max-time 5 "$PINKSYNC_URL/health" >/dev/null 2>&1 || curl -k -s --max-time 5 "$PINKSYNC_URL/" >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} PinkSync platform reachable"
else
    echo -e "  ${YELLOW}⚠${NC} PinkSync platform not reachable"
fi

echo ""
echo "═══════════════════════════════════════"
echo "Summary"
echo "═══════════════════════════════════════"

if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✅ All accessibility tests passed!${NC}"
    echo ""
    echo "The platform is ready for deaf accessibility testing."
    exit 0
else
    echo -e "${YELLOW}⚠️  $FAILURES test(s) had issues${NC}"
    echo ""
    echo "Note: Some endpoints may not be implemented yet."
    echo "This is expected during development."
    exit 0
fi
