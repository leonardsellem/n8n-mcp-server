/**
 * Delete Tag Tool
 * 
 * This tool deletes a tag in n8n.
 */

import { BaseTagsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the delete_tag tool
 */
export class DeleteTagHandler extends BaseTagsToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing tag ID
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { tagId } = args;
      
      if (!tagId) {
        throw new N8nApiError('Missing required parameter: tagId');
      }
      
      // Delete the tag using direct API call
      await this.apiService.getAxiosInstance().delete(`/tags/${tagId}`);
      
      return this.formatSuccess({ success: true }, `Deleted tag with ID "${tagId}"`);
    }, args);
  }
}

/**
 * Get tool definition for the delete_tag tool
 * 
 * @returns Tool definition
 */
export function getDeleteTagToolDefinition(): ToolDefinition {
  return {
    name: 'delete_tag',
    description: 'Delete a tag in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        tagId: {
          type: 'string',
          description: 'ID of the tag to delete',
        },
      },
      required: ['tagId'],
    },
  };
}
