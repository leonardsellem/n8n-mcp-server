# Transactional Updates Example

This example demonstrates the new transactional update capabilities in v2.7.0.

## Before (v2.6.x and earlier)

Previously, you had to carefully order operations to ensure nodes existed before connecting them:

```json
{
  "id": "workflow-123",
  "operations": [
    // 1. First add all nodes
    { "type": "addNode", "node": { "name": "Process", "type": "n8n-nodes-base.set", ... }},
    { "type": "addNode", "node": { "name": "Notify", "type": "n8n-nodes-base.slack", ... }},
    
    // 2. Then add connections (would fail if done before nodes)
    { "type": "addConnection", "source": "Webhook", "target": "Process" },
    { "type": "addConnection", "source": "Process", "target": "Notify" }
  ]
}
```

## After (v2.7.0+)

Now you can write operations in any order - the engine automatically handles dependencies:

```json
{
  "id": "workflow-123",
  "operations": [
    // Connections can come first!
    { "type": "addConnection", "source": "Webhook", "target": "Process" },
    { "type": "addConnection", "source": "Process", "target": "Notify" },
    
    // Nodes added later - still works!
    { "type": "addNode", "node": { "name": "Process", "type": "n8n-nodes-base.set", "position": [400, 300] }},
    { "type": "addNode", "node": { "name": "Notify", "type": "n8n-nodes-base.slack", "position": [600, 300] }}
  ]
}
```

## How It Works

1. **Two-Pass Processing**:
   - Pass 1: All node operations (add, remove, update, move, enable, disable)
   - Pass 2: All other operations (connections, settings, metadata)

2. **Operation Limit**: Maximum 5 operations per request keeps complexity manageable

3. **Atomic Updates**: All operations succeed or all fail - no partial updates

## Benefits for AI Agents

- **Intuitive**: Write operations in the order that makes sense logically
- **Reliable**: No need to track dependencies manually
- **Simple**: Focus on what to change, not how to order changes
- **Safe**: Built-in limits prevent overly complex operations

## Complete Example

Here's a real-world example of adding error handling to a workflow:

```json
{
  "id": "workflow-123",
  "operations": [
    // Define the flow first (makes logical sense)
    { 
      "type": "removeConnection", 
      "source": "HTTP Request", 
      "target": "Save to DB" 
    },
    { 
      "type": "addConnection", 
      "source": "HTTP Request", 
      "target": "Error Handler" 
    },
    { 
      "type": "addConnection", 
      "source": "Error Handler", 
      "target": "Send Alert" 
    },
    
    // Then add the nodes
    { 
      "type": "addNode", 
      "node": {
        "name": "Error Handler",
        "type": "n8n-nodes-base.if",
        "position": [500, 400],
        "parameters": {
          "conditions": {
            "boolean": [{
              "value1": "={{$json.error}}",
              "value2": true
            }]
          }
        }
      }
    },
    { 
      "type": "addNode", 
      "node": {
        "name": "Send Alert",
        "type": "n8n-nodes-base.emailSend",
        "position": [700, 400],
        "parameters": {
          "to": "alerts@company.com",
          "subject": "Workflow Error Alert"
        }
      }
    }
  ]
}
```

All operations will be processed correctly, even though connections reference nodes that don't exist yet!