# Simplified Docker build for production testing
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies including @octokit/rest
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Copy runtime package.json and install dependencies
COPY package.runtime.json package.json
RUN npm install --production --no-audit --no-fund

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy environment file
COPY .env.example .env

# Create data directory for SQLite cache
RUN mkdir -p /app/data && \
    chmod 755 /app/data

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Set Docker environment flag
ENV IS_DOCKER=true
ENV NODE_ENV=production

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

# Start the application
CMD ["node", "dist/mcp/index.js"]
