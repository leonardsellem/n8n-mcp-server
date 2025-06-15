/**
 * Create User Tool
 * 
 * This tool creates a new user in n8n.
 */

import { BaseUsersToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the create_user tool
 */
export class CreateUserHandler extends BaseUsersToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing user data
   * @returns Created user information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { email, firstName, lastName, role } = args;
      
      if (!email) {
        throw new N8nApiError('Missing required parameter: email');
      }
      
      // Create the user using direct API call
      const response = await this.apiService.getAxiosInstance().post('/users', {
        email,
        firstName,
        lastName,
        role: role || 'member'
      });
      const createdUser = response.data;
      
      return this.formatSuccess(createdUser);
    }, args);
  }
}

/**
 * Get tool definition for the create_user tool
 * 
 * @returns Tool definition
 */
export function getCreateUserToolDefinition(): ToolDefinition {
  return {
    name: 'create_user',
    description: 'Create a new user in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the user',
        },
        firstName: {
          type: 'string',
          description: 'First name of the user',
        },
        lastName: {
          type: 'string',
          description: 'Last name of the user',
        },
        role: {
          type: 'string',
          description: 'Role of the user (admin, member, etc.)',
          default: 'member',
        },
      },
      required: ['email'],
    },
  };
}
