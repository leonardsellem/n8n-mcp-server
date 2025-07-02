# Installation Guide

This guide covers all installation methods for n8n-MCP.

## Table of Contents

- [Quick Start](#quick-start)
- [Docker Installation](#docker-installation)
- [Manual Installation](#manual-installation)
- [Development Setup](#development-setup)
- [Troubleshooting](#troubleshooting)

## Quick Start

The fastest way to get n8n-MCP running:

```bash
# Using Docker (recommended)
cat > .env << EOF
AUTH_TOKEN=$(openssl rand -base64 32)
USE_FIXED_HTTP=true
EOF
docker compose up -d
```

## Docker Installation

### Prerequisites

- Docker Engine (install via package manager or Docker Desktop)
- Docker Compose V2 (included with modern Docker installations)

### Method 1: Using Pre-built Images

1. **Create a project directory:**
   ```bash
   mkdir n8n-mcp && cd n8n-mcp
   ```

2. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   
   services:
     n8n-mcp:
       image: ghcr.io/czlonkowski/n8n-mcp:latest
       container_name: n8n-mcp
       restart: unless-stopped
       
       environment:
         MCP_MODE: ${MCP_MODE:-http}
         USE_FIXED_HTTP: ${USE_FIXED_HTTP:-true}
         AUTH_TOKEN: ${AUTH_TOKEN:?AUTH_TOKEN is required}
         NODE_ENV: ${NODE_ENV:-production}
         LOG_LEVEL: ${LOG_LEVEL:-info}
         PORT: ${PORT:-3000}
       
       volumes:
         - n8n-mcp-data:/app/data
       
       ports:
         - "${PORT:-3000}:3000"
       
       healthcheck:
         test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   
   volumes:
     n8n-mcp-data:
       driver: local
   ```

3. **Create .env file:**
   ```bash
   echo "AUTH_TOKEN=$(openssl rand -base64 32)" > .env
   ```

4. **Start the container:**
   ```bash
   docker compose up -d
   ```

5. **Verify installation:**
   ```bash
   curl http://localhost:3000/health
   ```

### Method 2: Building from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/czlonkowski/n8n-mcp.git
   cd n8n-mcp
   ```

2. **Build the image:**
   ```bash
   docker build -t n8n-mcp:local .
   ```

3. **Run with docker-compose:**
   ```bash
   docker compose up -d
   ```

### Docker Management Commands

```bash
# View logs
docker compose logs -f

# Stop the container
docker compose stop

# Remove container and volumes
docker compose down -v

# Update to latest image
docker compose pull
docker compose up -d

# Execute commands inside container
docker compose exec n8n-mcp npm run validate

# Backup database
docker cp n8n-mcp:/app/data/nodes.db ./nodes-backup.db
```

## Manual Installation

### Prerequisites

- Node.js v16+ (v20+ recommended)
- npm or yarn
- Git

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/czlonkowski/n8n-mcp.git
   cd n8n-mcp
   ```

2. **Clone n8n documentation (optional but recommended):**
   ```bash
   git clone https://github.com/n8n-io/n8n-docs.git ../n8n-docs
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Initialize the database:**
   ```bash
   npm run rebuild
   ```

6. **Validate installation:**
   ```bash
   npm run test-nodes
   ```

### Running the Server

#### stdio Mode (for Claude Desktop)
```bash
npm start
```

#### HTTP Mode (for remote access)
```bash
npm run start:http
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Server configuration
MCP_MODE=http          # or stdio
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info

# Authentication (required for HTTP mode)
AUTH_TOKEN=your-secure-token-here

# Database
NODE_DB_PATH=./data/nodes.db
REBUILD_ON_START=false
```

## Development Setup

### Prerequisites

- All manual installation prerequisites
- TypeScript knowledge
- Familiarity with MCP protocol

### Setup Steps

1. **Clone and install:**
   ```bash
   git clone https://github.com/czlonkowski/n8n-mcp.git
   cd n8n-mcp
   npm install
   ```

2. **Set up development environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Development commands:**
   ```bash
   # Run in development mode with auto-reload
   npm run dev
   
   # Run tests
   npm test
   
   # Type checking
   npm run typecheck
   
   # Linting
   npm run lint
   ```

### Docker Development

1. **Use docker-compose override:**
   ```bash
   cp docker-compose.override.yml.example docker-compose.override.yml
   ```

2. **Edit override for development:**
   ```yaml
   version: '3.8'
   
   services:
     n8n-mcp:
       build: .
       environment:
         NODE_ENV: development
         LOG_LEVEL: debug
       volumes:
         - ./src:/app/src:ro
         - ./dist:/app/dist
   ```

3. **Run with live reload:**
   ```bash
   docker compose up --build
   ```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Use a different port
PORT=3001 docker compose up -d
```

#### Database Initialization Failed
```bash
# For Docker
docker compose exec n8n-mcp npm run rebuild

# For manual installation
npm run rebuild
```

#### Permission Denied Errors
```bash
# Fix permissions (Linux/macOS)
sudo chown -R $(whoami) ./data

# For Docker volumes
docker compose exec n8n-mcp chown -R nodejs:nodejs /app/data
```

#### Node Version Mismatch
The project includes automatic fallback to sql.js for compatibility. If you still have issues:
```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm use 20
```

### Getting Help

1. Check the logs:
   - Docker: `docker compose logs`
   - Manual: Check console output or `LOG_LEVEL=debug npm start`

2. Validate the database:
   ```bash
   npm run validate
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Report issues:
   - GitHub Issues: https://github.com/czlonkowski/n8n-mcp/issues
   - Include logs and environment details

## Next Steps

After installation, configure Claude Desktop to use n8n-MCP:
- See [Claude Desktop Setup Guide](./README_CLAUDE_SETUP.md)
- For remote deployments, see [HTTP Deployment Guide](./HTTP_DEPLOYMENT.md)
- For Docker details, see [Docker README](../DOCKER_README.md)