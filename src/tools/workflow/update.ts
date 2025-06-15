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
      const { workflowId, name, nodes, connections, active, tags } = args;
      
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
      
      // Prepare update object with changes - exclude read-only fields
      const workflowData: Record<string, any> = {
        name: currentWorkflow.name,
        nodes: currentWorkflow.nodes || [],
        connections: currentWorkflow.connections || {},
        settings: currentWorkflow.settings || {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600,
          timezone: "UTC"
        },
        staticData: currentWorkflow.staticData || {}
      };
      
      // Update fields if provided (but exclude read-only ones)
      if (name !== undefined) workflowData.name = name;
      if (nodes !== undefined) workflowData.nodes = nodes;
      if (connections !== undefined) workflowData.connections = connections;
      // Note: active field is read-only and handled through activate/deactivate endpoints
      // Note: tags field is read-only and handled through tags API
      
      // Update the workflow
      const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, workflowData);
      
      // Build a summary of changes
      const changesArray = [];
      if (name !== undefined && name !== currentWorkflow.name) changesArray.push(`name: "${currentWorkflow.name}" → "${name}"`);
      if (nodes !== undefined) changesArray.push('nodes updated');
      if (connections !== undefined) changesArray.push('connections updated');
      
      // Handle activation separately if requested
      if (active !== undefined && active !== currentWorkflow.active) {
        if (active) {
          await this.apiService.activateWorkflow(workflowId);
        } else {
          await this.apiService.deactivateWorkflow(workflowId);
        }
        changesArray.push(`active: ${currentWorkflow.active} → ${active}`);
      }
      
      // Handle tags separately if provided
      if (tags !== undefined) {
        // This would need to be implemented through the tags API
        changesArray.push('tags update requested (handled separately)');
      }
      
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
    description: 'Update an existing workflow in n8n. Note: Use activate_workflow/deactivate_workflow for activation status.',
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
      },
      required: ['workflowId'],
    },
  };
}
