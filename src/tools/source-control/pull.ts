/**
 * Pull Source Control Tool
 * 
 * This tool pulls changes from the source control repository.
 */

import { BaseSourceControlToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for the pull_source_control tool
 */
export class PullSourceControlHandler extends BaseSourceControlToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Pull operation result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { force = false } = args;
      
      // Pull changes using direct API call
      const response = await this.apiService.getAxiosInstance().post('/source-control/pull', {
        force
      });
      
      const result = response.data;
      
      return this.formatSuccess(result, 'Successfully pulled changes from source control');
    }, args);
  }
}

/**
 * Get tool definition for the pull_source_control tool
 * 
 * @returns Tool definition
 */
export function getPullSourceControlToolDefinition(): ToolDefinition {
  return {
    name: 'pull_source_control',
    description: 'Pull changes from the source control repository',
    inputSchema: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          description: 'Force pull even if there are local changes',
          default: false,
        },
      },
      required: [],
    },
  };
}

/**
 * Create and export the pull from repository tool
 */
export const pullFromRepositoryTool = {
  definition: getPullSourceControlToolDefinition(),
  handler: PullSourceControlHandler,
};
