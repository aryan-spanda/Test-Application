# Multi-stage build for Node.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodeuser:nodejs src/ ./src/
COPY --chown=nodeuser:nodejs frontend/ ./frontend/
COPY --chown=nodeuser:nodejs package*.json ./

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 3000, path: '/health', method: 'GET' }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) { console.log('Health check passed'); process.exit(0); } \
      else { console.log('Health check failed'); process.exit(1); } \
    }); \
    req.on('error', () => { console.log('Health check failed'); process.exit(1); }); \
    req.end();"

# Start the application
CMD ["npm", "start"]
