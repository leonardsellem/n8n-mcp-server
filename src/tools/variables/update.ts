/**
 * Update Variable Tool
 * 
 * This tool updates an existing variable in n8n.
 */

import { BaseVariablesToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_variable tool
 */
export class UpdateVariableHandler extends BaseVariablesToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing variable data
   * @returns Updated variable information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { variableId, key, value, type } = args;
      
      if (!variableId) {
        throw new N8nApiError('Missing required parameter: variableId');
      }
      
      const updateData: any = {};
      if (key !== undefined) updateData.key = key;
      if (value !== undefined) updateData.value = value;
      if (type !== undefined) updateData.type = type;
      
      if (Object.keys(updateData).length === 0) {
        throw new N8nApiError('At least one field (key, value, type) must be provided for update');
      }
      
      // Update the variable using direct API call
      const response = await this.apiService.getAxiosInstance().patch(`/variables/${variableId}`, updateData);
      const variable = response.data;
      
      return this.formatSuccess(
        variable,
        `Variable ${variableId} updated successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the update_variable tool
 * 
 * @returns Tool definition
 */
export function getUpdateVariableToolDefinition(): ToolDefinition {
  return {
    name: 'update_variable',
    description: 'Update a variable in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        variableId: {
          type: 'string',
          description: 'ID of the variable to update',
        },
        key: {
          type: 'string',
          description: 'New variable key/name',
        },
        value: {
          type: 'string',
          description: 'New variable value',
        },
        type: {
          type: 'string',
          description: 'Variable type (string, number, boolean)',
        },
      },
      required: ['variableId'],
    },
  };
}

/**
 * Create and export the update variable tool
 */
export const updateVariableTool = {
  definition: getUpdateVariableToolDefinition(),
  handler: UpdateVariableHandler,
};
