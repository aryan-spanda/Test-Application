# Test Application - Restructured

This application has been restructured as a monorepo with a clean separation of frontend, backend, and shared code.

## New Structure

```
Test-Application/
├── src/
│   ├── frontend/          # React frontend application
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── package.json
│   ├── backend/           # Node.js backend application
│   │   ├── server.js
│   │   └── package.json
│   └── shared/            # Shared utilities and configurations
│       ├── constants/     # Shared constants
│       ├── utils/         # Common utility functions
│       ├── config/        # Shared configuration
│       └── types/         # TypeScript type definitions
├── package.json           # Root workspace configuration
└── Dockerfile             # Multi-stage build for both apps
```

## Key Changes Made

### 1. **Monorepo Workspace Setup**
- Root `package.json` now manages workspaces
- Frontend and backend have their own `package.json` files
- Unified development commands

### 2. **Shared Code Directory**
- Common utilities in `src/shared/`
- Shared constants and configurations
- TypeScript type definitions
- Reusable functions

### 3. **Multi-Stage Dockerfile**
- Builds both frontend and backend
- Production-optimized with non-root user
- Serves frontend static files from backend

### 4. **Updated CI/CD**
- Modified to work with new structure
- Installs dependencies for all workspaces
- Runs tests for both frontend and backend

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in development
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build both applications
npm run build

# Run all tests
npm test

# Run linting
npm run lint
```

## Benefits

1. **Clear Separation**: Frontend, backend, and shared code are clearly organized
2. **Code Reuse**: Shared utilities and types prevent duplication
3. **Unified Development**: Single commands to manage the entire application
4. **Single Deployment**: One Docker image contains both frontend and backend
5. **Monorepo Benefits**: Easier dependency management and versioning

## Next Steps

1. Update your config-repo Helm chart if needed (should work as-is)
2. Test the new build process locally
3. Verify CI/CD pipeline works with new structure
4. Update documentation references to old structure
