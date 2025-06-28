/**
 * Workflow Loader - Enhanced workflow loading and generation utilities
 * 
 * Provides intelligent workflow loading, template generation, and optimization
 * for AI agents working with n8n workflows.
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { DiscoveredNode, dynamicNodeRegistry } from '../data/dynamic-node-registry.js';
import { NodeParameterValidator, ValidationResult } from '../validation/node-parameter-validator.js';
import { performanceMonitor } from '../monitoring/performance-monitor.js';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'integration' | 'data-processing' | 'ai-workflow' | 'monitoring';
  complexity: 'simple' | 'medium' | 'complex';
  nodes: WorkflowNodeTemplate[];
  connections: WorkflowConnection[];
  estimatedSetupTime: string;
  requiredCredentials: string[];
  useCases: string[];
  aiOptimized: boolean;
}

export interface WorkflowNodeTemplate {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: string;
  notes?: string;
}

export interface WorkflowConnection {
  from: {
    nodeId: string;
    outputIndex: number;
  };
  to: {
    nodeId: string;
    inputIndex: number;
  };
  outputName?: string;
  inputName?: string;
}

export interface WorkflowGenerationOptions {
  includeErrorHandling?: boolean;
  optimizeForPerformance?: boolean;
  addLogging?: boolean;
  includeRetry?: boolean;
  generateDocumentation?: boolean;
  aiEnhanced?: boolean;
}

export class WorkflowLoader {
  private static readonly TEMPLATES: WorkflowTemplate[] = [
    {
      id: 'email-automation',
      name: 'Email Automation Workflow',
      description: 'Automatically process and respond to emails based on content analysis',
      category: 'automation',
      complexity: 'medium',
      nodes: [
        {
          id: 'trigger-1',
          name: 'Email Trigger',
          type: 'emailReadImap',
          position: [100, 100],
          parameters: {
            mailbox: 'INBOX',
            pollInterval: 300
          },
          credentials: 'imapApi'
        },
        {
          id: 'analysis-1',
          name: 'Content Analysis',
          type: 'openai',
          position: [300, 100],
          parameters: {
            operation: 'text',
            prompt: 'Analyze this email and categorize it as: urgent, normal, or spam'
          },
          credentials: 'openAiApi'
        },
        {
          id: 'condition-1',
          name: 'Check Category',
          type: 'if',
          position: [500, 100],
          parameters: {
            conditions: {
              string: [
                {
                  value1: '={{$json["category"]}}',
                  value2: 'urgent',
                  operation: 'equal'
                }
              ]
            }
          }
        }
      ],
      connections: [
        {
          from: { nodeId: 'trigger-1', outputIndex: 0 },
          to: { nodeId: 'analysis-1', inputIndex: 0 }
        },
        {
          from: { nodeId: 'analysis-1', outputIndex: 0 },
          to: { nodeId: 'condition-1', inputIndex: 0 }
        }
      ],
      estimatedSetupTime: '15-30 minutes',
      requiredCredentials: ['imapApi', 'openAiApi'],
      useCases: [
        'Customer support automation',
        'Email triage and prioritization',
        'Automated email categorization'
      ],
      aiOptimized: true
    },
    {
      id: 'data-sync',
      name: 'Database Sync Workflow',
      description: 'Synchronize data between different databases and services',
      category: 'data-processing',
      complexity: 'simple',
      nodes: [
        {
          id: 'schedule-1',
          name: 'Daily Sync',
          type: 'cron',
          position: [100, 100],
          parameters: {
            triggerTimes: {
              hour: 2,
              minute: 0
            }
          }
        },
        {
          id: 'source-1',
          name: 'Source Database',
          type: 'postgres',
          position: [300, 100],
          parameters: {
            operation: 'executeQuery',
            query: 'SELECT * FROM users WHERE updated_at > $1'
          },
          credentials: 'postgresApi'
        },
        {
          id: 'transform-1',
          name: 'Transform Data',
          type: 'set',
          position: [500, 100],
          parameters: {
            values: {
              id: '={{$json["user_id"]}}',
              name: '={{$json["full_name"]}}',
              email: '={{$json["email_address"]}}'
            }
          }
        }
      ],
      connections: [
        {
          from: { nodeId: 'schedule-1', outputIndex: 0 },
          to: { nodeId: 'source-1', inputIndex: 0 }
        },
        {
          from: { nodeId: 'source-1', outputIndex: 0 },
          to: { nodeId: 'transform-1', inputIndex: 0 }
        }
      ],
      estimatedSetupTime: '10-20 minutes',
      requiredCredentials: ['postgresApi'],
      useCases: [
        'Database synchronization',
        'Data migration',
        'ETL processes'
      ],
      aiOptimized: false
    }
  ];

  /**
   * Load a workflow template by ID
   */
  static getWorkflowTemplate(templateId: string): WorkflowTemplate | null {
    return this.TEMPLATES.find(template => template.id === templateId) || null;
  }

  /**
   * Get all available workflow templates
   */
  static getAllTemplates(category?: string, complexity?: string): WorkflowTemplate[] {
    let templates = [...this.TEMPLATES];
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    if (complexity) {
      templates = templates.filter(t => t.complexity === complexity);
    }
    
    return templates;
  }

  /**
   * Generate a workflow from node types
   */
  static generateWorkflow(
    nodeTypes: string[], 
    options: WorkflowGenerationOptions = {}
  ): any {
    return performanceMonitor.wrapRequest(async () => {
      const {
        includeErrorHandling = true,
        optimizeForPerformance = false,
        addLogging = false,
        includeRetry = false,
        generateDocumentation = true,
        aiEnhanced = false
      } = options;

      const workflow: any = {
        name: 'Generated Workflow',
        version: 1,
        createdAt: new Date().toISOString(),
        nodes: [] as any[],
        connections: {} as any,
        settings: {
          executionOrder: 'v1'
        }
      };

      // Generate nodes with intelligent positioning
      const nodes = await this.createWorkflowNodes(nodeTypes, options);
      workflow.nodes = nodes;

      // Generate connections
      workflow.connections = this.generateConnections(nodes);

      // Add error handling if requested
      if (includeErrorHandling) {
        this.addErrorHandling(workflow);
      }

      // Add logging if requested
      if (addLogging) {
        this.addLogging(workflow);
      }

      // Add retry logic if requested
      if (includeRetry) {
        this.addRetryLogic(workflow);
      }

      // Add AI enhancements if requested
      if (aiEnhanced) {
        await this.addAIEnhancements(workflow);
      }

      // Add documentation if requested
      if (generateDocumentation) {
        workflow.meta = this.generateDocumentation(workflow, nodeTypes);
      }

      return workflow;
    }, 'generateWorkflow');
  }

  /**
   * Create workflow nodes with intelligent configuration
   */
  private static async createWorkflowNodes(
    nodeTypes: string[], 
    options: WorkflowGenerationOptions
  ): Promise<any[]> {
    const nodes: any[] = [];
    const startY = 100;
    const nodeSpacing = 200;

    for (let i = 0; i < nodeTypes.length; i++) {
      const nodeType = nodeTypes[i];
      const nodeInfo = await this.getNodeInfo(nodeType);
      
      const node: any = {
        id: `node-${i + 1}`,
        name: nodeInfo?.displayName || this.formatNodeName(nodeType),
        type: nodeType,
        typeVersion: 1,
        position: [100 + (i * nodeSpacing), startY + this.calculateVerticalOffset(i)],
        parameters: await this.generateNodeParameters(nodeInfo, options)
      };

      // Add credentials if required
      if (nodeInfo && this.requiresCredentials(nodeInfo)) {
        node.credentials = this.suggestCredentials(nodeType);
      }

      // Add notes for documentation
      if (options.generateDocumentation) {
        node.notes = this.generateNodeNotes(nodeInfo);
      }

      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Get node information from the dynamic registry
   */
  private static async getNodeInfo(nodeType: string): Promise<DiscoveredNode | null> {
    // Try to find the node in the dynamic registry
    const allNodes = dynamicNodeRegistry.getAllNodes();
    return allNodes.find(node => 
      node.name.includes(nodeType) || 
      node.displayName.toLowerCase().includes(nodeType.toLowerCase())
    ) || null;
  }

  /**
   * Generate intelligent node parameters
   */
  private static async generateNodeParameters(
    nodeInfo: DiscoveredNode | null, 
    options: WorkflowGenerationOptions
  ): Promise<Record<string, any>> {
    const parameters: Record<string, any> = {};

    if (!nodeInfo) {
      return parameters;
    }

    // Add common parameters based on node type
    if (nodeInfo.triggerNode) {
      parameters.pollTimes = {
        item: [
          {
            mode: 'everyMinute'
          }
        ]
      };
    }

    // Add AI-enhanced parameters if requested
    if (options.aiEnhanced && nodeInfo.aiDescription) {
      parameters.aiOptimized = true;
      parameters.description = nodeInfo.aiDescription;
    }

    // Add performance optimizations if requested
    if (options.optimizeForPerformance) {
      parameters.continueOnFail = false;
      parameters.retryOnFail = false;
      parameters.waitBetween = 0;
    }

    return parameters;
  }

  /**
   * Generate connections between nodes
   */
  private static generateConnections(nodes: any[]): Record<string, any> {
    const connections: Record<string, any> = {};

    for (let i = 0; i < nodes.length - 1; i++) {
      const currentNode = nodes[i];
      const nextNode = nodes[i + 1];

      if (!connections[currentNode.name]) {
        connections[currentNode.name] = {
          main: []
        };
      }

      connections[currentNode.name].main.push([
        {
          node: nextNode.name,
          type: 'main',
          index: 0
        }
      ]);
    }

    return connections;
  }

  /**
   * Add error handling to workflow
   */
  private static addErrorHandling(workflow: any): void {
    const errorHandlerNode = {
      id: 'error-handler',
      name: 'Error Handler',
      type: 'set',
      typeVersion: 1,
      position: [100, 400],
      parameters: {
        values: {
          errorMessage: '={{$json["error"]["message"]}}',
          errorNode: '={{$json["error"]["node"]}}',
          timestamp: '={{new Date().toISOString()}}'
        }
      },
      onError: 'continueRegularOutput'
    };

    workflow.nodes.push(errorHandlerNode);

    // Add error connections to existing nodes
    workflow.nodes.forEach((node: any) => {
      if (node.name !== 'Error Handler') {
        node.onError = 'continueErrorOutput';
        if (!workflow.connections[node.name]) {
          workflow.connections[node.name] = {};
        }
        if (!workflow.connections[node.name].error) {
          workflow.connections[node.name].error = [];
        }
        workflow.connections[node.name].error.push([
          {
            node: 'Error Handler',
            type: 'main',
            index: 0
          }
        ]);
      }
    });
  }

  /**
   * Add logging to workflow
   */
  private static addLogging(workflow: any): void {
    const loggerNode = {
      id: 'logger',
      name: 'Logger',
      type: 'function',
      typeVersion: 1,
      position: [100, 300],
      parameters: {
        functionCode: `
// Log workflow execution details
const timestamp = new Date().toISOString();
const nodeData = items[0].json;

console.log(\`[\${timestamp}] Workflow execution:\`, {
  node: $node.name,
  data: nodeData,
  itemCount: items.length
});

return items;
`
      }
    };

    workflow.nodes.push(loggerNode);
  }

  /**
   * Add retry logic to workflow
   */
  private static addRetryLogic(workflow: any): void {
    workflow.nodes.forEach((node: any) => {
      if (node.type !== 'set' && node.type !== 'function') {
        node.retryOnFail = true;
        node.maxTries = 3;
        node.waitBetween = 1000;
      }
    });
  }

  /**
   * Add AI enhancements to workflow
   */
  private static async addAIEnhancements(workflow: any): Promise<void> {
    // Add AI decision node for complex workflows
    if (workflow.nodes.length > 3) {
      const aiDecisionNode = {
        id: 'ai-decision',
        name: 'AI Decision Engine',
        type: 'openai',
        typeVersion: 1,
        position: [workflow.nodes.length * 200, 100],
        parameters: {
          operation: 'text',
          prompt: 'Analyze the workflow data and determine the best next action based on the results.',
          maxTokens: 150,
          temperature: 0.3
        },
        credentials: 'openAiApi'
      };

      workflow.nodes.push(aiDecisionNode);
    }
  }

  /**
   * Generate documentation for the workflow
   */
  private static generateDocumentation(workflow: any, nodeTypes: string[]): any {
    return {
      description: `Generated workflow using ${nodeTypes.length} nodes: ${nodeTypes.join(', ')}`,
      nodeCount: workflow.nodes.length,
      estimatedExecutionTime: this.estimateExecutionTime(workflow),
      complexity: this.assessWorkflowComplexity(workflow),
      requiredCredentials: this.extractRequiredCredentials(workflow),
      useCases: this.generateUseCases(nodeTypes),
      setupInstructions: this.generateSetupInstructions(workflow),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Validate a complete workflow
   */
  static validateWorkflow(workflow: any): ValidationResult {
    return NodeParameterValidator.validateWorkflow(workflow);
  }

  /**
   * Optimize workflow for performance
   */
  static optimizeWorkflow(workflow: any): any {
    const optimized = JSON.parse(JSON.stringify(workflow));

    // Remove unnecessary parameters
    optimized.nodes.forEach((node: any) => {
      if (node.parameters) {
        // Remove default values
        Object.keys(node.parameters).forEach(key => {
          if (node.parameters[key] === '' || node.parameters[key] === null) {
            delete node.parameters[key];
          }
        });
      }

      // Optimize execution settings
      if (!node.continueOnFail) {
        node.continueOnFail = false;
      }
      if (!node.alwaysOutputData) {
        node.alwaysOutputData = false;
      }
    });

    return optimized;
  }

  /**
   * Helper methods
   */
  private static formatNodeName(nodeType: string): string {
    return nodeType
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private static calculateVerticalOffset(index: number): number {
    // Add some vertical variation to make workflows more visually appealing
    return (index % 2) * 50;
  }

  private static requiresCredentials(nodeInfo: DiscoveredNode): boolean {
    return nodeInfo.authRequired || false;
  }

  private static suggestCredentials(nodeType: string): Record<string, string> {
    const credentialMap: Record<string, string> = {
      'gmail': 'gmailOAuth2',
      'slack': 'slackOAuth2',
      'github': 'githubOAuth2',
      'openai': 'openAiApi',
      'postgres': 'postgres'
    };

    const credentialKey = Object.keys(credentialMap).find(key => 
      nodeType.toLowerCase().includes(key)
    );

    return credentialKey ? { [credentialMap[credentialKey]]: credentialMap[credentialKey] } : {};
  }

  private static generateNodeNotes(nodeInfo: DiscoveredNode | null): string {
    if (!nodeInfo) {
      return 'Configure this node according to your requirements.';
    }

    let notes = nodeInfo.description;
    
    if (nodeInfo.authRequired) {
      notes += '\n\n⚠️ This node requires authentication credentials.';
    }
    
    if (nodeInfo.rateLimit) {
      notes += '\n\n⏱️ This service has rate limits. Consider adding delays between requests.';
    }
    
    if (nodeInfo.integrationComplexity === 'complex') {
      notes += '\n\n🔧 This is a complex integration. Review documentation carefully.';
    }

    return notes;
  }

  private static estimateExecutionTime(workflow: any): string {
    const nodeCount = workflow.nodes.length;
    const hasApiCalls = workflow.nodes.some((node: any) => 
      ['http', 'webhook', 'api'].some(term => node.type.toLowerCase().includes(term))
    );

    if (nodeCount <= 3) {
      return hasApiCalls ? '5-15 seconds' : '1-5 seconds';
    } else if (nodeCount <= 10) {
      return hasApiCalls ? '15-60 seconds' : '5-15 seconds';
    } else {
      return hasApiCalls ? '1-5 minutes' : '15-60 seconds';
    }
  }

  private static assessWorkflowComplexity(workflow: any): 'simple' | 'medium' | 'complex' {
    const nodeCount = workflow.nodes.length;
    const hasConditions = workflow.nodes.some((node: any) => node.type === 'if');
    const hasLoops = workflow.nodes.some((node: any) => node.type === 'loop');

    if (nodeCount <= 3 && !hasConditions && !hasLoops) {
      return 'simple';
    } else if (nodeCount <= 10 || hasConditions) {
      return 'medium';
    } else {
      return 'complex';
    }
  }

  private static extractRequiredCredentials(workflow: any): string[] {
    const credentials = new Set<string>();
    
    workflow.nodes.forEach((node: any) => {
      if (node.credentials) {
        Object.keys(node.credentials).forEach(cred => credentials.add(cred));
      }
    });

    return Array.from(credentials);
  }

  private static generateUseCases(nodeTypes: string[]): string[] {
    const useCases: string[] = [];
    
    if (nodeTypes.some(type => type.includes('email'))) {
      useCases.push('Email automation and processing');
    }
    
    if (nodeTypes.some(type => type.includes('database') || type.includes('sql'))) {
      useCases.push('Data synchronization and ETL');
    }
    
    if (nodeTypes.some(type => type.includes('ai') || type.includes('openai'))) {
      useCases.push('AI-powered content generation and analysis');
    }
    
    if (nodeTypes.some(type => type.includes('webhook') || type.includes('http'))) {
      useCases.push('API integration and webhook processing');
    }

    return useCases.length > 0 ? useCases : ['General workflow automation'];
  }

  private static generateSetupInstructions(workflow: any): string[] {
    const instructions = [
      'Import this workflow into your n8n instance',
      'Configure the required credentials for authenticated nodes',
      'Review and adjust node parameters according to your use case',
      'Test the workflow with sample data'
    ];

    const credentials = this.extractRequiredCredentials(workflow);
    if (credentials.length > 0) {
      instructions.splice(1, 0, `Set up credentials for: ${credentials.join(', ')}`);
    }

    return instructions;
  }
}

export default WorkflowLoader;
