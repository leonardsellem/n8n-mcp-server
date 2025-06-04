/**
 * Update Workflow Tool
 * 
 * This tool updates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_workflow tool
 */
export class UpdateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow updates
   * @returns Updated workflow information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, name, nodes, connections, settings, staticData } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Validate nodes if provided
      if (nodes && !Array.isArray(nodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }
      
      // Validate connections if provided
      if (connections && typeof connections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }
      
      // Get the current workflow to update
      const currentWorkflow = await this.apiService.getWorkflow(workflowId);
      
      // Build update payload from scratch, only allowed fields
      const workflowData: Record<string, any> = {};
      if (name !== undefined) workflowData.name = name;
      else if (currentWorkflow.name !== undefined) workflowData.name = currentWorkflow.name;
      if (nodes !== undefined) workflowData.nodes = nodes;
      else if (currentWorkflow.nodes !== undefined) workflowData.nodes = currentWorkflow.nodes;
      if (connections !== undefined) workflowData.connections = connections;
      else if (currentWorkflow.connections !== undefined) workflowData.connections = currentWorkflow.connections;
      if (settings !== undefined) workflowData.settings = settings;
      else if (currentWorkflow.settings !== undefined) workflowData.settings = currentWorkflow.settings;
      if (staticData !== undefined) workflowData.staticData = staticData;
      else if (currentWorkflow.staticData !== undefined) workflowData.staticData = currentWorkflow.staticData;
      
      // Update the workflow
      const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, workflowData);
      
      // Build a summary of changes
      const changesArray = [];
      if (name !== undefined && name !== currentWorkflow.name) changesArray.push(`name: "${currentWorkflow.name}" → "${name}"`);
      if (nodes !== undefined) changesArray.push('nodes updated');
      if (connections !== undefined) changesArray.push('connections updated');
      if (settings !== undefined) changesArray.push('settings updated');
      if (staticData !== undefined) changesArray.push('staticData updated');
      
      const changesSummary = changesArray.length > 0
        ? `Changes: ${changesArray.join(', ')}`
        : 'No changes were made';
      
      return this.formatSuccess(
        {
          id: updatedWorkflow.id,
          name: updatedWorkflow.name,
          active: updatedWorkflow.active
        },
        `Workflow updated successfully. ${changesSummary}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the update_workflow tool
 * 
 * @returns Tool definition
 */
export function getUpdateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'update_workflow',
    description: 'Update an existing workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to update',
        },
        name: {
          type: 'string',
          description: 'New name for the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Updated array of node objects that define the workflow',
          items: {
            type: 'object',
          },
        },
        connections: {
          type: 'object',
          description: 'Updated connection mappings between nodes',
        },
        settings: {
          type: 'object',
          description: 'Updated settings for the workflow',
        },
        staticData: {
          type: 'object',
          description: 'Updated static data for the workflow',
        },
      },
      required: ['workflowId'],
    },
  };
}
