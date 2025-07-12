# 🔄 GitHub Auto-Update Guide

## How to Enable Auto-Updates from Main n8n Repository

The system is already configured to sync from `n8n-io/n8n` repository. Here's how to activate it:

---

## 🚀 Quick Setup (2 Minutes)

### 1. Get GitHub Token
```bash
# Go to: https://github.com/settings/tokens
# Click "Generate new token (classic)"
# Set expiration: 90 days (or longer)
# Select scopes:
#   ✅ repo > public_repo (read public repositories)
#   ✅ metadata (read repository metadata)
# Copy the token: ghp_xxxxxxxxxxxxxxxxxxxx
```

### 2. Configure Environment
```bash
# Set your GitHub token
export GITHUB_TOKEN=ghp_your_actual_token_here

# Update the .env file
echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env
```

### 3. Restart Container
```bash
docker compose restart
```

**That's it!** Auto-updates are now enabled.

---

## 🔧 What It Does

### Repository Configuration:
- **Repository**: `n8n-io/n8n` (main n8n repository)
- **Monitored paths**:
  - `packages/nodes-base/nodes/` (all n8n nodes)
  - `packages/nodes-base/credentials/` (credential types)
- **Update frequency**: Every 15 minutes (configurable)

### Auto-Update Process:
1. **Check GitHub** every 15 minutes for new commits
2. **Download new/changed files** from monitored paths  
3. **Parse node metadata** (display names, descriptions, properties)
4. **Update local database** with new node information
5. **Invalidate cache** so AI agents get fresh data
6. **Log all changes** for monitoring

### Fallback Strategy:
- If GitHub is down → Use local NPM packages
- If API rate limited → Use cached data
- If network fails → Continue with existing nodes
- **Never breaks** - AI agents always get working nodes

---

## 📊 Monitoring Auto-Updates

### Check Status:
```bash
# View recent logs
docker logs n8n-mcp --tail 20

# Monitor GitHub sync activity  
docker logs n8n-mcp -f | grep -E "(GitHub|sync|update)"

# Check container health
docker ps | grep n8n-mcp
```

### Expected Log Messages:
```
✅ Good signs:
[GitHub Sync] Initialized successfully
[GitHub Sync] Checking for updates from n8n-io/n8n
[GitHub Sync] Found 3 new files, 1 updated file
[GitHub Sync] Updated database with new nodes
[Reliable Auto Loader] Enhanced with 5 GitHub nodes

⚠️ Warning signs (but still working):
[GitHub Sync] Rate limit reached, using cached data
[GitHub Sync] Network timeout, falling back to NPM
[Reliable Auto Loader] GitHub sync failed, using local nodes

❌ Error signs:
[GitHub Sync] Authentication failed - check GITHUB_TOKEN
[GitHub Sync] Repository not found - check permissions
```

---

## 🧪 Testing Auto-Updates

### Manual Test:
```bash
# Test GitHub API access
curl -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/n8n-io/n8n/contents/packages/nodes-base/nodes"

# Run the test script
./test-github-auto-update.sh
```

### Force Update (if needed):
```bash
# Restart container to trigger immediate check
docker compose restart

# Or use MCP tools (when in HTTP mode):
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer your-auth-token" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"force_update","arguments":{}}}'
```

---

## 🎯 Benefits of Auto-Updates

### For AI Agents:
- ✅ **Always current** - Latest n8n nodes available immediately
- ✅ **New features** - Access to newly released nodes automatically  
- ✅ **Bug fixes** - Node improvements applied automatically
- ✅ **Zero downtime** - Updates happen in background
- ✅ **Bulletproof** - Fallbacks ensure service never breaks

### For Developers:
- ✅ **Maintenance-free** - No manual node updates needed
- ✅ **Production-ready** - Battle-tested fallback mechanisms
- ✅ **Monitoring** - Full visibility into update process
- ✅ **Configurable** - Adjust update frequency as needed

---

## ⚙️ Configuration Options

### Environment Variables:
```bash
# GitHub configuration
GITHUB_TOKEN=ghp_your_token          # Required for auto-updates
UPDATE_INTERVAL_MINUTES=15           # How often to check (default: 15)

# Repository settings (optional - defaults shown)
GITHUB_REPOSITORY=n8n-io/n8n         # Repository to monitor
GITHUB_PATHS=packages/nodes-base/nodes,packages/nodes-base/credentials

# Cache settings
GITHUB_CACHE_PATH=/app/data/github-cache  # Where to store downloaded files
```

### Docker Compose:
```yaml
services:
  n8n-mcp:
    environment:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      UPDATE_INTERVAL_MINUTES: 30      # Check every 30 minutes
      LOG_LEVEL: debug                 # More verbose logging
```

---

## 🚨 Troubleshooting

### "No GitHub token provided"
```bash
# Check if token is set
echo $GITHUB_TOKEN

# Set token and restart
export GITHUB_TOKEN=your_token_here
docker compose restart
```

### "GitHub API rate limit"
```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/rate_limit"

# Solution: Wait or use a different token
# The system will fallback to cached data automatically
```

### "Authentication failed"
```bash
# Check token permissions:
# - Must have "public_repo" access
# - Must have "metadata" access
# - Token must not be expired

# Test token:
curl -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/user"
```

### Container memory issues:
```bash
# Increase memory limit in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

---

## 📈 Performance

### Expected Metrics:
- **Sync time**: 30-60 seconds for full update
- **File downloads**: ~500-1000 node files
- **Database update**: 5-10 seconds  
- **Memory usage**: <512MB during sync
- **API calls**: ~10-50 per sync (depending on changes)

### Optimization:
- Uses GitHub API efficiently (only downloads changes)
- Caches downloaded files locally
- Only updates database when changes detected
- Incremental sync (not full download each time)

---

## ✅ Success Indicators

You'll know auto-updates are working when:

1. **Container logs show**:
   ```
   [GitHub Sync] Initialized successfully
   [GitHub Sync] Last sync: 2025-01-15T10:30:00Z
   [Reliable Auto Loader] Enhanced with X GitHub nodes
   ```

2. **Node count increases** over time as new nodes are released

3. **New n8n features** appear in MCP tools automatically

4. **Zero manual intervention** needed for months

---

**🎉 You now have a fully automated n8n node sync system!**

The MCP server will automatically stay in sync with the main n8n repository, ensuring AI agents always have access to the latest workflow automation capabilities.