#!/bin/bash
set -e

echo "🐳 Simple n8n Node Extraction via Docker"
echo "======================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')]${NC} ⚠️  $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')]${NC} ❌ $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✅"

# Build the project first
print_status "Building the project..."
npm run build

# Create a temporary directory for extraction
TEMP_DIR=$(mktemp -d)
print_status "Created temporary directory: $TEMP_DIR"

# Run Docker container to copy node files
print_status "Running n8n container to extract nodes..."
docker run --rm -d --name n8n-temp n8nio/n8n:latest sleep 300

# Wait a bit for container to start
sleep 5

# Copy n8n modules from container
print_status "Copying n8n modules from container..."
docker cp n8n-temp:/usr/local/lib/node_modules/n8n/node_modules "$TEMP_DIR/node_modules" || {
    print_error "Failed to copy node_modules"
    docker stop n8n-temp
    rm -rf "$TEMP_DIR"
    exit 1
}

# Stop the container
docker stop n8n-temp

# Run our extraction script locally
print_status "Running extraction script..."
NODE_ENV=development \
NODE_DB_PATH=./data/nodes-fresh.db \
N8N_MODULES_PATH="$TEMP_DIR/node_modules" \
node scripts/extract-from-docker.js

# Clean up
print_status "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

# Check the results
print_status "Checking extraction results..."
if [ -f "./data/nodes-fresh.db" ]; then
    NODE_COUNT=$(sqlite3 ./data/nodes-fresh.db "SELECT COUNT(*) FROM nodes;" 2>/dev/null || echo "0")
    print_status "Extracted $NODE_COUNT nodes"
    
    # Check if we got the If node source code and look for version
    IF_SOURCE=$(sqlite3 ./data/nodes-fresh.db "SELECT source_code FROM nodes WHERE node_type='n8n-nodes-base.If' LIMIT 1;" 2>/dev/null || echo "")
    if [[ $IF_SOURCE =~ version:[[:space:]]*([0-9]+) ]]; then
        IF_CODE_VERSION="${BASH_REMATCH[1]}"
        print_status "If node version from source code: v$IF_CODE_VERSION"
        
        if [ "$IF_CODE_VERSION" -ge "2" ]; then
            print_status "✅ Successfully extracted latest If node (v$IF_CODE_VERSION)!"
        else
            print_warning "If node is still v$IF_CODE_VERSION, expected v2 or higher"
        fi
    fi
else
    print_error "Database file not found after extraction"
fi

print_status "✨ Extraction complete!"

# Offer to restart the MCP server
echo ""
read -p "Would you like to restart the MCP server with the new nodes? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Restarting MCP server..."
    # Kill any existing server process
    pkill -f "node.*dist/index.js" || true
    
    # Start the server
    npm start &
    print_status "MCP server restarted with fresh node database"
fi