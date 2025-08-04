# Multi-stage build for frontend and backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
# Copy workspace root files first
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
# Install all workspace dependencies from root
RUN npm ci
# Copy frontend source
COPY src/frontend/ ./src/frontend/
COPY src/shared/ ./src/shared/
# Build frontend
WORKDIR /app/src/frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
# Copy workspace root files
COPY package*.json ./
COPY src/backend/package*.json ./src/backend/
# Install all workspace dependencies from root
RUN npm ci
# Copy backend source
COPY src/backend/ ./src/backend/
COPY src/shared/ ./src/shared/

# Stage 3: Production Runtime
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy backend
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/backend ./backend/
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/shared ./shared/

# Copy frontend build
COPY --from=frontend-builder --chown=nodeuser:nodejs /app/src/frontend/build ./frontend/build/

# Copy workspace package files for production install
COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/src/backend/package*.json ./backend/

# Install only production dependencies
RUN npm ci --only=production

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
WORKDIR /app/backend
CMD ["node", "server.js"]
