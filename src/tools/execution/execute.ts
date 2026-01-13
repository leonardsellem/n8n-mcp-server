/**
 * Execute Workflow Tool
 *
 * This tool executes a workflow by ID with optional input data.
 * Unlike run_webhook, this uses the direct API endpoint.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the execute_workflow tool
 */
export class ExecuteWorkflowHandler extends BaseExecutionToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns Execution result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId, data } = args;

      if (!workflowId) {
        return this.formatError(
          'Missing required parameter: workflowId. Use list_workflows to find available workflow IDs.'
        );
      }

      const result = await this.apiService.executeWorkflow(workflowId, data || {});

      // Format response with helpful context
      const response = {
        success: true,
        executionId: result.id || result.executionId,
        workflowId: workflowId,
        status: result.status || result.finished ? 'finished' : 'running',
        startedAt: result.startedAt,
        finishedAt: result.stoppedAt,
        data: result.data,
        hint: result.status === 'error'
          ? 'Execution failed. Use get_execution_details for more info.'
          : 'Execution completed successfully.',
      };

      return this.formatSuccess(response, `Workflow ${workflowId} executed`);
    }, args);
  }
}

/**
 * Get tool definition for the execute_workflow tool
 *
 * @returns Tool definition
 */
export function getExecuteWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'execute_workflow',
    description:
      'Execute a workflow by its ID. This runs the workflow immediately via the n8n API. ' +
      'Use this when you have a workflow ID and want to trigger it directly. ' +
      'For webhook-triggered workflows, use run_webhook instead. ' +
      'Returns execution ID and status. Use get_execution to check progress.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description:
            'The workflow ID to execute (e.g., "abc123"). Use list_workflows to find available IDs.',
        },
        data: {
          type: 'object',
          description:
            'Optional input data to pass to the workflow. This will be available in the workflow as input.',
        },
      },
      required: ['workflowId'],
    },
  };
}
