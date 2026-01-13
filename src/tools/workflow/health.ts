/**
 * Health Check Tool
 *
 * This tool checks n8n API connectivity and provides system status.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Handler for the health_check tool
 */
export class HealthCheckHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns Health check results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    const startTime = Date.now();
    const config = getEnvConfig();

    try {
      // Test API connectivity
      await this.apiService.checkConnectivity();
      const latencyMs = Date.now() - startTime;

      // Get workflow count for status
      const workflows = await this.apiService.getWorkflows();
      const activeCount = workflows.filter((w: any) => w.active).length;

      // Get cache stats
      const cacheStats = workflowCache.getStats();

      const response = {
        success: true,
        status: 'healthy',
        apiUrl: config.n8nApiUrl,
        latencyMs,
        workflows: {
          total: workflows.length,
          active: activeCount,
          inactive: workflows.length - activeCount,
        },
        cache: {
          hitRate: cacheStats.hitRate,
          hits: cacheStats.hits,
          misses: cacheStats.misses,
        },
        hint: 'n8n API is reachable and responding correctly.',
      };

      return this.formatSuccess(response, 'Health check passed');
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      const response = {
        success: false,
        status: 'unhealthy',
        apiUrl: config.n8nApiUrl,
        latencyMs,
        error: errorMessage,
        hint: 'Check that n8n is running and the API key is valid. Verify N8N_API_URL and N8N_API_KEY environment variables.',
      };

      return this.formatSuccess(response, 'Health check failed');
    }
  }
}

/**
 * Get tool definition for the health_check tool
 *
 * @returns Tool definition
 */
export function getHealthCheckToolDefinition(): ToolDefinition {
  return {
    name: 'health_check',
    description:
      'Check n8n API connectivity and system health. ' +
      'Returns API latency, workflow counts, and cache statistics. ' +
      'Use this to verify the connection before running workflows or to debug connection issues.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  };
}
