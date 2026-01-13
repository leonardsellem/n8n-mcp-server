/**
 * Get Workflow Tool
 *
 * This tool retrieves a specific workflow from n8n by ID.
 * Uses caching for improved performance.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the get_workflow tool
 */
export class GetWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments containing workflowId
   * @returns Workflow details
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId } = args;

      if (!workflowId) {
        return this.formatError(
          'Missing required parameter: workflowId. Use list_workflows to find available workflow IDs.'
        );
      }

      // Try cache first
      let workflow: Workflow | null = workflowCache.getWorkflow(workflowId);

      if (!workflow) {
        workflow = await this.apiService.getWorkflow(workflowId);
        if (workflow) {
          workflowCache.setWorkflow(workflow);
        }
      }

      if (!workflow) {
        return this.formatError(`Workflow ${workflowId} not found.`);
      }

      // Build enhanced response with hints
      const response = {
        ...workflow,
        _meta: {
          nodeCount: workflow.nodes?.length || 0,
          nodeTypes: [...new Set(workflow.nodes?.map((n: any) => n.type) || [])],
          hint: workflow.active
            ? 'Workflow is active. Use execute_workflow to run it, or update_workflow to modify.'
            : 'Workflow is inactive. Use activate_workflow to enable it first.',
        },
      };

      return this.formatSuccess(response, `Workflow: ${workflow.name}`);
    }, args);
  }
}

/**
 * Get tool definition for the get_workflow tool
 *
 * @returns Tool definition
 */
export function getGetWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow',
    description:
      'Get full details of a specific workflow by ID, including all nodes, connections, and settings. ' +
      'Use this when you need to see the complete workflow structure. ' +
      'For a quick overview of all workflows, use list_workflows instead.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description:
            'The workflow ID to retrieve (e.g., "abc123"). Use list_workflows to find available IDs.',
        },
      },
      required: ['workflowId'],
    },
  };
}
