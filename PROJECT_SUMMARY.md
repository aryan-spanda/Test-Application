# Test Application Repository

## Overview

This is a complete application repository following the **Pure Reference Landing Zone** pattern for the Spanda Platform. The repository contains everything needed for a production-ready Node.js application that can be deployed via ArgoCD through the platform's landing zone.

## Repository Structure

```
test-application/
├── src/                           # Application source code
│   ├── server.js                  # Main Express.js server
│   └── server.test.js             # Unit tests
├── deploy/                        # Deployment configurations (ArgoCD reads this)
│   ├── k8s/                       # Raw Kubernetes manifests
│   │   └── manifests.yaml
│   └── helm/                      # Helm chart (recommended)
│       ├── Chart.yaml
│       ├── values.yaml            # Default values
│       ├── values-dev.yaml        # Development environment
│       ├── values-prod.yaml       # Production environment
│       └── templates/             # Helm templates
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
│           ├── serviceaccount.yaml
│           ├── hpa.yaml
│           └── _helpers.tpl
├── .github/workflows/             # CI/CD pipeline
│   └── ci.yml                     # GitHub Actions workflow
├── scripts/                       # Development helpers
│   ├── dev.sh                     # Linux/Mac development script
│   └── dev.ps1                    # Windows PowerShell script
├── docs/                          # Documentation
│   ├── deployment.md              # Deployment guide
│   └── landing-zone-examples.md   # Example registration files
├── Dockerfile                     # Container build instructions
├── package.json                   # Node.js dependencies
├── jest.config.js                 # Test configuration
├── .eslintrc.js                   # Linting configuration
├── .gitignore                     # Git ignore patterns
├── .dockerignore                  # Docker ignore patterns
└── README.md                      # Project documentation
```

## Key Features

### Application Features
- **Express.js API** with health checks and metrics
- **Prometheus metrics** endpoint (`/metrics`)
- **Health check** endpoint (`/health`)
- **Security hardened** (non-root user, read-only filesystem)
- **Unit tests** with Jest
- **Code linting** with ESLint

### Deployment Features
- **Multi-environment support** (dev, prod)
- **Helm chart** with customizable values
- **Horizontal Pod Autoscaler** for production
- **Security policies** (Pod Security Standards compliant)
- **Resource limits** and requests
- **Ingress configuration** with TLS
- **Service account** management

### CI/CD Features
- **Automated testing** on pull requests
- **Docker image building** and publishing
- **Security scanning** with Trivy
- **Automatic image tag updates**
- **Multi-branch support** (main, develop)

## Pure Reference Landing Zone Integration

This application follows the pure reference pattern where:

1. **Application Repository** (this repo): Contains source code and deployment manifests
2. **Landing Zone Repository**: Contains only registration files that point to this repo
3. **ArgoCD**: Reads manifests from this repo based on landing zone references

### Landing Zone Registration Example

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
    repoURL: https://github.com/your-org/test-application.git  # This repo
    targetRevision: main
    path: deploy/helm                                          # Points to our manifests
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
```

## Getting Started

### 1. Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Using the helper script (Linux/Mac)
./scripts/dev.sh dev

# Using PowerShell script (Windows)
.\scripts\dev.ps1 dev
```

### 2. Build and Test Locally

```bash
# Build Docker image
docker build -t test-application:local .

# Run container
docker run -p 3000:3000 test-application:local

# Test health endpoint
curl http://localhost:3000/health
```

### 3. Deploy to Platform

1. **Push to GitHub**: Push this repository to your GitHub organization
2. **Create Registration**: Add a registration file in the platform's landing zone repo
3. **ArgoCD Discovery**: Platform ApplicationSet automatically discovers and deploys
4. **Monitor**: Check ArgoCD UI and Kubernetes for deployment status

## Environment Variables

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (info/debug/error)

## API Endpoints

- `GET /` - Welcome message with application info
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics
- `GET /api/users` - Sample API endpoint
- `GET /api/status` - Application status

## Security Features

- Non-root user (UID 1001)
- Read-only root filesystem
- No privilege escalation
- Dropped all capabilities
- Resource limits enforced
- Security scanning in CI

## Monitoring and Observability

- **Health Checks**: Kubernetes liveness and readiness probes
- **Metrics**: Prometheus metrics with custom HTTP request metrics
- **Logging**: Structured logging with Morgan middleware
- **Tracing**: Ready for distributed tracing integration

## Next Steps

1. **Customize the Application**: Modify `src/server.js` for your use case
2. **Update Configuration**: Adjust Helm values for your requirements
3. **Set Registry**: Update image repository in values files
4. **Create Registration**: Add to platform landing zone
5. **Deploy**: Push code and create landing zone registration

This repository provides a complete template for applications following the Spanda Platform's pure reference landing zone pattern.
