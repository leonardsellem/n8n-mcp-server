/**
 * Delete Project Tool
 * 
 * This tool deletes a project from n8n.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the delete_project tool
 */
export class DeleteProjectHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing project ID
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { projectId } = args;
      
      if (!projectId) {
        throw new N8nApiError('Missing required parameter: projectId');
      }
      
      // Delete the project using direct API call
      await this.apiService.getAxiosInstance().delete(`/projects/${projectId}`);
      
      return this.formatSuccess(
        { projectId, deleted: true },
        `Project ${projectId} deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the delete_project tool
 * 
 * @returns Tool definition
 */
export function getDeleteProjectToolDefinition(): ToolDefinition {
  return {
    name: 'delete_project',
    description: 'Delete a project from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'ID of the project to delete',
        },
      },
      required: ['projectId'],
    },
  };
}
