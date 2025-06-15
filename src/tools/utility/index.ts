/**
 * Utility Tools Module
 * 
 * This module exports all utility tools and their definitions.
 */

import { ToolDefinition } from '../../types/index.js';

// Import all utility tool handlers and definitions
export {
  BulkWorkflowOperationsHandler,
  AdvancedWorkflowSearchHandler,
  WorkflowAnalyticsHandler
} from './bulk-operations.js';

export {
  getBulkWorkflowOperationsToolDefinition,
  getAdvancedWorkflowSearchToolDefinition,
  getWorkflowAnalyticsToolDefinition
} from './bulk-operations.js';

/**
 * Set up all utility tools
 * 
 * @returns Array of utility tool definitions
 */
export async function setupUtilityTools(): Promise<ToolDefinition[]> {
  const { 
    getBulkWorkflowOperationsToolDefinition,
    getAdvancedWorkflowSearchToolDefinition,
    getWorkflowAnalyticsToolDefinition
  } = await import('./bulk-operations.js');

  return [
    getBulkWorkflowOperationsToolDefinition(),
    getAdvancedWorkflowSearchToolDefinition(),
    getWorkflowAnalyticsToolDefinition()
  ];
}