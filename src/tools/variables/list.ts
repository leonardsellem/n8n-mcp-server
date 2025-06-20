/**
 * List Variables Tool
 * 
 * This tool lists all variables in n8n.
 */

import { BaseVariablesToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the list_variables tool
 */
export class ListVariablesHandler extends BaseVariablesToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (optional filters)
   * @returns List of variables
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { limit = 50, offset = 0 } = args;
      
      // Get variables using direct API call
      const response = await this.apiService.getAxiosInstance().get('/variables', {
        params: {
          limit,
          offset
        }
      });
      const variables = response.data;
      
      return this.formatSuccess(
        variables,
        `Retrieved ${Array.isArray(variables.data) ? variables.data.length : variables.length || 0} variables`
      );
    }, args);
  }
}

/**
 * Get tool definition for the list_variables tool
 * 
 * @returns Tool definition
 */
export function getListVariablesToolDefinition(): ToolDefinition {
  return {
    name: 'list_variables',
    description: 'List all variables in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of variables to return',
          default: 50,
        },
        offset: {
          type: 'number',
          description: 'Number of variables to skip',
          default: 0,
        },
      },
      required: [],
    },
  };
}

/**
 * Create and export the list variables tool
 */
export const listVariablesTool = {
  definition: getListVariablesToolDefinition(),
  handler: ListVariablesHandler,
};
