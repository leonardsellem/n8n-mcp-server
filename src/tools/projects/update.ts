/**
 * Update Project Tool
 * 
 * This tool updates an existing project in n8n.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_project tool
 */
export class UpdateProjectHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing project ID and update data
   * @returns Updated project information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { projectId, name, description } = args;
      
      if (!projectId) {
        throw new N8nApiError('Missing required parameter: projectId');
      }
      
      // Build update data
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      
      if (Object.keys(updateData).length === 0) {
        throw new N8nApiError('At least one field (name, description) must be provided for update');
      }
      
      // Update the project using direct API call
      const response = await this.apiService.getAxiosInstance().patch(`/projects/${projectId}`, updateData);
      const project = response.data;
      
      return this.formatSuccess(project, `Updated project "${project.name || projectId}"`);
    }, args);
  }
}

/**
 * Get tool definition for the update_project tool
 * 
 * @returns Tool definition
 */
export function getUpdateProjectToolDefinition(): ToolDefinition {
  return {
    name: 'update_project',
    description: 'Update an existing project in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'ID of the project to update',
        },
        name: {
          type: 'string',
          description: 'New name for the project',
        },
        description: {
          type: 'string',
          description: 'New description for the project',
        },
      },
      required: ['projectId'],
    },
  };
}
