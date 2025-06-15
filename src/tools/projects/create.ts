/**
 * Create Project Tool
 * 
 * This tool creates a new project in n8n.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the create_project tool
 */
export class CreateProjectHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing project data
   * @returns Created project information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { name, type = 'personal' } = args;
      
      if (!name) {
        throw new N8nApiError('Missing required parameter: name');
      }
      
      const projectData = {
        name,
        type
      };
      
      // Create the project using direct API call
      const response = await this.apiService.getAxiosInstance().post('/projects', projectData);
      const project = response.data;
      
      return this.formatSuccess(
        project,
        `Project "${name}" created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the create_project tool
 * 
 * @returns Tool definition
 */
export function getCreateProjectToolDefinition(): ToolDefinition {
  return {
    name: 'create_project',
    description: 'Create a new project in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the project',
        },
        type: {
          type: 'string',
          description: 'Type of project (personal or team)',
          enum: ['personal', 'team'],
          default: 'personal',
        },
      },
      required: ['name'],
    },
  };
}
