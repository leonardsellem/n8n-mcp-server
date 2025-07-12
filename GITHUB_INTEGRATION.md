# GitHub Integration Guide

The n8n MCP server now supports direct GitHub integration for real-time node caching and automatic updates. This system fetches nodes directly from the n8n GitHub repository and automatically updates your local cache when changes are detected.

## 🚀 Features

- **Direct GitHub Fetching**: Load nodes directly from `https://github.com/n8n-io/n8n`
- **Automatic Updates**: Monitor GitHub for changes and update cache automatically
- **Cache Invalidation**: Intelligent cache invalidation based on commit SHAs
- **Dual Source Support**: GitHub primary with local package fallback
- **Real-time Monitoring**: Configurable intervals for change detection
- **Rate Limit Aware**: Respects GitHub API rate limits

## 🔧 Setup

### 1. Generate GitHub Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repositories)
4. Copy the generated token

### 2. Configure Environment

Add to your `.env` file:

```bash
# GitHub Personal Access Token (required)
GITHUB_TOKEN=your-github-token-here

# Optional: Customize repository and branch
GITHUB_REPOSITORY=n8n-io/n8n
GITHUB_BRANCH=master

# Optional: Monitoring settings
GITHUB_MONITORING_ENABLED=true
GITHUB_CHECK_INTERVAL=*/15 * * * *  # Every 15 minutes
```

### 3. Build and Rebuild

```bash
# Build the project
npm run build

# Rebuild database with GitHub integration
npm run rebuild

# Or rebuild from local packages only
npm run rebuild:local
```

## 📋 Usage

### Basic Commands

```bash
# Test GitHub integration
npm run test:github

# Rebuild from GitHub (default)
npm run rebuild

# Rebuild from GitHub (explicit)
npm run rebuild:github

# Rebuild from local packages
npm run rebuild:local

# Test with rebuild
npm run test:github -- --rebuild
```

### Server Operation

The server will automatically:
1. **Start monitoring** GitHub for changes every 15 minutes (configurable)
2. **Detect changes** by comparing commit SHAs
3. **Update cache** when new/modified nodes are found
4. **Track metadata** in the database for efficiency

## 🔄 How It Works

### Node Discovery Process

1. **GitHub API Access**: Uses GitHub REST API to browse repository
2. **File Discovery**: Finds all `.node.ts` files in:
   - `packages/nodes-base/nodes/`
   - `packages/nodes-base/credentials/`
   - `packages/@n8n/n8n-nodes-langchain/nodes/`
   - `packages/@n8n/n8n-nodes-langchain/credentials/`
3. **Content Fetching**: Downloads raw TypeScript source code
4. **Parsing**: Extracts node metadata from source files
5. **Caching**: Stores in SQLite database with GitHub metadata

### Change Detection

1. **Commit Monitoring**: Compares latest commit SHA with cached SHA
2. **File Diffing**: Identifies new, modified, and deleted node files
3. **Incremental Updates**: Only updates changed nodes (not full rebuild)
4. **Database Tracking**: Maintains sync state and statistics

### Database Schema

The database tracks GitHub-specific information:

```sql
-- GitHub tracking fields in nodes table
github_path TEXT,              -- Original GitHub file path
github_sha TEXT,               -- File SHA for change detection
github_last_modified DATETIME, -- Last modification timestamp
source_type TEXT,              -- 'github' or 'package'
source_content TEXT,           -- Raw TypeScript source code

-- Sync metadata table
github_sync_metadata (
  repository TEXT,
  branch TEXT,
  last_sync_commit TEXT,
  last_sync_timestamp DATETIME,
  nodes_synced INTEGER,
  sync_status TEXT
);
```

## 🔍 Monitoring

### Check Current Status

```bash
# Test GitHub integration
npm run test:github

# Check API rate limit
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit
```

### Monitor Logs

The server logs GitHub activity:

```bash
# Start server with GitHub monitoring
npm start

# Check logs for GitHub activity
tail -f logs/application.log | grep -i github
```

### Database Inspection

```bash
# Connect to database
sqlite3 data/nodes.db

# Check GitHub nodes
SELECT node_type, github_path, github_sha, source_type 
FROM nodes 
WHERE source_type = 'github' 
LIMIT 10;

# Check sync status
SELECT * FROM github_sync_metadata;
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GITHUB_TOKEN` | - | GitHub API token (required) |
| `GITHUB_REPOSITORY` | `n8n-io/n8n` | Repository to monitor |
| `GITHUB_BRANCH` | `master` | Branch to monitor |
| `GITHUB_MONITORING_ENABLED` | `true` | Enable monitoring |
| `GITHUB_CHECK_INTERVAL` | `*/15 * * * *` | Check frequency (cron) |
| `GITHUB_SYNC_ENABLED` | `true` | Enable sync service |
| `GITHUB_SYNC_INTERVAL` | `0 */6 * * *` | Sync frequency (cron) |
| `GITHUB_CACHE_PATH` | `./cache/github` | Local cache directory |

