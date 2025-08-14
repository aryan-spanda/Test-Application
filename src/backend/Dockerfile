# Backend Dockerfile - Node.js API Server
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY src/backend/package*.json ./src/backend/

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -g 1001 -S backend && \
    adduser -S backend -u 1001 -G backend

# Set working directory
WORKDIR /app

# Copy production dependencies from dependencies stage
COPY --from=dependencies --chown=backend:backend /app/node_modules ./node_modules

# Copy backend source code
COPY --chown=backend:backend src/backend/ ./backend/
COPY --chown=backend:backend src/shared/ ./shared/
COPY --chown=backend:backend package.json .

# Switch to non-root user
USER backend

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the backend server
CMD ["node", "backend/server.js"]
