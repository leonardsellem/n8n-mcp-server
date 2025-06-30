/**
 * Create Workflow Tool
 * 
 * This tool creates a new workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { parseIfJsonString } from '../../utils/json.js';

/**
 * Handler for the create_workflow tool
 */
export class CreateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow details
   * @returns Created workflow information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { name, nodes, connections, active, tags } = args;

      const parsedNodes: any = parseIfJsonString(nodes, { throwOnError: true, paramName: 'nodes' });
      const parsedConnections: any = parseIfJsonString(connections, { throwOnError: true, paramName: 'connections' });
      const parsedTags: any = parseIfJsonString(tags, { throwOnError: true, paramName: 'tags' });
      
      if (!name) {
        throw new N8nApiError('Missing required parameter: name');
      }

      // Validate nodes if provided
      if (parsedNodes && !Array.isArray(parsedNodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }

      // Validate connections if provided
      if (parsedConnections && typeof parsedConnections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }

      // Validate tags if provided
      if (parsedTags && !Array.isArray(parsedTags)) {
        throw new N8nApiError('Parameter "tags" must be an array');
      }
      
      // Prepare workflow object
      const workflowData: Record<string, any> = {
        name,
        active: active === true,  // Default to false if not specified
      };
      
      // Add optional fields if provided
      if (parsedNodes) workflowData.nodes = parsedNodes;
      if (parsedConnections) workflowData.connections = parsedConnections;
      if (parsedTags) workflowData.tags = parsedTags;
      
      // Create the workflow
      const workflow = await this.apiService.createWorkflow(workflowData);
      
      return this.formatSuccess(
        {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active
        },
        `Workflow created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the create_workflow tool
 * 
 * @returns Tool definition
 */
export function getCreateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow',
    description: 'Create a new workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Array of node objects that define the workflow',
          items: {
            type: 'object',
          },
        },
        connections: {
          type: 'object',
          description: 'Connection mappings between nodes',
        },
        active: {
          type: 'boolean',
          description: 'Whether the workflow should be active upon creation',
        },
        tags: {
          type: 'array',
          description: 'Tags to associate with the workflow',
          items: {
            type: 'string',
          },
        },
      },
      required: ['name'],
    },
  };
}
