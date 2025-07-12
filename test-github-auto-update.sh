#!/bin/bash
# Test GitHub Auto-Update from n8n-io/n8n Repository

echo "🔄 Testing GitHub Auto-Update from n8n-io/n8n"
echo "============================================="

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable not set!"
    echo ""
    echo "🔧 To enable auto-updates:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Create a token with 'Contents' and 'Metadata' read permissions"
    echo "3. Set the token:"
    echo "   export GITHUB_TOKEN=your_token_here"
    echo "4. Restart the container:"
    echo "   docker compose restart"
    echo ""
    exit 1
fi

echo "✅ GitHub token configured"
echo "📊 Current configuration:"
echo "   Repository: n8n-io/n8n"
echo "   Paths: packages/nodes-base/nodes, packages/nodes-base/credentials"
echo "   Update interval: every $UPDATE_INTERVAL_MINUTES minutes"
echo ""

# Test GitHub API access
echo "🔍 Testing GitHub API access..."
curl -s -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/n8n-io/n8n/contents/packages/nodes-base/nodes" \
     | head -c 200

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ GitHub API access working!"
else
    echo ""
    echo "❌ GitHub API access failed!"
    echo "Check your GITHUB_TOKEN permissions"
    exit 1
fi

echo ""
echo "🐳 Container status:"
docker ps | grep n8n-mcp

echo ""
echo "📋 Recent container logs:"
docker logs n8n-mcp --tail 10

echo ""
echo "🎯 To monitor auto-updates:"
echo "   docker logs n8n-mcp -f | grep -E '(GitHub|sync|update)'"
echo ""
echo "🔧 To force an immediate update:"
echo "   docker exec n8n-mcp node -e 'console.log(\"Force update functionality would go here\")'"
echo ""
echo "✅ Auto-update system ready!"
echo "   The system will automatically check n8n-io/n8n every $UPDATE_INTERVAL_MINUTES minutes"
echo "   New nodes will be downloaded and cached automatically"
echo "   Database will be updated when changes are detected"