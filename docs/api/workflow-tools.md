# Workflow Tools

This page documents the tools available for managing n8n workflows.

## Overview

Workflow tools allow AI assistants to manage n8n workflows, including creating, retrieving, updating, deleting, activating, and deactivating workflows. These tools provide a natural language interface to n8n's workflow management capabilities.

## Available Tools

### workflow_list

Lists all workflows with optional filtering.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "active": {
      "type": "boolean",
      "description": "Filter workflows by active status"
    }
  },
  "required": []
}
```

**Example Usage:**

```javascript
// List all workflows
const result = await useWorkflowList({});

// List only active workflows
const activeWorkflows = await useWorkflowList({ active: true });

// List only inactive workflows
const inactiveWorkflows = await useWorkflowList({ active: false });
```

**Response:**

```javascript
[
  {
    "id": "1234abc",
    "name": "Test Workflow 1",
    "active": true,
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-02T14:30:00.000Z"
  },
  {
    "id": "5678def",
    "name": "Test Workflow 2",
    "active": false,
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-12T10:15:00.000Z"
  }
]
```

### workflow_get

Retrieves a specific workflow by ID.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "The ID of the workflow to retrieve"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const workflow = await useWorkflowGet({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": true,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-02T14:30:00.000Z",
  "nodes": [
    // Detailed node configuration
  ],
  "connections": {
    // Connection configuration
  },
  "settings": {
    // Workflow settings
  }
}
```

### workflow_create

Creates a new workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the workflow"
    },
    "nodes": {
      "type": "array",
      "description": "Array of node configurations"
    },
    "connections": {
      "type": "object",
      "description": "Connection configuration"
    },
    "active": {
      "type": "boolean",
      "description": "Whether the workflow should be active"
    },
    "settings": {
      "type": "object",
      "description": "Workflow settings"
    }
  },
  "required": ["name"]
}
```

Nodes, connections, and tags may also be provided as JSON strings. They will be
parsed automatically by the tool before validation.

**Example Usage:**

```javascript
const newWorkflow = await useWorkflowCreate({
  name: "New Workflow",
  active: true,
  nodes: [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [100, 200],
      "parameters": {}
    }
  ],
  connections: {}
});
```

**Response:**

```javascript
{
  "id": "new123",
  "name": "New Workflow",
  "active": true,
  "createdAt": "2025-03-12T15:30:00.000Z",
  "updatedAt": "2025-03-12T15:30:00.000Z",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [100, 200],
      "parameters": {}
    }
  ],
  "connections": {}
}
```

### workflow_update

Updates an existing workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to update"
    },
    "name": {
      "type": "string",
      "description": "New name for the workflow"
    },
    "nodes": {
      "type": "array",
      "description": "Updated array of node configurations"
    },
    "connections": {
      "type": "object",
      "description": "Updated connection configuration"
    },
    "active": {
      "type": "boolean",
      "description": "Whether the workflow should be active"
    },
    "settings": {
      "type": "object",
      "description": "Updated workflow settings"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const updatedWorkflow = await useWorkflowUpdate({
  id: "1234abc",
  name: "Updated Workflow Name",
  active: false
});
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Updated Workflow Name",
  "active": false,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T15:45:00.000Z",
  "nodes": [
    // Existing node configuration
  ],
  "connections": {
    // Existing connection configuration
  }
}
```

### workflow_delete

Deletes a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to delete"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
await useWorkflowDelete({ id: "1234abc" });
```

**Response:**

```javascript
{
  "success": true
}
```

### workflow_activate

Activates a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to activate"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const activatedWorkflow = await useWorkflowActivate({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": true,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T16:00:00.000Z"
}
```

### workflow_deactivate

Deactivates a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to deactivate"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const deactivatedWorkflow = await useWorkflowDeactivate({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": false,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T16:15:00.000Z"
}
```

## Error Handling

All workflow tools can return the following errors:

| Error | Description |
|-------|-------------|
| Authentication Error | The provided API key is invalid or missing |
| Not Found Error | The requested workflow does not exist |
| Validation Error | The input parameters are invalid or incomplete |
| Permission Error | The API key does not have permission to perform the operation |
| Server Error | An unexpected error occurred on the n8n server |

## Best Practices

- Use `workflow_list` to discover available workflows before performing operations
- Validate workflow IDs before attempting to update or delete workflows
- Check workflow status (active/inactive) before attempting activation/deactivation
- Include only the necessary fields when updating workflows to avoid unintended changes
