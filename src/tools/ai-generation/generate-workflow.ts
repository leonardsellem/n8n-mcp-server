/**
 * Generate Workflow From Description Tool
 *
 * This module provides functionality to create workflows from natural language descriptions.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from '../templates/base-handler.js';
import { getAllAvailableNodes, searchNodes } from '../../discovery/enhanced-discovery.js';

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
        const analysis = await this.analyzeDescription(description);
        
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
  private async analyzeDescription(description: string): Promise<any> {
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

    // Determine node types using verified nodes
    const nodeTypes = await this.mapToNodeTypes(triggers, actions);

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
   * Map triggers and actions to verified n8n node types from discovery system
   */
  private async mapToNodeTypes(triggers: string[], actions: string[]): Promise<string[]> {
    const allNodes = await getAllAvailableNodes();
    const nodeTypes: string[] = [];
    
    // Enhanced mapping using verified nodes
    const enhancedNodeTypeMap: Record<string, string[]> = {
      webhook: ['webhook', 'http-request', 'trigger'],
      schedule: ['schedule', 'cron', 'timer'],
      emailTrigger: ['email', 'imap', 'mail-trigger'],
      fileTrigger: ['file', 'watch', 'monitor'],
      emailSend: ['email', 'send-email', 'smtp'],
      chat: ['slack', 'discord', 'teams', 'telegram'],
      database: ['postgres', 'mysql', 'mongodb', 'sql'],
      httpRequest: ['http', 'api', 'request', 'rest'],
      function: ['function', 'code', 'javascript'],
      fileWrite: ['file', 'write', 'save']
    };

    // Find best matching verified nodes
    for (const [category, keywords] of Object.entries(enhancedNodeTypeMap)) {
      if (triggers.includes(category) || actions.includes(category)) {
        // Search for nodes matching these keywords
        for (const keyword of keywords) {
          const matchingNodes = await searchNodes(keyword, { limit: 3 });
          nodeTypes.push(...matchingNodes.slice(0, 1).map(node => node.name));
        }
      }
    }

    // Fallback to basic verified nodes if no specific matches
    if (nodeTypes.length === 0) {
      const basicNodes = allNodes.filter(node => 
        ['webhook', 'function', 'set'].some(basic => 
          node.name.toLowerCase().includes(basic)
        )
      ).slice(0, 3);
      nodeTypes.push(...basicNodes.map(node => node.name));
    }

    return [...new Set(nodeTypes)]; // Remove duplicates
  }

  /**
   * Generate workflow from analysis
   */
  private generateWorkflowFromAnalysis(analysis: any, name?: string): any {
    const nodes = [];
    const connections: any = {};
    let nodeIndex = 0;
    let previousNodeId = '';

    // Generate trigger nodes
    analysis.triggers.forEach((trigger: string, index: number) => {
      const node = this.createTriggerNode(trigger, nodeIndex);
      nodes.push(node);
      if (index === 0) {
        previousNodeId = node.id;
      }
      nodeIndex++;
    });

    // Generate action nodes
    analysis.actions.forEach((action: string) => {
      const node = this.createActionNode(action, nodeIndex);
      nodes.push(node);
      
      // Connect to previous node using proper ID-based connections
      if (previousNodeId) {
        if (!connections[previousNodeId]) {
          connections[previousNodeId] = { main: [[]] };
        }
        connections[previousNodeId].main[0].push({
          node: node.id,
          type: 'main',
          index: 0
        });
      }
      
      previousNodeId = node.id;
      nodeIndex++;
    });

    // If no actions detected, add a basic function node
    if (analysis.actions.length === 0) {
      const node = this.createActionNode('function', nodeIndex);
      nodes.push(node);
      
      if (previousNodeId) {
        if (!connections[previousNodeId]) {
          connections[previousNodeId] = { main: [[]] };
        }
        connections[previousNodeId].main[0].push({
          node: node.id,
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
 * Analyze description to determine workflow requirements with enhanced pattern detection
 */
export async function analyzeDescription(description: string): Promise<DescriptionAnalysis> {
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

  // Detect actions with enhanced complexity patterns
  const actions = [];
  
  // Basic actions
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

  // Complex workflow patterns
  if (descLower.includes('condition') || descLower.includes('if') || descLower.includes('depending') || descLower.includes('route') || descLower.includes('based on')) {
    actions.push('switch');
  }
  if (descLower.includes('validate') || descLower.includes('check') || descLower.includes('verify')) {
    actions.push('validation');
  }
  if (descLower.includes('error') || descLower.includes('fail') || descLower.includes('catch') || descLower.includes('handle error')) {
    actions.push('errorHandler');
  }
  if (descLower.includes('wait') || descLower.includes('delay') || descLower.includes('pause')) {
    actions.push('wait');
  }
  if (descLower.includes('loop') || descLower.includes('iterate') || descLower.includes('each') || descLower.includes('repeat')) {
    actions.push('itemLists');
  }
  if (descLower.includes('merge') || descLower.includes('combine') || descLower.includes('join')) {
    actions.push('merge');
  }
  if (descLower.includes('filter') || descLower.includes('select') || descLower.includes('where')) {
    actions.push('filter');
  }

  // Determine node types using verified nodes
  const nodeTypes = await mapToNodeTypes(triggers, actions);

  // Enhanced complexity calculation
  let complexityScore = triggers.length + actions.length;
  
  // Add complexity points for advanced patterns
  if (actions.includes('switch') || actions.includes('validation') || actions.includes('errorHandler')) {
    complexityScore += 2;
  }
  if (actions.includes('itemLists') || actions.includes('merge') || actions.includes('filter')) {
    complexityScore += 1;
  }
  
  const complexity = complexityScore > 5 ? 'complex' :
                    complexityScore > 2 ? 'medium' : 'simple';

  return {
    triggers,
    actions,
    nodeTypes,
    complexity,
    description
  };
}

/**
 * Map triggers and actions to verified n8n node types from discovery system
 */
export async function mapToNodeTypes(triggers: string[], actions: string[]): Promise<string[]> {
  const allNodes = await getAllAvailableNodes();
  const nodeTypes: string[] = [];
  
  // Enhanced mapping using verified nodes
  const enhancedNodeTypeMap: Record<string, string[]> = {
    webhook: ['webhook', 'http-request', 'trigger'],
    schedule: ['schedule', 'cron', 'timer'],
    emailTrigger: ['email', 'imap', 'mail-trigger'],
    fileTrigger: ['file', 'watch', 'monitor'],
    emailSend: ['email', 'send-email', 'smtp'],
    chat: ['slack', 'discord', 'teams', 'telegram'],
    database: ['postgres', 'mysql', 'mongodb', 'sql'],
    httpRequest: ['http', 'api', 'request', 'rest'],
    function: ['function', 'code', 'javascript'],
    fileWrite: ['file', 'write', 'save']
  };

  // Find best matching verified nodes
  for (const [category, keywords] of Object.entries(enhancedNodeTypeMap)) {
    if (triggers.includes(category) || actions.includes(category)) {
      // Search for nodes matching these keywords
      for (const keyword of keywords) {
        const matchingNodes = await searchNodes(keyword, { limit: 3 });
        nodeTypes.push(...matchingNodes.slice(0, 1).map(node => node.name));
      }
    }
  }

  // Fallback to basic verified nodes if no specific matches
  if (nodeTypes.length === 0) {
    const basicNodes = allNodes.filter(node => 
      ['webhook', 'function', 'set'].some(basic => 
        node.name.toLowerCase().includes(basic)
      )
    ).slice(0, 3);
    nodeTypes.push(...basicNodes.map(node => node.name));
  }

  return [...new Set(nodeTypes)]; // Remove duplicates
}

/**
 * Generate workflow from analysis with enhanced complexity and branching
 */
export function generateWorkflowFromAnalysis(analysis: DescriptionAnalysis, name?: string): GeneratedWorkflow {
  const nodes: any[] = [];
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

  // Enhanced workflow generation with branching logic
  if (analysis.complexity === 'complex') {
    // For complex workflows, create branching patterns
    const branchingWorkflow = generateComplexBranchingWorkflow(analysis, nodes, connections, previousNodeName, nodeIndex);
    return {
      name: name || `Complex AI Workflow - ${new Date().toISOString().split('T')[0]}`,
      nodes: branchingWorkflow.nodes,
      connections: branchingWorkflow.connections,
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
  } else {
    // Generate standard linear workflow for simple/medium complexity
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
}

/**
 * Generate complex branching workflow with conditional logic
 */
function generateComplexBranchingWorkflow(
  analysis: DescriptionAnalysis, 
  nodes: any[], 
  connections: any, 
  previousNodeName: string, 
  startIndex: number
): { nodes: any[], connections: any } {
  let nodeIndex = startIndex;
  
  // Add validation node if needed
  if (analysis.actions.includes('validation')) {
    const validationNode = createActionNode('validation', nodeIndex++);
    nodes.push(validationNode);
    
    if (previousNodeName) {
      connections[previousNodeName] = { main: [[{ node: validationNode.name, type: 'main', index: 0 }]] };
    }
    previousNodeName = validationNode.name;
  }

  // Add switch node for conditional logic
  if (analysis.actions.includes('switch')) {
    const switchNode = createActionNode('switch', nodeIndex++);
    nodes.push(switchNode);
    
    if (previousNodeName) {
      connections[previousNodeName] = { main: [[{ node: switchNode.name, type: 'main', index: 0 }]] };
    }

    // Create multiple branch paths
    const emailBranch = createActionNode('emailSend', nodeIndex++);
    const apiBranch = createActionNode('httpRequest', nodeIndex++);
    const processBranch = createActionNode('function', nodeIndex++);
    
    nodes.push(emailBranch, apiBranch, processBranch);
    
    // Connect switch outputs to different branches
    connections[switchNode.name] = {
      main: [
        [{ node: emailBranch.name, type: 'main', index: 0 }],  // Output 0: email path
        [{ node: apiBranch.name, type: 'main', index: 0 }],    // Output 1: API path  
        [{ node: processBranch.name, type: 'main', index: 0 }] // Output 2: process path
      ]
    };

    // Add merge node to combine branches
    const mergeNode = createActionNode('merge', nodeIndex++);
    nodes.push(mergeNode);
    
    // Connect all branches to merge
    connections[emailBranch.name] = { main: [[{ node: mergeNode.name, type: 'main', index: 0 }]] };
    connections[apiBranch.name] = { main: [[{ node: mergeNode.name, type: 'main', index: 0 }]] };
    connections[processBranch.name] = { main: [[{ node: mergeNode.name, type: 'main', index: 0 }]] };
    
    previousNodeName = mergeNode.name;
  }

  // Add error handling wrapper
  if (analysis.actions.includes('errorHandler')) {
    const errorHandlerNode = createActionNode('errorHandler', nodeIndex++);
    nodes.push(errorHandlerNode);
    
    if (previousNodeName) {
      connections[previousNodeName] = { main: [[{ node: errorHandlerNode.name, type: 'main', index: 0 }]] };
    }
    previousNodeName = errorHandlerNode.name;
  }

  // Add item processing if needed
  if (analysis.actions.includes('itemLists')) {
    const itemListsNode = createActionNode('itemLists', nodeIndex++);
    nodes.push(itemListsNode);
    
    if (previousNodeName) {
      connections[previousNodeName] = { main: [[{ node: itemListsNode.name, type: 'main', index: 0 }]] };
    }
    previousNodeName = itemListsNode.name;
  }

  // Add remaining actions that aren't handled by branching logic
  const remainingActions = analysis.actions.filter(action => 
    !['switch', 'validation', 'errorHandler', 'itemLists'].includes(action)
  );
  
  remainingActions.forEach((action: string) => {
    const node = createActionNode(action, nodeIndex++);
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
    previousNodeName = node.name;
  });

  return { nodes, connections };
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
  // Grid-based positioning with bounds checking for complex workflows
  const basePosition = [
    Math.min(240 + ((index % 5) * 300), 1800), // Max 5 nodes per row
    300 + (Math.floor(index / 5) * 200)        // New row every 5 nodes
  ];
  
  // Generate proper UUID for node ID
  const nodeId = generateId();
  
  switch (actionType) {
    case 'emailSend':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.send-email', // Corrected node type
        name: `Send Email${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          subject: 'Workflow Notification',
          text: '={{ JSON.stringify($json, null, 2) }}',
          toEmail: 'recipient@example.com',
          options: {} // Required options object
        },
        position: basePosition
      };

    case 'httpRequest':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.httpRequest',
        name: `HTTP Request${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          url: 'https://api.example.com/endpoint',
          method: 'POST',
          sendBody: true,
          bodyContentType: 'json',
          jsonBody: '={{ $json }}',
          options: {} // Required options object
        },
        position: basePosition
      };

    case 'function':
      return {
        id: nodeId,
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

    case 'switch':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.switch',
        name: `Switch${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                leftValue: '={{ $json.type }}',
                rightValue: 'email',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ]
          },
          fallbackOutput: 0 // Required fallbackOutput parameter
        },
        position: basePosition
      };

    case 'validation':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.function',
        name: `Validate Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          functionCode: `
            // Validate incoming data
            const errors = [];
            const data = $input.first().json;
            
            // Check required fields
            if (!data.id) errors.push('Missing required field: id');
            if (!data.email || !data.email.includes('@')) errors.push('Invalid email address');
            
            if (errors.length > 0) {
              throw new Error('Validation failed: ' + errors.join(', '));
            }
            
            return [{
              ...data,
              validated: true,
              validatedAt: new Date().toISOString()
            }];
          `
        },
        position: basePosition
      };

    case 'errorHandler':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.function',
        name: `Error Handler${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          functionCode: `
            // Handle errors gracefully
            try {
              const data = $input.first().json;
              
              return [{
                success: true,
                data: data,
                processedAt: new Date().toISOString()
              }];
            } catch (error) {
              return [{
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
                retryRecommended: true
              }];
            }
          `
        },
        position: basePosition
      };

    case 'wait':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.wait',
        name: `Wait${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          amount: 5,
          unit: 'seconds'
        },
        position: basePosition
      };

    case 'itemLists':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.itemLists',
        name: `Process Items${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          operation: 'splitOutItems',
          fieldName: 'items'
        },
        position: basePosition
      };

    case 'merge':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.merge',
        name: `Merge Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          mode: 'combine',
          combineBy: 'combineByPosition',
          options: {}
        },
        position: basePosition
      };

    case 'filter':
      return {
        id: nodeId,
        type: 'n8n-nodes-base.filter',
        name: `Filter Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                leftValue: '={{ $json.status }}',
                rightValue: 'active',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ]
          }
        },
        position: basePosition
      };

    default:
      return {
        id: nodeId,
        type: 'n8n-nodes-base.set',
        name: `Set Data${index > 0 ? ` ${index + 1}` : ''}`,
        parameters: {
          options: {
            keepOnlySet: false,
            dotNotation: false
          }, // Required options object
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
