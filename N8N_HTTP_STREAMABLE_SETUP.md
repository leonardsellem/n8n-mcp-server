# n8n MCP HTTP Streamable Configuration Guide

## Overview

This guide shows how to configure the n8n-nodes-mcp community node to connect to n8n-mcp using the **recommended HTTP Streamable transport**.

## Prerequisites

1. Install n8n-nodes-mcp community node:
   - Go to n8n Settings → Community Nodes
   - Install: `n8n-nodes-mcp`
   - Restart n8n if prompted

2. Ensure environment variable is set:
   ```bash
   N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
   ```

## Quick Start

### Step 1: Start Services

```bash
# Stop any existing containers
docker stop n8n n8n-mcp && docker rm n8n n8n-mcp

# Start with HTTP Streamable configuration
docker-compose -f docker-compose.n8n.yml up -d

# Services will be available at:
# - n8n: http://localhost:5678
# - n8n-mcp: http://localhost:3000
```

### Step 2: Create MCP Credentials in n8n

1. Open n8n at http://localhost:5678
2. Go to Credentials → Add credential
3. Search for "MCP" and select "MCP API"
4. Configure the fields as follows:
   - **Credential Name**: `n8n MCP Server`
   - **HTTP Stream URL**: `
   - **Messages Post Endpoint**: (leave empty)
   - **Additional Headers**: 
     ```json
     {
       "Authorization": "Bearer test-secure-token-123456789"
     }
     ```
5. Save the credential

### Step 3: Configure MCP Client Node

Add an MCP Client node to your workflow with these settings:

- **Connection Type**: `HTTP Streamable`
- **HTTP Streamable URL**: `http://n8n-mcp:3000/mcp`
- **Authentication**: `Bearer Auth`
- **Credentials**: Select the credential you created
- **Operation**: Choose your operation (e.g., "List Tools", "Call Tool")

### Step 4: Test the Connection

1. Execute the workflow
2. The MCP Client should successfully connect and return results

## Available Operations

### List Tools
Shows all available MCP tools:
- `start_here_workflow_guide`
- `list_nodes`
- `get_node_info`
- `search_nodes`
- `get_node_essentials`
- `validate_node_config`
- And many more...

### Call Tool
Execute specific tools with arguments:

**Example: Get Node Info**
- Tool Name: `get_node_info`
- Arguments: `{ "nodeType": "n8n-nodes-base.httpRequest" }`

**Example: Search Nodes**
- Tool Name: `search_nodes`
- Arguments: `{ "query": "webhook", "limit": 5 }`

## Import Example Workflow

Import the pre-configured workflow:
1. Go to Workflows → Add workflow → Import from File
2. Select: `examples/n8n-mcp-streamable-workflow.json`
3. Update the credentials with your bearer token

## Troubleshooting

### Connection Refused
- Verify services are running: `docker ps`
- Check logs: `docker logs n8n-mcp`
- Ensure you're using `http://n8n-mcp:3000/mcp` (container name) not `localhost`

### Authentication Failed
- Verify bearer token matches exactly
- Check CORS settings allow n8n origin

### Test Endpoint Manually
```bash
# Test health check
curl http://localhost:3000/health

# Test MCP endpoint (should return error without proper JSON-RPC body)
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer test-secure-token-123456789" \
  -H "Content-Type: application/json"
```

## Architecture Notes

- **Transport**: HTTP Streamable (StreamableHTTPServerTransport)
- **Protocol**: JSON-RPC 2.0 over HTTP POST
- **Authentication**: Bearer token in Authorization header
- **Endpoint**: Single `/mcp` endpoint handles all operations
- **Stateless**: Each request creates a new MCP server instance

## Why HTTP Streamable?

1. **Recommended by MCP**: The official recommended transport method
2. **Better Performance**: More efficient than SSE
3. **Simpler Implementation**: Single POST endpoint
4. **Future Proof**: SSE is deprecated in MCP spec