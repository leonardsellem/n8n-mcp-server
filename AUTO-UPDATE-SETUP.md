# n8n MCP Server Auto-Update Setup Guide

This guide explains how to set up and configure the n8n MCP server with comprehensive GitHub auto-update capabilities.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Initial database setup:**
   ```bash
   npm run rebuild
   ```

4. **Configure environment variables** (see below)

5. **Start with auto-update:**
   ```bash
   npm run start:auto-update
   ```

## 🔧 Environment Configuration

Create a `.env` file in the project root with the following variables:

### Required for Auto-Update
```bash
# GitHub Integration (Required for auto-update)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPOSITORY=n8n-io/n8n
GITHUB_SYNC_INTERVAL="*/15 * * * *"  # Every 15 minutes
AUTO_REBUILD_INTERVAL="0 2 * * *"    # Daily at 2 AM

# GitHub Webhooks (Optional but recommended)
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_WEBHOOK_PORT=3001
```

### Optional Configuration
```bash
# n8n API Integration
N8N_API_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key

# Logging
LOG_LEVEL=info

# Cache Configuration
CACHE_TTL=3600000           # 1 hour in milliseconds
CACHE_MAX_SIZE=1000         # Maximum cache entries
```

## 🔑 GitHub Setup

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with these permissions:
   - `repo` (Full control of private repositories)
   - `contents:read` (Access repository contents)
3. Copy the token and set it as `GITHUB_TOKEN`

### 2. Setup GitHub Webhook (Optional)

For real-time updates when nodes change on GitHub:

1. Go to your n8n repository → Settings → Webhooks
2. Click "Add webhook"
3. Configure:
   - **Payload URL**: `http://your-server:3001/webhook`
   - **Content type**: `application/json`
   - **Secret**: Set a secure secret and use it as `GITHUB_WEBHOOK_SECRET`
   - **Events**: Select "Push" and "Pull requests"
4. Save the webhook

## 🏗️ Architecture Overview

The auto-update system consists of several integrated components:

### Core Components

1. **HybridNodeLoader** - Loads nodes from both NPM packages and GitHub
2. **HotReloadRepository** - Database with real-time update capabilities
3. **GitHubWebhookService** - Handles real-time GitHub events
4. **AutoUpdateService** - Orchestrates the entire update process
5. **EnhancedCacheManager** - Intelligent cache invalidation

### Update Flow

```
GitHub Changes → Webhook/Scheduled Sync → Node Loading → Database Update → Cache Invalidation → MCP Tools Updated
```

## 📊 Monitoring and Management

### Available MCP Tools

The auto-update server provides additional management tools:

- `get_auto_update_status` - Get comprehensive service status
- `force_github_sync` - Manually trigger GitHub synchronization
- `get_cache_statistics` - View cache performance metrics
- `invalidate_cache` - Clear cache entries manually
- `get_update_history` - View recent update events

### Example Usage

```bash
# Check auto-update status
mcp call get_auto_update_status

# Force GitHub sync
mcp call force_github_sync '{"rebuild_database": true}'

# View cache statistics
mcp call get_cache_statistics

# Clear cache
mcp call invalidate_cache '{"cache_type": "all", "reason": "manual_refresh"}'
```

## 🔄 Update Mechanisms

### 1. Scheduled Sync
- **Default**: Every 15 minutes
- **Configurable**: Via `GITHUB_SYNC_INTERVAL`
- **Action**: Checks for changes and updates if needed

### 2. Webhook Updates
- **Trigger**: Real-time GitHub push/PR events
- **Latency**: Near-instant (< 5 seconds)
- **Scope**: Only processes node file changes

### 3. Daily Rebuild
- **Default**: Daily at 2 AM
- **Configurable**: Via `AUTO_REBUILD_INTERVAL`
- **Action**: Complete database rebuild with latest GitHub data

### 4. Manual Updates
- **Trigger**: `force_github_sync` MCP tool
- **Use case**: Immediate updates when needed

## 🧪 Testing the Setup

### 1. Verify GitHub Connection
```bash
# Start the server and check logs for:
# [Auto Update] GitHub sync completed
# [Auto Update] Auto-update service initialized
```

