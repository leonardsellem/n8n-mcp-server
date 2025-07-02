# n8n Update Process - Quick Reference

## Quick Steps to Update n8n

When there's a new n8n version available, follow these steps:

```bash
# 1. Update n8n dependencies automatically
npm run update:n8n

# 2. Validate the update
npm run validate

# 3. Commit and push
git add -A
git commit -m "chore: update n8n to vX.X.X

- Updated n8n from X.X.X to X.X.X
- Updated n8n-core from X.X.X to X.X.X
- Updated n8n-workflow from X.X.X to X.X.X
- Updated @n8n/n8n-nodes-langchain from X.X.X to X.X.X
- Rebuilt node database with XXX nodes
- All validation tests passing

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

## What the Commands Do

### `npm run update:n8n`
This single command:
1. Checks for the latest n8n version
2. Updates n8n and all its required dependencies (n8n-core, n8n-workflow, @n8n/n8n-nodes-langchain)
3. Runs `npm install` to update package-lock.json
4. Automatically rebuilds the node database
5. Shows you exactly what versions were updated

### `npm run validate`
- Validates critical nodes (httpRequest, code, slack, agent)
- Shows database statistics
- Confirms everything is working correctly

## Important Notes

1. **Always run on main branch** - Make sure you're on main and it's clean
2. **The update script is smart** - It automatically syncs all n8n dependencies to compatible versions
3. **Database rebuild is automatic** - The update script handles this for you
4. **Docker image builds automatically** - Pushing to GitHub triggers the workflow

## Time Estimate
- Total time: ~3-5 minutes
- Most time is spent on `npm install` and database rebuild
- The actual commands take seconds to run

## Troubleshooting

If validation fails:
1. Check the error message - usually it's a node type reference issue
2. The update script handles most compatibility issues automatically
3. If needed, check the GitHub Actions logs for the dependency update workflow

## Alternative: Check First
To see what would be updated without making changes:
```bash
npm run update:n8n:check
```

This shows you the available updates without modifying anything.