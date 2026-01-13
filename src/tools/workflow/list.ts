/**
 * List Workflows Tool
 *
 * This tool retrieves a list of workflows from n8n.
 * Uses caching for improved performance.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the list_workflows tool
 */
export class ListWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns List of workflows
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { active, compact } = args;

      // Try cache first
      let workflows = workflowCache.getWorkflowList();

      if (!workflows) {
        workflows = await this.apiService.getWorkflows();
        workflowCache.setWorkflowList(workflows);
      }

      // Filter by active status if specified
      let filtered = workflows;
      if (typeof active === 'boolean') {
        filtered = filtered.filter((w: Workflow) => w.active === active);
      }

      // Format the workflows for display
      const formattedWorkflows = filtered.map((workflow: Workflow) => {
        const base = {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          hint: workflow.active
            ? 'Ready - use execute_workflow to run'
            : 'Inactive - use activate_workflow first',
        };

        // Add more details unless compact mode
        if (!compact) {
          return {
            ...base,
            updatedAt: workflow.updatedAt,
            nodeCount: workflow.nodes?.length || 0,
            tags: workflow.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [],
          };
        }

        return base;
      });

      const activeCount = formattedWorkflows.filter((w: any) => w.active).length;

      const response = {
        success: true,
        total: formattedWorkflows.length,
        active: activeCount,
        inactive: formattedWorkflows.length - activeCount,
        workflows: formattedWorkflows,
        hint: formattedWorkflows.length === 0
          ? 'No workflows found. Use create_workflow to create one.'
          : `Use get_workflow with an ID for full details, or search_workflows to find specific ones.`,
      };

      return this.formatSuccess(response);
    }, args);
  }
}

/**
 * Get tool definition for the list_workflows tool
 *
 * @returns Tool definition
 */
export function getListWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'list_workflows',
    description:
      'List all n8n workflows with their ID, name, active status, and basic info. ' +
      'Use this to discover available workflows before executing or modifying them. ' +
      'Returns a summary by default - use get_workflow for full node details. ' +
      'For finding specific workflows, use search_workflows instead.',
    inputSchema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description:
            'Filter by active status: true for active only, false for inactive only. Omit to show all.',
        },
        compact: {
          type: 'boolean',
          description:
            'Return minimal data (id, name, active only). Faster for large workflow counts. Default: false.',
        },
      },
      required: [],
    },
  };
}
