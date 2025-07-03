/**
 * Execution Formatter Utilities
 * 
 * This module provides utility functions for formatting execution data
 * in a consistent, user-friendly manner.
 */

import { Execution } from '../types/index.js';

/**
 * Format basic execution information for display
 * 
 * @param execution Execution object
 * @returns Formatted execution summary
 */
export function formatExecutionSummary(execution: Execution): Record<string, any> {
  // Calculate duration
  const startedAt = execution.startedAt ? new Date(execution.startedAt) : new Date();
  const stoppedAt = execution.stoppedAt ? new Date(execution.stoppedAt) : new Date();
  const durationMs = stoppedAt.getTime() - startedAt.getTime();
  const durationSeconds = Math.round(durationMs / 1000);
  
  // Create status indicator emoji
  const statusIndicator = getStatusIndicator(execution.status);
  
  return {
    id: execution.id,
    workflowId: execution.workflowId,
    status: `${statusIndicator} ${execution.status}`,
    startedAt: execution.startedAt,
    stoppedAt: execution.stoppedAt || 'In progress',
    duration: `${durationSeconds}s`,
    finished: execution.status === 'success' || execution.status === 'error'
  };
}

/**
 * Format detailed execution information including node results
 * 
 * @param execution Execution object
 * @returns Formatted execution details
 */
export function formatExecutionDetails(execution: Execution): Record<string, any> {
  const summary = formatExecutionSummary(execution);
  
  // Extract node results
  const nodeResults: Record<string, any> = {};
  if (execution.data?.resultData?.runData) {
    for (const [nodeName, nodeData] of Object.entries(execution.data.resultData.runData)) {
      try {
        // Get the last output
        const lastOutput = Array.isArray(nodeData) && nodeData.length > 0
          ? nodeData[nodeData.length - 1]
          : null;
          
        if (lastOutput && lastOutput.data && Array.isArray(lastOutput.data.main)) {
          // Extract the output data
          const outputData = lastOutput.data.main.length > 0 
            ? lastOutput.data.main[0]
            : [];
            
          nodeResults[nodeName] = {
            status: lastOutput.status,
            items: outputData.length,
            data: outputData.slice(0, 3), // Limit to first 3 items to avoid overwhelming response
          };
        }
      } catch (error) {
        nodeResults[nodeName] = { error: 'Failed to parse node output' };
      }
    }
  }
  
  // Add node results and error information to the summary
  return {
    ...summary,
    mode: execution.mode,
    nodeResults: nodeResults,
    // Include error information if present
    error: execution.data?.resultData && 'error' in execution.data.resultData
      ? {
          message: (execution.data.resultData as any).error?.message,
          stack: (execution.data.resultData as any).error?.stack,
        }
      : undefined,
  };
}

/**
 * Get appropriate status indicator emoji based on execution status
 * 
 * @param status Execution status string
 * @returns Status indicator emoji
 */
export function getStatusIndicator(status: string): string {
  switch (status) {
    case 'success':
      return '✅'; // Success
    case 'error':
      return '❌'; // Error
    case 'waiting':
      return '⏳'; // Waiting
    case 'canceled':
      return '🛑'; // Canceled
    default:
      return '⏱️'; // In progress or unknown
  }
}

/**
 * Summarize execution results for more compact display
 * 
 * @param executions Array of execution objects
 * @param limit Maximum number of executions to include
 * @returns Summary of execution results
 */
export function summarizeExecutions(executions: Execution[], limit: number = 10): Record<string, any> {
  const limitedExecutions = executions.slice(0, limit);
  
  // Group executions by status
  const byStatus: Record<string, number> = {};
  limitedExecutions.forEach(execution => {
    const status = execution.status || 'unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;
  });
  
  // Calculate success rate
  const totalCount = limitedExecutions.length;
  const successCount = byStatus.success || 0;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
  
  return {
    total: totalCount,
    byStatus: Object.entries(byStatus).map(([status, count]) => ({
      status: `${getStatusIndicator(status)} ${status}`,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    })),
    successRate: `${successRate}%`,
    displayed: limitedExecutions.length,
    totalAvailable: executions.length
  };
}
