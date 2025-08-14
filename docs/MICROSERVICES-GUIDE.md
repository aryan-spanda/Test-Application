# Microservices Architecture Guide

This document explains how to build, deploy, and manage the Test Application as separate microservices.

## Architecture Overview

The application is split into two microservices:

- **Frontend Service**: NGINX serving React application (port 3000)
- **Backend Service**: Node.js API server (port 8080)

## Separate Dockerfiles Architecture

This application follows true microservices best practices with **separate Dockerfiles for each service**:

- **Frontend Dockerfile**: `src/frontend/Dockerfile` - NGINX serving React application  
- **Backend Dockerfile**: `src/backend/Dockerfile` - Node.js API server

### Why Separate Dockerfiles?

✅ **Independent Builds**: Each service has different dependencies and build steps  
✅ **Independent Scaling**: Scale frontend and backend separately based on load  
✅ **Independent Updates**: Deploy services independently without affecting others  
✅ **Smaller Images**: Each image contains only what that service needs  
✅ **True Decoupling**: Complete isolation between microservices

## Building Individual Services

### Build Frontend Only
```bash
docker build -f src/frontend/Dockerfile -t my-frontend:latest .
```

### Build Backend Only  
```bash
docker build -f src/backend/Dockerfile -t my-backend:latest .
```

## Build Scripts

### Automated Building

Use the provided scripts to build both images:

**Linux/Mac:**
```bash
./scripts/build-images.sh latest
./scripts/build-images.sh latest --push  # Also push to registry
```

**Windows:**
```cmd
scripts\build-images.bat latest
scripts\build-images.bat latest --push
```

## Local Development

### Docker Compose

Run microservices locally:

```bash
# Start both services
docker-compose -f docker-compose.microservices.yml up

# Backend available at: http://localhost:8080
# Frontend available at: http://localhost:3000
```

### Service Communication

- Frontend calls backend via `/api/*` proxy
- NGINX configuration handles the routing
- Backend service discovery via container names

## Kubernetes Deployment

### Helm Configuration

The application supports two deployment modes:

1. **Unified Mode** (`deploymentMode: "unified"`)
   - Single container with both frontend and backend
   - Good for simple deployments

2. **Microservices Mode** (`deploymentMode: "microservices"`)
   - Separate pods for frontend and backend
   - Independent scaling and resource allocation

### Enable Microservices Mode

Update `values-dev.yaml`:

```yaml
app:
  deploymentMode: microservices
```

### Deploy with Scripts

**Linux/Mac:**
```bash
./scripts/deploy-microservices.sh default latest dev
```

**Windows PowerShell:**
```powershell
.\scripts\deploy-microservices.ps1 -Namespace "default" -Version "latest" -Environment "dev"
```

## Network Architecture

### Service Communication

```
[Internet] -> [Ingress] -> [Frontend Service] -> [Frontend Pods]
                                    |
                                    v
                            [Backend Service] -> [Backend Pods]
```

### Network Policies

When enabled, network policies ensure:

- Frontend can communicate with backend on port 8080
- Backend can respond to frontend requests  
- Both services can access DNS and external APIs
- Ingress controller can reach frontend

## Scaling Configuration

### Frontend Scaling
- Default: 2-5 replicas
- CPU threshold: 70%
- Handles static content and API proxying

### Backend Scaling  
- Default: 2-8 replicas
- CPU threshold: 75%
- Processes API requests and business logic

## Resource Allocation

### Frontend Resources
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 200m  
    memory: 256Mi
```

### Backend Resources
```yaml
resources:
  requests:
    cpu: 150m
    memory: 256Mi
  limits:
    cpu: 300m
    memory: 512Mi
```

## Health Checks

Both services include comprehensive health checks:

- **Liveness Probe**: Ensures container is running
- **Readiness Probe**: Ensures service is ready for traffic  
- **Health Endpoints**: `/health` for monitoring

## Security Features

- Non-root user execution
- Security context constraints
- Network policy isolation
- Security headers (NGINX)
- Input validation and sanitization

## Monitoring & Observability

- Structured logging with correlation IDs
- Prometheus metrics endpoints
- Health check endpoints for monitoring
- Request tracing between services

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -l "app.kubernetes.io/name=test-application"
```

### View Logs
```bash
# Frontend logs
kubectl logs -l "component=frontend"

# Backend logs  
kubectl logs -l "component=backend"
```

### Test Service Communication
```bash
# Port forward to test services
kubectl port-forward svc/test-application-frontend 3000:80
kubectl port-forward svc/test-application-backend 8080:80
```

### Common Issues

1. **Image Pull Errors**: Ensure images are built and pushed
2. **Service Discovery**: Check service names and ports
3. **Network Policies**: Verify ingress/egress rules
4. **Resource Limits**: Monitor CPU/memory usage

## CI/CD Integration

### Build Pipeline
1. Build frontend image with target `frontend`
2. Build backend image with target `backend` 
3. Push both images to registry
4. Update Helm values with new image tags
5. Deploy via ArgoCD or Helm

### GitOps Workflow
1. Code changes trigger image builds
2. ArgoCD Image Updater detects new images
3. Helm charts updated with new tags
4. Kubernetes deployments rolled out
5. Health checks verify deployment

This architecture provides the benefits of microservices (independent scaling, deployment, and development) while maintaining the simplicity of a single repository and build process.
