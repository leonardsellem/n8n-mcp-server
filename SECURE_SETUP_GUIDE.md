# 🔒 Secure n8n MCP Server Setup Guide

## 🎯 Current Status: WORKING & GITHUB-SAFE

✅ **MCP server initialized with 22 tools (n8n API: not configured)**  
✅ **Environment configuration working correctly**  
✅ **GitHub security: No personal credentials will be committed**  
✅ **Documentation and node discovery fully functional**

---

## 🔐 Security Features

### GitHub Protection
- ✅ `.env` file is in `.gitignore` - will NOT be committed to GitHub
- ✅ Only `.env.example` is tracked by Git (safe template)
- ✅ Server works perfectly without personal credentials
- ✅ Default configuration is documentation-only mode

### Safe for Public Repositories
The current setup is **completely safe** for public repositories:
- No API keys required for core functionality
- No personal data exposed
- Works in "documentation-only" mode by default

---

## 🚀 Usage Modes

### Mode 1: Documentation-Only (Current - GitHub Safe)
**Perfect for: Learning, exploring n8n nodes, getting help**

```bash
# Your current .env is already configured for this mode:
N8N_API_URL=          # Empty (safe)
N8N_API_KEY=          # Empty (safe)
```

**Available Tools (22 total):**
- ✅ Node discovery and documentation
- ✅ Workflow guides and tutorials  
- ✅ n8n best practices
- ✅ Node parameter help
- ✅ Credential configuration guides
- ❌ Cannot create/execute actual workflows

### Mode 2: Full Workflow Management (Optional)
**Perfect for: Active n8n development, workflow automation**

**Setup:**
1. Copy your current `.env` to `.env.backup`
2. Edit `.env` to add your n8n credentials:

```bash
# Add these lines to your .env file:
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key-here
```

**Additional Tools Available:**
- ✅ All documentation tools (22)
- ✅ Create and execute workflows
- ✅ Manage n8n instance remotely
- ✅ Workflow debugging and monitoring

---

## 🔧 Quick Start Commands

### Test Current Setup (Safe Mode)
```bash
cd n8n-mcp-final

# Test MCP server functionality
echo '{"method": "tools/list", "params": {}}' | node dist/mcp/index.js

# Get node documentation
echo '{"method": "tools/call", "params": {"name": "start_here_workflow_guide", "arguments": {"topic": "overview"}}}' | node dist/mcp/index.js

# Check database statistics
echo '{"method": "tools/call", "params": {"name": "get_database_statistics", "arguments": {}}}' | node dist/mcp/index.js
```

### Configure for Claude Desktop (Recommended)
```json
{
  "mcpServers": {
    "n8n-mcp-server": {
      "command": "node",
      "args": ["C:/Users/Chris Boyd/Documents/MCP-Servers/n8n-mcp-final/dist/mcp/index.js"],
      "env": {}
    }
  }
}
```

---

## 🐳 Docker Deployment (Production Ready)

### Build Docker Image
```bash
cd n8n-mcp-final
docker build -t n8n-mcp-server:latest .
```

### Run in Safe Mode (No Credentials)
```bash
docker run -d \
  --name n8n-mcp-server \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  n8n-mcp-server:latest
```

### Run with Custom Environment
```bash
docker run -d \
  --name n8n-mcp-server \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/.env:/app/.env \
  n8n-mcp-server:latest
```

---

## 🛡️ Best Practices

### For GitHub Safety
1. **Never commit `.env` files** - Already protected by `.gitignore`
2. **Use `.env.example` for templates** - Already provided
3. **Document public setup instructions** - This guide
4. **Test in documentation-only mode first** - Current setup

### For Production Use
1. **Use Docker for isolation**
2. **Mount volumes for data persistence**
3. **Use environment variables for secrets**
4. **Monitor logs for security issues**

### For Development
1. **Keep `.env.backup` for quick restoration**
2. **Test changes in documentation-only mode first**
3. **Use separate environments for testing**

---

## 🎯 Current Server Capabilities

### Core Documentation Tools (Always Available)
1. `start_here_workflow_guide` - n8n getting started
2. `search_nodes` - Find nodes by functionality  
3. `get_node_details` - Detailed node documentation
4. `list_node_categories` - Browse node types
5. `get_credential_details` - Authentication setup
6. `explain_node_parameters` - Parameter configuration
7. `workflow_troubleshooting` - Debug workflows
8. `get_database_statistics` - Server metrics
9. Plus 14 more specialized tools...

### Workflow Management Tools (n8n API Required)
- `create_workflow` - Build new workflows
- `execute_workflow` - Run workflows
- `get_workflow_status` - Monitor execution
- `list_workflows` - Browse existing workflows

---

## 🔍 Troubleshooting

### "n8n API: not configured" Message
This is **NORMAL and EXPECTED** behavior for documentation-only mode.
- ✅ Server is working correctly
- ✅ 22 tools are available
- ✅ No action needed unless you want workflow management

### Adding n8n API Access Later
1. Get API key from your n8n instance (Settings > API)
2. Edit `.env` file to add credentials
3. Restart MCP server
4. Verify with: `echo '{"method": "tools/list", "params": {}}' | node dist/mcp/index.js`

### Docker Issues
```bash
# Check container status
docker ps

# View logs
docker logs n8n-mcp-server

# Restart container
docker restart n8n-mcp-server
```

---

## ✅ Success Verification

Your setup is working correctly if you see:
```
[INFO] MCP server initialized with 22 tools (n8n API: not configured)
[INFO] n8n Documentation MCP Server running on stdio transport
```

**This means:**
- ✅ All documentation tools are loaded and functional
- ✅ Server is running in secure, GitHub-safe mode
- ✅ Ready for AI agent integration
- ✅ No personal credentials exposed

**Perfect for GitHub commits and public sharing!** 🎉
