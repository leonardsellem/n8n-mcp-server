/**
 * Resource Formatter Utilities
 * 
 * This module provides utility functions for formatting resource data
 * in a consistent, user-friendly manner for MCP resources.
 */

import { Workflow, Execution } from '../types/index.js';
import { formatExecutionSummary, summarizeExecutions } from './execution-formatter.js';

/**
 * Format workflow summary for static resource listing
 * 
 * @param workflow Workflow object
 * @returns Formatted workflow summary
 */
export function formatWorkflowSummary(workflow: Workflow): Record<string, any> {
  return {
    id: workflow.id,
    name: workflow.name,
    active: workflow.active,
    status: workflow.active ? '🟢 Active' : '⚪ Inactive',
    updatedAt: workflow.updatedAt,
    createdAt: workflow.createdAt,
  };
}

/**
 * Format detailed workflow information for dynamic resources
 * 
 * @param workflow Workflow object
 * @returns Formatted workflow details
 */
export function formatWorkflowDetails(workflow: Workflow): Record<string, any> {
  const summary = formatWorkflowSummary(workflow);
  
  // Add additional details
  return {
    ...summary,
    nodes: workflow.nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      parameters: node.parameters,
    })),
    connections: workflow.connections,
    staticData: workflow.staticData,
    settings: workflow.settings,
    tags: workflow.tags,
    // Exclude potentially sensitive or unnecessary information
    // like pinData or other internal fields
  };
}

/**
 * Format execution statistics summary
 * 
 * @param executions Array of execution objects
 * @returns Formatted execution statistics
 */
export function formatExecutionStats(executions: Execution[]): Record<string, any> {
  // Group executions by status
  const statusCounts: Record<string, number> = {};
  executions.forEach(execution => {
    const status = execution.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  // Calculate success rate
  const totalCount = executions.length;
  const successCount = statusCounts.success || 0;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
  
  // Calculate average execution time
  let totalDuration = 0;
  let completedCount = 0;
  
  executions.forEach(execution => {
    if (execution.startedAt && execution.stoppedAt) {
      const startedAt = new Date(execution.startedAt);
      const stoppedAt = new Date(execution.stoppedAt);
      const durationMs = stoppedAt.getTime() - startedAt.getTime();
      
      totalDuration += durationMs;
      completedCount++;
    }
  });
  
  const avgDurationMs = completedCount > 0 ? Math.round(totalDuration / completedCount) : 0;
  const avgDurationSec = Math.round(avgDurationMs / 1000);
  
  // Group executions by workflow
  const workflowExecutions: Record<string, number> = {};
  executions.forEach(execution => {
    const workflowId = execution.workflowId;
    workflowExecutions[workflowId] = (workflowExecutions[workflowId] || 0) + 1;
  });
  
  // Get top workflows by execution count
  const topWorkflows = Object.entries(workflowExecutions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([workflowId, count]) => ({
      workflowId,
      executionCount: count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    }));
  
  return {
    total: totalCount,
    byStatus: Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    })),
    successRate: `${successRate}%`,
    averageExecutionTime: completedCount > 0 ? `${avgDurationSec}s` : 'N/A',
    recentTrend: {
      // Recent executions trend - last 24 hours vs previous 24 hours
      // This is a placeholder - would need timestamp filtering logic
      changePercent: '0%',
      description: 'Stable execution rate'
    },
    topWorkflows: topWorkflows,
    timeUpdated: new Date().toISOString()
  };
}

/**
 * Format resource URI for n8n resources
 * 
 * @param resourceType Type of resource (workflow or execution)
 * @param id Optional resource ID for specific resources
 * @returns Formatted resource URI
 */
export function formatResourceUri(
  resourceType: 'workflow' | 'execution' | 'workflows' | 'execution-stats',
  id?: string,
): string {
  if (id) {
    const base = ['workflow', 'execution'].includes(resourceType)
      ? `${resourceType}s`
      : resourceType;
    return `n8n://${base}/${id}`;
  }
  return `n8n://${resourceType}`;
}
