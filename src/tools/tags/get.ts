/**
 * Get Tag Tool
 * 
 * This tool retrieves a tag by ID in n8n.
 */

import { BaseTagsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the get_tag tool
 */
export class GetTagHandler extends BaseTagsToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing tag ID
   * @returns Tag information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { tagId } = args;
      
      if (!tagId) {
        throw new N8nApiError('Missing required parameter: tagId');
      }
      
      // Get the tag using direct API call
      const response = await this.apiService.getAxiosInstance().get(`/tags/${tagId}`);
      const tag = response.data;
      
      return this.formatSuccess(tag);
    }, args);
  }
}

/**
 * Get tool definition for the get_tag tool
 * 
 * @returns Tool definition
 */
export function getGetTagToolDefinition(): ToolDefinition {
  return {
    name: 'get_tag',
    description: 'Get a tag by ID in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        tagId: {
          type: 'string',
          description: 'ID of the tag to retrieve',
        },
      },
      required: ['tagId'],
    },
  };
}
