#!/bin/bash

# Local development helper script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies for all workspaces..."
    npm run install:all
}

# Run tests
run_tests() {
    log_info "Running tests for all workspaces..."
    npm test
}

# Run linter
run_lint() {
    log_info "Running linter for all workspaces..."
    npm run lint
}

# Build Docker image
build_image() {
    check_docker
    log_info "Building Docker image..."
    docker build -t test-application:local .
}

# Run Docker container locally
run_container() {
    check_docker
    log_info "Running container locally..."
    docker run --rm -p 3000:3000 --name test-app-local test-application:local
}

# Run application locally (no Docker)
run_local() {
    log_info "Starting backend only..."
    cd src/backend && npm start
}

# Run in development mode with hot reload
run_dev() {
    log_info "Starting both frontend and backend in development mode..."
    npm run dev
}

# Run frontend only
run_frontend() {
    log_info "Starting frontend only..."
    npm run dev:frontend
}

# Run backend only
run_backend() {
    log_info "Starting backend only..."
    npm run dev:backend
}

# Build applications
build_apps() {
    log_info "Building both frontend and backend..."
    npm run build
}

# Health check
health_check() {
    log_info "Performing health check..."
    curl -f http://localhost:3000/health || {
        log_error "Health check failed"
        exit 1
    }
    log_info "Health check passed"
}

# Show help
show_help() {
    echo "Test Application Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install          Install dependencies for all workspaces"
    echo "  test             Run tests for frontend and backend"
    echo "  lint             Run linter for frontend and backend"
    echo "  build-apps       Build frontend and backend applications"
    echo "  build            Build Docker image"
    echo "  run              Run backend only (production mode)"
    echo "  dev              Run both frontend and backend (development mode)"
    echo "  frontend         Run frontend only (development mode)"
    echo "  backend          Run backend only (development mode)"
    echo "  container        Build and run Docker container locally"
    echo "  health           Perform health check"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install       # Install all dependencies"
    echo "  $0 dev           # Start both frontend and backend"
    echo "  $0 frontend      # Start frontend only"
    echo "  $0 backend       # Start backend only"
    echo "  $0 build         # Build Docker image"
    echo "  $0 container     # Run in Docker"
    echo ""
    echo "Note: For deployment, use the config repository's Helm charts"
}

# Main script logic
case "${1:-help}" in
    install)
        install_deps
        ;;
    test)
        run_tests
        ;;
    lint)
        run_lint
        ;;
    build-apps)
        build_apps
        ;;
    build)
        build_image
        ;;
    run)
        run_local
        ;;
    dev)
        run_dev
        ;;
    frontend)
        run_frontend
        ;;
    backend)
        run_backend
        ;;
    container)
        build_image
        run_container
        ;;
    health)
        health_check
        ;;
    help|*)
        show_help
        ;;
esac
