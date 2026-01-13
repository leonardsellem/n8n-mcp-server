/**
 * Execution Tools Module
 *
 * This module provides MCP tools for interacting with n8n workflow executions.
 * Enhanced with execute_workflow and detailed execution info.
 */

import { ToolDefinition } from '../../types/index.js';
import { getListExecutionsToolDefinition } from './list.js';
import { getGetExecutionToolDefinition } from './get.js';
import { getDeleteExecutionToolDefinition } from './delete.js';
import { getRunWebhookToolDefinition } from './run.js';
// New enhanced tools
import { getExecuteWorkflowToolDefinition } from './execute.js';
import { getGetExecutionDetailsToolDefinition } from './details.js';

/**
 * Set up execution management tools
 *
 * @returns Array of execution tool definitions
 */
export async function setupExecutionTools(): Promise<ToolDefinition[]> {
  return [
    getListExecutionsToolDefinition(),
    getGetExecutionToolDefinition(),
    getDeleteExecutionToolDefinition(),
    getRunWebhookToolDefinition(),
    // New enhanced tools
    getExecuteWorkflowToolDefinition(),
    getGetExecutionDetailsToolDefinition(),
  ];
}

// Export execution tool handlers for use in the handler
export { ListExecutionsHandler } from './list.js';
export { GetExecutionHandler } from './get.js';
export { DeleteExecutionHandler } from './delete.js';
export { RunWebhookHandler } from './run.js';
// New handlers
export { ExecuteWorkflowHandler } from './execute.js';
export { GetExecutionDetailsHandler } from './details.js';
