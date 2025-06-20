/**
 * Get Project Tool
 * 
 * This tool retrieves a single project by ID.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the get_project tool
 */
export class GetProjectHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing project ID
   * @returns Project information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { projectId } = args;
      
      if (!projectId) {
        throw new N8nApiError('Missing required parameter: projectId');
      }
      
      // Get the project using direct API call
      const response = await this.apiService.getAxiosInstance().get(`/projects/${projectId}`);
      const project = response.data;
      
      return this.formatSuccess(project, `Retrieved project "${project.name || projectId}"`);
    }, args);
  }
}

/**
 * Get tool definition for the get_project tool
 * 
 * @returns Tool definition
 */
export function getGetProjectToolDefinition(): ToolDefinition {
  return {
    name: 'get_project',
    description: 'Retrieve a specific project by ID',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'ID of the project to retrieve',
        },
      },
      required: ['projectId'],
    },
  };
}
