/**
 * List Tags Tool
 * 
 * This tool lists all tags in n8n.
 */

import { BaseTagsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the list_tags tool
 */
export class ListTagsHandler extends BaseTagsToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (optional filters)
   * @returns List of tags
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      // List all tags using direct API call
      const response = await this.apiService.getAxiosInstance().get('/tags');
      const tags = response.data;
      
      return this.formatSuccess(tags);
    }, args);
  }
}

/**
 * Get tool definition for the list_tags tool
 * 
 * @returns Tool definition
 */
export function getListTagsToolDefinition(): ToolDefinition {
  return {
    name: 'list_tags',
    description: 'List all tags in n8n',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  };
}
