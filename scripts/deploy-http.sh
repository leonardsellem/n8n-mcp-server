#!/bin/bash
# Simple deployment script for n8n-MCP HTTP server
# For private, single-user deployments only

set -e

echo "n8n-MCP HTTP Deployment Script"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please edit .env file and set:"
    echo "   - AUTH_TOKEN (generate with: openssl rand -base64 32)"
    echo "   - MCP_MODE=http"
    echo "   - PORT (default 3000)"
    echo ""
    exit 1
fi

# Check if AUTH_TOKEN is set
if ! grep -q "AUTH_TOKEN=.*[a-zA-Z0-9]" .env; then
    echo "ERROR: AUTH_TOKEN not set in .env file"
    echo "Generate one with: openssl rand -base64 32"
    exit 1
fi

# Build and start
echo "Building project..."
npm run build

echo ""
echo "Starting HTTP server..."
echo "Use Ctrl+C to stop"
echo ""

# Start with production settings
NODE_ENV=production npm run start:http