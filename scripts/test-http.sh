#!/bin/bash
# Test script for n8n-MCP HTTP Server

set -e

# Configuration
URL="${1:-http://localhost:3000}"
TOKEN="${AUTH_TOKEN:-test-token}"
VERBOSE="${VERBOSE:-0}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing n8n-MCP HTTP Server"
echo "================================"
echo "Server URL: $URL"
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq not installed. Output will not be formatted.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    echo ""
    JQ="cat"
else
    JQ="jq ."
fi

# Function to make requests
make_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local headers="$4"
    local expected_status="$5"
    
    if [ "$VERBOSE" = "1" ]; then
        echo -e "${YELLOW}Request:${NC} $method $URL$endpoint"
        [ -n "$data" ] && echo -e "${YELLOW}Data:${NC} $data"
    fi
    
    # Build curl command
    local cmd="curl -s -w '\n%{http_code}' -X $method '$URL$endpoint'"
    [ -n "$headers" ] && cmd="$cmd $headers"
    [ -n "$data" ] && cmd="$cmd -d '$data'"
    
    # Execute and capture response
    local response=$(eval "$cmd")
    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1)
    
    # Check status
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $method $endpoint - Status: $status"
    else
        echo -e "${RED}✗${NC} $method $endpoint - Expected: $expected_status, Got: $status"
    fi
    
    # Show response body
    if [ -n "$body" ]; then
        echo "$body" | $JQ
    fi
    echo ""
}

# Test 1: Health check
echo "1. Testing health endpoint..."
make_request "GET" "/health" "" "" "200"

# Test 2: OPTIONS request (CORS preflight)
echo "2. Testing CORS preflight..."
make_request "OPTIONS" "/mcp" "" "-H 'Origin: http://localhost' -H 'Access-Control-Request-Method: POST'" "204"

# Test 3: Authentication failure
echo "3. Testing authentication (should fail)..."
make_request "POST" "/mcp" \
    '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
    "-H 'Content-Type: application/json' -H 'Authorization: Bearer wrong-token'" \
    "401"

# Test 4: Missing authentication
echo "4. Testing missing authentication..."
make_request "POST" "/mcp" \
    '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
    "-H 'Content-Type: application/json'" \
    "401"

# Test 5: Valid MCP request to list tools
echo "5. Testing valid MCP request (list tools)..."
make_request "POST" "/mcp" \
    '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
    "-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -H 'Accept: application/json, text/event-stream'" \
    "200"

# Test 6: 404 for unknown endpoint
echo "6. Testing 404 response..."
make_request "GET" "/unknown" "" "" "404"

# Test 7: Invalid JSON
echo "7. Testing invalid JSON..."
make_request "POST" "/mcp" \
    '{invalid json}' \
    "-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN'" \
    "400"

# Test 8: Request size limit
echo "8. Testing request size limit..."
# Use a different approach for large data
echo "Skipping large payload test (would exceed bash limits)"

# Test 9: MCP initialization
if [ "$VERBOSE" = "1" ]; then
    echo "9. Testing MCP initialization..."
    make_request "POST" "/mcp" \
        '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"roots":{}}},"id":1}' \
        "-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -H 'Accept: text/event-stream'" \
        "200"
fi

echo "================================"
echo "🎉 Tests completed!"
echo ""
echo "To run with verbose output: VERBOSE=1 $0"
echo "To test a different server: $0 https://your-server.com"
echo "To use a different token: AUTH_TOKEN=your-token $0"