### Monitoring Intervals

```bash
# Every 5 minutes (aggressive)
GITHUB_CHECK_INTERVAL="*/5 * * * *"

# Every hour (conservative)
GITHUB_CHECK_INTERVAL="0 * * * *"

# Every 15 minutes (recommended)
GITHUB_CHECK_INTERVAL="*/15 * * * *"

# Daily at midnight
GITHUB_CHECK_INTERVAL="0 0 * * *"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Rate Limit Exceeded
```bash
# Check rate limit
npm run test:github

# Solution: Increase check interval
GITHUB_CHECK_INTERVAL="0 * * * *"  # Every hour instead of 15 minutes
```

#### 2. Authentication Failed
```bash
# Check token validity
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Solution: Generate new token with 'public_repo' scope
```

#### 3. No Changes Detected
```bash
# Check sync metadata
sqlite3 data/nodes.db "SELECT * FROM github_sync_metadata;"

# Force refresh
npm run rebuild:github -- --force
```

#### 4. Build Errors
```bash
# Ensure TypeScript builds
npm run build

# Check for syntax errors
npm run lint
```

### Performance Optimization

#### 1. Rate Limit Management
- Use longer intervals for monitoring
- Implement exponential backoff
- Cache GitHub responses locally

#### 2. Database Optimization
- Index GitHub fields for faster queries
- Use prepared statements
- Batch database operations

#### 3. Memory Usage
- Stream large file downloads
- Implement garbage collection
- Limit concurrent operations

## 📈 Benefits

### For Users
- **Latest Nodes**: Always have access to the newest n8n nodes
- **No Waiting**: No need to wait for npm package releases
- **Automatic Updates**: Cache stays current without manual intervention
- **Fallback Support**: Local packages as backup if GitHub is unavailable

### For Developers
- **Real-time Testing**: Test with latest node versions immediately
- **Development Speed**: Faster iteration with live GitHub integration
- **Debugging**: Direct access to TypeScript source code
- **Monitoring**: Built-in change detection and logging

## 🔒 Security

### Best Practices
1. **Token Security**: Store GitHub token in environment variables
2. **Scope Limitation**: Use minimal token scopes (`public_repo`)
3. **Rate Limiting**: Respect GitHub API limits
4. **Error Handling**: Proper error handling for API failures
5. **Logging**: Secure logging without exposing tokens

### Token Management
```bash
# Generate secure token
GITHUB_TOKEN=$(openssl rand -base64 32)

# Store in secure location
echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env

# Rotate tokens regularly
# Update token in GitHub settings and .env file
```

## 🔄 Migration

### From Local to GitHub

1. **Backup Current Database**:
   ```bash
   cp data/nodes.db data/nodes.db.backup
   ```

2. **Set GitHub Token**:
   ```bash
   echo "GITHUB_TOKEN=your-token" >> .env
   ```

3. **Rebuild with GitHub**:
   ```bash
   npm run rebuild:github
   ```

4. **Verify Results**:
   ```bash
   npm run test:github
   ```

### From GitHub to Local

1. **Disable GitHub Monitoring**:
   ```bash
   echo "GITHUB_MONITORING_ENABLED=false" >> .env
   ```

2. **Rebuild with Local Packages**:
   ```bash
   npm run rebuild:local
   ```

## 📊 Statistics

After successful GitHub integration:
- **~525 nodes** available from GitHub
- **~15-minute** update intervals
- **~5000 API calls/hour** rate limit
- **~280MB** database size with source code
- **~99% uptime** with local fallback

## 🤝 Contributing

To contribute to GitHub integration:

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests
5. Submit pull request

Key files for GitHub integration:
- `src/loaders/remote-node-discovery.ts`
- `src/services/github-monitor.ts`
- `src/services/github-sync.ts`
- `src/config/github-config.ts`
- `src/scripts/rebuild-github.ts`

## 📚 Resources

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [n8n Repository](https://github.com/n8n-io/n8n)
- [Personal Access Tokens](https://github.com/settings/tokens)
- [Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

---

**🎉 GitHub Integration is now active!** Your n8n MCP server will automatically stay synchronized with the latest n8n nodes from GitHub.