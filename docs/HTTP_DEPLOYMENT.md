# HTTP Deployment Guide for n8n-MCP

Deploy n8n-MCP as a remote HTTP server to provide n8n knowledge to Claude from anywhere.

📌 **Latest Version**: v2.7.2 (includes fix for n8n management tools in Docker, updated documentation)

## 🎯 Overview

n8n-MCP HTTP mode enables:
- ☁️ Cloud deployment (VPS, Docker, Kubernetes)
- 🌐 Remote access from any Claude Desktop client
- 🔒 Token-based authentication
- ⚡ Production-ready performance (~12ms response time)
- 🔧 Fixed implementation (v2.3.2) for stability
- 🚀 Optional n8n management tools (16 additional tools when configured)

## 📐 Deployment Scenarios

### 1. Local Development (Simplest)
Use **stdio mode** - Claude Desktop connects directly to the Node.js process:
```
Claude Desktop → n8n-mcp (stdio mode)
```
- ✅ No HTTP server needed
- ✅ No authentication required
- ✅ Fastest performance
- ❌ Only works locally

### 2. Local HTTP Server
Run HTTP server locally for testing remote features:
```
Claude Desktop → http-bridge.js → localhost:3000
```
- ✅ Test HTTP features locally
- ✅ Multiple Claude instances can connect
- ✅ Good for development
- ❌ Still only local access

### 3. Remote Server
Deploy to cloud for access from anywhere:
```
Claude Desktop → mcp-remote → https://your-server.com
```
- ✅ Access from anywhere
- ✅ Team collaboration
- ✅ Production-ready
- ❌ Requires server setup

⚠️ **Experimental Feature**: Remote server deployment has not been thoroughly tested. If you encounter any issues, please [open an issue](https://github.com/czlonkowski/n8n-mcp/issues) on GitHub.

## 📋 Prerequisites

**Server Requirements:**
- Node.js 16+ or Docker
- 512MB RAM minimum
- Public IP or domain name
- (Recommended) SSL certificate for HTTPS

**Client Requirements:**
- Claude Desktop
- Node.js 18+ (for mcp-remote)
- Or Claude Pro/Team (for native remote MCP)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended for Production)

```bash
# 1. Create environment file
cat > .env << EOF
AUTH_TOKEN=$(openssl rand -base64 32)
USE_FIXED_HTTP=true
MCP_MODE=http
PORT=3000
# Optional: Enable n8n management tools
# N8N_API_URL=https://your-n8n-instance.com
# N8N_API_KEY=your-api-key-here
EOF

# 2. Deploy with Docker
docker run -d \
  --name n8n-mcp \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  ghcr.io/czlonkowski/n8n-mcp:latest

# 3. Verify deployment
curl http://localhost:3000/health
```

### Option 2: Local Development (Without Docker)

```bash
# 1. Clone and setup
git clone https://github.com/czlonkowski/n8n-mcp.git
cd n8n-mcp
npm install
npm run build
npm run rebuild

# 2. Configure environment
export MCP_MODE=http
export USE_FIXED_HTTP=true  # Important: Use fixed implementation
export AUTH_TOKEN=$(openssl rand -base64 32)
export PORT=3000

# 3. Start server
npm run start:http
```

### Option 3: Direct stdio Mode (Simplest for Local)

Skip HTTP entirely and use stdio mode directly:

```json
{
  "mcpServers": {
    "n8n-local": {
      "command": "node",
      "args": [
        "/path/to/n8n-mcp/dist/mcp/index.js"
      ],
      "env": {
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

💡 **Save your AUTH_TOKEN** - clients will need it to connect!

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|------|
| `MCP_MODE` | Must be set to `http` | `http` |
| `USE_FIXED_HTTP` | **Important**: Set to `true` for v2.3.2 fixes | `true` |
| `AUTH_TOKEN` | Secure token (32+ characters) | `generated-token` |

### Optional Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Bind address | `0.0.0.0` |
| `LOG_LEVEL` | Log verbosity | `info` |
| `NODE_ENV` | Environment | `production` |

### n8n Management Tools (Optional)

Enable 16 additional tools for managing n8n workflows by configuring API access:

⚠️ **Requires v2.7.1+** - Earlier versions had an issue with tool registration in Docker environments.

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_API_URL` | Your n8n instance URL | `https://your-n8n.com` |
| `N8N_API_KEY` | n8n API key (from Settings > API) | `n8n_api_key_xxx` |
| `N8N_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `N8N_API_MAX_RETRIES` | Max retry attempts | `3` |

#### What This Enables

When configured, you get **16 additional tools** (total: 38 tools):

**Workflow Management (11 tools):**
- `n8n_create_workflow` - Create new workflows
- `n8n_get_workflow` - Get workflow by ID
- `n8n_update_full_workflow` - Update entire workflow
- `n8n_update_partial_workflow` - Update using diff operations (v2.7.0+)
- `n8n_delete_workflow` - Delete workflows
- `n8n_list_workflows` - List all workflows
- And more workflow detail/structure tools

**Execution Management (4 tools):**
- `n8n_trigger_webhook_workflow` - Execute via webhooks
- `n8n_get_execution` - Get execution details
- `n8n_list_executions` - List workflow runs
- `n8n_delete_execution` - Delete execution records

**System Tools:**
- `n8n_health_check` - Check n8n connectivity
- `n8n_diagnostic` - System diagnostics
- `n8n_validate_workflow` - Validate from n8n instance

#### Getting Your n8n API Key

1. Log into your n8n instance
2. Go to **Settings** > **API**
3. Click **Create API Key**
4. Copy the generated key

⚠️ **Security Note**: Store API keys securely and never commit them to version control.

## 🔐 Security Setup

### Authentication

All requests require Bearer token authentication:

```bash
# Test authentication
curl -H "Authorization: Bearer $AUTH_TOKEN" \
     https://your-server.com/health
