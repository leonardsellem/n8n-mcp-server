/**
 * List Projects Tool
 * 
 * This tool lists all projects in n8n.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the list_projects tool
 */
export class ListProjectsHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (optional filters)
   * @returns List of projects
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { includePersonal = true, includeTeam = true } = args;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (!includePersonal) queryParams.append('includePersonal', 'false');
      if (!includeTeam) queryParams.append('includeTeam', 'false');
      
      const url = `/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      // Get projects using direct API call
      const response = await this.apiService.getAxiosInstance().get(url);
      const projects = response.data.data || response.data || [];
      
      return this.formatSuccess({
        projects,
        count: projects.length,
        message: `Found ${projects.length} projects`
      });
    }, args);
  }
}

/**
 * Get tool definition for the list_projects tool
 * 
 * @returns Tool definition
 */
export function getListProjectsToolDefinition(): ToolDefinition {
  return {
    name: 'list_projects',
    description: 'List all projects in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        includePersonal: {
          type: 'boolean',
          description: 'Include personal projects in the list',
          default: true,
        },
        includeTeam: {
          type: 'boolean',
          description: 'Include team projects in the list',
          default: true,
        },
      },
      required: [],
    },
  };
}
