/**
 * Workflow Tools Module
 * 
 * This module provides MCP tools for interacting with n8n workflows.
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
import { getExecuteWorkflowToolDefinition, ExecuteWorkflowHandler } from './execute.js';
import { getRepairWorkflowTriggersToolDefinition, RepairWorkflowTriggersHandler } from './repair-triggers.js';
import { getRepairWorkflowToolDefinition, RepairWorkflowHandler } from './repair-workflow.js';

// Import enhanced workflow tools
import {
  CreateSmartWorkflowHandler,
  AddNodeToWorkflowHandler,
  OptimizeWorkflowHandler,
  CloneWorkflowHandler,
  getCreateSmartWorkflowToolDefinition,
  getAddNodeToWorkflowToolDefinition,
  getOptimizeWorkflowToolDefinition,
  getCloneWorkflowToolDefinition,
} from './enhanced-workflow.js';

// Export handlers
export {
  ListWorkflowsHandler,
  GetWorkflowHandler,
  CreateWorkflowHandler,
  UpdateWorkflowHandler,
  DeleteWorkflowHandler,
  ActivateWorkflowHandler,
  DeactivateWorkflowHandler,
  ExecuteWorkflowHandler,
  RepairWorkflowTriggersHandler,
  RepairWorkflowHandler,
  CreateSmartWorkflowHandler,
  AddNodeToWorkflowHandler,
  OptimizeWorkflowHandler,
  CloneWorkflowHandler,
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
    getExecuteWorkflowToolDefinition(),
    getRepairWorkflowTriggersToolDefinition(),
    getRepairWorkflowToolDefinition(),
    getCreateSmartWorkflowToolDefinition(),
    getAddNodeToWorkflowToolDefinition(),
    getOptimizeWorkflowToolDefinition(),
    getCloneWorkflowToolDefinition(),
  ];
}
