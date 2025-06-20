/**
 * Delete Variable Tool
 * 
 * This tool deletes a variable in n8n.
 */

import { BaseVariablesToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the delete_variable tool
 */
export class DeleteVariableHandler extends BaseVariablesToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing variable ID
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { variableId } = args;
      
      if (!variableId) {
        throw new N8nApiError('Missing required parameter: variableId');
      }
      
      // Delete the variable using direct API call
      await this.apiService.getAxiosInstance().delete(`/variables/${variableId}`);
      
      return this.formatSuccess(
        { variableId, deleted: true },
        `Variable ${variableId} deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the delete_variable tool
 * 
 * @returns Tool definition
 */
export function getDeleteVariableToolDefinition(): ToolDefinition {
  return {
    name: 'delete_variable',
    description: 'Delete a variable from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        variableId: {
          type: 'string',
          description: 'ID of the variable to delete',
        },
      },
      required: ['variableId'],
    },
  };
}

/**
 * Create and export the delete variable tool
 */
export const deleteVariableTool = {
  definition: getDeleteVariableToolDefinition(),
  handler: DeleteVariableHandler,
};
