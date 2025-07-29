# Deployment Guide

This guide explains how to deploy the Test Application using the Spanda Platform's Landing Zone pattern.

## Prerequisites

- Access to the platform's landing zone repository
- Application repository pushed to GitHub
- Container registry access (GitHub Container Registry)

## Deployment Steps

### 1. Build and Push Container Image

The CI/CD pipeline automatically builds and pushes container images when code is committed:

```bash
# The pipeline builds images with these tags:
# - ghcr.io/your-org/test-application:latest (main branch)
# - ghcr.io/your-org/test-application:develop (develop branch)
# - ghcr.io/your-org/test-application:main-<sha> (commit SHA)
```

### 2. Create Landing Zone Registration

Create a registration file in the platform's landing zone repository:

```yaml
# In platform-repo/landing-zone/test-team/test-application-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: test-application-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/test-application.git
    targetRevision: main
    path: deploy/helm
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: test-app-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 3. ArgoCD Discovery

The platform's ApplicationSet will automatically discover the new registration file and create an ArgoCD Application.

### 4. Deployment Verification

Monitor the deployment:

```bash
# Check ArgoCD Application status
kubectl get applications -n argocd

# Check application pods
kubectl get pods -n test-app-prod

# Check application health
curl https://test-app.spanda.local/health
```

## Environment Management

### Development Environment

1. Create `test-application-dev.yaml` pointing to `develop` branch
2. Uses `values-dev.yaml` with reduced resources
3. Deploys to `test-app-dev` namespace

### Production Environment

1. Create `test-application-prod.yaml` pointing to `main` branch
2. Uses `values-prod.yaml` with production resources
3. Deploys to `test-app-prod` namespace
4. Includes autoscaling and anti-affinity rules

## Image Updates

### Automated Updates (Recommended)

The CI pipeline automatically updates the image tag in `values-prod.yaml` when code is pushed to main:

```yaml
# In values-prod.yaml
image:
  tag: "abc123def456"  # Updated by CI
```

### Manual Updates

Update the image tag manually in the values file:

```bash
# Edit values file
sed -i 's/tag: ".*"/tag: "new-tag"/' deploy/helm/values-prod.yaml

# Commit changes
git add deploy/helm/values-prod.yaml
git commit -m "Update image tag to new-tag"
git push
```

## Monitoring and Observability

The application exposes:

- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics` (Prometheus format)
- **Application Info**: `GET /`

Platform monitoring will automatically scrape metrics and monitor health.

## Troubleshooting

### Application Won't Start

1. Check pod logs:
   ```bash
   kubectl logs -n test-app-prod deployment/test-application
   ```

2. Check events:
   ```bash
   kubectl get events -n test-app-prod --sort-by='.lastTimestamp'
   ```

### ArgoCD Sync Issues

1. Check Application status:
   ```bash
   kubectl describe application test-application-prod -n argocd
   ```

2. Manual sync:
   ```bash
   argocd app sync test-application-prod
   ```

### Image Pull Issues

1. Verify image exists:
   ```bash
   docker pull ghcr.io/your-org/test-application:latest
   ```

2. Check image pull secrets in namespace

## Security Considerations

- Application runs as non-root user (UID 1001)
- Read-only root filesystem
- No privilege escalation
- Dropped all capabilities
- Resource limits enforced
- Network policies (if enabled)

## Scaling

### Manual Scaling

```bash
kubectl scale deployment test-application -n test-app-prod --replicas=5
```

### Automatic Scaling

HPA is configured in production:
- Min replicas: 3
- Max replicas: 10
- CPU target: 70%
- Memory target: 70%
