import { z } from 'zod';
import { WorkflowNode, WorkflowConnection, Workflow } from '../types/n8n-api';

// Zod schemas for n8n API validation

export const workflowNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  typeVersion: z.number(),
  position: z.tuple([z.number(), z.number()]),
  parameters: z.record(z.unknown()),
  credentials: z.record(z.string()).optional(),
  disabled: z.boolean().optional(),
  notes: z.string().optional(),
  notesInFlow: z.boolean().optional(),
  continueOnFail: z.boolean().optional(),
  retryOnFail: z.boolean().optional(),
  maxTries: z.number().optional(),
  waitBetweenTries: z.number().optional(),
  alwaysOutputData: z.boolean().optional(),
  executeOnce: z.boolean().optional(),
});

export const workflowConnectionSchema = z.record(
  z.object({
    main: z.array(
      z.array(
        z.object({
          node: z.string(),
          type: z.string(),
          index: z.number(),
        })
      )
    ),
  })
);

export const workflowSettingsSchema = z.object({
  executionOrder: z.enum(['v0', 'v1']).default('v1'),
  timezone: z.string().optional(),
  saveDataErrorExecution: z.enum(['all', 'none']).default('all'),
  saveDataSuccessExecution: z.enum(['all', 'none']).default('all'),
  saveManualExecutions: z.boolean().default(true),
  saveExecutionProgress: z.boolean().default(true),
  executionTimeout: z.number().optional(),
  errorWorkflow: z.string().optional(),
});

// Default settings for workflow creation
export const defaultWorkflowSettings = {
  executionOrder: 'v1' as const,
  saveDataErrorExecution: 'all' as const,
  saveDataSuccessExecution: 'all' as const,
  saveManualExecutions: true,
  saveExecutionProgress: true,
};

// Validation functions
export function validateWorkflowNode(node: unknown): WorkflowNode {
  return workflowNodeSchema.parse(node);
}

export function validateWorkflowConnections(connections: unknown): WorkflowConnection {
  return workflowConnectionSchema.parse(connections);
}

export function validateWorkflowSettings(settings: unknown): z.infer<typeof workflowSettingsSchema> {
  return workflowSettingsSchema.parse(settings);
}

// Clean workflow data for API operations
export function cleanWorkflowForCreate(workflow: Partial<Workflow>): Partial<Workflow> {
  const {
    // Remove read-only fields
    id,
    createdAt,
    updatedAt,
    versionId,
    meta,
    // Remove fields that cause API errors during creation
    active,
    tags,
    // Keep everything else
    ...cleanedWorkflow
  } = workflow;

  // Ensure settings are present with defaults
  if (!cleanedWorkflow.settings) {
    cleanedWorkflow.settings = defaultWorkflowSettings;
  }

  return cleanedWorkflow;
}

export function cleanWorkflowForUpdate(workflow: Workflow): Partial<Workflow> {
  const {
    // Remove read-only/computed fields
    id,
    createdAt,
    updatedAt,
    versionId,
    meta,
    staticData,
    // Remove fields that cause API errors
    pinData,
    tags,
    // Remove additional fields that n8n API doesn't accept
    isArchived,
    usedCredentials,
    sharedWithProjects,
    triggerCount,
    shared,
    active,
    // Keep everything else
    ...cleanedWorkflow
  } = workflow as any;

  // Ensure settings are present
  if (!cleanedWorkflow.settings) {
    cleanedWorkflow.settings = defaultWorkflowSettings;
  }

  return cleanedWorkflow;
}

