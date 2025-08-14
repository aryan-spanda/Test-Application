# Frontend Dockerfile - React Application with NGINX
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/

# Copy shared package.json if it exists
COPY src/shared/ ./src/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY src/frontend/ ./src/frontend/
COPY src/shared/ ./src/shared/

# Build the React application
WORKDIR /app/src/frontend
RUN npm run build

# Production stage - NGINX
FROM nginx:alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -g 1001 -S frontend && \
    adduser -S frontend -u 1001 -G frontend

# Copy built React app from builder stage
COPY --from=builder --chown=frontend:frontend /app/src/frontend/build /usr/share/nginx/html

# Copy custom NGINX configuration
COPY --chown=frontend:frontend docker/nginx.conf /etc/nginx/conf.d/default.conf

# Set up NGINX directories and permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R frontend:frontend /var/cache/nginx && \
    chown -R frontend:frontend /var/run && \
    chown -R frontend:frontend /etc/nginx/conf.d && \
    chown -R frontend:frontend /usr/share/nginx/html && \
    # Allow NGINX to bind to port 3000 as non-root
    sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf || true

# Switch to non-root user
USER frontend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
