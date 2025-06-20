/**
 * List Environments Tool
 *
 * This module provides functionality to manage multiple n8n instances.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseEnvironmentToolHandler } from './base-handler.js';

/**
 * Handler for listing environments
 */
export class ListEnvironmentsHandler extends BaseEnvironmentToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { includeStatus = true } = args;

      try {
        const environments = this.getAllEnvironments();
        
        const envData = await Promise.all(
          environments.map(async (env) => {
            const baseInfo = {
              name: env.name,
              type: env.type,
              url: env.url,
              description: env.description
            };

            if (includeStatus) {
              const isConnected = await this.testEnvironmentConnection(env.name);
              return {
                ...baseInfo,
                status: isConnected ? 'connected' : 'disconnected'
              };
            }

            return {
              ...baseInfo,
              status: undefined
            };
          })
        );

        const result = {
          environments: envData,
          total: envData.length,
          connected: includeStatus ? envData.filter((e: any) => e.status === 'connected').length : null
        };

        return this.formatSuccess(result, `Found ${environments.length} configured environments`);
      } catch (error) {
        throw new Error(`Failed to list environments: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }
}

/**
 * Get the tool definition for listing environments
 */
export function getListEnvironmentsToolDefinition(): ToolDefinition {
  return {
    name: 'list_environments',
    description: 'List all configured n8n environments (dev/staging/prod) with their status',
    inputSchema: {
      type: 'object',
      properties: {
        includeStatus: {
          type: 'boolean',
          description: 'Whether to include connection status for each environment',
          default: true
        }
      }
    }
  };
}