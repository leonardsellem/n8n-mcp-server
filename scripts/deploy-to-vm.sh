#!/bin/bash

# Deployment script for n8n Documentation MCP Server
# Target: n8ndocumentation.aiservices.pl

set -e

echo "🚀 n8n Documentation MCP Server - VM Deployment"
echo "=============================================="

# Configuration
SERVER_USER=${SERVER_USER:-root}
SERVER_HOST=${SERVER_HOST:-n8ndocumentation.aiservices.pl}
APP_DIR="/opt/n8n-mcp"
SERVICE_NAME="n8n-docs-mcp"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Please create it from .env.example${NC}"
    exit 1
fi

# Check required environment variables
source .env
if [ "$MCP_DOMAIN" != "n8ndocumentation.aiservices.pl" ]; then
    echo -e "${YELLOW}⚠️  Warning: MCP_DOMAIN is not set to n8ndocumentation.aiservices.pl${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if [ -z "$MCP_AUTH_TOKEN" ] || [ "$MCP_AUTH_TOKEN" == "your-secure-auth-token-here" ]; then
    echo -e "${RED}❌ MCP_AUTH_TOKEN not set or using default value${NC}"
    echo "Generate a secure token with: openssl rand -hex 32"
    exit 1
fi

echo -e "${GREEN}✅ Configuration validated${NC}"

# Build the project locally
echo -e "\n${YELLOW}Building project...${NC}"
npm run build

# Create deployment package
echo -e "\n${YELLOW}Creating deployment package...${NC}"
rm -rf deploy-package
mkdir -p deploy-package

# Copy necessary files
cp -r dist deploy-package/
cp -r data deploy-package/
cp package*.json deploy-package/
cp .env deploy-package/
cp ecosystem.config.js deploy-package/ 2>/dev/null || true

# Create tarball
tar -czf deploy-package.tar.gz deploy-package

echo -e "${GREEN}✅ Deployment package created${NC}"

# Upload to server
echo -e "\n${YELLOW}Uploading to server...${NC}"
scp deploy-package.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Deploy on server
echo -e "\n${YELLOW}Deploying on server...${NC}"
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
set -e

# Create app directory
mkdir -p /opt/n8n-mcp
cd /opt/n8n-mcp

# Stop existing service if running
pm2 stop n8n-docs-mcp 2>/dev/null || true

# Extract deployment package
tar -xzf /tmp/deploy-package.tar.gz --strip-components=1
rm /tmp/deploy-package.tar.gz

# Install production dependencies
npm ci --only=production

# Create PM2 ecosystem file if not exists
if [ ! -f ecosystem.config.js ]; then
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'n8n-docs-mcp',
    script: './dist/index-http.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF
fi

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment complete!"
echo ""
echo "Service status:"
pm2 status n8n-docs-mcp
ENDSSH

# Clean up local files
rm -rf deploy-package deploy-package.tar.gz

echo -e "\n${GREEN}🎉 Deployment successful!${NC}"
echo -e "\nServer endpoints:"
echo -e "  Health: https://$SERVER_HOST/health"
echo -e "  Stats:  https://$SERVER_HOST/stats"
echo -e "  MCP:    https://$SERVER_HOST/mcp"
echo -e "\nClaude Desktop configuration:"
echo -e "  {
    \"mcpServers\": {
      \"n8n-nodes-remote\": {
        \"command\": \"npx\",
        \"args\": [
          \"-y\",
          \"@modelcontextprotocol/client-http\",
          \"https://$SERVER_HOST/mcp\"
        ],
        \"env\": {
          \"MCP_AUTH_TOKEN\": \"$MCP_AUTH_TOKEN\"
        }
      }
    }
  }"