// Validate workflow structure
export function validateWorkflowStructure(workflow: Partial<Workflow>): string[] {
  const errors: string[] = [];

  // Check required fields
  if (!workflow.name) {
    errors.push('Workflow name is required');
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  if (!workflow.connections) {
    errors.push('Workflow connections are required');
  }

  // Check for minimum viable workflow
  if (workflow.nodes && workflow.nodes.length === 1) {
    const singleNode = workflow.nodes[0];
    const isWebhookOnly = singleNode.type === 'n8n-nodes-base.webhook' || 
                         singleNode.type === 'n8n-nodes-base.webhookTrigger';
    
    if (!isWebhookOnly) {
      errors.push('Single-node workflows are only valid for webhooks. Add at least one more node and connect them. Example: Manual Trigger → Set node');
    }
  }

  // Check for empty connections in multi-node workflows
  if (workflow.nodes && workflow.nodes.length > 1 && workflow.connections) {
    const connectionCount = Object.keys(workflow.connections).length;
    
    if (connectionCount === 0) {
      errors.push('Multi-node workflow has empty connections. Connect nodes like this: connections: { "Node1 Name": { "main": [[{ "node": "Node2 Name", "type": "main", "index": 0 }]] } }');
    }
  }

  // Validate nodes
  if (workflow.nodes) {
    workflow.nodes.forEach((node, index) => {
      try {
        validateWorkflowNode(node);
        
        // Additional check for common node type mistakes
        if (node.type.startsWith('nodes-base.')) {
          errors.push(`Invalid node type "${node.type}" at index ${index}. Use "n8n-nodes-base.${node.type.substring(11)}" instead.`);
        } else if (!node.type.includes('.')) {
          errors.push(`Invalid node type "${node.type}" at index ${index}. Node types must include package prefix (e.g., "n8n-nodes-base.webhook").`);
        }
      } catch (error) {
        errors.push(`Invalid node at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  // Validate connections
  if (workflow.connections) {
    try {
      validateWorkflowConnections(workflow.connections);
    } catch (error) {
      errors.push(`Invalid connections: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate that all connection references exist and use node NAMES (not IDs)
  if (workflow.nodes && workflow.connections) {
    const nodeNames = new Set(workflow.nodes.map(node => node.name));
    const nodeIds = new Set(workflow.nodes.map(node => node.id));
    const nodeIdToName = new Map(workflow.nodes.map(node => [node.id, node.name]));
    
    Object.entries(workflow.connections).forEach(([sourceName, connection]) => {
      // Check if source exists by name (correct)
      if (!nodeNames.has(sourceName)) {
        // Check if they're using an ID instead of name
        if (nodeIds.has(sourceName)) {
          const correctName = nodeIdToName.get(sourceName);
          errors.push(`Connection uses node ID '${sourceName}' but must use node name '${correctName}'. Change connections.${sourceName} to connections['${correctName}']`);
        } else {
          errors.push(`Connection references non-existent node: ${sourceName}`);
        }
      }
      
      connection.main.forEach((outputs, outputIndex) => {
        outputs.forEach((target, targetIndex) => {
          // Check if target exists by name (correct)
          if (!nodeNames.has(target.node)) {
            // Check if they're using an ID instead of name
            if (nodeIds.has(target.node)) {
              const correctName = nodeIdToName.get(target.node);
              errors.push(`Connection target uses node ID '${target.node}' but must use node name '${correctName}' (from ${sourceName}[${outputIndex}][${targetIndex}])`);
            } else {
              errors.push(`Connection references non-existent target node: ${target.node} (from ${sourceName}[${outputIndex}][${targetIndex}])`);
            }
          }
        });
      });
    });
  }

  return errors;
}

// Check if workflow has webhook trigger
export function hasWebhookTrigger(workflow: Workflow): boolean {
  return workflow.nodes.some(node => 
    node.type === 'n8n-nodes-base.webhook' || 
    node.type === 'n8n-nodes-base.webhookTrigger'
  );
}

// Get webhook URL from workflow
export function getWebhookUrl(workflow: Workflow): string | null {
  const webhookNode = workflow.nodes.find(node => 
    node.type === 'n8n-nodes-base.webhook' || 
    node.type === 'n8n-nodes-base.webhookTrigger'
  );

  if (!webhookNode || !webhookNode.parameters) {
    return null;
  }

  // Check for path parameter
  const path = webhookNode.parameters.path as string | undefined;
  if (!path) {
    return null;
  }

  // Note: We can't construct the full URL without knowing the n8n instance URL
  // The caller will need to prepend the base URL
  return path;
}

// Helper function to generate proper workflow structure examples
export function getWorkflowStructureExample(): string {
  return `
Minimal Workflow Example:
{
  "name": "My Workflow",
  "nodes": [
    {
      "id": "manual-trigger-1",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {}
    },
    {
      "id": "set-1",
      "name": "Set Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [450, 300],
      "parameters": {
        "mode": "manual",
        "assignments": {
          "assignments": [{
            "id": "1",
            "name": "message",
            "value": "Hello World",
            "type": "string"
          }]
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{
        "node": "Set Data",
        "type": "main",
        "index": 0
      }]]
    }
  }
}

IMPORTANT: In connections, use the node NAME (e.g., "Manual Trigger"), NOT the node ID or type!`;
}

// Helper function to fix common workflow issues
export function getWorkflowFixSuggestions(errors: string[]): string[] {
  const suggestions: string[] = [];
  
  if (errors.some(e => e.includes('empty connections'))) {
    suggestions.push('Add connections between your nodes. Each node (except endpoints) should connect to another node.');
    suggestions.push('Connection format: connections: { "Source Node Name": { "main": [[{ "node": "Target Node Name", "type": "main", "index": 0 }]] } }');
  }
  
  if (errors.some(e => e.includes('Single-node workflows'))) {
    suggestions.push('Add at least one more node to process data. Common patterns: Trigger → Process → Output');
    suggestions.push('Examples: Manual Trigger → Set, Webhook → HTTP Request, Schedule Trigger → Database Query');
  }
  
  if (errors.some(e => e.includes('node ID') && e.includes('instead of node name'))) {
    suggestions.push('Replace node IDs with node names in connections. The name is what appears in the node header.');
    suggestions.push('Wrong: connections: { "set-1": {...} }, Right: connections: { "Set Data": {...} }');
  }
  
  return suggestions;
}