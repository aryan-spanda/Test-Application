const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const promClient = require('prom-client');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Mock database (in-memory)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', createdAt: new Date().toISOString() },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', createdAt: new Date().toISOString() },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', createdAt: new Date().toISOString() }
];
let nextUserId = 6;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true
}));
app.use(morgan(process.env.LOG_FORMAT || 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api', limiter);

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  next();
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fullstack Test Application',
    description: 'Backend API with Frontend SPA serving',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      frontend: 'React SPA served at root path',
      backend: 'API endpoints listed below'
    },
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      users: '/api/users',
      docs: '/api/docs'
    }
  });
});

app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    services: {
      database: 'connected',  // Mock status
      cache: 'connected',     // Mock status
      external_api: 'healthy' // Mock status
    }
  };
  
  res.status(200).json(healthData);
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

// User CRUD operations
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  let filteredUsers = users;
  
  // Search functionality
  if (search) {
    filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total: filteredUsers.length,
      total_pages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Name and email are required',
      fields: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null
      }
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: nextUserId++,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Name and email are required'
    });
  }
  
  // Check if email already exists (excluding current user)
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId);
  if (existingUser) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Another user with this email already exists'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name.trim(),
    email: email.trim().toLowerCase(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'User updated successfully',
    user: users[userIndex]
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  res.json({
    message: 'User deleted successfully',
    user: deletedUser
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Dummy Backend API Documentation',
    version: '1.0.0',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'API information and available endpoints'
      },
      {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint'
      },
      {
        method: 'GET',
        path: '/metrics',
        description: 'Prometheus metrics'
      },
      {
        method: 'GET',
        path: '/api/users',
        description: 'Get all users with pagination and search',
        query_params: ['page', 'limit', 'search']
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get user by ID'
      },
      {
        method: 'POST',
        path: '/api/users',
        description: 'Create new user',
        body: { name: 'string', email: 'string' }
      },
      {
        method: 'PUT',
        path: '/api/users/:id',
        description: 'Update user by ID',
        body: { name: 'string', email: 'string' }
      },
      {
        method: 'DELETE',
        path: '/api/users/:id',
        description: 'Delete user by ID'
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong on our end' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes - they should return JSON errors
  if (req.path.startsWith('/api') || 
      req.path.startsWith('/health') || 
      req.path.startsWith('/metrics')) {
    return res.status(404).json({ 
      error: 'Not Found', 
      message: `Route ${req.path} not found`,
      available_endpoints: [
        'GET /',
        'GET /health', 
        'GET /metrics',
        'GET /api/users',
        'GET /api/docs'
      ]
    });
  }
  
  // For all other routes, serve the React app
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fullstack Test Application running on port ${PORT}`);
  console.log(`📱 Frontend: React SPA served at http://localhost:${PORT}/`);
  console.log(`🔧 Backend API: http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
