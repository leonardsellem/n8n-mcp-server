# n8n Templates Integration

This module provides integration with n8n.io's workflow templates, allowing AI agents to discover and use proven workflow patterns.

## Features

- **API Integration**: Connects to n8n.io's official template API
- **Fresh Templates**: Only includes templates updated within the last 6 months
- **Manual Fetch**: Templates are fetched separately from the main node database
- **Full Workflow JSON**: Complete workflow definitions ready for import
- **Smart Search**: Find templates by nodes, keywords, or task categories

## Usage

### Fetching Templates

```bash
npm run fetch:templates
```

This command will:
1. Connect to n8n.io API
2. Fetch all templates from the last 6 months
3. Download complete workflow JSON for each template
4. Store in local SQLite database
5. Display progress and statistics

### Testing

```bash
npm run test:templates
```

### MCP Tools

The following tools are available via MCP:

- `list_node_templates(nodeTypes, limit)` - Find templates using specific nodes
- `get_template(templateId)` - Get complete workflow JSON
- `search_templates(query, limit)` - Search by keywords
- `get_templates_for_task(task)` - Get templates for common tasks

### Task Categories

- `ai_automation` - AI-powered workflows
- `data_sync` - Database and spreadsheet synchronization
- `webhook_processing` - Webhook handling workflows
- `email_automation` - Email processing workflows
- `slack_integration` - Slack bots and notifications
- `data_transformation` - Data manipulation workflows
- `file_processing` - File handling workflows
- `scheduling` - Scheduled and recurring tasks
- `api_integration` - External API connections
- `database_operations` - Database CRUD operations

## Implementation Details

### Architecture

- `template-fetcher.ts` - Handles API communication and rate limiting
- `template-repository.ts` - Database operations and queries
- `template-service.ts` - Business logic and MCP integration

### Database Schema

Templates are stored in a dedicated table with:
- Workflow metadata (name, description, author)
- Node usage tracking
- View counts for popularity
- Complete workflow JSON
- Creation/update timestamps
- 6-month freshness constraint

### API Endpoints Used

- `/api/templates/workflows` - List all workflows
- `/api/templates/search` - Search with pagination
- `/api/templates/workflows/{id}` - Get specific workflow
- `/api/templates/search/filters` - Available filters

## Notes

- Templates are NOT fetched during regular database rebuilds
- Run `fetch:templates` manually when you need fresh templates
- API rate limiting is implemented (200-500ms between requests)
- Progress is shown during fetching for large datasets