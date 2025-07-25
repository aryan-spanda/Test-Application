# Test Application Development Helper for Windows
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker first."
        exit 1
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Info "Installing dependencies..."
    npm install
}

# Run tests
function Invoke-Tests {
    Write-Info "Running tests..."
    npm test
}

# Run linter
function Invoke-Lint {
    Write-Info "Running linter..."
    npm run lint
}

# Build Docker image
function Build-Image {
    Test-Docker
    Write-Info "Building Docker image..."
    docker build -t test-application:local .
}

# Run Docker container locally
function Start-Container {
    Test-Docker
    Write-Info "Running container locally..."
    docker run --rm -p 3000:3000 --name test-app-local test-application:local
}

# Run application locally (no Docker)
function Start-Local {
    Write-Info "Starting application locally..."
    npm start
}

# Run in development mode with nodemon
function Start-Dev {
    Write-Info "Starting application in development mode..."
    npm run dev
}

# Validate Helm chart
function Test-Helm {
    Write-Info "Validating Helm chart..."
    if (!(Get-Command helm -ErrorAction SilentlyContinue)) {
        Write-Error "Helm is not installed. Please install Helm first."
        exit 1
    }
    
    helm lint deploy/helm/
    helm template test-app deploy/helm/ --values deploy/helm/values-dev.yaml
}

# Deploy to local Kubernetes
function Deploy-LocalK8s {
    Write-Info "Deploying to local Kubernetes..."
    if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Error "kubectl is not installed. Please install kubectl first."
        exit 1
    }
    
    # Create namespace
    kubectl create namespace test-app-local --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy using Helm
    helm upgrade --install test-app deploy/helm/ `
        --namespace test-app-local `
        --values deploy/helm/values-dev.yaml `
        --set image.repository=test-application `
        --set image.tag=local `
        --set ingress.enabled=false
}

# Health check
function Test-Health {
    Write-Info "Performing health check..."
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
        Write-Info "Health check passed"
        Write-Host "Status: $($response.status)"
    }
    catch {
        Write-Error "Health check failed"
        exit 1
    }
}

# Show help
function Show-Help {
    Write-Host "Test Application Development Helper" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\scripts\dev.ps1 [command]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  install          Install npm dependencies"
    Write-Host "  test             Run tests"
    Write-Host "  lint             Run linter"
    Write-Host "  build            Build Docker image"
    Write-Host "  run              Run application locally (no Docker)"
    Write-Host "  dev              Run in development mode with nodemon"
    Write-Host "  container        Run Docker container locally"
    Write-Host "  validate-helm    Validate Helm chart"
    Write-Host "  deploy-local     Deploy to local Kubernetes"
    Write-Host "  health           Perform health check"
    Write-Host "  help             Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\dev.ps1 install       # Install dependencies"
    Write-Host "  .\scripts\dev.ps1 dev           # Start development server"
    Write-Host "  .\scripts\dev.ps1 build         # Build Docker image"
    Write-Host "  .\scripts\dev.ps1 container     # Run in Docker"
}

# Main script logic
switch ($Command.ToLower()) {
    "install" {
        Install-Dependencies
    }
    "test" {
        Invoke-Tests
    }
    "lint" {
        Invoke-Lint
    }
    "build" {
        Build-Image
    }
    "run" {
        Start-Local
    }
    "dev" {
        Start-Dev
    }
    "container" {
        Build-Image
        Start-Container
    }
    "validate-helm" {
        Test-Helm
    }
    "deploy-local" {
        Build-Image
        Deploy-LocalK8s
    }
    "health" {
        Test-Health
    }
    default {
        Show-Help
    }
}
