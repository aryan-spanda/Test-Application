# Example Landing Zone Registration Files

These are example registration files that would go in your platform/landing-zone repository to reference this application.

## Option A: Direct ArgoCD Application

```yaml
# landing-zone/test-team/test-application-dev.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: test-application-dev
  namespace: argocd
  labels:
    team: test-team
    environment: dev
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/test-application.git
    targetRevision: develop
    path: deploy/helm
    helm:
      valueFiles:
        - values-dev.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: test-app-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

```yaml
# landing-zone/test-team/test-application-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: test-application-prod
  namespace: argocd
  labels:
    team: test-team
    environment: prod
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

## Option B: Custom AppRegistration CRD

```yaml
# landing-zone/test-team/test-application.yaml
apiVersion: platform.spanda.io/v1
kind: AppRegistration
metadata:
  name: test-application
  namespace: platform-system
spec:
  application:
    name: test-application
    team: test-team
    description: "Sample test application for platform demo"
  
  source:
    repository: https://github.com/your-org/test-application.git
    path: deploy/helm
    
  environments:
    - name: dev
      branch: develop
      namespace: test-app-dev
      replicas: 1
      resources:
        requests:
          cpu: 50m
          memory: 64Mi
        limits:
          cpu: 200m
          memory: 256Mi
      
    - name: prod
      branch: main
      namespace: test-app-prod
      replicas: 3
      resources:
        requests:
          cpu: 200m
          memory: 256Mi
        limits:
          cpu: 1000m
          memory: 1Gi
      autoscaling:
        enabled: true
        minReplicas: 3
        maxReplicas: 10
  
  ingress:
    enabled: true
    hosts:
      dev: test-app-dev.spanda.local
      prod: test-app.spanda.local
    tls: true
  
  monitoring:
    enabled: true
    healthCheck: /health
    metrics: /metrics
  
  security:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
```
