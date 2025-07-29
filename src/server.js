const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const promClient = require('prom-client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for our frontend
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    try {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration
        .labels(req.method, req.route?.path || req.path, res.statusCode)
        .observe(duration);
    } catch (error) {
      // Ignore metrics errors to prevent 500s
      console.error('Metrics error:', error.message); // eslint-disable-line no-console
    }
  });
  next();
});

// Routes
// Serve the main dashboard at root
app.get('/', (req, res) => {
  // Check if this is an API request
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({
      message: 'Welcome to Test Application',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } else {
    // Serve the HTML dashboard
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

app.get('/api/users', (req, res) => {
  res.json([
    { 
      id: 1, 
      name: 'Alice Cooper', 
      email: 'alice@spandaai.com',
      role: 'AI Engineer',
      status: 'active',
      lastLogin: '2025-07-29T10:30:00Z'
    },
    { 
      id: 2, 
      name: 'Bob Rodriguez', 
      email: 'bob@spandaai.com',
      role: 'DevOps Engineer',
      status: 'active',
      lastLogin: '2025-07-29T09:15:00Z'
    },
    { 
      id: 3, 
      name: 'Carol Zhang', 
      email: 'carol@spandaai.com',
      role: 'Data Scientist',
      status: 'active',
      lastLogin: '2025-07-29T08:45:00Z'
    },
    { 
      id: 4, 
      name: 'David Kumar', 
      email: 'david@spandaai.com',
      role: 'Platform Architect',
      status: 'active',
      lastLogin: '2025-07-29T11:00:00Z'
    }
  ]);
});

app.get('/api/status', (req, res) => {
  res.json({
    application: 'spanda-ai-test-application',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: 'connected',
      type: 'MongoDB',
      latency: '12ms',
      connections: 24
    },
    services: {
      ai_engine: 'healthy',
      data_pipeline: 'healthy',
      api_gateway: 'healthy',
      monitoring: 'healthy'
    },
    network: {
      bandwidth: '1.2 Gbps',
      latency: '8ms',
      packet_loss: '0.01%'
    },
    last_check: new Date().toISOString(),
    cluster_info: {
      namespace: 'test-application',
      pods: 3,
      nodes: 2,
      load_balancer: 'active'
    }
  });
});

// New API endpoints for enhanced functionality
app.get('/api/network/diagnostics', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    tests: [
      { name: 'DNS Resolution', status: 'healthy', latency: '8ms' },
      { name: 'Load Balancer', status: 'healthy', response_time: '15ms' },
      { name: 'CDN Status', status: 'optimal', cache_hit_ratio: '94%' },
      { name: 'Database Connection', status: 'healthy', pool_size: '24/100' },
      { name: 'External APIs', status: 'healthy', success_rate: '99.8%' }
    ],
    network_stats: {
      total_requests: 15420,
      successful_requests: 15388,
      failed_requests: 32,
      average_response_time: '45ms',
      peak_response_time: '230ms'
    }
  });
});

app.get('/api/monitoring/metrics', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    system_metrics: {
      cpu_usage: '23%',
      memory_usage: '67%',
      disk_usage: '45%',
      network_io: '125 MB/s'
    },
    application_metrics: {
      active_users: 156,
      requests_per_minute: 890,
      error_rate: '0.2%',
      average_response_time: '45ms'
    },
    ai_metrics: {
      model_inference_time: '23ms',
      prediction_accuracy: '94.2%',
      training_jobs_active: 3,
      data_processing_rate: '2.1 GB/min'
    }
  });
});

app.get('/api/database/stats', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    connection_info: {
      type: 'MongoDB',
      version: '6.0.2',
      cluster_size: 3,
      active_connections: 24,
      max_connections: 100
    },
    performance: {
      queries_per_second: 450,
      average_query_time: '12ms',
      slow_queries: 2,
      cache_hit_ratio: '89%'
    },
    storage: {
      total_size: '45.2 GB',
      used_space: '23.1 GB',
      free_space: '22.1 GB',
      growth_rate: '1.2 GB/week'
    }
  });
});

// Error handling
app.use((err, req, res) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Test Application running on port ${PORT}`); // eslint-disable-line no-console
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`); // eslint-disable-line no-console
    console.log(`Health check: http://localhost:${PORT}/health`); // eslint-disable-line no-console
    console.log(`Metrics: http://localhost:${PORT}/metrics`); // eslint-disable-line no-console
  });
}

module.exports = app;
