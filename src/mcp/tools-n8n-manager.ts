import { ToolDefinition } from '../types';

/**
 * n8n Management Tools
 * 
 * These tools enable AI agents to manage n8n workflows through the n8n API.
 * They require N8N_API_URL and N8N_API_KEY to be configured.
 */
export const n8nManagementTools: ToolDefinition[] = [
  // Workflow Management Tools
  {
    name: 'n8n_create_workflow',
    description: `Create a new workflow in n8n. Requires workflow name, nodes array, and connections object. The workflow will be created in inactive state and must be manually activated in the UI. Returns the created workflow with its ID.`,
    inputSchema: {
      type: 'object',
      properties: {
        name: { 
          type: 'string', 
          description: 'Workflow name (required)' 
        },
        nodes: { 
          type: 'array', 
          description: 'Array of workflow nodes. Each node must have: id, name, type, typeVersion, position, and parameters',
          items: {
            type: 'object',
            required: ['id', 'name', 'type', 'typeVersion', 'position', 'parameters'],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              typeVersion: { type: 'number' },
              position: { 
                type: 'array',
                items: { type: 'number' },
                minItems: 2,
                maxItems: 2
              },
              parameters: { type: 'object' },
              credentials: { type: 'object' },
              disabled: { type: 'boolean' },
              notes: { type: 'string' },
              continueOnFail: { type: 'boolean' },
              retryOnFail: { type: 'boolean' },
              maxTries: { type: 'number' },
              waitBetweenTries: { type: 'number' }
            }
          }
        },
        connections: { 
          type: 'object', 
          description: 'Workflow connections object. Keys are source node IDs, values define output connections' 
        },
        settings: {
          type: 'object',
          description: 'Optional workflow settings (execution order, timezone, error handling)',
          properties: {
            executionOrder: { type: 'string', enum: ['v0', 'v1'] },
            timezone: { type: 'string' },
            saveDataErrorExecution: { type: 'string', enum: ['all', 'none'] },
            saveDataSuccessExecution: { type: 'string', enum: ['all', 'none'] },
            saveManualExecutions: { type: 'boolean' },
            saveExecutionProgress: { type: 'boolean' },
            executionTimeout: { type: 'number' },
            errorWorkflow: { type: 'string' }
          }
        }
      },
      required: ['name', 'nodes', 'connections']
    }
  },
  {
    name: 'n8n_get_workflow',
    description: `Get a workflow by ID. Returns the complete workflow including nodes, connections, and settings.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_get_workflow_details',
    description: `Get detailed workflow information including metadata, version, and execution statistics. More comprehensive than get_workflow.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_get_workflow_structure',
    description: `Get simplified workflow structure showing only nodes and their connections. Useful for understanding workflow flow without parameter details.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_get_workflow_minimal',
    description: `Get minimal workflow information (ID, name, active status, tags). Fast and lightweight for listing purposes.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_update_full_workflow',
    description: `Update an existing workflow with complete replacement. Requires the full nodes array and connections object when modifying workflow structure. Use n8n_update_partial_workflow for incremental changes. Cannot activate workflows via API - use UI instead.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID to update' 
        },
        name: { 
          type: 'string', 
          description: 'New workflow name' 
        },
        nodes: { 
          type: 'array', 
          description: 'Complete array of workflow nodes (required if modifying workflow structure)' 
        },
        connections: { 
          type: 'object', 
          description: 'Complete connections object (required if modifying workflow structure)' 
        },
        settings: { 
          type: 'object', 
          description: 'Workflow settings to update' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_update_partial_workflow',
    description: `Update a workflow using diff operations for precise, incremental changes. More efficient than n8n_update_full_workflow for small modifications. Supports adding/removing/updating nodes and connections without sending the entire workflow.

PARAMETERS:
• id (required) - Workflow ID to update
• operations (required) - Array of operations to apply (max 5)
• validateOnly (optional) - Test operations without applying (default: false)

TRANSACTIONAL UPDATES (v2.7.0+):
• Maximum 5 operations per request for reliability
• Two-pass processing: nodes first, then connections/metadata
• Add nodes and connect them in the same request
• Operations can be in any order - engine handles dependencies

IMPORTANT NOTES:
• Operations are atomic - all succeed or all fail
• Use validateOnly: true to test before applying
• Node references use NAME, not ID (except in node definition)
• updateNode with nested paths: use dot notation like "parameters.values[0]"
• All nodes require: id, name, type, typeVersion, position, parameters

OPERATION TYPES:

addNode - Add a new node
  Required: node object with id, name, type, typeVersion, position, parameters
  Example: {
    type: "addNode",
    node: {
      id: "unique_id",
      name: "HTTP Request",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [400, 300],
      parameters: { url: "https://api.example.com", method: "GET" }
    }
  }

removeNode - Remove node by name
  Required: nodeName or nodeId
  Example: {type: "removeNode", nodeName: "Old Node"}

updateNode - Update node properties
  Required: nodeName, changes
  Example: {type: "updateNode", nodeName: "Webhook", changes: {"parameters.path": "/new-path"}}

moveNode - Change node position
  Required: nodeName, position
  Example: {type: "moveNode", nodeName: "Set", position: [600, 400]}

enableNode/disableNode - Toggle node status
  Required: nodeName
  Example: {type: "disableNode", nodeName: "Debug"}

addConnection - Connect nodes
  Required: source, target
  Optional: sourceOutput (default: "main"), targetInput (default: "main"), 
           sourceIndex (default: 0), targetIndex (default: 0)
  Example: {
    type: "addConnection",
    source: "Webhook",
    target: "Set",
    sourceOutput: "main",  // for nodes with multiple outputs
    targetInput: "main"    // for nodes with multiple inputs
  }

removeConnection - Disconnect nodes
  Required: source, target
  Optional: sourceOutput, targetInput
  Example: {type: "removeConnection", source: "Set", target: "HTTP Request"}

updateSettings - Change workflow settings
  Required: settings object
  Example: {type: "updateSettings", settings: {executionOrder: "v1", timezone: "Europe/Berlin"}}

updateName - Rename workflow
  Required: name
  Example: {type: "updateName", name: "New Workflow Name"}

addTag/removeTag - Manage tags
  Required: tag
  Example: {type: "addTag", tag: "production"}

EXAMPLES:

Simple update:
operations: [
  {type: "updateName", name: "My Updated Workflow"},
  {type: "disableNode", nodeName: "Debug Node"}
]

Complex example - Add nodes and connect (any order works):
operations: [
  {type: "addConnection", source: "Webhook", target: "Format Date"},
  {type: "addNode", node: {id: "abc123", name: "Format Date", type: "n8n-nodes-base.dateTime", typeVersion: 2, position: [400, 300], parameters: {}}},
  {type: "addConnection", source: "Format Date", target: "Logger"},
  {type: "addNode", node: {id: "def456", name: "Logger", type: "n8n-nodes-base.n8n", typeVersion: 1, position: [600, 300], parameters: {}}}
]

Validation example:
{
  id: "workflow-id",
  operations: [{type: "addNode", node: {...}}],
  validateOnly: true  // Test without applying
}`,
    inputSchema: {
      type: 'object',
      additionalProperties: true,  // Allow any extra properties Claude Desktop might add
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID to update' 
        },
        operations: {
          type: 'array',
          description: 'Array of diff operations to apply. Each operation must have a "type" field and relevant properties for that operation type.',
          items: {
            type: 'object',
            additionalProperties: true
          }
        },
        validateOnly: {
          type: 'boolean',
          description: 'If true, only validate operations without applying them'
        }
      },
      required: ['id', 'operations']
    }
  },
  {
    name: 'n8n_delete_workflow',
    description: `Permanently delete a workflow. This action cannot be undone.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID to delete' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_list_workflows',
    description: `List workflows with optional filters. Supports pagination via cursor.`,
    inputSchema: {
      type: 'object',
      properties: {
        limit: { 
          type: 'number', 
          description: 'Number of workflows to return (1-100, default: 100)' 
        },
        cursor: { 
          type: 'string', 
          description: 'Pagination cursor from previous response' 
        },
        active: { 
          type: 'boolean', 
          description: 'Filter by active status' 
        },
        tags: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Filter by tags (exact match)' 
        },
        projectId: { 
          type: 'string', 
          description: 'Filter by project ID (enterprise feature)' 
        },
        excludePinnedData: { 
          type: 'boolean', 
          description: 'Exclude pinned data from response (default: true)' 
        }
      }
    }
  },
  {
    name: 'n8n_validate_workflow',
    description: `Validate a workflow from n8n instance by ID. Fetches the workflow and runs comprehensive validation including node configurations, connections, and expressions. Returns detailed validation report with errors, warnings, and suggestions.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Workflow ID to validate' 
        },
        options: {
          type: 'object',
          description: 'Validation options',
          properties: {
            validateNodes: { 
              type: 'boolean', 
              description: 'Validate node configurations (default: true)' 
            },
            validateConnections: { 
              type: 'boolean', 
              description: 'Validate workflow connections (default: true)' 
            },
            validateExpressions: { 
              type: 'boolean', 
              description: 'Validate n8n expressions (default: true)' 
            },
            profile: { 
              type: 'string', 
              enum: ['minimal', 'runtime', 'ai-friendly', 'strict'],
              description: 'Validation profile to use (default: runtime)' 
            }
          }
        }
      },
      required: ['id']
    }
  },

  // Execution Management Tools
  {
    name: 'n8n_trigger_webhook_workflow',
    description: `Trigger a workflow via webhook. Workflow must be ACTIVE and have a Webhook trigger node. HTTP method must match webhook configuration.`,
    inputSchema: {
      type: 'object',
      properties: {
        webhookUrl: { 
          type: 'string', 
          description: 'Full webhook URL from n8n workflow (e.g., https://n8n.example.com/webhook/abc-def-ghi)' 
        },
        httpMethod: { 
          type: 'string', 
          enum: ['GET', 'POST', 'PUT', 'DELETE'],
          description: 'HTTP method (must match webhook configuration, often GET)' 
        },
        data: { 
          type: 'object', 
          description: 'Data to send with the webhook request' 
        },
        headers: { 
          type: 'object', 
          description: 'Additional HTTP headers' 
        },
        waitForResponse: { 
          type: 'boolean', 
          description: 'Wait for workflow completion (default: true)' 
        }
      },
      required: ['webhookUrl']
    }
  },
  {
    name: 'n8n_get_execution',
    description: `Get details of a specific execution by ID.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Execution ID' 
        },
        includeData: { 
          type: 'boolean', 
          description: 'Include full execution data (default: false)' 
        }
      },
      required: ['id']
    }
  },
  {
    name: 'n8n_list_executions',
    description: `List workflow executions with optional filters. Supports pagination.`,
    inputSchema: {
      type: 'object',
      properties: {
        limit: { 
          type: 'number', 
          description: 'Number of executions to return (1-100, default: 100)' 
        },
        cursor: { 
          type: 'string', 
          description: 'Pagination cursor from previous response' 
        },
        workflowId: { 
          type: 'string', 
          description: 'Filter by workflow ID' 
        },
        projectId: { 
          type: 'string', 
          description: 'Filter by project ID (enterprise feature)' 
        },
        status: { 
          type: 'string', 
          enum: ['success', 'error', 'waiting'],
          description: 'Filter by execution status' 
        },
        includeData: { 
          type: 'boolean', 
          description: 'Include execution data (default: false)' 
        }
      }
    }
  },
  {
    name: 'n8n_delete_execution',
    description: `Delete an execution record. This only removes the execution history, not any data processed.`,
    inputSchema: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Execution ID to delete' 
        }
      },
      required: ['id']
    }
  },

  // System Tools
  {
    name: 'n8n_health_check',
    description: `Check n8n instance health and API connectivity. Returns status and available features.`,
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'n8n_list_available_tools',
    description: `List all available n8n management tools and their capabilities. Useful for understanding what operations are possible.`,
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'n8n_diagnostic',
    description: `Diagnose n8n API configuration and management tools availability. Shows current configuration status, which tools are enabled/disabled, and helps troubleshoot why management tools might not be appearing. Returns detailed diagnostic information including environment variables, API connectivity, and tool registration status.`,
    inputSchema: {
      type: 'object',
      properties: {
        verbose: {
          type: 'boolean',
          description: 'Include detailed debug information (default: false)'
        }
      }
    }
  }
];