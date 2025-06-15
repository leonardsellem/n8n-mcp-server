/**
 * Environment Management Tools Module
 * 
 * This module provides MCP tools for managing multiple n8n instances and environments.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import { getListEnvironmentsToolDefinition, ListEnvironmentsHandler } from './list-environments.js';
import { getDeployWorkflowToEnvironmentToolDefinition, DeployWorkflowToEnvironmentHandler } from './deploy-workflow.js';
import { getCompareEnvironmentsToolDefinition, CompareEnvironmentsHandler } from './compare-environments.js';
import { getSyncWorkflowsToolDefinition, SyncWorkflowsHandler } from './sync-workflows.js';

// Export handlers
export {
  ListEnvironmentsHandler,
  DeployWorkflowToEnvironmentHandler,
  CompareEnvironmentsHandler,
  SyncWorkflowsHandler,
};

/**
 * Set up environment management tools
 *
 * @returns Array of environment tool definitions
 */
export async function setupEnvironmentTools(): Promise<ToolDefinition[]> {
  return [
    getListEnvironmentsToolDefinition(),
    getDeployWorkflowToEnvironmentToolDefinition(),
    getCompareEnvironmentsToolDefinition(),
    getSyncWorkflowsToolDefinition(),
  ];
}