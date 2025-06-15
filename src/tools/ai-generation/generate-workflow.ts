/**
 * Generate Workflow From Description Tool
 *
 * This module provides functionality to create workflows from natural language descriptions.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from '../templates/base-handler.js';

/**
 * Analysis result from description parsing
 */
export interface DescriptionAnalysis {
  triggers: string[];
  actions: string[];
  nodeTypes: string[];
  complexity: 'simple' | 'medium' | 'complex';
  description: string;
}

/**
 * Workflow generation result
 */
export interface GeneratedWorkflow {
  name: string;
  nodes: any[];
  connections: any;
  settings: any;
  staticData: any;
}

/**
 * Handler for generating workflows from descriptions
 */
export class GenerateWorkflowFromDescriptionHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['description']);
      
      const { description, name, category = 'ai-generated' } = args;

      try {
        // Analyze the description to determine workflow requirements
        const analysis = this.analyzeDescription(description);
        
        // Generate workflow based on analysis
        const workflow = this.generateWorkflowFromAnalysis(analysis, name);
        
        // Create the workflow in n8n
        const createdWorkflow = await this.apiService.createWorkflow(workflow);

        const result = {
          success: true,
          workflow: createdWorkflow,
          analysis: {
            detectedTriggers: analysis.triggers,
            detectedActions: analysis.actions,
            suggestedNodes: analysis.nodeTypes,
            complexity: analysis.complexity
          },
          description: description
        };

        return this.formatSuccess(result, `Successfully generated workflow from description`);
      } catch (error) {
        throw new Error(`Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Analyze description to determine workflow requirements
   */
  private analyzeDescription(description: string): any {
    const descLower = description.toLowerCase();
    
    // Detect triggers
    const triggers = [];
    if (descLower.includes('webhook') || descLower.includes('http request') || descLower.includes('api call')) {
      triggers.push('webhook');
    }
    if (descLower.includes('schedule') || descLower.includes('daily') || descLower.includes('hourly') || descLower.includes('cron')) {
      triggers.push('schedule');
    }
    if (descLower.includes('email') && (descLower.includes('receive') || descLower.includes('incoming'))) {
      triggers.push('emailTrigger');
    }
    if (descLower.includes('file') && (descLower.includes('upload') || descLower.includes('watch') || descLower.includes('monitor'))) {
      triggers.push('fileTrigger');
    }

    // Default to webhook if no trigger detected
    if (triggers.length === 0) {
      triggers.push('webhook');
    }

    // Detect actions
    const actions = [];
    if (descLower.includes('email') && (descLower.includes('send') || descLower.includes('notify'))) {
      actions.push('emailSend');
    }
    if (descLower.includes('slack') || descLower.includes('discord') || descLower.includes('teams')) {
      actions.push('chat');
    }
    if (descLower.includes('database') || descLower.includes('sql') || descLower.includes('postgres') || descLower.includes('mysql')) {
      actions.push('database');
    }
    if (descLower.includes('api') && (descLower.includes('send') || descLower.includes('post') || descLower.includes('put'))) {
      actions.push('httpRequest');
    }
    if (descLower.includes('transform') || descLower.includes('process') || descLower.includes('format')) {
      actions.push('function');
    }
    if (descLower.includes('save') || descLower.includes('store') || descLower.includes('file')) {
      actions.push('fileWrite');
    }

    // Determine node types
    const nodeTypes = this.mapToNodeTypes(triggers, actions);

    // Determine complexity
    const complexity = triggers.length + actions.length > 3 ? 'complex' : 
                      triggers.length + actions.length > 1 ? 'medium' : 'simple';

    return {
      triggers,
      actions,
      nodeTypes,
      complexity,
      description
    };
  }

  /**
   * Map triggers and actions to n8n node types
   */
  private mapToNodeTypes(triggers: string[], actions: string[]): string[] {
    const nodeTypeMap: Record<string, string> = {
      webhook: 'n8n-nodes-base.webhook',
      schedule: 'n8n-nodes-base.scheduleTrigger',
      emailTrigger: 'n8n-nodes-base.emailReadImap',
      fileTrigger: 'n8n-nodes-base.localFileTrigger',
      emailSend: 'n8n-nodes-base.emailSend',
      chat: 'n8n-nodes-base.slack',
      database: 'n8n-nodes-base.postgres',
      httpRequest: 'n8n-nodes-base.httpRequest',
      function: 'n8n-nodes-base.function',
      fileWrite: 'n8n-nodes-base.writeFile'
    };

    const nodeTypes: string[] = [];
    triggers.forEach(trigger => {
      if (nodeTypeMap[trigger]) {
        nodeTypes.push(nodeTypeMap[trigger]);
      }
    });
    actions.forEach(action => {
      if (nodeTypeMap[action]) {
        nodeTypes.push(nodeTypeMap[action]);
      }
    });

    return nodeTypes;
  }

  /**
   * Generate workflow from analysis
   */
  private generateWorkflowFromAnalysis(analysis: any, name?: string): any {
    const nodes = [];
    const connections: any = {};
    let nodeIndex = 0;
    let previousNodeName = '';

    // Generate trigger nodes
    analysis.triggers.forEach((trigger: string, index: number) => {
      const node = this.createTriggerNode(trigger, nodeIndex);
      nodes.push(node);
      if (index === 0) {
        previousNodeName = node.name;
      }
      nodeIndex++;
    });

    // Generate action nodes
    analysis.actions.forEach((action: string) => {
      const node = this.createActionNode(action, nodeIndex);
      nodes.push(node);
      
      // Connect to previous node
      if (previousNodeName) {
        if (!connections[previousNodeName]) {
          connections[previousNodeName] = { main: [[]] };
        }
        connections[previousNodeName].main[0].push({
          node: node.name,
          type: 'main',
          index: 0
        });
      }
      
      previousNodeName = node.name;
      nodeIndex++;
    });

    // If no actions detected, add a basic function node
    if (analysis.actions.length === 0) {
      const node = this.createActionNode('function', nodeIndex);
      nodes.push(node);
      
      if (previousNodeName) {
        if (!connections[previousNodeName]) {
          connections[previousNodeName] = { main: [[]] };
        }
        connections[previousNodeName].main[0].push({
          node: node.name,
          type: 'main',
          index: 0
        });
      }
    }

    return {
      name: name || `AI Generated Workflow - ${new Date().toISOString().split('T')[0]}`,
      nodes,
      connections,
      settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true,
        saveDataErrorExecution: "all",
        saveDataSuccessExecution: "all",
        executionTimeout: 3600,
        timezone: "UTC"
      },
      staticData: {}
    };
  }

  /**
   * Create trigger node
   */
  private createTriggerNode(triggerType: string, index: number): any {
    const basePosition = [240 + (index * 220), 300];
    
    switch (triggerType) {
      case 'webhook':
        return {
          id: `webhook_${index}`,
          type: 'n8n-nodes-base.webhook',
          name: `Webhook${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            path: 'webhook-data',
            httpMethod: 'POST',
            responseMode: 'responseNode'
          },
          position: basePosition,
          webhookId: this.generateId()
        };
      
      case 'schedule':
        return {
          id: `schedule_${index}`,
          type: 'n8n-nodes-base.scheduleTrigger',
          name: `Schedule${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            rule: {
              interval: [
                {
                  field: 'hours',
                  hoursInterval: 1
                }
              ]
            }
          },
          position: basePosition
        };

      case 'emailTrigger':
        return {
          id: `email_trigger_${index}`,
          type: 'n8n-nodes-base.emailReadImap',
          name: `Email Trigger${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            mailbox: 'INBOX',
            action: 'read',
            format: 'simple'
          },
          position: basePosition
        };

      default:
        return {
          id: `manual_trigger_${index}`,
          type: 'n8n-nodes-base.manualTrigger',
          name: `Manual Trigger${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {},
          position: basePosition
        };
    }
  }

  /**
   * Create action node
   */
  private createActionNode(actionType: string, index: number): any {
    const basePosition = [240 + (index * 220), 300];
    
    switch (actionType) {
      case 'emailSend':
        return {
          id: `email_send_${index}`,
          type: 'n8n-nodes-base.emailSend',
          name: `Send Email${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            subject: 'Workflow Notification',
            text: '={{ JSON.stringify($json, null, 2) }}',
            toEmail: 'recipient@example.com'
          },
          position: basePosition
        };

      case 'httpRequest':
        return {
          id: `http_request_${index}`,
          type: 'n8n-nodes-base.httpRequest',
          name: `HTTP Request${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            url: 'https://api.example.com/endpoint',
            method: 'POST',
            body: {
              mode: 'json',
              json: '={{ $json }}'
            }
          },
          position: basePosition
        };

      case 'function':
        return {
          id: `function_${index}`,
          type: 'n8n-nodes-base.function',
          name: `Process Data${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            functionCode: `
              // Process the incoming data
              const processedData = {
                timestamp: new Date().toISOString(),
                originalData: $input.all(),
                processed: true
              };
              
              return [processedData];
            `
          },
          position: basePosition
        };

      default:
        return {
          id: `set_${index}`,
          type: 'n8n-nodes-base.set',
          name: `Set Data${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            values: {
              string: [
                {
                  name: 'processed',
                  value: 'true'
                }
              ]
            }
          },
          position: basePosition
        };
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Exported utility functions for reuse by other tools
 */

/**
 * Analyze description to determine workflow requirements
 */
export function analyzeDescription(description: string): DescriptionAnalysis {
  const descLower = description.toLowerCase();
  
  // Detect triggers
  const triggers = [];
  if (descLower.includes('webhook') || descLower.includes('http request') || descLower.includes('api call')) {
    triggers.push('webhook');
  }
  if (descLower.includes('schedule') || descLower.includes('daily') || descLower.includes('hourly') || descLower.includes('cron')) {
    triggers.push('schedule');
  }
  if (descLower.includes('email') && (descLower.includes('receive') || descLower.includes('incoming'))) {
    triggers.push('emailTrigger');
  }
  if (descLower.includes('file') && (descLower.includes('upload') || descLower.includes('watch') || descLower.includes('monitor'))) {
    triggers.push('fileTrigger');
  }

  // Default to webhook if no trigger detected
  if (triggers.length === 0) {
    triggers.push('webhook');
  }

  // Detect actions
  const actions = [];
  if (descLower.includes('email') && (descLower.includes('send') || descLower.includes('notify'))) {
    actions.push('emailSend');
  }
  if (descLower.includes('slack') || descLower.includes('discord') || descLower.includes('teams')) {
    actions.push('chat');
  }
  if (descLower.includes('database') || descLower.includes('sql') || descLower.includes('postgres') || descLower.includes('mysql')) {
    actions.push('database');
  }
  if (descLower.includes('api') && (descLower.includes('send') || descLower.includes('post') || descLower.includes('put'))) {
    actions.push('httpRequest');
  }
  if (descLower.includes('transform') || descLower.includes('process') || descLower.includes('format')) {
    actions.push('function');
  }
  if (descLower.includes('save') || descLower.includes('store') || descLower.includes('file')) {
    actions.push('fileWrite');
  }
  if (descLower.includes('fetch') || descLower.includes('get') || descLower.includes('retrieve')) {
    actions.push('httpRequest');
  }

  // Determine node types
  const nodeTypes = mapToNodeTypes(triggers, actions);

  // Determine complexity
  const complexity = triggers.length + actions.length > 3 ? 'complex' :
                    triggers.length + actions.length > 1 ? 'medium' : 'simple';

  return {
    triggers,
    actions,
    nodeTypes,
    complexity,
    description
  };
}

/**
 * Map triggers and actions to n8n node types
 */
export function mapToNodeTypes(triggers: string[], actions: string[]): string[] {
  const nodeTypeMap: Record<string, string> = {
    webhook: 'n8n-nodes-base.webhook',
    schedule: 'n8n-nodes-base.scheduleTrigger',
    emailTrigger: 'n8n-nodes-base.emailReadImap',
    fileTrigger: 'n8n-nodes-base.localFileTrigger',
    emailSend: 'n8n-nodes-base.send-email',
    chat: 'n8n-nodes-base.slack',
    database: 'n8n-nodes-base.postgres',
    httpRequest: 'n8n-nodes-base.httpRequest',
    function: 'n8n-nodes-base.function',
    fileWrite: 'n8n-nodes-base.writeFile'
  };

  const nodeTypes: string[] = [];
  triggers.forEach(trigger => {
    if (nodeTypeMap[trigger]) {
      nodeTypes.push(nodeTypeMap[trigger]);
    }
  });
  actions.forEach(action => {
    if (nodeTypeMap[action]) {
      nodeTypes.push(nodeTypeMap[action]);
    }
  });

  return nodeTypes;
}

/**
 * Generate workflow from analysis
 */
export function generateWorkflowFromAnalysis(analysis: DescriptionAnalysis, name?: string): GeneratedWorkflow {
  const nodes = [];
  const connections: any = {};
  let nodeIndex = 0;
  let previousNodeName = '';

  // Generate trigger nodes
  analysis.triggers.forEach((trigger: string, index: number) => {
    const node = createTriggerNode(trigger, nodeIndex);
    nodes.push(node);
    if (index === 0) {
      previousNodeName = node.name;
    }
    nodeIndex++;
  });

  // Generate action nodes
  analysis.actions.forEach((action: string) => {
    const node = createActionNode(action, nodeIndex);
    nodes.push(node);
    
    // Connect to previous node
    if (previousNodeName) {
      if (!connections[previousNodeName]) {
        connections[previousNodeName] = { main: [[]] };
      }
      connections[previousNodeName].main[0].push({
        node: node.name,
        type: 'main',
        index: 0
      });
    }
    
    previousNodeName = node.name;
    nodeIndex++;
  });

  // If no actions detected, add a basic function node
  if (analysis.actions.length === 0) {
    const node = createActionNode('function', nodeIndex);
    nodes.push(node);
    
    if (previousNodeName) {
      if (!connections[previousNodeName]) {
        connections[previousNodeName] = { main: [[]] };
      }
      connections[previousNodeName].main[0].push({
        node: node.name,
        type: 'main',
        index: 0
      });
    }
  }

  return {
    name: name || `AI Generated Workflow - ${new Date().toISOString().split('T')[0]}`,
    nodes,
    connections,
    settings: {
      saveExecutionProgress: true,
      saveManualExecutions: true,
      saveDataErrorExecution: "all",
      saveDataSuccessExecution: "all",
      executionTimeout: 3600,
      timezone: "UTC"
    },
    staticData: {}
  };
}

/**
 * Create trigger node
 */
export function createTriggerNode(triggerType: string, index: number): any {
  const basePosition = [240 + (index * 220), 300];
  
  switch (triggerType) {
    case 'webhook':
      return {
        id: `webhook_${index}`,
        type: 'n8n-nodes-base.webhook',
        name: `Webhook${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          path: 'webhook-data',
          httpMethod: 'POST',
          responseMode: 'responseNode'
        },
        position: basePosition,
        webhookId: generateId()
      };
    
    case 'schedule':
      return {
        id: `schedule_${index}`,
        type: 'n8n-nodes-base.scheduleTrigger',
        name: `Schedule${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          rule: {
            interval: [
              {
                field: 'hours',
                hoursInterval: 1
              }
            ]
          }
        },
        position: basePosition
      };

    case 'emailTrigger':
      return {
        id: `email_trigger_${index}`,
        type: 'n8n-nodes-base.emailReadImap',
        name: `Email Trigger${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          mailbox: 'INBOX',
          action: 'read',
          format: 'simple'
        },
        position: basePosition
      };

    default:
      return {
        id: `manual_trigger_${index}`,
        type: 'n8n-nodes-base.manualTrigger',
        name: `Manual Trigger${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {},
        position: basePosition
      };
  }
}

/**
 * Create action node
 */
export function createActionNode(actionType: string, index: number): any {
  const basePosition = [240 + (index * 220), 300];
  
  switch (actionType) {
    case 'emailSend':
      return {
        id: `email_send_${index}`,
        type: 'n8n-nodes-base.emailSend',
        name: `Send Email${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          subject: 'Workflow Notification',
          text: '={{ JSON.stringify($json, null, 2) }}',
          toEmail: 'recipient@example.com'
        },
        position: basePosition
      };

    case 'httpRequest':
      return {
        id: `http_request_${index}`,
        type: 'n8n-nodes-base.httpRequest',
        name: `HTTP Request${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          url: 'https://api.example.com/endpoint',
          method: 'POST',
          body: {
            mode: 'json',
            json: '={{ $json }}'
          }
        },
        position: basePosition
      };

    case 'function':
      return {
        id: `function_${index}`,
        type: 'n8n-nodes-base.function',
        name: `Process Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          functionCode: `
            // Process the incoming data
            const processedData = {
              timestamp: new Date().toISOString(),
              originalData: $input.all(),
              processed: true
            };
            
            return [processedData];
          `
        },
        position: basePosition
      };

    default:
      return {
        id: `set_${index}`,
        type: 'n8n-nodes-base.set',
        name: `Set Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          values: {
            string: [
              {
                name: 'processed',
                value: 'true'
              }
            ]
          }
        },
        position: basePosition
      };
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Get the tool definition for generating workflows from descriptions
 */
export function getGenerateWorkflowFromDescriptionToolDefinition(): ToolDefinition {
  return {
    name: 'generate_workflow_from_description',
    description: 'Create workflows from natural language descriptions using AI analysis',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Natural language description of what the workflow should do'
        },
        name: {
          type: 'string',
          description: 'Optional name for the generated workflow'
        },
        category: {
          type: 'string',
          description: 'Category for the workflow',
          default: 'ai-generated'
        }
      },
      required: ['description']
    }
  };
}