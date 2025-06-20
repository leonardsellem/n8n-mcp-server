/**
 * Update Tag Tool
 * 
 * This tool updates a tag in n8n.
 */

import { BaseTagsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_tag tool
 */
export class UpdateTagHandler extends BaseTagsToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing tag ID and update data
   * @returns Updated tag information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { tagId, name } = args;
      
      if (!tagId) {
        throw new N8nApiError('Missing required parameter: tagId');
      }
      
      if (!name) {
        throw new N8nApiError('Missing required parameter: name');
      }
      
      // Update the tag using direct API call
      const response = await this.apiService.getAxiosInstance().patch(`/tags/${tagId}`, {
        name
      });
      const updatedTag = response.data;
      
      return this.formatSuccess(updatedTag);
    }, args);
  }
}

/**
 * Get tool definition for the update_tag tool
 * 
 * @returns Tool definition
 */
export function getUpdateTagToolDefinition(): ToolDefinition {
  return {
    name: 'update_tag',
    description: 'Update a tag in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        tagId: {
          type: 'string',
          description: 'ID of the tag to update',
        },
        name: {
          type: 'string',
          description: 'New name for the tag',
        },
      },
      required: ['tagId', 'name'],
    },
  };
}
