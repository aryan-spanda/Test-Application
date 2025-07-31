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
    Write-Info "Installing dependencies for all workspaces..."
    npm run install:all
}

# Run tests
function Invoke-Tests {
    Write-Info "Running tests for all workspaces..."
    npm test
}

# Run linter
function Invoke-Lint {
    Write-Info "Running linter for all workspaces..."
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
    Write-Info "Starting backend only..."
    Set-Location src/backend
    npm start
    Set-Location ../..
}

# Run in development mode with hot reload
function Start-Dev {
    Write-Info "Starting both frontend and backend in development mode..."
    npm run dev
}

# Run frontend only
function Start-Frontend {
    Write-Info "Starting frontend only..."
    npm run dev:frontend
}

# Run backend only
function Start-Backend {
    Write-Info "Starting backend only..."
    npm run dev:backend
}

# Build applications
function Build-Apps {
    Write-Info "Building both frontend and backend..."
    npm run build
}
    
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
    Write-Host "  install          Install dependencies for all workspaces"
    Write-Host "  test             Run tests for frontend and backend"
    Write-Host "  lint             Run linter for frontend and backend"
    Write-Host "  build-apps       Build frontend and backend applications"
    Write-Host "  build            Build Docker image"
    Write-Host "  run              Run backend only (production mode)"
    Write-Host "  dev              Run both frontend and backend (development mode)"
    Write-Host "  frontend         Run frontend only (development mode)"
    Write-Host "  backend          Run backend only (development mode)"
    Write-Host "  container        Build and run Docker container locally"
    Write-Host "  health           Perform health check"
    Write-Host "  help             Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\dev.ps1 install       # Install all dependencies"
    Write-Host "  .\scripts\dev.ps1 dev           # Start both frontend and backend"
    Write-Host "  .\scripts\dev.ps1 frontend      # Start frontend only"
    Write-Host "  .\scripts\dev.ps1 backend       # Start backend only"
    Write-Host "  .\scripts\dev.ps1 build         # Build Docker image"
    Write-Host "  .\scripts\dev.ps1 container     # Run in Docker"
    Write-Host ""
    Write-Host "Note: For deployment, use the config repository's Helm charts" -ForegroundColor Yellow
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
    "build-apps" {
        Build-Apps
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
    "frontend" {
        Start-Frontend
    }
    "backend" {
        Start-Backend
    }
    "container" {
        Build-Image
        Start-Container
    }
    "health" {
        Test-Health
    }
    default {
        Show-Help
    }
}
