/**
 * Search Workflows Tool
 *
 * This tool searches workflows by name, tags, or node types.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the search_workflows tool
 */
export class SearchWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns Search results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { query, searchIn = 'all', active } = args;

      if (!query || query.trim() === '') {
        return this.formatError(
          'Missing required parameter: query. Provide a search term to find workflows.'
        );
      }

      // Get workflows (from cache or API)
      let workflows = workflowCache.getWorkflowList();
      if (!workflows) {
        workflows = await this.apiService.getWorkflows();
        workflowCache.setWorkflowList(workflows);
      }

      const searchQuery = query.toLowerCase().trim();

      // Filter by active status if specified
      let filtered = workflows;
      if (typeof active === 'boolean') {
        filtered = filtered.filter((w: Workflow) => w.active === active);
      }

      // Search based on searchIn parameter
      const results = filtered.filter((workflow: Workflow) => {
        const nameMatch = workflow.name?.toLowerCase().includes(searchQuery);

        // Search in tags if available
        const tagsMatch = workflow.tags?.some((tag: any) =>
          (typeof tag === 'string' ? tag : tag.name)?.toLowerCase().includes(searchQuery)
        );

        // Search in node types if requested
        const nodesMatch = workflow.nodes?.some((node: any) =>
          node.type?.toLowerCase().includes(searchQuery) ||
          node.name?.toLowerCase().includes(searchQuery)
        );

        switch (searchIn) {
          case 'name':
            return nameMatch;
          case 'tags':
            return tagsMatch;
          case 'nodes':
            return nodesMatch;
          case 'all':
          default:
            return nameMatch || tagsMatch || nodesMatch;
        }
      });

      // Format results with helpful metadata
      const formattedResults = results.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        tags: workflow.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [],
        nodeCount: workflow.nodes?.length || 0,
        updatedAt: workflow.updatedAt,
        hint: workflow.active
          ? 'Ready to execute with execute_workflow'
          : 'Inactive - use activate_workflow first',
      }));

      const response = {
        success: true,
        query,
        searchIn,
        totalResults: formattedResults.length,
        results: formattedResults,
        hint: formattedResults.length === 0
          ? 'No workflows found. Try a different search term or use list_workflows to see all.'
          : `Found ${formattedResults.length} workflow(s) matching "${query}"`,
      };

      return this.formatSuccess(response);
    }, args);
  }
}

/**
 * Get tool definition for the search_workflows tool
 *
 * @returns Tool definition
 */
export function getSearchWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'search_workflows',
    description:
      'Search for workflows by name, tags, or node types. ' +
      'Use this to quickly find specific workflows instead of listing all. ' +
      'Supports partial matching (e.g., "email" will match "Send Email Notification"). ' +
      'Results include workflow ID, name, status, and hints for next actions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search term to find workflows. Matches against names, tags, or node types based on searchIn parameter.',
        },
        searchIn: {
          type: 'string',
          enum: ['name', 'tags', 'nodes', 'all'],
          description:
            'Where to search: "name" (workflow names only), "tags" (workflow tags), "nodes" (node types and names), "all" (everywhere). Default: "all".',
        },
        active: {
          type: 'boolean',
          description:
            'Optional filter: true for active workflows only, false for inactive only. Omit to search all.',
        },
      },
      required: ['query'],
    },
  };
}
