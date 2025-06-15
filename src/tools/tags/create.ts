/**
 * Create Tag Tool
 * 
 * This tool creates a new tag in n8n.
 */

import { BaseTagsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the create_tag tool
 */
export class CreateTagHandler extends BaseTagsToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing tag data
   * @returns Created tag information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { name } = args;
      
      if (!name) {
        throw new N8nApiError('Missing required parameter: name');
      }
      
      // Create the tag using direct API call
      const response = await this.apiService.getAxiosInstance().post('/tags', {
        name
      });
      const createdTag = response.data;
      
      return this.formatSuccess(createdTag);
    }, args);
  }
}

/**
 * Get tool definition for the create_tag tool
 * 
 * @returns Tool definition
 */
export function getCreateTagToolDefinition(): ToolDefinition {
  return {
    name: 'create_tag',
    description: 'Create a new tag in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the tag to create',
        },
      },
      required: ['name'],
    },
  };
}
