/**
 * Delete Workflow Tool
 * 
 * This tool deletes an existing workflow from n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the delete_workflow tool
 */
export class DeleteWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflowId
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Get the workflow info first for the confirmation message
      const workflow = await this.apiService.getWorkflow(workflowId);
      const workflowName = workflow.name;
      
      // Delete the workflow
      await this.apiService.deleteWorkflow(workflowId);

      // Invalidate cache after deletion
      workflowCache.invalidateAll();

      return this.formatSuccess(
        { id: workflowId },
        `Workflow "${workflowName}" (ID: ${workflowId}) has been successfully deleted`
      );
    }, args);
  }
}

/**
 * Get tool definition for the delete_workflow tool
 * 
 * @returns Tool definition
 */
export function getDeleteWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'delete_workflow',
    description: 'Delete a workflow from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to delete',
        },
      },
      required: ['workflowId'],
    },
  };
}
