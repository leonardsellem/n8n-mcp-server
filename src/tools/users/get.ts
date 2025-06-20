/**
 * Get User Tool
 * 
 * This tool retrieves a specific user in n8n.
 */

import { BaseUsersToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the get_user tool
 */
export class GetUserHandler extends BaseUsersToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing user ID
   * @returns User information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { userId } = args;
      
      if (!userId) {
        throw new N8nApiError('Missing required parameter: userId');
      }
      
      // Get the user using direct API call
      const response = await this.apiService.getAxiosInstance().get(`/users/${userId}`);
      const user = response.data;
      
      return this.formatSuccess(user);
    }, args);
  }
}

/**
 * Get tool definition for the get_user tool
 * 
 * @returns Tool definition
 */
export function getGetUserToolDefinition(): ToolDefinition {
  return {
    name: 'get_user',
    description: 'Get details of a specific user in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID of the user to retrieve',
        },
      },
      required: ['userId'],
    },
  };
}
