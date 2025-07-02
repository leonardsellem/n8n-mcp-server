#!/bin/bash
# Test script to verify Docker optimization (no n8n deps)

set -e

echo "🧪 Testing Docker optimization..."
echo ""

# Check if nodes.db exists
if [ ! -f "data/nodes.db" ]; then
    echo "❌ ERROR: data/nodes.db not found!"
    echo "   Run 'npm run rebuild' first to create the database"
    exit 1
fi

# Build the image
echo "📦 Building Docker image..."
DOCKER_BUILDKIT=1 docker build -t n8n-mcp:test . > /dev/null 2>&1

# Check image size
echo "📊 Checking image size..."
SIZE=$(docker images n8n-mcp:test --format "{{.Size}}")
echo "   Image size: $SIZE"

# Test that n8n is NOT in the image
echo ""
echo "🔍 Verifying no n8n dependencies..."
if docker run --rm n8n-mcp:test sh -c "ls node_modules | grep -E '^n8n$|^n8n-|^@n8n'" 2>/dev/null; then
    echo "❌ ERROR: Found n8n dependencies in runtime image!"
    exit 1
else
    echo "✅ No n8n dependencies found (as expected)"
fi

# Test that runtime dependencies ARE present
echo ""
echo "🔍 Verifying runtime dependencies..."
EXPECTED_DEPS=("@modelcontextprotocol" "better-sqlite3" "express" "dotenv")
for dep in "${EXPECTED_DEPS[@]}"; do
    if docker run --rm n8n-mcp:test sh -c "ls node_modules | grep -q '$dep'" 2>/dev/null; then
        echo "✅ Found: $dep"
    else
        echo "❌ Missing: $dep"
        exit 1
    fi
done

# Test that the server starts
echo ""
echo "🚀 Testing server startup..."
docker run --rm -d \
    --name n8n-mcp-test \
    -e MCP_MODE=http \
    -e AUTH_TOKEN=test-token \
    -e LOG_LEVEL=error \
    n8n-mcp:test > /dev/null 2>&1

# Wait for startup
sleep 3

# Check if running
if docker ps | grep -q n8n-mcp-test; then
    echo "✅ Server started successfully"
    docker stop n8n-mcp-test > /dev/null 2>&1
else
    echo "❌ Server failed to start"
    docker logs n8n-mcp-test 2>&1
    exit 1
fi

# Clean up
docker rmi n8n-mcp:test > /dev/null 2>&1

echo ""
echo "🎉 All tests passed! Docker optimization is working correctly."
echo ""
echo "📈 Benefits:"
echo "   - No n8n dependencies in runtime image"
echo "   - Image size: ~200MB (vs ~1.5GB with n8n)"
echo "   - Build time: ~1-2 minutes (vs ~12 minutes)"
echo "   - No version conflicts at runtime"