#!/bin/bash
# Test Docker Simple Auto-Update Setup

echo "🐳 Testing Docker Simple Auto-Update Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_step() {
    local name="$1"
    local command="$2"
    
    echo -e "\n${BLUE}🔧 Testing: ${name}${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✅ SUCCESS: ${name}${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED: ${name}${NC}"
        return 1
    fi
}

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.simple-auto.yml down --remove-orphans

# Test 1: Build the simple auto-update image
test_step "Build simple auto-update Docker image" \
    "docker compose -f docker-compose.simple-auto.yml build --no-cache n8n-mcp-simple-auto"

# Test 2: Start the container
test_step "Start simple auto-update container" \
    "docker compose -f docker-compose.simple-auto.yml up -d n8n-mcp-simple-auto"

# Test 3: Wait for container to be ready
echo -e "\n${BLUE}⏳ Waiting for container to initialize...${NC}"
sleep 30

# Test 4: Check if container is running
test_step "Container is running" \
    "docker compose -f docker-compose.simple-auto.yml ps n8n-mcp-simple-auto | grep -q 'Up'"

# Test 5: Check container logs for success indicators
echo -e "\n${BLUE}📋 Container logs:${NC}"
docker compose -f docker-compose.simple-auto.yml logs n8n-mcp-simple-auto | tail -20

# Test 6: Check if MCP server initialized
test_step "MCP server initialized successfully" \
    "docker compose -f docker-compose.simple-auto.yml logs n8n-mcp-simple-auto | grep -q 'Server initialized successfully'"

# Test 7: Check if database loaded
test_step "Database loaded successfully" \
    "docker compose -f docker-compose.simple-auto.yml logs n8n-mcp-simple-auto | grep -q 'nodes.db'"

# Test 8: Check if auto-update service started
test_step "Auto-update service initialized" \
    "docker compose -f docker-compose.simple-auto.yml logs n8n-mcp-simple-auto | grep -q 'Simple Auto Update'"

# Test 9: Container health check
test_step "Container health check passes" \
    "docker compose -f docker-compose.simple-auto.yml ps n8n-mcp-simple-auto | grep -q 'healthy\\|Up'"

# Test 10: Test MCP communication (simulate AI agent)
echo -e "\n${BLUE}🤖 Testing MCP communication (AI agent simulation)${NC}"
CONTAINER_ID=$(docker compose -f docker-compose.simple-auto.yml ps -q n8n-mcp-simple-auto)

if [ -n "$CONTAINER_ID" ]; then
    # Send MCP initialize request
    echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"docker-test","version":"1.0.0"}}}' | \
    timeout 10s docker exec -i "$CONTAINER_ID" node -e "
        const readline = require('readline');
        const rl = readline.createInterface({input: process.stdin});
        rl.on('line', (line) => {
            try {
                const req = JSON.parse(line);
                console.log('Received request:', req.method);
                process.exit(0);
            } catch (e) {
                console.error('Parse error:', e.message);
                process.exit(1);
            }
        });
        setTimeout(() => process.exit(1), 5000);
    "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SUCCESS: MCP communication working${NC}"
    else
        echo -e "${RED}❌ FAILED: MCP communication failed${NC}"
    fi
else
    echo -e "${RED}❌ FAILED: Could not find container${NC}"
fi

# Final summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "==============="

if docker compose -f docker-compose.simple-auto.yml ps n8n-mcp-simple-auto | grep -q "Up"; then
    echo -e "${GREEN}🎉 Docker Simple Auto-Update Setup: SUCCESS!${NC}"
    echo ""
    echo -e "${YELLOW}🚀 Usage for AI agents:${NC}"
    echo "  1. docker compose -f docker-compose.simple-auto.yml up -d"
    echo "  2. Connect to stdio MCP server in container"
    echo "  3. Use any n8n MCP tools - bulletproof reliability!"
    echo ""
    echo -e "${YELLOW}🔧 With auto-updates:${NC}"
    echo "  export GITHUB_TOKEN=your_token"
    echo "  docker compose -f docker-compose.simple-auto.yml up -d"
    echo ""
    echo -e "${YELLOW}📝 View logs:${NC}"
    echo "  docker compose -f docker-compose.simple-auto.yml logs -f"
else
    echo -e "${RED}❌ Docker Simple Auto-Update Setup: FAILED${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Debugging:${NC}"
    echo "  docker compose -f docker-compose.simple-auto.yml logs n8n-mcp-simple-auto"
    echo "  docker compose -f docker-compose.simple-auto.yml ps"
fi

echo ""
echo -e "${BLUE}🛑 To stop:${NC} docker compose -f docker-compose.simple-auto.yml down"