# Test Application Network Traffic Flow

This document visualizes the network traffic patterns for the test-application with NetworkPolicies enabled.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTPS (443)
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                  Load Balancer                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP/HTTPS (80/443)
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                nginx-ingress-controller                         │
│                  (ingress-nginx namespace)                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP (3000)
                          │ ✅ ALLOWED by NetworkPolicy
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                  test-application                               │
│                    (default namespace)                          │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │   Pod 1         │    │   Pod 2         │                   │
│  │  Port 3000      │    │  Port 3000      │                   │
│  └─────────────────┘    └─────────────────┘                   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ DNS (53), HTTPS (443)
                          │ ✅ ALLOWED by NetworkPolicy
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│              (APIs, Databases, etc.)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Traffic Flow

### 1. Ingress Traffic (TO the application)

```
Internet → Load Balancer → nginx-ingress → test-application:3000
    ✅                        ✅              ✅
   (No policy)         (Global infra      (App NetworkPolicy
                        allows this)       allows from nginx)
```

**Allowed Sources:**
- ✅ nginx-ingress-controller pods (from ingress-nginx namespace)
- ✅ Prometheus/monitoring pods (from monitoring namespace)
- ❌ Other applications in same namespace (blocked by default)
- ❌ Direct external access (blocked by ingress controller)

### 2. Egress Traffic (FROM the application)

```
test-application → DNS:53 → External Services:443
        ✅           ✅           ✅
   (App allows    (Global     (App allows
    DNS egress)   DNS rule)   HTTPS egress)
```

**Allowed Destinations:**
- ✅ DNS resolution (port 53 UDP/TCP) - Required for external calls
- ✅ External HTTPS APIs (port 443 TCP) - For service integrations
- ❌ External HTTP APIs (port 80 TCP) - Blocked for security
- ❌ Internal services (blocked unless explicitly configured)

## Environment-Specific Traffic Patterns

### Development Environment
```
NetworkPolicy: DISABLED
├── Ingress: ALL TRAFFIC ALLOWED (for debugging)
└── Egress: ALL TRAFFIC ALLOWED (for testing)
```

### Staging Environment
```
NetworkPolicy: ENABLED (Production-like)
├── Ingress: 
│   ├── ✅ nginx-ingress-controller
│   ├── ✅ monitoring
│   └── ✅ load-testing tools
└── Egress:
    ├── ✅ DNS resolution
    ├── ✅ HTTPS to external APIs
    ├── ✅ Database connections (staging DB)
    └── ❌ HTTP traffic (blocked)
```

### Production Environment
```
NetworkPolicy: ENABLED (Maximum Security)
├── Ingress:
│   ├── ✅ nginx-ingress-controller ONLY
│   └── ✅ monitoring ONLY
└── Egress:
    ├── ✅ DNS resolution
    ├── ✅ HTTPS to approved external APIs
    └── ❌ ALL other traffic (blocked)
```

## Security Boundaries

### Namespace Isolation
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ingress-nginx  │    │    default      │    │   monitoring    │
│                 │    │                 │    │                 │
│  nginx-ingress  │───▶│ test-application│◀───│   prometheus    │
│  controller     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ✅                      ▲                      ✅
   (Allowed ingress)            │                 (Allowed for
                                │                  metrics scraping)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                        │
│                                                                 │
│  DNS Servers    HTTPS APIs    Databases    Other Services      │
│      ✅           ✅            ❌             ❌               │
└─────────────────────────────────────────────────────────────────┘
```

### Pod-Level Security
```
test-application Pod
├── Listening on: 3000 (HTTP API)
├── Listening on: 3000 (Metrics endpoint)
│
├── Ingress Rules:
│   ├── ✅ FROM nginx-ingress → TO :3000
│   ├── ✅ FROM monitoring → TO :3000
│   └── ❌ FROM anywhere-else → TO :3000
│
└── Egress Rules:
    ├── ✅ TO anywhere → :53 (DNS)
    ├── ✅ TO anywhere → :443 (HTTPS)
    └── ❌ TO anywhere → :* (everything else)
```

## Traffic Flow Matrix

| Source | Destination | Port | Protocol | Allowed | Reason |
|--------|-------------|------|----------|---------|---------|
| Internet | nginx-ingress | 443 | TCP | ✅ | Load balancer allows |
| nginx-ingress | test-app | 3000 | TCP | ✅ | NetworkPolicy allows |
| monitoring | test-app | 3000 | TCP | ✅ | NetworkPolicy allows |
| other-app | test-app | 3000 | TCP | ❌ | NetworkPolicy blocks |
| test-app | DNS | 53 | UDP/TCP | ✅ | NetworkPolicy allows |
| test-app | External API | 443 | TCP | ✅ | NetworkPolicy allows |
| test-app | External API | 80 | TCP | ❌ | NetworkPolicy blocks |
| test-app | Internal DB | 5432 | TCP | ❌ | NetworkPolicy blocks* |

*\* Unless explicitly configured in values.yaml*

## Troubleshooting Network Issues

### Common Problems and Solutions

1. **Application not receiving traffic from ingress**
   - Check: `allowFromIngressController: true`
   - Verify: nginx-ingress namespace has correct labels

2. **Metrics scraping fails**
   - Check: `allowFromMonitoring: true`
   - Verify: monitoring namespace exists and has labels

3. **External API calls fail**
   - Check: `allowDNS: true` and `allowToInternet: true`
   - Verify: Using HTTPS (443) not HTTP (80)

4. **Database connections fail**
   - Check: `allowToDatabase: true`
   - Configure: `databaseServices` with correct namespace/labels

### Debug Commands

```bash
# Check if NetworkPolicy is applied
kubectl get networkpolicy -n default

# View NetworkPolicy details
kubectl describe networkpolicy test-application -n default

# Test DNS resolution from pod
kubectl exec -it <pod-name> -- nslookup google.com

# Test external connectivity
kubectl exec -it <pod-name> -- curl -I https://api.github.com

# Check pod labels (for policy matching)
kubectl get pods --show-labels -n default
```

This traffic flow ensures secure, controlled communication while maintaining the flexibility needed for different environments.