```

### SSL/HTTPS (Strongly Recommended)

Use a reverse proxy for SSL termination:

**Nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /mcp {
        proxy_pass http://localhost:3000;
        proxy_set_header Authorization $http_authorization;
    }
}
```

**Caddy example (automatic HTTPS):**
```caddy
your-domain.com {
    reverse_proxy /mcp localhost:3000
}
```

## 💻 Client Configuration

### Understanding the Architecture

Claude Desktop only supports stdio (standard input/output) communication, but our HTTP server requires HTTP requests. We bridge this gap using one of two methods:

```
Method 1: Using mcp-remote (npm package)
Claude Desktop (stdio) → mcp-remote → HTTP Server

Method 2: Using custom bridge script
Claude Desktop (stdio) → http-bridge.js → HTTP Server
```

### Method 1: Using mcp-remote (Recommended)

**Requirements**: Node.js 18+ installed locally

```json
{
  "mcpServers": {
    "n8n-remote": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-server.com/mcp",
        "--header",
        "Authorization: Bearer ${AUTH_TOKEN}"
      ],
      "env": {
        "AUTH_TOKEN": "your-auth-token-here"
      }
    }
  }
}
```

### Method 2: Using Custom Bridge Script

For local testing or when mcp-remote isn't available:

```json
{
  "mcpServers": {
    "n8n-local-http": {
      "command": "node",
      "args": [
        "/path/to/n8n-mcp/scripts/http-bridge.js"
      ],
      "env": {
        "MCP_URL": "http://localhost:3000/mcp",
        "AUTH_TOKEN": "your-auth-token-here"
      }
    }
  }
}
```

### Local Development with Docker

When testing locally with Docker:

```json
{
  "mcpServers": {
    "n8n-docker-http": {
      "command": "node",
      "args": [
        "/path/to/n8n-mcp/scripts/http-bridge.js"
      ],
      "env": {
        "MCP_URL": "http://localhost:3001/mcp",
        "AUTH_TOKEN": "docker-test-token"
      }
    }
  }
}
```

### For Claude Pro/Team Users

Use native remote MCP support:
1. Go to Settings > Integrations
2. Add your MCP server URL
3. Complete OAuth flow (if implemented)

⚠️ **Note**: Direct config file entries won't work for remote servers in Pro/Team.

## 🌐 Production Deployment

### Docker Compose Setup

```yaml
version: '3.8'

services:
  n8n-mcp:
    image: ghcr.io/czlonkowski/n8n-mcp:latest
    container_name: n8n-mcp
    restart: unless-stopped
    environment:
      MCP_MODE: http
      USE_FIXED_HTTP: true
      AUTH_TOKEN: ${AUTH_TOKEN:?AUTH_TOKEN required}
      NODE_ENV: production
      LOG_LEVEL: info
      # Optional: Enable n8n management tools
      # N8N_API_URL: ${N8N_API_URL}
      # N8N_API_KEY: ${N8N_API_KEY}
    ports:
      - "127.0.0.1:3000:3000"  # Bind to localhost only
    volumes:
      - n8n-mcp-data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

volumes:
  n8n-mcp-data:
```

### Systemd Service (Linux)

Create `/etc/systemd/system/n8n-mcp.service`:

```ini
[Unit]
Description=n8n-MCP HTTP Server
After=network.target

[Service]
Type=simple
User=n8n-mcp
WorkingDirectory=/opt/n8n-mcp
ExecStart=/usr/bin/node dist/mcp/index.js
Restart=always
RestartSec=10

# Environment
Environment="MCP_MODE=http"
Environment="USE_FIXED_HTTP=true"
Environment="NODE_ENV=production"
EnvironmentFile=/opt/n8n-mcp/.env

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable n8n-mcp
sudo systemctl start n8n-mcp
```

## 📡 Monitoring & Maintenance

### Health Checks

```bash
# Basic health check
curl https://your-server.com/health

# Response:
{
  "status": "ok",
  "mode": "http-fixed",
  "version": "2.3.2",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 512,
    "unit": "MB"
  }
}
```

### Monitoring with Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'n8n-mcp'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/health'
    bearer_token: 'your-auth-token'
