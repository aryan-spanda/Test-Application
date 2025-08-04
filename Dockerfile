# Multi-stage build for frontend and backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy all package.json files first for dependency caching
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
COPY src/backend/package*.json ./src/backend/

# Install root dependencies
RUN npm ci

# --- FIX IS HERE ---
# COPY the frontend source code BEFORE running the build
COPY src/frontend/ ./src/frontend/
COPY src/shared/ ./src/shared/

# Build frontend
WORKDIR /app/src/frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app

# Copy all package.json files first
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
COPY src/backend/package*.json ./src/backend/

# Install root dependencies
RUN npm ci

# Copy backend and shared source code
COPY src/backend/ ./src/backend/
COPY src/shared/ ./src/shared/

# Stage 3: Final Production Image
FROM node:18-alpine AS production

# Create a non-root user and group for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy dependencies from backend-builder
COPY --from=backend-builder --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy built frontend from frontend-builder
COPY --from=frontend-builder --chown=nodeuser:nodejs /app/src/frontend/build ./frontend/build

# Copy backend and shared source code
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/backend ./backend/
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/shared ./shared/
COPY --chown=nodeuser:nodejs package.json .

# Set the user to the non-root user
USER nodeuser

EXPOSE 3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 3000, path: '/health', method: 'GET' }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) { console.log('Health check passed'); process.exit(0); } \
      else { console.log('Health check failed'); process.exit(1); } \
    }); \
    req.on('error', () => { console.log('Health check failed'); process.exit(1); }); \
    req.end();"

CMD ["node", "backend/server.js"]
