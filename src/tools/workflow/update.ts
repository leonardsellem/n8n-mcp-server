/**
 * Update Workflow Tool
 * 
 * This tool updates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the update_workflow tool
 */
export class UpdateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow updates
   * @returns Updated workflow information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, name, nodes, connections, active, tags } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Validate nodes if provided
      if (nodes && !Array.isArray(nodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }
      
      // Validate connections if provided
      if (connections && typeof connections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }
      
      // Get the current workflow to update
      const currentWorkflow = await this.apiService.getWorkflow(workflowId);
      
      // Strip settings properties not accepted by the n8n public API v1 PUT schema.
      // The GET response returns the full IWorkflowSettings (from n8n-workflow), but the
      // PUT endpoint uses an OpenAPI schema with additionalProperties: false that only
      // allows a subset of fields. Internal fields present in GET but absent from the
      // OpenAPI spec cause: "request/body/settings must NOT have additional properties"
      // See: n8n/packages/cli/src/public-api/v1/handlers/workflows/spec/schemas/workflowSettings.yml
      const rejectedSettingsKeys = ['binaryMode', 'timeSavedMode', 'credentialResolverId', 'redactionPolicy'];
      const filteredSettings = { ...currentWorkflow.settings };
      for (const key of rejectedSettingsKeys) {
        delete filteredSettings[key];
      }

      // Prepare update object with only allowed properties (per n8n API schema)
      const workflowData: Record<string, any> = {
        name: name !== undefined ? name : currentWorkflow.name,
        nodes: nodes !== undefined ? nodes : currentWorkflow.nodes,
        connections: connections !== undefined ? connections : currentWorkflow.connections,
        settings: filteredSettings
      };
      
      // Add optional staticData if it exists
      if (currentWorkflow.staticData !== undefined) {
        workflowData.staticData = currentWorkflow.staticData;
      }
      
      // Note: active and tags are read-only properties and cannot be updated via this endpoint
      
      // Update the workflow
      const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, workflowData);
      
      // Build a summary of changes
      const changesArray = [];
      if (name !== undefined && name !== currentWorkflow.name) changesArray.push(`name: "${currentWorkflow.name}" → "${name}"`);
      if (nodes !== undefined) changesArray.push('nodes updated');
      if (connections !== undefined) changesArray.push('connections updated');
      
      // Add warnings for read-only properties
      const warnings = [];
      if (active !== undefined) warnings.push('active (read-only, use activate/deactivate workflow tools)');
      if (tags !== undefined) warnings.push('tags (read-only property)');
      
      const changesSummary = changesArray.length > 0
        ? `Changes: ${changesArray.join(', ')}`
        : 'No changes were made';
      
      const warningsSummary = warnings.length > 0
        ? ` Note: Ignored ${warnings.join(', ')}.`
        : '';
      
      return this.formatSuccess(
        {
          id: updatedWorkflow.id,
          name: updatedWorkflow.name,
          active: updatedWorkflow.active
        },
        `Workflow updated successfully. ${changesSummary}${warningsSummary}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the update_workflow tool
 * 
 * @returns Tool definition
 */
export function getUpdateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'update_workflow',
    description: 'Update an existing workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to update',
        },
        name: {
          type: 'string',
          description: 'New name for the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Updated array of node objects that define the workflow',
          items: {
            type: 'object',
          },
        },
        connections: {
          type: 'object',
          description: 'Updated connection mappings between nodes',
        },
        active: {
          type: 'boolean',
          description: 'Whether the workflow should be active (read-only: use activate/deactivate workflow tools instead)',
        },
        tags: {
          type: 'array',
          description: 'Tags to associate with the workflow (read-only: cannot be updated via this endpoint)',
          items: {
            type: 'string',
          },
        },
      },
      required: ['workflowId'],
    },
  };
}