```

### Log Management

```bash
# Docker logs
docker logs -f n8n-mcp --tail 100

# Systemd logs
journalctl -u n8n-mcp -f

# Log rotation (Docker)
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  n8n-mcp
```

## 🔒 Security Best Practices

### 1. Token Management

```bash
# Generate strong tokens
openssl rand -base64 32

# Rotate tokens regularly
AUTH_TOKEN_NEW=$(openssl rand -base64 32)
docker exec n8n-mcp env AUTH_TOKEN=$AUTH_TOKEN_NEW
```

### 2. Network Security

- ✅ **Always use HTTPS** in production
- ✅ **Firewall rules** to limit access
- ✅ **VPN** for internal deployments
- ✅ **Rate limiting** at proxy level

### 3. Container Security

```bash
# Run as non-root user (already configured)
# Read-only filesystem
docker run --read-only \
  --tmpfs /tmp \
  -v n8n-mcp-data:/app/data \
  n8n-mcp

# Security scanning
docker scan ghcr.io/czlonkowski/n8n-mcp:latest
```

## 🔍 Troubleshooting

### Common Issues

**"Stream is not readable" error:**
- ✅ Solution: Ensure `USE_FIXED_HTTP=true` is set
- This is fixed in v2.3.2

**"TransformStream is not defined" (client-side):**
- 🔄 Update Node.js to v18+ on client machine
- Or use Docker stdio mode instead

**"Why is command 'node' instead of 'docker'?"**
- Claude Desktop only supports stdio communication
- The bridge script (http-bridge.js or mcp-remote) translates between stdio and HTTP
- Docker containers running HTTP servers need this bridge

**Bridge script not working:**
```bash
# Test the bridge manually
export MCP_URL=http://localhost:3000/mcp
export AUTH_TOKEN=your-token
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node /path/to/http-bridge.js
```

**Connection refused:**
```bash
# Check server is running
curl http://localhost:3000/health

# Check Docker status
docker ps
docker logs n8n-mcp

# Check firewall
sudo ufw status
```

**Authentication failed:**
- Verify AUTH_TOKEN matches exactly
- Check for extra spaces or quotes
- Test with curl first

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug docker run ...

# Test MCP endpoint directly
curl -X POST https://your-server.com/mcp \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"list_nodes","params":{"limit":5},"id":1}'
```

## 🚀 Scaling & Performance

### Performance Metrics

- Average response time: **~12ms**
- Memory usage: **~50-100MB**
- Concurrent connections: **100+**
- Database queries: **<5ms** with FTS5

### Horizontal Scaling

The server is stateless - scale easily:

```yaml
# Docker Swarm example
deploy:
  replicas: 3
  update_config:
    parallelism: 1
    delay: 10s
  restart_policy:
    condition: on-failure
```

### Optimization Tips

1. **Use Docker** for consistent performance
2. **Enable HTTP/2** in your reverse proxy
3. **Set up CDN** for static assets
4. **Monitor memory** usage over time

## 👥 Multi-User Service Considerations

While n8n-MCP is designed for single-user deployments, you can build a multi-user service:

1. **Use this as a core engine** with your own auth layer
2. **Deploy multiple instances** with different tokens
3. **Add user management** in your proxy layer
4. **Implement rate limiting** per user

See [Architecture Guide](./ARCHITECTURE.md) for building multi-user services.

## 🔧 Using n8n Management Tools

When n8n API is configured, Claude can manage workflows directly:

### Example: Create a Workflow via Claude

```bash
# Test n8n connectivity first
curl -X POST https://your-server.com/mcp \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "n8n_health_check",
    "params": {},
    "id": 1
  }'
```

### Common Use Cases

1. **Workflow Automation**: Claude can create, update, and manage workflows
2. **CI/CD Integration**: Deploy workflows from version control
3. **Workflow Templates**: Claude can apply templates to new workflows
4. **Monitoring**: Track execution status and debug failures
5. **Incremental Updates**: Use diff-based updates for efficient changes

### Security Best Practices for n8n API

- 🔐 Use separate API keys for different environments
- 🔄 Rotate API keys regularly
- 📝 Audit workflow changes via n8n's audit log
- 🚫 Never expose n8n API directly to the internet
- ✅ Use MCP server as a security layer

## 📦 Updates & Maintenance

```bash
# Update to latest version
docker pull ghcr.io/czlonkowski/n8n-mcp:latest
docker compose up -d

# Backup database
docker cp n8n-mcp:/app/data/nodes.db ./backup-$(date +%Y%m%d).db

# Restore database
docker cp ./backup.db n8n-mcp:/app/data/nodes.db
docker restart n8n-mcp
```

## 🆘 Getting Help

- 📚 [Full Documentation](https://github.com/czlonkowski/n8n-mcp)
- 🐛 [Report Issues](https://github.com/czlonkowski/n8n-mcp/issues)
- 💬 [Discussions](https://github.com/czlonkowski/n8n-mcp/discussions)