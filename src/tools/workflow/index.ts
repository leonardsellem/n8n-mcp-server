/**
 * Workflow Tools Module
 *
 * This module provides MCP tools for interacting with n8n workflows.
 * Enhanced with search, clone, and health check capabilities.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions
import { getListWorkflowsToolDefinition, ListWorkflowsHandler } from './list.js';
import { getGetWorkflowToolDefinition, GetWorkflowHandler } from './get.js';
import { getCreateWorkflowToolDefinition, CreateWorkflowHandler } from './create.js';
import { getUpdateWorkflowToolDefinition, UpdateWorkflowHandler } from './update.js';
import { getDeleteWorkflowToolDefinition, DeleteWorkflowHandler } from './delete.js';
import { getActivateWorkflowToolDefinition, ActivateWorkflowHandler } from './activate.js';
import { getDeactivateWorkflowToolDefinition, DeactivateWorkflowHandler } from './deactivate.js';
// New enhanced tools
import { getSearchWorkflowsToolDefinition, SearchWorkflowsHandler } from './search.js';
import { getCloneWorkflowToolDefinition, CloneWorkflowHandler } from './clone.js';
import { getHealthCheckToolDefinition, HealthCheckHandler } from './health.js';

// Export handlers
export {
  ListWorkflowsHandler,
  GetWorkflowHandler,
  CreateWorkflowHandler,
  UpdateWorkflowHandler,
  DeleteWorkflowHandler,
  ActivateWorkflowHandler,
  DeactivateWorkflowHandler,
  // New handlers
  SearchWorkflowsHandler,
  CloneWorkflowHandler,
  HealthCheckHandler,
};

/**
 * Set up workflow management tools
 *
 * @returns Array of workflow tool definitions
 */
export async function setupWorkflowTools(): Promise<ToolDefinition[]> {
  return [
    getListWorkflowsToolDefinition(),
    getGetWorkflowToolDefinition(),
    getCreateWorkflowToolDefinition(),
    getUpdateWorkflowToolDefinition(),
    getDeleteWorkflowToolDefinition(),
    getActivateWorkflowToolDefinition(),
    getDeactivateWorkflowToolDefinition(),
    // New enhanced tools
    getSearchWorkflowsToolDefinition(),
    getCloneWorkflowToolDefinition(),
    getHealthCheckToolDefinition(),
  ];
}
