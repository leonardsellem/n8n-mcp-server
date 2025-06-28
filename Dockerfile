# Multi-stage Docker build for n8n MCP Server
# Optimized for production deployment with security and performance considerations

FROM node:18-alpine AS base
WORKDIR /app

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build && \
    npm prune --production

# Production stage
FROM base AS production

# Install only production dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/cache /app/tmp && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "import('./build/utils/health-check.js').then(m => m.healthCheck())" || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "build/index.js"]

# Metadata
LABEL maintainer="Leonard Sellem <https://sellem.me>"
LABEL description="n8n MCP Server - Model Context Protocol server for n8n workflow automation"
LABEL version="0.1.4"
