/**
 * List Users Tool
 * 
 * This tool lists all users in n8n.
 */

import { BaseUsersToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the list_users tool
 */
export class ListUsersHandler extends BaseUsersToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (optional filters)
   * @returns List of users
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      // Get all users using direct API call
      const response = await this.apiService.getAxiosInstance().get('/users');
      const users = response.data;
      
      return this.formatSuccess(users);
    }, args);
  }
}

/**
 * Get tool definition for the list_users tool
 * 
 * @returns Tool definition
 */
export function getListUsersToolDefinition(): ToolDefinition {
  return {
    name: 'list_users',
    description: 'List all users in n8n',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  };
}
