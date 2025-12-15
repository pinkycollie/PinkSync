#!/bin/bash

# PinkSync Branch Deployment Helper
# This script helps you deploy your branch to GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   PinkSync Branch Deployment Helper   ║"
echo "╔════════════════════════════════════════╗"
echo -e "${NC}"

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Current branch: ${GREEN}$CURRENT_BRANCH${NC}"

# Check if branch matches supported patterns
SUPPORTED_PATTERNS=(
    "service-"
    "api-"
    "tool-"
    "feat-"
    "feature-"
    "video-"
    "data-"
    "integrated-"
    "QR-Code-"
    "admin-"
)

SPECIAL_BRANCHES=("vcode" "videoized" "REGISTRATION")

IS_SUPPORTED=false

# Check patterns
for pattern in "${SUPPORTED_PATTERNS[@]}"; do
    if [[ $CURRENT_BRANCH == $pattern* ]]; then
        IS_SUPPORTED=true
        break
    fi
done

# Check special branches
for branch in "${SPECIAL_BRANCHES[@]}"; do
    if [[ $CURRENT_BRANCH == $branch ]]; then
        IS_SUPPORTED=true
        break
    fi
done

if [ "$IS_SUPPORTED" = false ]; then
    print_warning "Current branch doesn't match supported patterns for automatic deployment"
    echo ""
    echo "Supported patterns:"
    for pattern in "${SUPPORTED_PATTERNS[@]}"; do
        echo "  - ${pattern}*"
    done
    echo ""
    echo "Special branches:"
    for branch in "${SPECIAL_BRANCHES[@]}"; do
        echo "  - $branch"
    done
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
fi

# Sanitize branch name for URL
SANITIZED_BRANCH=$(echo "$CURRENT_BRANCH" | sed 's/\//-/g')
DEPLOYMENT_URL="https://pinkycollie.github.io/PinkSync/$SANITIZED_BRANCH/"

print_info "Deployment URL will be: ${GREEN}$DEPLOYMENT_URL${NC}"
echo ""

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    read -p "Commit changes before deployment? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        print_success "Changes committed"
    fi
fi

# Push to remote
print_info "Pushing branch to GitHub..."
if git push origin "$CURRENT_BRANCH"; then
    print_success "Branch pushed successfully"
else
    print_error "Failed to push branch"
    exit 1
fi

echo ""
print_success "Deployment triggered!"
echo ""
print_info "GitHub Actions is now building your branch..."
echo ""
echo "You can:"
echo "  1. Check the workflow status:"
echo "     ${BLUE}https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml${NC}"
echo ""
echo "  2. Wait 2-3 minutes and visit your deployment:"
echo "     ${GREEN}$DEPLOYMENT_URL${NC}"
echo ""
echo "  3. Check branch info (once deployed):"
echo "     ${BLUE}${DEPLOYMENT_URL}BRANCH_INFO.txt${NC}"
echo ""

# Ask if user wants to open browser
read -p "Open GitHub Actions in browser? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml"
    elif command -v open &> /dev/null; then
        open "https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml"
    else
        print_warning "Could not open browser automatically"
        echo "Please visit: https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml"
    fi
fi

echo ""
print_success "Done! Happy deploying! 🚀"
