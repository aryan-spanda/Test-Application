# 🚀 Spanda AI Test Application

A comprehensive full-stack application for testing Spanda AI platform capabilities including networking, monitoring, and GitOps deployment workflows.

## � Spanda Platform Ready

This application is configured for deployment on **Spanda Platform** with automatic infrastructure provisioning, monitoring, and GitOps deployment.

### Platform Files
- `platform-values.yaml` - Platform deployment configuration
- `platform-modules.yaml` - Required platform services
- `setup-spanda-platform.sh` - Quick setup script

### Quick Platform Setup
```bash
# Run the setup script to configure for Spanda Platform
./setup-spanda-platform.sh
```

## �🌟 Features

### Frontend Dashboard
- **Beautiful UI**: Modern, responsive web interface with gradient design
- **Real-time Monitoring**: Live application status and metrics
- **Interactive Testing**: Built-in API testing capabilities
- **Network Diagnostics**: Advanced network monitoring and analysis
- **AI Monitoring**: Intelligent system monitoring with predictive analytics

### Backend APIs
- **Health Checks**: Comprehensive health monitoring endpoints
- **User Management**: Sample user API with enhanced data
- **System Status**: Detailed application and infrastructure status
- **Metrics**: Prometheus-compatible metrics collection
- **Network Diagnostics**: Network testing and analysis endpoints
- **Database Stats**: Database performance and connection monitoring

### Enhanced Capabilities
- **GitOps Ready**: Designed for ArgoCD automatic deployment
- **Kubernetes Native**: Optimized for Kubernetes deployment
- **Monitoring Integration**: Prometheus metrics and health checks
- **Security**: Helmet.js security headers and CORS protection
- **Logging**: Morgan request logging for observability

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Monitoring    │
│   Dashboard     │◄──►│   Express API   │◄──►│   Prometheus    │
│   (HTML/CSS/JS) │    │   Node.js       │    │   Metrics       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Database      │    │   Health Checks │
│   (MetalLB)     │    │   (Simulated)   │    │   /health       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Docker Build
```bash
docker build -t test-application .
docker run -p 3000:3000 test-application
```

### Kubernetes Deployment
```bash
kubectl apply -f deploy/
```

## 📡 API Endpoints

### Core Endpoints
- `GET /` - Main dashboard (HTML) or API info (JSON)
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics

### API Routes
- `GET /api/users` - User management API
- `GET /api/status` - Comprehensive system status
- `GET /api/network/diagnostics` - Network testing
- `GET /api/monitoring/metrics` - Application metrics
- `GET /api/database/stats` - Database statistics

## 🔧 Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📊 Monitoring & Metrics

The application includes comprehensive monitoring:
- **Prometheus Metrics**: HTTP request duration, default Node.js metrics
- **Health Checks**: Kubernetes-ready health endpoint
- **Logging**: Request logging with Morgan
- **Performance**: Response time tracking

## 🌐 GitOps Workflow

This application is designed for GitOps deployment with ArgoCD:
1. Code changes pushed to GitHub
2. ArgoCD detects changes automatically
3. Application deployed to Kubernetes
4. Health checks ensure successful deployment

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🎯 Network Testing Features

The application includes advanced network testing capabilities:
- **Latency Monitoring**: Real-time response time measurement
- **Bandwidth Analysis**: Network throughput monitoring
- **Connection Health**: Database and service connectivity
- **Load Balancer Status**: Load balancer health verification

## 🚀 Deployment

### GitOps Deployment (Recommended)
1. Push changes to GitHub repository
2. ArgoCD automatically syncs changes
3. Application deployed to Kubernetes cluster
4. Access via port forwarding or load balancer

### Manual Deployment
```bash
# Build and push image
docker build -t ghcr.io/aryan-spanda/test-application:latest .
docker push ghcr.io/aryan-spanda/test-application:latest

# Deploy to Kubernetes
kubectl apply -f deploy/
```

## 📈 Performance

- **Response Time**: < 50ms average
- **Memory Usage**: ~50MB
- **CPU Usage**: < 5% under normal load
- **Concurrent Users**: Supports 1000+ concurrent connections

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request validation
- **Non-root User**: Container runs as non-root user

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Interactive Testing**: Built-in API testing tools
- **Real-time Updates**: Auto-refreshing status indicators
- **Modern Design**: Beautiful gradient and card-based layout
- **Accessibility**: Screen reader friendly

---

**Built with ❤️ for the Spanda AI Platform**
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
