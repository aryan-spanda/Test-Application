# Spanda Platform - Application Deployment Guide

This guide shows how to deploy your application using the Spanda Platform with **minimal configuration**.

## 🚀 Quick Start

### 1. Add Platform Configuration

Create a `spanda-app.yaml` file in your repository root:

```yaml
# Spanda Platform Application Configuration
app:
  name: "your-app-name"
  team: "your-team-name"
  description: "Brief description of your app"
  repository: "your-dockerhub/repo-name"  # Docker Hub repository
  config_repo: "org-name/config-repo-name"  # Platform config repository

# Services your application provides
services:
  - name: "api"
    port: 3000
    protocol: "HTTP"
    path: "/api"
    healthCheck: "/health"

# Environment configurations
environments:
  staging:
    replicas: 2
    resources:
      cpu: "100m"
      memory: "128Mi"
    ingress:
      enabled: true
      domain: "staging.yourdomain.com"
    
  production:
    replicas: 5
    resources:
      cpu: "500m" 
      memory: "512Mi"
    ingress:
      enabled: true
      domain: "prod.yourdomain.com"

# Platform modules to enable
platform:
  networking: true      # Load balancer, ingress, network policies
  monitoring: true      # Prometheus, Grafana, alerts
  security: true        # RBAC, pod security, network policies
  storage: false        # Persistent volumes, backup
  logging: true         # Centralized logging
  autoscaling: false    # Horizontal pod autoscaler
```

### 2. Required Secrets

Add these secrets to your GitHub repository:

- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Your Docker Hub access token
- `GITOPS_PAT` - GitHub Personal Access Token with repo permissions

### 3. Deploy Your Application

Simply push to your main branch:

```bash
git add .
git commit -m "Deploy to Spanda Platform"
git push origin main
```

That's it! The platform will automatically:
- ✅ Build and test your application
- 🐳 Create and push Docker image
- 📋 Generate all Kubernetes manifests
- 🚀 Deploy to the cluster
- 📊 Set up monitoring and logging

## 📁 Required Repository Structure

Your application repository only needs these files:

```
your-app/
├── src/                    # Your application code
├── package.json           # Dependencies and scripts
├── Dockerfile            # Container build instructions
├── spanda-app.yaml       # Platform configuration (ONLY CONFIG FILE!)
├── .github/workflows/    # GitHub Actions (we provide this)
├── README.md             # Documentation
└── .gitignore           # Git ignore rules
```

## 🔧 Platform Features

### Automatic Infrastructure

When you enable platform modules, you get:

- **Networking**: Load balancer, ingress controller, network policies
- **Monitoring**: Prometheus metrics, Grafana dashboards, alerting
- **Security**: RBAC, pod security policies, network isolation
- **Logging**: Centralized log aggregation and retention
- **Autoscaling**: Horizontal pod autoscaler (if enabled)

### Multi-Environment Support

- **Staging**: Automatic deployment on every push
- **Production**: Manual approval or automatic based on your workflow

### Health Checks

The platform automatically configures:
- Liveness probes
- Readiness probes
- Service discovery
- Load balancing

## 📊 Monitoring Your Application

After deployment, access these dashboards:

- **ArgoCD**: https://argocd.yourdomain.com - GitOps deployment status
- **Grafana**: https://grafana.yourdomain.com - Application metrics
- **Prometheus**: https://prometheus.yourdomain.com - Raw metrics

## 🛠️ Advanced Configuration

### Custom Resource Limits

```yaml
environments:
  production:
    replicas: 10
    resources:
      cpu: "2000m"      # 2 CPU cores
      memory: "4Gi"     # 4 GB RAM
    scaling:
      minReplicas: 5
      maxReplicas: 20
      targetCPU: 70
```

### Multiple Services

```yaml
services:
  - name: "api"
    port: 3000
    path: "/api"
    healthCheck: "/health"
  - name: "frontend"
    port: 80
    path: "/"
    healthCheck: "/health"
```

### Storage Requirements

```yaml
platform:
  storage: true

environments:
  production:
    storage:
      size: "10Gi"
      class: "fast-ssd"
```

## 🔍 Troubleshooting

### Check Deployment Status

```bash
# View GitHub Actions
# Go to: https://github.com/your-org/your-repo/actions

# Check ArgoCD application
kubectl get applications -n argocd

# View application pods
kubectl get pods -n your-app-staging
```

### Common Issues

1. **Build Fails**: Check your Dockerfile and package.json
2. **Health Check Fails**: Ensure your app responds to the health check endpoint
3. **Image Push Fails**: Verify Docker Hub credentials
4. **Deployment Fails**: Check resource limits and namespace quotas

## 📞 Support

Need help? 
- 📧 Platform Team: platform@yourcompany.com
- 💬 Slack: #spanda-platform
- 📚 Documentation: https://docs.spanda-platform.com
