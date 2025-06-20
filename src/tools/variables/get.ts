/**
 * Get Variable Tool
 * 
 * This tool retrieves a specific variable from n8n.
 */

import { BaseVariablesToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the get_variable tool
 */
export class GetVariableHandler extends BaseVariablesToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing variable ID
   * @returns Variable information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { variableId } = args;
      
      if (!variableId) {
        throw new N8nApiError('Missing required parameter: variableId');
      }
      
      // Get the variable using direct API call
      const response = await this.apiService.getAxiosInstance().get(`/variables/${variableId}`);
      const variable = response.data;
      
      return this.formatSuccess(
        variable,
        `Variable ${variableId} retrieved successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the get_variable tool
 * 
 * @returns Tool definition
 */
export function getGetVariableToolDefinition(): ToolDefinition {
  return {
    name: 'get_variable',
    description: 'Get a specific variable from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        variableId: {
          type: 'string',
          description: 'ID of the variable to retrieve',
        },
      },
      required: ['variableId'],
    },
  };
}

/**
 * Create and export the get variable tool
 */
export const getVariableTool = {
  definition: getGetVariableToolDefinition(),
  handler: GetVariableHandler,
};
