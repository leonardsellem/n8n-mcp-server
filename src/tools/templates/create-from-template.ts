/**
 * Create Workflow From Template Tool
 *
 * This module provides functionality to instantiate workflows from templates.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from './base-handler.js';

/**
 * Handler for creating workflows from templates
 */
export class CreateWorkflowFromTemplateHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['templateId']);
      
      const { templateId, workflowName, parameters = {} } = args;

      try {
        // Get the template
        const template = await this.getTemplate(templateId);
        if (!template) {
          throw new Error(`Template with ID "${templateId}" not found`);
        }

        // Apply parameters to the template
        const workflowData = await this.applyParametersToTemplate(template, parameters);
        
        // Set workflow name
        if (workflowName) {
          workflowData.name = workflowName;
        } else {
          workflowData.name = `${template.name} - ${new Date().toISOString().split('T')[0]}`;
        }

        // Create the workflow in n8n
        const createdWorkflow = await this.apiService.createWorkflow(workflowData);

        const result = {
          success: true,
          workflow: createdWorkflow,
          template: {
            id: template.id,
            name: template.name,
            version: template.version
          },
          appliedParameters: parameters
        };

        return this.formatSuccess(result, `Successfully created workflow from template "${template.name}"`);
      } catch (error) {
        throw new Error(`Failed to create workflow from template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Get template by ID
   */
  private async getTemplate(templateId: string): Promise<any> {
    // Only check built-in templates from n8n.io
    const builtInTemplates = this.getBuiltInTemplates();
    const builtInTemplate = builtInTemplates.find(t => t.id === templateId);
    
    return builtInTemplate || null;
  }

  /**
   * Apply parameters to template workflow
   */
  private async applyParametersToTemplate(template: any, parameters: Record<string, any>): Promise<any> {
    const workflowData = JSON.parse(JSON.stringify(template.workflow));
    
    // Apply parameters to nodes
    if (template.parameters && template.parameters.length > 0) {
      workflowData.nodes = workflowData.nodes.map((node: any) => {
        let nodeParameters = { ...node.parameters };
        
        // Replace parameter placeholders in node parameters
        nodeParameters = this.replaceParameterPlaceholders(nodeParameters, parameters);
        
        return {
          ...node,
          parameters: nodeParameters
        };
      });
    }

    return workflowData;
  }

  /**
   * Replace parameter placeholders in object
   */
  private replaceParameterPlaceholders(obj: any, parameters: Record<string, any>): any {
    if (typeof obj === 'string') {
      // Replace {{parameterName}} placeholders
      return obj.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
        return parameters[paramName] !== undefined ? parameters[paramName] : match;
      });
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.replaceParameterPlaceholders(item, parameters));
    } else if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceParameterPlaceholders(value, parameters);
      }
      return result;
    }
    
    return obj;
  }

}

/**
 * Get the tool definition for creating workflows from templates
 */
export function getCreateWorkflowFromTemplateToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow_from_template',
    description: 'Instantiate a new workflow from a template with customizable parameters',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          description: 'ID of the template to use'
        },
        workflowName: {
          type: 'string',
          description: 'Name for the new workflow (optional, will auto-generate if not provided)'
        },
        parameters: {
          type: 'object',
          description: 'Parameters to customize the template (key-value pairs)',
          additionalProperties: true
        }
      },
      required: ['templateId']
    }
  };
}