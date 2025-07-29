# Dummy Full-Stack Application Development Helper for Windows
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
        return $false
    }
}

# Install dependencies for both frontend and backend
function Install-Dependencies {
    Write-Info "Installing dependencies for both frontend and backend..."
    
    Write-Info "Installing backend dependencies..."
    Push-Location backend
    npm install
    Pop-Location
    
    Write-Info "Installing frontend dependencies..."
    Push-Location frontend
    npm install
    Pop-Location
    
    Write-Info "Dependencies installed successfully!"
}

# Run tests for both components
function Run-Tests {
    Write-Info "Running tests for both frontend and backend..."
    
    Write-Info "Running backend tests..."
    Push-Location backend
    npm test
    Pop-Location
    
    Write-Info "Running frontend tests..."
    Push-Location frontend
    npm test
    Pop-Location
}

# Build Docker images
function Build-Images {
    if (-not (Test-Docker)) { return }
    
    Write-Info "Building Docker images..."
    
    Write-Info "Building backend image..."
    Push-Location backend
    docker build -t dummy-backend:local .
    Pop-Location
    
    Write-Info "Building frontend image..."
    Push-Location frontend
    docker build -t dummy-frontend:local .
    Pop-Location
    
    Write-Info "Docker images built successfully!"
}

# Run backend only
function Run-Backend {
    Write-Info "Starting backend in development mode on port 8080..."
    Push-Location backend
    npm run dev
    Pop-Location
}

# Run frontend only  
function Run-Frontend {
    Write-Info "Starting frontend in development mode on port 3000..."
    Push-Location frontend
    npm start
    Pop-Location
}

# Health check
function Test-Health {
    Write-Info "Performing health check..."
    
    try {
        $backendResponse = Invoke-RestMethod -Uri "http://localhost:8080/health" -Method Get -TimeoutSec 5
        if ($backendResponse.status -eq "healthy") {
            Write-Info "Backend health check passed - Status: $($backendResponse.status)"
        } else {
            Write-Warn "Backend health check returned: $($backendResponse.status)"
        }
    }
    catch {
        Write-Error "Backend health check failed. Is the backend running on port 8080?"
    }
    
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5 -UseBasicParsing
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Info "Frontend health check passed - Status: $($frontendResponse.StatusCode)"
        }
    }
    catch {
        Write-Error "Frontend health check failed. Is the frontend running on port 3000?"
    }
}

# Show help
function Show-Help {
    Write-Host ""
    Write-Host "Dummy Full-Stack Application Development Helper" -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\scripts\fullstack.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  install          Install npm dependencies for both frontend and backend"
    Write-Host "  test             Run tests for both components"
    Write-Host "  build            Build Docker images for both components"
    Write-Host "  backend          Run backend only in development mode (port 8080)"
    Write-Host "  frontend         Run frontend only in development mode (port 3000)"
    Write-Host "  health           Perform health check on running applications"
    Write-Host "  help             Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\scripts\fullstack.ps1 install       # Install all dependencies"
    Write-Host "  .\scripts\fullstack.ps1 backend       # Start backend server"
    Write-Host "  .\scripts\fullstack.ps1 frontend      # Start frontend server"
    Write-Host "  .\scripts\fullstack.ps1 build         # Build Docker images"
    Write-Host "  .\scripts\fullstack.ps1 health        # Check application health"
    Write-Host ""
    Write-Host "Application URLs:" -ForegroundColor Yellow
    Write-Host "  Frontend: http://localhost:3000"
    Write-Host "  Backend:  http://localhost:8080"
    Write-Host "  API Docs: http://localhost:8080/api/docs"
    Write-Host "  Health:   http://localhost:8080/health"
    Write-Host ""
    Write-Host "Development Workflow:" -ForegroundColor Magenta
    Write-Host "  1. Run 'install' to install dependencies"
    Write-Host "  2. Open two terminals"
    Write-Host "  3. In first terminal: .\scripts\fullstack.ps1 backend"
    Write-Host "  4. In second terminal: .\scripts\fullstack.ps1 frontend"
    Write-Host "  5. Open http://localhost:3000 in your browser"
    Write-Host ""
}

# Main script logic
switch ($Command.ToLower()) {
    "install" { Install-Dependencies }
    "test" { Run-Tests }
    "build" { Build-Images }
    "backend" { Run-Backend }
    "frontend" { Run-Frontend }
    "health" { Test-Health }
    default { Show-Help }
}
