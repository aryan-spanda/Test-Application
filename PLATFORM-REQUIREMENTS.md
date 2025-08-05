# Platform Requirements Configuration

This file (`platform-requirements.yml`) allows you to specify which bare-metal platform modules your application needs. The platform team will automatically configure the infrastructure based on your requirements.

## **How It Works**

1. **You specify requirements** in `platform-requirements.yml`
2. **CI/CD pipeline reads your requirements** and generates platform configuration
3. **Platform modules are automatically enabled/disabled** based on your needs
4. **Infrastructure is provisioned** according to your specifications

## **Basic Configuration**

```yaml
# Application Information
app:
  name: "my-app"
  environment: "staging"  # staging, production

# Frontend Requirements
frontend:
  enabled: true
  framework: "react"
  modules:
    external_load_balancer: true      # ✅ Enable public access
    ssl_termination: true             # ✅ Enable HTTPS
    cdn: false                        # ❌ Disable CDN (expensive)
    
    
# Backend Requirements  
backend:
  enabled: true
  framework: "express"
  modules:
    internal_load_balancer: true      # ✅ Enable internal networking
    external_api_access: true         # ✅ Enable external API access
    monitoring: true                  # ✅ Enable observability
```

## **Module Reference**

### **Frontend Modules**
- `external_load_balancer`: Public internet access for your frontend
- `ssl_termination`: HTTPS/TLS termination (recommended for production)
- `cdn`: Content Delivery Network for global performance
- `waf`: Web Application Firewall for security

### **Backend Modules**
- `internal_load_balancer`: Load balancing for internal services
- `external_api_access`: External API endpoints (REST/GraphQL)
- `service_mesh`: Advanced service-to-service communication
- `monitoring`: Metrics, logging, and observability

### **Shared Infrastructure**
- `vpc_networking`: Virtual Private Cloud (usually required)
- `firewall`: Security rules and network policies
- `logging`: Centralized log aggregation
- `secrets_management`: Secure secret storage
- `backup`: Automated backup solutions
- `disaster_recovery`: Multi-region failover

## **Platform-Managed Resources**

**⚠️ Important**: Resource allocation (CPU, memory, replicas) is standardized and managed by the platform team. These cannot be modified in your requirements file.

### **Standard Resource Tiers**

**STAGING Environment** (automatically applied):
- Frontend: 1 replica, 100m CPU, 128Mi memory
- Backend: 1 replica, 200m CPU, 256Mi memory
- Modules: Basic features only (expensive modules disabled)

**PRODUCTION Environment** (automatically applied):
- Frontend: 3 replicas, 500m CPU, 512Mi memory
- Backend: 3 replicas, 1000m CPU, 1Gi memory
- Modules: Full security and reliability features enabled

### **Custom Resource Requests**

If your application requires different resources:
1. Contact the platform team with business justification
2. Provide performance testing data supporting the request
3. Include expected traffic/load patterns

Available tiers: Small (staging), Medium (production), Large (custom)

## **Common Patterns**

### **Simple Static Website**
```yaml
frontend:
  enabled: true
  modules:
    external_load_balancer: true
    ssl_termination: true
    cdn: true

backend:
  enabled: false
```

### **Full-Stack Application**
```yaml  
frontend:
  enabled: true
  modules:
    external_load_balancer: true
    ssl_termination: true
    
backend:
  enabled: true
  modules:
    internal_load_balancer: true
    external_api_access: true
    monitoring: true
```

### **API-Only Service**
```yaml
frontend:
  enabled: false
  
backend:
  enabled: true
  modules:
    external_api_access: true
    monitoring: true
    service_mesh: true  # For microservices
```

### **High-Availability Production App**
```yaml
production:
  frontend:
    replicas: 5
  backend:
    replicas: 3
  modules:
    cdn: true
    waf: true
    backup: true
    disaster_recovery: true
    compliance_scanning: true
```

## **Cost Considerations**

### **Free/Low-Cost Modules**
- `vpc_networking`, `firewall`, `logging`
- `internal_load_balancer`, `monitoring`
- `secrets_management`

### **Moderate-Cost Modules**
- `external_load_balancer`, `ssl_termination`
- `external_api_access`, `backup`

### **Higher-Cost Modules**
- `cdn`, `waf`, `service_mesh`
- `disaster_recovery`, `compliance_scanning`

## **Best Practices**

1. **Start Simple**: Enable only what you need initially
2. **Use Environment Overrides**: Different settings for dev/staging/prod
3. **Monitor Costs**: Review module usage regularly
4. **Security First**: Always enable `firewall` and `ssl_termination` for public apps
5. **Gradual Enhancement**: Add advanced features as you scale

## **Validation**

The platform workflow will validate your configuration and:
- ✅ Check for required modules based on your app type
- ✅ Warn about expensive module combinations
- ✅ Ensure security modules are enabled for production
- ❌ Fail if incompatible modules are requested

## **Getting Help**

- **Module Questions**: Contact the platform team
- **Cost Estimates**: Use the platform cost calculator
- **Best Practices**: See our architecture decision records
- **Troubleshooting**: Check the GitOps deployment logs

## **Migration from Old System**

If you previously had a `platform-modules.yaml` in your config-repo:

1. **Copy the module settings** to your new `platform-requirements.yml`
2. **Remove the old file** from config-repo (platform team handles this)
3. **Test your deployment** to ensure everything works
4. **Fine-tune** your requirements based on actual usage

Your new `platform-requirements.yml` is much more developer-friendly and includes documentation right in the file!
