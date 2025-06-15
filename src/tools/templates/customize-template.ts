/**
 * Customize Template Tool
 *
 * This module provides functionality to modify templates with parameters before creation.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from './base-handler.js';

/**
 * Handler for customizing templates
 */
export class CustomizeTemplateHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['templateId']);
      
      const { templateId, customizations = {} } = args;

      try {
        // Get the template
        const template = await this.getTemplate(templateId);
        if (!template) {
          throw new Error(`Template with ID "${templateId}" not found`);
        }

        // Apply customizations to create a preview
        const customizedTemplate = await this.applyCustomizations(template, customizations);

        // Generate preview information
        const preview = this.generatePreview(customizedTemplate);

        const result = {
          success: true,
          originalTemplate: {
            id: template.id,
            name: template.name,
            version: template.version
          },
          customizedTemplate: {
            name: customizedTemplate.name,
            description: customizedTemplate.description,
            nodes: customizedTemplate.workflow.nodes.map((node: any) => ({
              id: node.id,
              name: node.name,
              type: node.type,
              parameters: node.parameters
            })),
            connections: customizedTemplate.workflow.connections
          },
          preview,
          appliedCustomizations: customizations
        };

        return this.formatSuccess(result, `Template "${template.name}" customized successfully`);
      } catch (error) {
        throw new Error(`Failed to customize template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Get template by ID (same as in create-from-template.ts)
   */
  private async getTemplate(templateId: string): Promise<any> {
    const builtInTemplates = this.getCustomBuiltInTemplates();
    return builtInTemplates.find(t => t.id === templateId) || null;
  }

  /**
   * Apply customizations to template
   */
  private async applyCustomizations(template: any, customizations: Record<string, any>): Promise<any> {
    const customizedTemplate = JSON.parse(JSON.stringify(template));

    // Apply name customization
    if (customizations.name) {
      customizedTemplate.name = customizations.name;
    }

    // Apply description customization
    if (customizations.description) {
      customizedTemplate.description = customizations.description;
    }

    // Apply parameter defaults
    if (customizations.parameters) {
      customizedTemplate.workflow = this.applyParametersToWorkflow(
        customizedTemplate.workflow,
        customizations.parameters
      );
    }

    // Apply node customizations
    if (customizations.nodes) {
      customizedTemplate.workflow.nodes = customizedTemplate.workflow.nodes.map((node: any) => {
        const nodeCustomization = customizations.nodes[node.name] || customizations.nodes[node.id];
        if (nodeCustomization) {
          return {
            ...node,
            name: nodeCustomization.name || node.name,
            parameters: {
              ...node.parameters,
              ...nodeCustomization.parameters
            }
          };
        }
        return node;
      });
    }

    // Apply workflow settings customizations
    if (customizations.settings) {
      customizedTemplate.workflow.settings = {
        ...customizedTemplate.workflow.settings,
        ...customizations.settings
      };
    }

    return customizedTemplate;
  }

  /**
   * Apply parameters to workflow
   */
  private applyParametersToWorkflow(workflow: any, parameters: Record<string, any>): any {
    const workflowCopy = JSON.parse(JSON.stringify(workflow));
    
    workflowCopy.nodes = workflowCopy.nodes.map((node: any) => {
      let nodeParameters = { ...node.parameters };
      nodeParameters = this.replaceParameterPlaceholders(nodeParameters, parameters);
      return {
        ...node,
        parameters: nodeParameters
      };
    });

    return workflowCopy;
  }

  /**
   * Replace parameter placeholders in object
   */
  private replaceParameterPlaceholders(obj: any, parameters: Record<string, any>): any {
    if (typeof obj === 'string') {
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

  /**
   * Generate preview information
   */
  private generatePreview(template: any): any {
    const workflow = template.workflow;
    
    return {
      nodeCount: workflow.nodes.length,
      connectionCount: Object.keys(workflow.connections).length,
      triggerNodes: workflow.nodes.filter((node: any) => 
        node.type.includes('trigger') || node.type.includes('webhook')
      ).map((node: any) => ({
        name: node.name,
        type: node.type
      })),
      actionNodes: workflow.nodes.filter((node: any) => 
        !node.type.includes('trigger') && !node.type.includes('webhook')
      ).map((node: any) => ({
        name: node.name,
        type: node.type
      })),
      estimatedComplexity: this.calculateComplexity(workflow),
      requiredCredentials: this.extractRequiredCredentials(workflow)
    };
  }

  /**
   * Calculate workflow complexity
   */
  private calculateComplexity(workflow: any): string {
    const nodeCount = workflow.nodes.length;
    const connectionCount = Object.keys(workflow.connections).length;
    const complexity = nodeCount + connectionCount;

    if (complexity <= 5) return 'Simple';
    if (complexity <= 15) return 'Medium';
    return 'Complex';
  }

  /**
   * Extract required credentials from workflow
   */
  private extractRequiredCredentials(workflow: any): string[] {
    const credentials = new Set<string>();
    
    workflow.nodes.forEach((node: any) => {
      if (node.credentials) {
        Object.keys(node.credentials).forEach(credType => {
          credentials.add(credType);
        });
      }
    });

    return Array.from(credentials);
  }

  /**
   * Get built-in templates
   */
  private getCustomBuiltInTemplates(): any[] {
    return [
      {
        id: 'webhook-email-notification',
        name: 'Webhook to Email Notification',
        description: 'Receive webhook data and send email notifications',
        category: 'communication',
        version: '1.0.0',
        parameters: [
          { name: 'emailRecipient', type: 'string', description: 'Email recipient address' },
          { name: 'emailSubject', type: 'string', description: 'Email subject line' }
        ],
        workflow: {
          name: 'Webhook to Email',
          nodes: [
            {
              id: 'webhook',
              type: 'n8n-nodes-base.webhook',
              name: 'Webhook',
              parameters: {
                path: 'webhook-data',
                httpMethod: 'POST'
              },
              position: [240, 300]
            },
            {
              id: 'email',
              type: 'n8n-nodes-base.emailSend',
              name: 'Send Email',
              parameters: {
                subject: '{{emailSubject}}',
                text: '={{ JSON.stringify($json, null, 2) }}',
                toEmail: '{{emailRecipient}}'
              },
              position: [460, 300]
            }
          ],
          connections: {
            'Webhook': {
              main: [
                [
                  {
                    node: 'Send Email',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          },
          settings: {
            saveExecutionProgress: true,
            saveManualExecutions: true
          }
        }
      }
    ];
  }
}

/**
 * Get the tool definition for customizing templates
 */
export function getCustomizeTemplateToolDefinition(): ToolDefinition {
  return {
    name: 'customize_template',
    description: 'Modify templates with parameters and customizations before creation, providing a preview of changes',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          description: 'ID of the template to customize'
        },
        customizations: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Custom name for the template'
            },
            description: {
              type: 'string',
              description: 'Custom description for the template'
            },
            parameters: {
              type: 'object',
              description: 'Parameter values to apply to the template',
              additionalProperties: true
            },
            nodes: {
              type: 'object',
              description: 'Node-specific customizations (key: node name/id, value: customization object)',
              additionalProperties: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  parameters: { type: 'object' }
                }
              }
            },
            settings: {
              type: 'object',
              description: 'Workflow settings customizations',
              additionalProperties: true
            }
          }
        }
      },
      required: ['templateId']
    }
  };
}