# Dynamic Resources

This page documents the dynamic resources available in the n8n MCP Server.

## Overview

Dynamic resources are parameterized URIs that allow access to specific n8n data based on identifiers such as workflow IDs or execution IDs. These resources follow the URI template format defined in RFC 6570, with parameters enclosed in curly braces.

## Available Resource Templates

### n8n://workflow/{id}

Provides detailed information about a specific workflow.

**URI Template:** `n8n://workflow/{id}`

**Parameters:**
- `id` (required): The ID of the workflow to retrieve

**Description:** Returns comprehensive information about a specific workflow, including its nodes, connections, and settings.

**Example Usage:**

```javascript
const resource = await accessMcpResource('n8n-mcp-server', 'n8n://workflow/1234abc');
```

**Response:**

```javascript
{
  "workflow": {
    "id": "1234abc",
    "name": "Email Processing Workflow",
    "active": true,
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-02T14:30:00.000Z",
    "nodes": [
      {
        "id": "node1",
        "name": "Start",
        "type": "n8n-nodes-base.manualTrigger",
        "position": [100, 200],
        "parameters": {}
      },
      {
        "id": "node2",
        "name": "Email Trigger",
        "type": "n8n-nodes-base.emailTrigger",
        "position": [300, 200],
        "parameters": {
          "inbox": "support",
          "domain": "example.com"
        }
      }
    ],
    "connections": {
      "node1": {
        "main": [
          [
            {
              "node": "node2",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    },
    "settings": {
      "saveExecutionProgress": true,
      "saveManualExecutions": true,
      "timezone": "America/New_York"
    }
  }
}
```

### n8n://executions/{workflowId}

Provides a list of executions for a specific workflow.

**URI Template:** `n8n://executions/{workflowId}`

**Parameters:**
- `workflowId` (required): The ID of the workflow whose executions to retrieve

**Description:** Returns a list of execution records for the specified workflow, sorted by most recent first.

**Example Usage:**

```javascript
const resource = await accessMcpResource('n8n-mcp-server', 'n8n://executions/1234abc');
```

**Response:**

```javascript
{
  "executions": [
    {
      "id": "exec789",
      "workflowId": "1234abc",
      "status": "success",
      "startedAt": "2025-03-12T16:30:00.000Z",
      "finishedAt": "2025-03-12T16:30:05.000Z",
      "mode": "manual"
    },
    {
      "id": "exec456",
      "workflowId": "1234abc",
      "status": "error",
      "startedAt": "2025-03-11T14:20:00.000Z",
      "finishedAt": "2025-03-11T14:20:10.000Z",
      "mode": "manual"
    }
  ],
  "count": 2,
  "pagination": {
    "hasMore": false
  }
}
```

### n8n://execution/{id}

Provides detailed information about a specific execution.

**URI Template:** `n8n://execution/{id}`

**Parameters:**
- `id` (required): The ID of the execution to retrieve

**Description:** Returns comprehensive information about a specific execution, including its status, inputs, outputs, and execution path.

**Example Usage:**

```javascript
const resource = await accessMcpResource('n8n-mcp-server', 'n8n://execution/exec789');
```

**Response:**

```javascript
{
  "execution": {
    "id": "exec789",
    "workflowId": "1234abc",
    "workflowName": "Email Processing Workflow",
    "status": "success",
    "startedAt": "2025-03-12T16:30:00.000Z",
    "finishedAt": "2025-03-12T16:30:05.000Z",
    "mode": "manual",
    "data": {
      "resultData": {
        "runData": {
          "node1": [
            {
              "startTime": "2025-03-12T16:30:00.000Z",
              "endTime": "2025-03-12T16:30:01.000Z",
              "executionStatus": "success",
              "data": {
                "json": {
                  "started": true
                }
              }
            }
          ],
          "node2": [
            {
              "startTime": "2025-03-12T16:30:01.000Z",
              "endTime": "2025-03-12T16:30:05.000Z",
              "executionStatus": "success",
              "data": {
                "json": {
                  "subject": "Test Email",
                  "body": "This is a test",
                  "from": "sender@example.com"
                }
              }
            }
          ]
        }
      },
      "executionData": {
        "nodeExecutionOrder": ["node1", "node2"],
        "waitingNodes": [],
        "waitingExecutionData": []
      }
    }
  }
}
```

### n8n://workflow/{id}/active

Provides information about whether a specific workflow is active.

**URI Template:** `n8n://workflow/{id}/active`

**Parameters:**
- `id` (required): The ID of the workflow to check

**Description:** Returns the active status of a specific workflow.

**Example Usage:**

```javascript
const resource = await accessMcpResource('n8n-mcp-server', 'n8n://workflow/1234abc/active');
```

**Response:**

```javascript
{
  "workflowId": "1234abc",
  "active": true
}
```

## Content Types

All dynamic resources return JSON content with the MIME type `application/json`.

## Error Handling

Dynamic resources can return the following errors:

| HTTP Status | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameter in URI |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - API key does not have permission to access this resource |
| 404 | Not Found - The requested resource does not exist |
| 500 | Internal Server Error - An unexpected error occurred on the n8n server |

## Parameter Format

When using dynamic resources, parameters must be properly formatted:

1. **Workflow IDs**: Must be valid n8n workflow IDs (typically alphanumeric)
2. **Execution IDs**: Must be valid n8n execution IDs (typically alphanumeric)

## Best Practices

- Validate resource URIs before accessing them
- Handle possible 404 errors when accessing resources by ID
- Cache resource data when appropriate to reduce API calls
- Use specific resources (like `n8n://workflow/{id}/active`) for single properties when you don't need the entire resource
- Check workflow status before performing operations that require an active workflow
