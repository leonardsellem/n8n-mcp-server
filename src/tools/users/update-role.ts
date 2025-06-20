/**
 * Update User Role Tool
 * 
 * This tool updates a user's role in n8n.
 */

import { BaseUsersToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_user_role tool
 */
export class UpdateUserRoleHandler extends BaseUsersToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing user ID and new role
   * @returns Updated user information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { userId, role } = args;
      
      if (!userId) {
        throw new N8nApiError('Missing required parameter: userId');
      }
      
      if (!role) {
        throw new N8nApiError('Missing required parameter: role');
      }
      
      // Update the user role using direct API call
      const response = await this.apiService.getAxiosInstance().patch(`/users/${userId}/role`, {
        role
      });
      const updatedUser = response.data;
      
      return this.formatSuccess(
        updatedUser,
        `User ${userId} role updated to ${role}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the update_user_role tool
 * 
 * @returns Tool definition
 */
export function getUpdateUserRoleToolDefinition(): ToolDefinition {
  return {
    name: 'update_user_role',
    description: 'Update a user\'s role in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID of the user to update',
        },
        role: {
          type: 'string',
          description: 'New role for the user (admin, member, etc.)',
        },
      },
      required: ['userId', 'role'],
    },
  };
}