### 2. Test Webhook (if configured)
```bash
# Make a test commit to a node file
# Check logs for:
# [Auto Update] GitHub webhook received
# [Auto Update] Node change detected
```

### 3. Test Manual Sync
```bash
# Use MCP tool:
mcp call force_github_sync

# Check for successful sync in logs
```

## 📈 Performance Optimization

### Cache Configuration

The system uses intelligent caching with automatic invalidation:

- **Node Info Cache**: Stores parsed node data (TTL: 1 hour)
- **Search Cache**: Caches search results (TTL: 30 minutes)  
- **Template Cache**: Workflow templates (TTL: 2 hours)

### Memory Management

- **Cache Pressure Monitoring**: Automatic eviction when memory is low
- **LRU Eviction**: Least recently used items removed first
- **Configurable Limits**: Set via environment variables

### GitHub Rate Limiting

- **Built-in Throttling**: 200ms between API requests
- **Conditional Requests**: Only sync when changes detected
- **Intelligent Scheduling**: Avoids peak GitHub usage times

## 🛠️ Troubleshooting

### Common Issues

1. **"GitHub token not configured"**
   - Set `GITHUB_TOKEN` environment variable
   - Verify token has correct permissions

2. **"Database not found"**
   - Run `npm run rebuild` to create initial database
   - Check file permissions on `./data/` directory

3. **"Webhook service failed to start"**
   - Check if port 3001 is available
   - Verify firewall settings
   - Set `GITHUB_WEBHOOK_PORT` to alternative port

4. **"GitHub sync failed"**
   - Check GitHub token validity
   - Verify repository access permissions
   - Check network connectivity

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm run start:auto-update
```

### Health Checks

The server provides health endpoints:
```bash
# Auto-update service health
curl http://localhost:3001/health

# Cache statistics
mcp call get_cache_statistics

# Update history
mcp call get_update_history
```

## 🔒 Security Considerations

### GitHub Token Security
- Use minimal required permissions
- Rotate tokens regularly
- Store in secure environment variables
- Never commit tokens to version control

### Webhook Security
- Use strong webhook secrets
- Validate all incoming webhook signatures
- Rate limit webhook endpoints
- Monitor for suspicious activity

### Network Security
- Firewall webhook ports appropriately
- Use HTTPS for webhook URLs in production
- Consider VPN for sensitive deployments

## 🚀 Production Deployment

### Docker Support

The auto-update system is fully compatible with Docker:

```dockerfile
# Set environment variables
ENV GITHUB_TOKEN=your_token
ENV GITHUB_WEBHOOK_SECRET=your_secret

# Expose webhook port
EXPOSE 3001

# Start with auto-update
CMD ["npm", "run", "start:auto-update"]
```

### Monitoring

Recommended monitoring setup:
- GitHub webhook delivery logs
- Cache hit rates and memory usage
- Update frequency and success rates
- Database growth and performance

### Backup Strategy

- Regular database backups before major updates
- GitHub cache directory backup
- Configuration backup (excluding secrets)

## 📝 Maintenance

### Regular Tasks

1. **Monitor GitHub API usage** - Stay within rate limits
2. **Review update logs** - Check for failed syncs
3. **Clean cache directories** - Prevent disk space issues
4. **Update GitHub tokens** - Before expiration
5. **Review webhook logs** - Ensure deliveries succeed

### Version Updates

When updating n8n MCP server:
1. Stop auto-update service
2. Backup database and cache
3. Update code and dependencies
4. Rebuild database if schema changed
5. Restart with auto-update

## 🎯 Benefits

With auto-update enabled, you get:

- ✅ **Real-time updates** - Latest n8n nodes within minutes
- ✅ **Zero downtime** - Hot database reloading
- ✅ **Intelligent caching** - 90%+ cache hit rates
- ✅ **Comprehensive monitoring** - Full visibility into updates
- ✅ **Fallback reliability** - Graceful degradation to local packages
- ✅ **Performance optimization** - Automatic cache management

The MCP server becomes truly self-updating, ensuring AI agents always have access to the latest n8n capabilities!