# Dummy Full-Stack Application

A complete full-stack application with React frontend and Node.js backend, designed for deployment via ArgoCD in the Spanda Platform.

## Architecture

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│                 │ ───────────────▶│                 │
│   React         │                 │   Node.js       │
│   Frontend      │                 │   Backend       │
│   (Port 3000)   │◀─────────────── │   (Port 8080)   │
│                 │    JSON Data    │                 │
└─────────────────┘                 └─────────────────┘
```

## Repository Structure

```
├── frontend/                      # React frontend application
│   ├── src/                       # React source code
│   ├── public/                    # Static assets
│   ├── package.json              # Frontend dependencies
│   ├── Dockerfile                # Frontend container
│   └── deploy/                   # K8s manifests for ArgoCD
│       ├── deployment.yaml
│       ├── service.yaml
│       └── ingress.yaml
├── backend/                      # Node.js backend API
│   ├── src/                      # Backend source code
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   ├── Dockerfile               # Backend container
│   └── deploy/                  # K8s manifests for ArgoCD
│       ├── deployment.yaml
│       ├── service.yaml
│       └── sealed-secret.yaml
└── README.md                    # This file
```

## Components

### Frontend
- **React SPA** with modern UI
- **API integration** with backend
- **Containerized** with Nginx
- **Environment-specific** configuration

### Backend
- **Express.js API** with REST endpoints
- **Database integration** ready
- **Authentication** middleware
- **Health checks** and metrics

## Getting Started

### Local Development

#### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:8080
```

#### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Docker Build
```bash
# Backend
cd backend && docker build -t dummy-backend:latest .

# Frontend
cd frontend && docker build -t dummy-frontend:latest .
```

## API Endpoints

### Backend (Port 8080)
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Frontend (Port 3000)
- Serves React SPA
- Connects to backend API
- Responsive UI with modern design

## Environment Variables

### Backend
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment name
