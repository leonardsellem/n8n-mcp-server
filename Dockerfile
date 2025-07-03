# syntax=docker/dockerfile:1.7

# Stage 1: Builder (Full dependencies for TypeScript compilation)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install ALL dependencies (including n8n packages needed for compilation)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript (now has all required dependencies)
RUN npm run build

# Stage 2: Runtime (minimal dependencies)
FROM node:20-alpine AS runtime
WORKDIR /app

# Install only essential runtime tools
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Copy runtime-only package.json
COPY package.runtime.json package.json

# Install runtime dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm install --production --no-audit --no-fund

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create data directory for SQLite cache
RUN mkdir -p /app/data

# Copy required files
COPY .env.example ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set Docker environment flag
ENV IS_DOCKER=true
ENV NODE_ENV=production

# Expose MCP port
EXPOSE 3000

# Note: No health check needed for MCP stdio mode

# Start MCP server
CMD ["node", "dist/mcp/index.js"]
