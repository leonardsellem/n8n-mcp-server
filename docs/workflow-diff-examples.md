# Workflow Diff Examples

This guide demonstrates how to use the `n8n_update_partial_workflow` tool for efficient workflow editing.

## Overview

The `n8n_update_partial_workflow` tool allows you to make targeted changes to workflows without sending the entire workflow JSON. This results in:
- 80-90% reduction in token usage
- More precise edits
- Clearer intent
- Reduced risk of accidentally modifying unrelated parts

## Basic Usage

```json
{
  "id": "workflow-id-here",
  "operations": [
    {
      "type": "operation-type",
      "...operation-specific-fields..."
    }
  ]
}
```

## Operation Types

### 1. Node Operations

#### Add Node
```json
{
  "type": "addNode",
  "description": "Add HTTP Request node to fetch data",
  "node": {
    "name": "Fetch User Data",
    "type": "n8n-nodes-base.httpRequest",
    "position": [600, 300],
    "parameters": {
      "url": "https://api.example.com/users",
      "method": "GET",
      "authentication": "none"
    }
  }
}
```

#### Remove Node
```json
{
  "type": "removeNode",
  "nodeName": "Old Node Name",
  "description": "Remove deprecated node"
}
```

#### Update Node
```json
{
  "type": "updateNode",
  "nodeName": "HTTP Request",
  "changes": {
    "parameters.url": "https://new-api.example.com/v2/users",
    "parameters.headers.parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{$credentials.apiKey}}"
      }
    ]
  },
  "description": "Update API endpoint to v2"
}
```

#### Move Node
```json
{
  "type": "moveNode",
  "nodeName": "Set Variable",
  "position": [800, 400],
  "description": "Reposition for better layout"
}
```

#### Enable/Disable Node
```json
{
  "type": "disableNode",
  "nodeName": "Debug Node",
  "description": "Disable debug output for production"
}
```

### 2. Connection Operations

#### Add Connection
```json
{
  "type": "addConnection",
  "source": "Webhook",
  "target": "Process Data",
  "sourceOutput": "main",
  "targetInput": "main",
  "description": "Connect webhook to processor"
}
```

#### Remove Connection
```json
{
  "type": "removeConnection",
  "source": "Old Source",
  "target": "Old Target",
  "description": "Remove unused connection"
}
```

#### Update Connection (Change routing)
```json
{
  "type": "updateConnection",
  "source": "IF",
  "target": "Send Email",
  "changes": {
    "sourceOutput": "false",  // Change from 'true' to 'false' output
    "targetInput": "main"
  },
  "description": "Route failed conditions to email"
}
```

### 3. Workflow Metadata Operations

#### Update Workflow Name
```json
{
  "type": "updateName",
  "name": "Production User Sync v2",
  "description": "Update workflow name for versioning"
}
```

#### Update Settings
```json
{
  "type": "updateSettings",
  "settings": {
    "executionTimeout": 300,
    "saveDataErrorExecution": "all",
    "timezone": "America/New_York"
  },
  "description": "Configure production settings"
}
```

#### Manage Tags
```json
{
  "type": "addTag",
  "tag": "production",
  "description": "Mark as production workflow"
}
```

## Complete Examples

### Example 1: Add Slack Notification to Workflow
```json
{
  "id": "workflow-123",
  "operations": [
    {
      "type": "addNode",
      "node": {
        "name": "Send Slack Alert",
        "type": "n8n-nodes-base.slack",
        "position": [1000, 300],
        "parameters": {
          "resource": "message",
          "operation": "post",
          "channel": "#alerts",
          "text": "Workflow completed successfully!"
        }
      }
    },
    {
      "type": "addConnection",
      "source": "Process Data",
      "target": "Send Slack Alert"
    }
  ]
}
```

### Example 2: Update Multiple Webhook Paths
```json
{
  "id": "workflow-456",
  "operations": [
    {
      "type": "updateNode",
      "nodeName": "Webhook 1",
      "changes": {
        "parameters.path": "v2/webhook1"
      }
    },
    {
      "type": "updateNode",
      "nodeName": "Webhook 2",
      "changes": {
        "parameters.path": "v2/webhook2"
      }
    },
    {
      "type": "updateName",
      "name": "API v2 Webhooks"
    }
  ]
}
```

### Example 3: Refactor Workflow Structure
```json
{
  "id": "workflow-789",
  "operations": [
    {
      "type": "removeNode",
      "nodeName": "Legacy Processor"
    },
    {
      "type": "addNode",
      "node": {
        "name": "Modern Processor",
        "type": "n8n-nodes-base.code",
        "position": [600, 300],
        "parameters": {
          "mode": "runOnceForEachItem",
          "jsCode": "// Process items\nreturn item;"
        }
      }
    },
    {
      "type": "addConnection",
      "source": "HTTP Request",
      "target": "Modern Processor"
    },
    {
      "type": "addConnection",
      "source": "Modern Processor",
      "target": "Save to Database"
    }
  ]
}
```

