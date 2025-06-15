/**
 * Delete User Tool
 * 
 * This tool deletes a user in n8n.
 */

import { BaseUsersToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the delete_user tool
 */
export class DeleteUserHandler extends BaseUsersToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing user ID
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { userId } = args;
      
      if (!userId) {
        throw new N8nApiError('Missing required parameter: userId');
      }
      
      // Delete the user using direct API call
      await this.apiService.getAxiosInstance().delete(`/users/${userId}`);
      
      return this.formatSuccess(
        { userId, deleted: true },
        `User ${userId} deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the delete_user tool
 * 
 * @returns Tool definition
 */
export function getDeleteUserToolDefinition(): ToolDefinition {
  return {
    name: 'delete_user',
    description: 'Delete a user in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID of the user to delete',
        },
      },
      required: ['userId'],
    },
  };
}
