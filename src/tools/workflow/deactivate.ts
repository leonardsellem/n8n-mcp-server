/**
 * Deactivate Workflow Tool
 * 
 * This tool deactivates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the deactivate_workflow tool
 */
export class DeactivateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflowId
   * @returns Deactivation confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Deactivate the workflow
      const workflow = await this.apiService.deactivateWorkflow(workflowId);

      // Invalidate cache after deactivation
      workflowCache.invalidateWorkflow(workflowId);

      return this.formatSuccess(
        {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active
        },
        `Workflow "${workflow.name}" (ID: ${workflowId}) has been successfully deactivated`
      );
    }, args);
  }
}

/**
 * Get tool definition for the deactivate_workflow tool
 * 
 * @returns Tool definition
 */
export function getDeactivateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'deactivate_workflow',
    description: 'Deactivate a workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to deactivate',
        },
      },
      required: ['workflowId'],
    },
  };
}
