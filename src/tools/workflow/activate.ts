/**
 * Activate Workflow Tool
 * 
 * This tool activates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the activate_workflow tool
 */
export class ActivateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflowId
   * @returns Activation confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Activate the workflow
      const workflow = await this.apiService.activateWorkflow(workflowId);

      // Invalidate cache after activation
      workflowCache.invalidateWorkflow(workflowId);

      return this.formatSuccess(
        {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active
        },
        `Workflow "${workflow.name}" (ID: ${workflowId}) has been successfully activated`
      );
    }, args);
  }
}

/**
 * Get tool definition for the activate_workflow tool
 * 
 * @returns Tool definition
 */
export function getActivateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'activate_workflow',
    description: 'Activate a workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to activate',
        },
      },
      required: ['workflowId'],
    },
  };
}
