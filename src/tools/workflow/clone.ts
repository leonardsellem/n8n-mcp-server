/**
 * Clone Workflow Tool
 *
 * This tool duplicates an existing workflow with a new name.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { workflowCache } from '../../cache/workflow-cache.js';

/**
 * Handler for the clone_workflow tool
 */
export class CloneWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   *
   * @param args Tool arguments
   * @returns Cloned workflow
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId, newName } = args;

      if (!workflowId) {
        return this.formatError(
          'Missing required parameter: workflowId. Use list_workflows to find available workflow IDs.'
        );
      }

      // Get the source workflow
      const sourceWorkflow = await this.apiService.getWorkflow(workflowId);

      if (!sourceWorkflow) {
        return this.formatError(`Workflow ${workflowId} not found.`);
      }

      // Prepare the clone
      const cloneName = newName || `${sourceWorkflow.name} (Copy)`;
      const cloneData = {
        name: cloneName,
        nodes: sourceWorkflow.nodes,
        connections: sourceWorkflow.connections,
        settings: sourceWorkflow.settings,
        staticData: sourceWorkflow.staticData,
      };

      // Create the clone
      const clonedWorkflow = await this.apiService.createWorkflow(cloneData);

      // Invalidate cache
      workflowCache.invalidateAll();

      const response = {
        success: true,
        originalId: workflowId,
        originalName: sourceWorkflow.name,
        clonedWorkflow: {
          id: clonedWorkflow.id,
          name: clonedWorkflow.name,
          active: clonedWorkflow.active,
          nodeCount: clonedWorkflow.nodes?.length || 0,
        },
        hint: `Workflow cloned successfully. The clone is inactive by default. Use activate_workflow with ID "${clonedWorkflow.id}" to enable it.`,
      };

      return this.formatSuccess(response, `Workflow "${sourceWorkflow.name}" cloned as "${cloneName}"`);
    }, args);
  }
}

/**
 * Get tool definition for the clone_workflow tool
 *
 * @returns Tool definition
 */
export function getCloneWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'clone_workflow',
    description:
      'Duplicate an existing workflow with a new name. ' +
      'Creates an exact copy including all nodes, connections, and settings. ' +
      'The cloned workflow is created as inactive. ' +
      'Useful for creating variations of a workflow or backing up before modifications.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description:
            'The ID of the workflow to clone. Use list_workflows to find available IDs.',
        },
        newName: {
          type: 'string',
          description:
            'Optional name for the cloned workflow. If not provided, appends " (Copy)" to the original name.',
        },
      },
      required: ['workflowId'],
    },
  };
}
