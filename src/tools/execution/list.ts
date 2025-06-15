/**
 * List Executions Tool
 * 
 * This tool retrieves a list of workflow executions from n8n.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Execution } from '../../types/index.js';
import { formatExecutionSummary, summarizeExecutions } from '../../utils/execution-formatter.js';

/**
 * Handler for the list_executions tool
 */
export class ListExecutionsHandler extends BaseExecutionToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (workflowId, status, limit, lastId)
   * @returns List of executions
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const executions = await this.apiService.getExecutions();
      
      // Apply filters if provided
      let filteredExecutions = executions;
      
      // Filter by workflow ID if provided
      if (args.workflowId) {
        filteredExecutions = filteredExecutions.filter(
          (execution: Execution) => execution.workflowId === args.workflowId
        );
      }
      
      // Filter by status if provided
      if (args.status) {
        filteredExecutions = filteredExecutions.filter(
          (execution: Execution) => execution.status === args.status
        );
      }
      
      // Convert and validate lastId if provided for pagination consistency
      if (args.lastId) {
        const numericLastId = this.convertToNumericId(args.lastId);
        // Filter executions to start after the lastId for pagination
        const lastIdIndex = filteredExecutions.findIndex(
          (execution: Execution) => execution.id === numericLastId.toString()
        );
        if (lastIdIndex >= 0) {
          filteredExecutions = filteredExecutions.slice(lastIdIndex + 1);
        }
      }
      
      // Apply limit if provided
      const limit = args.limit && args.limit > 0 ? args.limit : filteredExecutions.length;
      filteredExecutions = filteredExecutions.slice(0, limit);
      
      // Format the executions for display
      const formattedExecutions = filteredExecutions.map((execution: Execution) => 
        formatExecutionSummary(execution)
      );
      
      // Generate summary if requested
      let summary = undefined;
      if (args.includeSummary) {
        summary = summarizeExecutions(executions);
      }
      
      // Prepare response data
      const responseData = {
        executions: formattedExecutions,
        summary: summary,
        total: formattedExecutions.length,
        filtered: args.workflowId || args.status ? true : false
      };
      
      return this.formatSuccess(
        responseData,
        `Found ${formattedExecutions.length} execution(s)`
      );
    }, args);
  }
}

/**
 * Get tool definition for the list_executions tool
 * 
 * @returns Tool definition
 */
export function getListExecutionsToolDefinition(): ToolDefinition {
  return {
    name: 'list_executions',
    description: 'Retrieve a list of workflow executions from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of workflow to filter executions by',
        },
        status: {
          type: 'string',
          description: 'Optional status to filter by (success, error, waiting, or canceled)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of executions to return',
        },
        lastId: {
          oneOf: [
            { type: 'string' },
            { type: 'number' }
          ],
          description: 'ID of the last execution for pagination. Accepts both string and numeric formats. String IDs will be validated and converted to numeric format.',
        },
        includeSummary: {
          type: 'boolean',
          description: 'Include summary statistics about executions',
        },
      },
      required: [],
    },
  };
}
