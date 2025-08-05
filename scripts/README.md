# Development Scripts

This directory contains development helper scripts to make working with the Test Application easier.

## Available Scripts

### For Unix/Linux/Mac: `dev.sh`
### For Windows: `dev.ps1`

Both scripts provide the same functionality with platform-specific implementations.

## Usage

### Unix/Linux/Mac:
```bash
./scripts/dev.sh [command]
```

### Windows:
```powershell
.\scripts\dev.ps1 [command]
```


## Available Commands

| Command | Description |
|---------|-------------|
| `install` | Install dependencies for all workspaces (frontend + backend) |
| `test` | Run tests for both frontend and backend |
| `lint` | Run linter for both frontend and backend |
| `build-apps` | Build both frontend and backend applications |
| `build` | Build Docker image for the entire application |
| `run` | Run backend only in production mode |
| `dev` | Run both frontend and backend in development mode with hot reload |
| `frontend` | Run frontend only in development mode |
| `backend` | Run backend only in development mode |
| `container` | Build and run the application in a Docker container |
| `health` | Perform health check on running application |
| `help` | Show help message |

## Examples

```bash
# Start development (both frontend and backend)
./scripts/dev.sh dev

# Run only frontend for UI development
./scripts/dev.sh frontend

# Run only backend for API development  
./scripts/dev.sh backend

# Build and test Docker image
./scripts/dev.sh build
./scripts/dev.sh container

# Run tests and linting
./scripts/dev.sh test
./scripts/dev.sh lint
```

## Key Features

✅ **Monorepo Support**: Works with the new `src/frontend` and `src/backend` structure
✅ **Development Focus**: Only includes application development commands
✅ **Cross-Platform**: Both Unix shell and PowerShell versions
✅ **Clean Separation**: No deployment commands (those belong in config-repo)

## What Was Removed

❌ **Helm Validation**: Removed `validate-helm` (use config-repo instead)
❌ **Local Deployment**: Removed `deploy-local` (use config-repo + ArgoCD)
❌ **Old Structure**: Updated all commands for new monorepo structure

## Note on Deployment

For deployment-related tasks, use the **Spanda-config repository** which contains:
- Helm charts
- ArgoCD applications
- Platform configurations
- Environment-specific values

This maintains clean separation between application code and deployment configuration.
