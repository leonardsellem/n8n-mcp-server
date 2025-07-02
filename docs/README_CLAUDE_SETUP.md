# Claude Desktop Configuration for n8n-MCP

This guide helps you connect n8n-MCP to Claude Desktop, giving Claude comprehensive knowledge about n8n's 525 workflow automation nodes, including 263 AI-capable tools.

## 🎯 Prerequisites

- Claude Desktop installed
- For local installation: Node.js (any version)
- For Docker: Docker installed (see installation instructions in main README)

## 🛠️ Configuration Methods

### Method 1: Local Installation (Recommended) 💻

1. **Install and build:**
   ```bash
   git clone https://github.com/czlonkowski/n8n-mcp.git
   cd n8n-mcp
   npm install
   npm run build
   npm run rebuild
   ```

2. **Configure Claude Desktop:**
   ```json
   {
     "mcpServers": {
       "n8n-mcp": {
         "command": "node",
         "args": ["/absolute/path/to/n8n-mcp/dist/mcp/index.js"],
         "env": {
           "NODE_ENV": "production",
           "LOG_LEVEL": "error",
           "MCP_MODE": "stdio",
           "DISABLE_CONSOLE_OUTPUT": "true"
         }
       }
     }
   }
   ```

⚠️ **Important**: 
- Use absolute paths, not relative paths
- The environment variables shown above are critical for proper stdio communication

### Method 2: Docker 🐳

No installation needed - runs directly from Docker:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "MCP_MODE=stdio",
        "-e", "LOG_LEVEL=error",
        "-e", "DISABLE_CONSOLE_OUTPUT=true",
        "ghcr.io/czlonkowski/n8n-mcp:latest"
      ]
    }
  }
}
```

✨ **Benefits**: No setup required, always up-to-date, isolated environment.

### Method 3: Remote Server Connection (Advanced)

⚠️ **Note**: Remote connections are complex and may have compatibility issues. Consider using local installation instead.

For production deployments with multiple users:

1. **Deploy server with HTTP mode** (see [HTTP Deployment Guide](./HTTP_DEPLOYMENT.md))

2. **Connect using custom HTTP client:**
   ```json
   {
     "mcpServers": {
       "n8n-remote": {
         "command": "node",
         "args": [
           "/path/to/n8n-mcp/scripts/mcp-http-client.js",
           "http://your-server.com:3000/mcp"
         ],
         "env": {
           "MCP_AUTH_TOKEN": "your-auth-token"
         }
       }
     }
   }
   ```

📝 **Note**: Native remote MCP support is available in Claude Pro/Team/Enterprise via Settings > Integrations.

## 📁 Configuration File Locations

Find your `claude_desktop_config.json` file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

🔄 **Important**: After editing, restart Claude Desktop (Cmd/Ctrl+R or quit and reopen).

## ✅ Verify Installation

After restarting Claude Desktop:

1. Look for "n8n-docker" or "n8n-documentation" in the MCP servers list
2. Try asking Claude: "What n8n nodes are available for working with Slack?"
3. Or use a tool directly: "Use the list_nodes tool to show me trigger nodes"

## 🔧 Available Tools (v2.5.1)

### Essential Tool - Start Here!
- **`start_here_workflow_guide`** - Essential guide and best practices (ALWAYS use this first!)

### Core Tools
- **`list_nodes`** - List all n8n nodes with filtering options
- **`get_node_info`** - Get comprehensive information (now includes aiToolCapabilities)
- **`get_node_essentials`** - Get only 10-20 essential properties (95% smaller!)
- **`search_nodes`** - Full-text search across all node documentation
- **`search_node_properties`** - Find specific properties within nodes
- **`get_node_documentation`** - Get parsed documentation from n8n-docs
- **`get_database_statistics`** - View database metrics and coverage

### AI Tools (Enhanced in v2.5.1)
- **`list_ai_tools`** - List AI-capable nodes (ANY node can be used as AI tool!)
- **`get_node_as_tool_info`** - Get guidance on using any node as an AI tool

### Task & Template Tools
- **`get_node_for_task`** - Pre-configured node settings for common tasks
- **`list_tasks`** - Discover available task templates
- **`list_node_templates`** - Find workflow templates using specific nodes
- **`get_template`** - Get complete workflow JSON for import
- **`search_templates`** - Search templates by keywords
- **`get_templates_for_task`** - Get curated templates for common tasks

### Validation Tools (Professional Grade)
- **`validate_node_operation`** - Smart validation with operation awareness
- **`validate_node_minimal`** - Quick validation for just required fields
- **`validate_workflow`** - Complete workflow validation (validates AI tool connections)
- **`validate_workflow_connections`** - Check workflow structure
- **`validate_workflow_expressions`** - Validate n8n expressions including $fromAI()
- **`get_property_dependencies`** - Analyze property visibility conditions

### Example Questions to Ask Claude:
- "Show me all n8n nodes for working with databases"
- "How do I use the HTTP Request node?"
- "Get the essentials for Slack node" (uses get_node_essentials)
- "How can I use Google Sheets as an AI tool?"
- "Validate my workflow before deployment"
- "Find templates for webhook automation"

## 🔍 Troubleshooting

### Server Not Appearing in Claude

1. **Check JSON syntax**: 
   ```bash
   # Validate your config file
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
   ```

2. **Verify paths are absolute** (not relative)

3. **Restart Claude Desktop completely** (quit and reopen)

### Remote Connection Issues

**"TransformStream is not defined" error:**
- Cause: Node.js version < 18
- Fix: Update Node.js to v18 or newer
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

**"Server disconnected" error:**
- Check AUTH_TOKEN matches between server and client
- Verify server is running: `curl https://your-server.com/health`
- Check for VPN interference

### Docker Issues

**"Cannot find image" error:**
```bash
# Pull the latest image
docker pull ghcr.io/czlonkowski/n8n-mcp:latest
```

**Permission denied:**
```bash
# Ensure Docker is running
docker ps
```

### Common Issues

**"Expected ',' or ']' after array element" errors in logs:**
- Cause: Console output interfering with stdio communication
- Fix: Ensure all required environment variables are set:
  - `MCP_MODE=stdio`
  - `LOG_LEVEL=error`
  - `DISABLE_CONSOLE_OUTPUT=true`

**"NODE_MODULE_VERSION mismatch" warnings:**
- Not a problem! The server automatically falls back to a pure JavaScript implementation
- The warnings are suppressed with proper environment variables

**Server appears but tools don't work:**
- Check that you've built the project: `npm run build`
- Verify the database exists: `npm run rebuild`
- Restart Claude Desktop completely (quit and reopen)

### Quick Fixes

- 🔄 **Always restart Claude** after config changes
- 📋 **Copy example configs exactly** (watch for typos)
- 📂 **Use absolute paths** (/Users/... not ~/...)
- 🔍 **Check logs**: View > Developer > Logs in Claude Desktop
- 🛑 **Set all environment variables** shown in the examples

For more help, see [Troubleshooting Guide](./TROUBLESHOOTING.md)