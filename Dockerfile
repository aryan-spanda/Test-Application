# Stage 1: Build Frontend
# This stage builds the static React assets.
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy package files first to leverage Docker cache.
# Dependencies are only re-installed if these files change.
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
COPY src/backend/package*.json ./src/backend/

# Install all dependencies for the monorepo
RUN npm ci

# --- THE FIX ---
# Now, copy the frontend source code into the container.
COPY src/frontend/ ./src/frontend/
COPY src/shared/ ./src/shared/

# With the code now present, run the build command.
WORKDIR /app/src/frontend
RUN npm run build

# Stage 2: Prepare Backend
# This stage installs backend dependencies.
FROM node:18-alpine AS backend-builder
WORKDIR /app

# Copy package files again for this stage.
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
COPY src/backend/package*.json ./src/backend/

# Install all dependencies
RUN npm ci

# Copy backend and shared source code
COPY src/backend/ ./src/backend/
COPY src/shared/ ./src/shared/

# Stage 3: Final Production Image
# This stage assembles the final, lean image.
FROM node:18-alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

# Create a non-root user and group for better security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy only the necessary production dependencies from the backend-builder
COPY --from=backend-builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/backend/node_modules ./backend/node_modules

# Copy the built static assets from the frontend-builder
COPY --from=frontend-builder --chown=nodeuser:nodejs /app/src/frontend/build ./frontend/build

# Copy the backend and shared source code
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/backend ./backend/
COPY --from=backend-builder --chown=nodeuser:nodejs /app/src/shared ./shared/
COPY --chown=nodeuser:nodejs package.json .

# Switch to the non-root user
USER nodeuser

EXPOSE 3000

# Add a health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD [ "wget", "-q", "--spider", "http://localhost:3000/health" ]

# The command to start the application
CMD ["node", "backend/server.js"]
