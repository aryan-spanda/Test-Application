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
    log_info "Installing dependencies..."
    npm install
}

# Run tests
run_tests() {
    log_info "Running tests..."
    npm test
}

# Run linter
run_lint() {
    log_info "Running linter..."
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
    log_info "Starting application locally..."
    npm start
}

# Run in development mode with nodemon
run_dev() {
    log_info "Starting application in development mode..."
    npm run dev
}

# Validate Helm chart
validate_helm() {
    log_info "Validating Helm chart..."
    if ! command -v helm &> /dev/null; then
        log_error "Helm is not installed. Please install Helm first."
        exit 1
    fi
    
    helm lint deploy/helm/
    helm template test-app deploy/helm/ --values deploy/helm/values-dev.yaml
}

# Deploy to local Kubernetes (kind/minikube)
deploy_local_k8s() {
    log_info "Deploying to local Kubernetes..."
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Create namespace
    kubectl create namespace test-app-local --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy using Helm
    helm upgrade --install test-app deploy/helm/ \
        --namespace test-app-local \
        --values deploy/helm/values-dev.yaml \
        --set image.repository=test-application \
        --set image.tag=local \
        --set ingress.enabled=false
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
    echo "  install          Install npm dependencies"
    echo "  test             Run tests"
    echo "  lint             Run linter"
    echo "  build            Build Docker image"
    echo "  run              Run application locally (no Docker)"
    echo "  dev              Run in development mode with nodemon"
    echo "  container        Run Docker container locally"
    echo "  validate-helm    Validate Helm chart"
    echo "  deploy-local     Deploy to local Kubernetes"
    echo "  health           Perform health check"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install       # Install dependencies"
    echo "  $0 dev           # Start development server"
    echo "  $0 build         # Build Docker image"
    echo "  $0 container     # Run in Docker"
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
    build)
        build_image
        ;;
    run)
        run_local
        ;;
    dev)
        run_dev
        ;;
    container)
        build_image
        run_container
        ;;
    validate-helm)
        validate_helm
        ;;
    deploy-local)
        build_image
        deploy_local_k8s
        ;;
    health)
        health_check
        ;;
    help|*)
        show_help
        ;;
esac