### Example 4: Add Error Handling
```json
{
  "id": "workflow-999",
  "operations": [
    {
      "type": "addNode",
      "node": {
        "name": "Error Handler",
        "type": "n8n-nodes-base.errorTrigger",
        "position": [200, 500]
      }
    },
    {
      "type": "addNode",
      "node": {
        "name": "Send Error Email",
        "type": "n8n-nodes-base.emailSend",
        "position": [400, 500],
        "parameters": {
          "toEmail": "admin@example.com",
          "subject": "Workflow Error: {{$node['Error Handler'].json.error.message}}",
          "text": "Error details: {{$json}}"
        }
      }
    },
    {
      "type": "addConnection",
      "source": "Error Handler",
      "target": "Send Error Email"
    },
    {
      "type": "updateSettings",
      "settings": {
        "errorWorkflow": "workflow-999"
      }
    }
  ]
}
```

## Best Practices

1. **Use Descriptive Names**: Always provide clear node names and descriptions for operations
2. **Batch Related Changes**: Group related operations in a single request
3. **Validate First**: Use `validateOnly: true` to test your operations before applying
4. **Reference by Name**: Prefer node names over IDs for better readability
5. **Small, Focused Changes**: Make targeted edits rather than large structural changes

## Common Patterns

### Add Processing Step
```json
{
  "operations": [
    {
      "type": "removeConnection",
      "source": "Source Node",
      "target": "Target Node"
    },
    {
      "type": "addNode",
      "node": {
        "name": "Process Step",
        "type": "n8n-nodes-base.set",
        "position": [600, 300],
        "parameters": { /* ... */ }
      }
    },
    {
      "type": "addConnection",
      "source": "Source Node",
      "target": "Process Step"
    },
    {
      "type": "addConnection",
      "source": "Process Step",
      "target": "Target Node"
    }
  ]
}
```

### Replace Node
```json
{
  "operations": [
    {
      "type": "addNode",
      "node": {
        "name": "New Implementation",
        "type": "n8n-nodes-base.httpRequest",
        "position": [600, 300],
        "parameters": { /* ... */ }
      }
    },
    {
      "type": "removeConnection",
      "source": "Previous Node",
      "target": "Old Implementation"
    },
    {
      "type": "removeConnection",
      "source": "Old Implementation",
      "target": "Next Node"
    },
    {
      "type": "addConnection",
      "source": "Previous Node",
      "target": "New Implementation"
    },
    {
      "type": "addConnection",
      "source": "New Implementation",
      "target": "Next Node"
    },
    {
      "type": "removeNode",
      "nodeName": "Old Implementation"
    }
  ]
}
```

## Error Handling

The tool validates all operations before applying any changes. Common errors include:

- **Duplicate node names**: Each node must have a unique name
- **Invalid node types**: Use full package prefixes (e.g., `n8n-nodes-base.webhook`)
- **Missing connections**: Referenced nodes must exist
- **Circular dependencies**: Connections cannot create loops

Always check the response for validation errors and adjust your operations accordingly.

## Transactional Updates (v2.7.0+)

The diff engine now supports transactional updates using a **two-pass processing** approach:

### How It Works

1. **Operation Limit**: Maximum 5 operations per request to ensure reliability
2. **Two-Pass Processing**:
   - **Pass 1**: All node operations (add, remove, update, move, enable, disable)
   - **Pass 2**: All other operations (connections, settings, metadata)

This allows you to add nodes and connect them in the same request:

```json
{
  "id": "workflow-id",
  "operations": [
    // These will be processed in Pass 2 (but work because nodes are added first)
    {
      "type": "addConnection",
      "source": "Webhook",
      "target": "Process Data"
    },
    {
      "type": "addConnection", 
      "source": "Process Data",
      "target": "Send Email"
    },
    // These will be processed in Pass 1
    {
      "type": "addNode",
      "node": {
        "name": "Process Data",
        "type": "n8n-nodes-base.set",
        "position": [400, 300],
        "parameters": {}
      }
    },
    {
      "type": "addNode",
      "node": {
        "name": "Send Email",
        "type": "n8n-nodes-base.emailSend",
        "position": [600, 300],
        "parameters": {
          "to": "user@example.com"
        }
      }
    }
  ]
}
```

### Benefits

- **Order Independence**: You don't need to worry about operation order
- **Atomic Updates**: All operations succeed or all fail
- **Intuitive Usage**: Add complex workflow structures in one call
- **Clear Limits**: 5 operations max keeps things simple and reliable

### Example: Complete Workflow Addition

```json
{
  "id": "workflow-id",
  "operations": [
    // Add three nodes
    {
      "type": "addNode",
      "node": {
        "name": "Schedule",
        "type": "n8n-nodes-base.schedule",
        "position": [200, 300],
        "parameters": {
          "rule": {
            "interval": [{ "field": "hours", "intervalValue": 1 }]
          }
        }
      }
    },
    {
      "type": "addNode", 
      "node": {
        "name": "Get Data",
        "type": "n8n-nodes-base.httpRequest",
        "position": [400, 300],
        "parameters": {
          "url": "https://api.example.com/data"
        }
      }
    },
    {
      "type": "addNode",
      "node": {
        "name": "Save to Database",
        "type": "n8n-nodes-base.postgres",
        "position": [600, 300],
        "parameters": {
          "operation": "insert"
        }
      }
    },
    // Connect them all
    {
      "type": "addConnection",
      "source": "Schedule",
      "target": "Get Data"
    },
    {
      "type": "addConnection",
      "source": "Get Data", 
      "target": "Save to Database"
    }
  ]
}
```

All 5 operations will be processed correctly regardless of order!