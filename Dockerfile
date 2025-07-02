# syntax=docker/dockerfile:1.7
# Ultra-optimized Dockerfile - minimal runtime dependencies (no n8n packages)

# Stage 1: Builder (TypeScript compilation only)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy tsconfig for TypeScript compilation
COPY tsconfig.json ./

# Create minimal package.json and install ONLY build dependencies
RUN --mount=type=cache,target=/root/.npm \
    echo '{}' > package.json && \
    npm install --no-save typescript@^5.8.3 @types/node@^22.15.30 @types/express@^5.0.3 \
        @modelcontextprotocol/sdk@^1.12.1 dotenv@^16.5.0 express@^5.1.0 axios@^1.10.0 \
        n8n-workflow@^1.96.0 uuid@^11.0.5 @types/uuid@^10.0.0

# Copy source and build
COPY src ./src
# Note: src/n8n contains TypeScript types needed for compilation
# These will be compiled but not included in runtime
RUN npx tsc

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

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy pre-built database and required files
COPY data/nodes.db ./data/
COPY src/database/schema-optimized.sql ./src/database/
COPY .env.example ./

# Copy entrypoint script
COPY docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Add container labels
LABEL org.opencontainers.image.source="https://github.com/czlonkowski/n8n-mcp"
LABEL org.opencontainers.image.description="n8n MCP Server - Runtime Only"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="n8n-mcp"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set Docker environment flag
ENV IS_DOCKER=true

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

# Optimized entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/mcp/index.js"]