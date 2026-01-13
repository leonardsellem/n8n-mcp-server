/**
 * Get Execution Details Tool
 *
 * This tool retrieves detailed execution information including
 * node-by-node data, timing, and error details.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface NodeExecution {
  nodeName: string;
  nodeType: string;
  status: 'success' | 'error' | 'waiting' | 'unknown';
  startTime?: string;
  endTime?: string;
  durationMs?: number;
  inputItemCount?: number;
  outputItemCount?: number;
  error?: {
    message: string;
    description?: string;
  };
  outputData?: any;
}

/**
 * Handler for the get_execution_details tool
 */
export class GetExecutionDetailsHandler extends BaseExecutionToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns Detailed execution information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { executionId, includeData = false } = args;

      if (!executionId) {
        return this.formatError(
          'Missing required parameter: executionId. Use list_executions to find available execution IDs.'
        );
      }

      const execution = await this.apiService.getExecution(executionId);

      if (!execution) {
        return this.formatError(`Execution ${executionId} not found.`);
      }

      // Parse node-by-node execution data
      const nodeExecutions: NodeExecution[] = [];
      const runData = execution.data?.resultData?.runData || {};

      for (const [nodeName, nodeRuns] of Object.entries(runData)) {
        const runs = nodeRuns as any[];
        if (!runs || runs.length === 0) continue;

        const lastRun = runs[runs.length - 1];
        const nodeExec: NodeExecution = {
          nodeName,
          nodeType: lastRun.source?.[0]?.previousNode || 'unknown',
          status: lastRun.error ? 'error' : 'success',
          startTime: lastRun.startTime,
          endTime: lastRun.executionTime ? undefined : lastRun.startTime,
          durationMs: lastRun.executionTime,
          inputItemCount: lastRun.inputData?.main?.[0]?.length || 0,
          outputItemCount: lastRun.data?.main?.[0]?.length || 0,
        };

        if (lastRun.error) {
          nodeExec.error = {
            message: lastRun.error.message || 'Unknown error',
            description: lastRun.error.description,
          };
        }

        if (includeData && lastRun.data?.main?.[0]) {
          // Limit data to first 5 items to avoid huge responses
          nodeExec.outputData = lastRun.data.main[0].slice(0, 5);
        }

        nodeExecutions.push(nodeExec);
      }

      // Find failed nodes
      const failedNodes = nodeExecutions.filter(n => n.status === 'error');
      const successNodes = nodeExecutions.filter(n => n.status === 'success');

      // Calculate total duration
      const totalDurationMs = nodeExecutions.reduce(
        (sum, n) => sum + (n.durationMs || 0),
        0
      );

      // Build response
      const response = {
        success: true,
        executionId: execution.id,
        workflowId: execution.workflowId,
        workflowName: execution.workflowData?.name || 'Unknown',
        status: execution.status || (execution.finished ? 'success' : 'running'),
        mode: execution.mode,
        startedAt: execution.startedAt,
        finishedAt: execution.stoppedAt,
        totalDurationMs,
        summary: {
          totalNodes: nodeExecutions.length,
          successNodes: successNodes.length,
          failedNodes: failedNodes.length,
        },
        nodes: nodeExecutions,
        hint: failedNodes.length > 0
          ? `${failedNodes.length} node(s) failed: ${failedNodes.map(n => n.nodeName).join(', ')}. Check error details above.`
          : 'All nodes executed successfully.',
      };

      return this.formatSuccess(response);
    }, args);
  }
}

/**
 * Get tool definition for the get_execution_details tool
 *
 * @returns Tool definition
 */
export function getGetExecutionDetailsToolDefinition(): ToolDefinition {
  return {
    name: 'get_execution_details',
    description:
      'Get detailed execution information including node-by-node data, timing, and errors. ' +
      'Use this to debug failed executions or understand workflow performance. ' +
      'Shows which nodes ran, how long each took, and any error messages. ' +
      'More detailed than get_execution - use this for troubleshooting.',
    inputSchema: {
      type: 'object',
      properties: {
        executionId: {
          type: 'string',
          description:
            'The execution ID to get details for. Use list_executions to find available IDs.',
        },
        includeData: {
          type: 'boolean',
          description:
            'Include output data from each node (first 5 items). Default: false. Set to true for debugging.',
        },
      },
      required: ['executionId'],
    },
  };
}
