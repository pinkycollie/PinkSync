#!/bin/bash

# PinkSync Auto-Deploy Script
# Automates deployment of PinkSync to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pinksync"
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  PinkSync Auto-Deploy v${VERSION}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to display menu
show_menu() {
    echo ""
    echo "Select deployment target:"
    echo "  1) Docker (Local)"
    echo "  2) Docker (Production)"
    echo "  3) Vercel (Next.js)"
    echo "  4) Deno Deploy (DeafAUTH)"
    echo "  5) Build Extension"
    echo "  6) Run Tests"
    echo "  7) Exit"
    echo ""
    read -p "Enter your choice [1-7]: " choice
}

# Function to deploy with Docker (Local)
deploy_docker_local() {
    print_info "Deploying with Docker (Local)..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    print_info "Building images..."
    docker-compose build
    
    print_info "Starting services..."
    docker-compose up -d
    
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    print_info "Checking health..."
    docker-compose ps
    
    print_info "Deployment complete!"
    print_info "Next.js: http://localhost:3000"
    print_info "Deno: http://localhost:8000"
    
    echo ""
    read -p "View logs? (y/n): " view_logs
    if [ "$view_logs" = "y" ]; then
        docker-compose logs -f
    fi
}

# Function to deploy with Docker (Production)
deploy_docker_prod() {
    print_info "Deploying with Docker (Production)..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env with your production values"
        read -p "Press enter to continue after editing .env..."
    fi
    
    print_info "Building production images..."
    docker-compose -f docker-compose.prod.yml build
    
    print_info "Starting production services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_info "Waiting for services..."
    sleep 15
    
    print_info "Running health checks..."
    docker-compose -f docker-compose.prod.yml ps
    
    print_info "Production deployment complete!"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed."
        print_info "Install with: npm install -g vercel"
        exit 1
    fi
    
    print_info "Building application..."
    npm run build
    
    read -p "Deploy to production? (y/n): " is_prod
    
    if [ "$is_prod" = "y" ]; then
        print_info "Deploying to production..."
        vercel --prod
    else
        print_info "Deploying to preview..."
        vercel
    fi
    
    print_info "Vercel deployment complete!"
}

# Function to deploy to Deno Deploy
deploy_deno() {
    print_info "Deploying to Deno Deploy..."
    
    if ! command_exists deno; then
        print_error "Deno is not installed."
        print_info "Install from: https://deno.land"
        exit 1
    fi
    
    if ! command_exists deployctl; then
        print_info "Installing deployctl..."
        deno install -Arf https://deno.land/x/deploy/deployctl.ts
    fi
    
    print_info "Running Deno checks..."
    cd deno-deafauth
    deno fmt --check
    deno lint
    deno check mod.ts
    
    read -p "Enter Deno Deploy project name: " project_name
    read -p "Deploy to production? (y/n): " is_prod
    
    if [ "$is_prod" = "y" ]; then
        print_info "Deploying to production..."
        deployctl deploy --project="$project_name" --prod mod.ts
    else
        print_info "Deploying to preview..."
        deployctl deploy --project="$project_name" mod.ts
    fi
    
    cd ..
    print_info "Deno Deploy complete!"
}

# Function to build extension
build_extension() {
    print_info "Building browser extension..."
    
    cd extension
    
    print_info "Creating extension package..."
    zip -r ../pinksync-extension-${VERSION}.zip . \
        -x "*.DS_Store" \
        -x "*README.md" \
        -x "*.md" \
        -x "icons/*.svg" \
        -x "icons/create-icons.js"
    
    cd ..
    
    print_info "Extension package created: pinksync-extension-${VERSION}.zip"
    print_info "Upload this to Chrome Web Store"
}

# Function to run tests
run_tests() {
    print_info "Running tests..."
    
    print_info "1. Next.js tests..."
    npm run build
    
    print_info "2. Deno tests..."
    cd deno-deafauth
    deno fmt --check
    deno lint
    deno check mod.ts
    deno run --allow-all example.ts
    cd ..
    
    print_info "All tests passed!"
}

# Main script
main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_docker_local
                ;;
            2)
                deploy_docker_prod
                ;;
            3)
                deploy_vercel
                ;;
            4)
                deploy_deno
                ;;
            5)
                build_extension
                ;;
            6)
                run_tests
                ;;
            7)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press enter to continue..."
    done
}

# Run main function
main
