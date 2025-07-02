#!/bin/bash
# scripts/test-docker.sh

echo "🧪 Testing n8n-MCP Docker Deployment"

# Test 1: Build simple image
echo "1. Building simple Docker image..."
docker build -t n8n-mcp:test .

# Test 2: Test stdio mode
echo "2. Testing stdio mode..."
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | \
  docker run --rm -i -e MCP_MODE=stdio n8n-mcp:test

# Test 3: Test HTTP mode
echo "3. Testing HTTP mode..."
docker run -d --name test-http \
  -e MCP_MODE=http \
  -e AUTH_TOKEN=test-token \
  -p 3001:3000 \
  n8n-mcp:test

sleep 5

# Check health
curl -f http://localhost:3001/health || echo "Health check failed"

# Test auth
curl -H "Authorization: Bearer test-token" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
     http://localhost:3001/mcp

docker stop test-http && docker rm test-http

# Test 4: Volume persistence
echo "4. Testing volume persistence..."
docker volume create test-data
docker run -d --name test-persist \
  -v test-data:/app/data \
  -e MCP_MODE=http \
  -e AUTH_TOKEN=test \
  -p 3002:3000 \
  n8n-mcp:test

sleep 10
docker exec test-persist ls -la /app/data/nodes.db
docker stop test-persist && docker rm test-persist
docker volume rm test-data

echo "✅ Docker tests completed!"