/**
 * Create Variable Tool
 * 
 * This tool creates a new variable in n8n.
 */

import { BaseVariablesToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the create_variable tool
 */
export class CreateVariableHandler extends BaseVariablesToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing variable data
   * @returns Created variable information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { key, value, type = 'string' } = args;
      
      if (!key) {
        throw new N8nApiError('Missing required parameter: key');
      }
      
      if (value === undefined || value === null) {
        throw new N8nApiError('Missing required parameter: value');
      }
      
      const variableData = {
        key,
        value,
        type
      };
      
      // Create the variable using direct API call
      const response = await this.apiService.getAxiosInstance().post('/variables', variableData);
      const variable = response.data;
      
      return this.formatSuccess(
        variable,
        `Variable ${key} created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the create_variable tool
 * 
 * @returns Tool definition
 */
export function getCreateVariableToolDefinition(): ToolDefinition {
  return {
    name: 'create_variable',
    description: 'Create a new variable in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Variable key/name',
        },
        value: {
          type: 'string',
          description: 'Variable value',
        },
        type: {
          type: 'string',
          description: 'Variable type (string, number, boolean)',
          default: 'string',
        },
      },
      required: ['key', 'value'],
    },
  };
}

/**
 * Create and export the create variable tool
 */
export const createVariableTool = {
  definition: getCreateVariableToolDefinition(),
  handler: CreateVariableHandler,
};
