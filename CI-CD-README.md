# Universal CI/CD Integration Guide

## Overview

This template provides a **dynamic, flexible CI/CD approach** that automatically detects and builds all microservices in your application. It works for applications with **any number of microservices** (2, 3, 4, 5, etc.).

## How It Works

### 🔍 **Automatic Discovery**
The pipeline scans the `src/` directory for any subdirectory containing a `Dockerfile`:

```bash
src/
├── frontend/Dockerfile     ✅ Found: "frontend"
├── backend/Dockerfile      ✅ Found: "backend" 
├── api-gateway/Dockerfile  ✅ Found: "api-gateway"
├── worker/Dockerfile       ✅ Found: "worker"
└── shared/                 ❌ Ignored: no Dockerfile
```

### 🏗️ **Matrix Build Strategy**
Uses CI/CD matrix builds to build all services in parallel:
- **Faster**: All services build simultaneously
- **Scalable**: Automatically handles new microservices
- **Consistent**: Same build process for all services

### 📦 **Smart Image Tagging**
Each service gets its own image tags:
```
aryanpola/sample-application:frontend-abc123
aryanpola/sample-application:backend-abc123  
aryanpola/sample-application:api-gateway-abc123
aryanpola/sample-application:worker-abc123
```

## Supported Application Architectures

### ✅ **2-Service Architecture** (Current)
```
src/
├── frontend/Dockerfile
└── backend/Dockerfile
```
**Images**: `frontend-latest`, `backend-latest`

### ✅ **3-Service Architecture**
```
src/
├── frontend/Dockerfile
├── backend/Dockerfile  
└── api-gateway/Dockerfile
```
**Images**: `frontend-latest`, `backend-latest`, `api-gateway-latest`

### ✅ **5-Service Architecture**
```
src/
├── web-ui/Dockerfile
├── mobile-api/Dockerfile
├── user-service/Dockerfile
├── notification-service/Dockerfile
└── payment-service/Dockerfile
```
**Images**: `web-ui-latest`, `mobile-api-latest`, `user-service-latest`, etc.

### ✅ **Complex Architecture**
```
src/
├── frontend/
│   ├── web/Dockerfile          # web frontend
│   └── mobile/Dockerfile       # mobile API
├── backend/
│   ├── auth/Dockerfile         # authentication service
│   ├── orders/Dockerfile       # order management
│   └── inventory/Dockerfile    # inventory service
└── infrastructure/
    ├── api-gateway/Dockerfile  # API gateway
    └── worker/Dockerfile       # background jobs
```

## Build Commands for Any Architecture

### Individual Service (Development)
```bash
# Build any service manually
docker build -f src/{service-name}/Dockerfile -t test-{service-name} .

# Examples:
docker build -f src/frontend/Dockerfile -t test-frontend .
docker build -f src/api-gateway/Dockerfile -t test-api-gateway .
```

### Local Development
```bash
# The docker-compose.yml will automatically use all discovered services
docker-compose up
```

## CI/CD Pipeline Requirements

Your CI/CD pipeline should:

1. **Build both images** using the commands above
2. **Tag images** with commit SHA or version tags
3. **Push to registry** (docker.io/aryanpola/sample-application)
4. **Update deployment** by triggering ArgoCD or updating Helm values

## Image Naming Convention

- **Frontend**: `aryanpola/sample-application:frontend-{version}`
- **Backend**: `aryanpola/sample-application:backend-{version}`

Where `{version}` can be:
- `latest` for main branch
- `{commit-sha}` for specific commits  
- `{branch-name}` for feature branches
- `{tag}` for releases

## ArgoCD Integration

The application is configured to work with ArgoCD Image Updater:

- **Frontend image tag**: Configured in `values.yaml` as `frontend.image.tag`
- **Backend image tag**: Configured in `values.yaml` as `backend.image.tag`
- **Auto-updates**: ArgoCD Image Updater monitors registry and updates deployments

## Environment Configuration

The application supports multiple environments:
- **Development**: `values-dev.yaml` with `deploymentMode: microservices`
- **Staging**: `values-staging.yaml` (if exists)
- **Production**: `values-production.yaml` (if exists)

## Manual Build (Development Only)

For local development and testing:

```bash
# Build frontend
docker build -f src/frontend/Dockerfile -t test-frontend .

# Build backend
docker build -f src/backend/Dockerfile -t test-backend .

# Run locally
docker-compose up
```

## Next Steps

1. **Set up CI/CD pipeline** using the template in `.github/workflows/ci-cd-template.yml`
2. **Configure registry credentials** in your CI/CD platform
3. **Test the pipeline** by pushing code changes
4. **Verify ArgoCD** picks up the new images and deploys automatically
