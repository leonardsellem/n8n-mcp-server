import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { z } from 'zod';

// Workflow JSON construction helper based on PDF insights
const WorkflowBuilderSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  nodes: z.array(z.object({
    name: z.string(),
    type: z.string(),
    parameters: z.record(z.any()).optional(),
    position: z.array(z.number()).optional(),
    credentials: z.record(z.string()).optional()
  })),
  connections: z.record(z.any()).optional(),
  settings: z.object({
    errorWorkflow: z.string().optional(),
    timezone: z.string().optional(),
    saveManualExecutions: z.boolean().optional()
  }).optional()
});

type WorkflowBuilderInput = z.infer<typeof WorkflowBuilderSchema>;

interface NodeDefinition {
  name: string;
  type: string;
  parameters?: Record<string, any>;
  position?: [number, number];
  credentials?: Record<string, string>;
}

interface WorkflowJSON {
  name: string;
  nodes: any[];
  connections: Record<string, any>;
  active?: boolean;
  settings?: Record<string, any>;
  pinData?: Record<string, any>;
  tags?: string[];
}

export class WorkflowJSONHelper extends BaseWorkflowToolHandler {
  /**
   * Execute the workflow JSON helper tool
   */
  async execute(args: Record<string, any>) {
    return this.handleExecution(async (args) => {
      const { type, name, pattern, triggerNode, actionNodes, toolNodes, authToken } = args;

      let result: any;

      switch (type) {
        case 'basic':
          if (!triggerNode) {
            throw new Error('triggerNode is required for basic workflow type');
          }
          result = await this.createBasicWorkflow(name, triggerNode, actionNodes || []);
          break;

        case 'mcp-server':
          result = await this.createMCPServerWorkflow(name, toolNodes || [], authToken);
          break;

        case 'pattern':
          if (!pattern) {
            throw new Error('pattern is required for pattern workflow type');
          }
          const patterns = await this.createCommonPatterns();
          result = patterns[pattern];
          if (!result) {
            throw new Error(`Unknown pattern: ${pattern}`);
          }
          break;

        default:
          throw new Error(`Unknown workflow type: ${type}`);
      }

      // Validate and optimize the result
      const validation = await this.validateWorkflowStructure(result);
      const optimized = await this.optimizeForAI(result);

      return this.formatSuccess({
        workflow: optimized,
        validation,
        message: `Successfully created ${type} workflow: ${name}`
      });
    }, args);
  }

  /**
   * Create a basic workflow JSON structure
   * Based on n8n's workflow format documented in the PDF
   */
  async createBasicWorkflow(
    name: string,
    triggerNode: NodeDefinition,
    actionNodes: NodeDefinition[] = []
  ): Promise<WorkflowJSON> {
    const nodes = [
      {
        id: this.generateNodeId(),
        name: triggerNode.name,
        type: triggerNode.type,
        typeVersion: 1,
        position: triggerNode.position || [0, 0],
        parameters: triggerNode.parameters || {},
        ...(triggerNode.credentials && { credentials: triggerNode.credentials })
      }
    ];

    // Add action nodes
    actionNodes.forEach((node, index) => {
      nodes.push({
        id: this.generateNodeId(),
        name: node.name,
        type: node.type,
        typeVersion: 1,
        position: node.position || [(index + 1) * 300, 0],
        parameters: node.parameters || {},
        ...(node.credentials && { credentials: node.credentials })
      });
    });

    // Create connections
    const connections: Record<string, any> = {};
    if (actionNodes.length > 0) {
      connections[triggerNode.name] = {
        main: [
          [
            {
              node: actionNodes[0].name,
              type: 'main',
              index: 0
            }
          ]
        ]
      };

      // Chain action nodes
      for (let i = 0; i < actionNodes.length - 1; i++) {
        connections[actionNodes[i].name] = {
          main: [
            [
              {
                node: actionNodes[i + 1].name,
                type: 'main',
                index: 0
              }
            ]
          ]
        };
      }
    }

    return {
      name,
      nodes,
      connections,
      active: false,
      settings: {}
    };
  }

  /**
   * Create an MCP Server Trigger workflow
   * Based on the PDF documentation of n8n's native MCP capabilities
   */
  async createMCPServerWorkflow(
    name: string,
    toolNodes: NodeDefinition[] = [],
    authToken?: string
  ): Promise<WorkflowJSON> {
    const mcpTrigger: NodeDefinition = {
      name: 'MCP Server Trigger',
      type: 'n8n-nodes-langchain.mcpTrigger',
      parameters: {
        authentication: authToken ? 'bearer' : 'none',
        bearerToken: authToken || ''
      },
      position: [0, 0]
    };

    // Add tool nodes branching from MCP trigger
    const nodes = [
      {
        id: this.generateNodeId(),
        name: mcpTrigger.name,
        type: mcpTrigger.type,
        typeVersion: 1,
        position: mcpTrigger.position,
        parameters: mcpTrigger.parameters
      }
    ];

    toolNodes.forEach((node, index) => {
      nodes.push({
        id: this.generateNodeId(),
        name: node.name,
        type: node.type,
        typeVersion: 1,
        position: node.position || [300, index * 150],
        parameters: node.parameters || {},
        ...(node.credentials && { credentials: node.credentials })
      });
    });

    // MCP connections are different - tools branch directly from trigger
    const connections: Record<string, any> = {};
    // Note: MCP trigger handles connections differently than standard workflows
    // Tools are not connected in sequence but as separate capabilities

    return {
      name,
      nodes,
      connections,
      active: false,
      settings: {},
      tags: ['mcp', 'ai-agent']
    };
  }

  /**
   * Validate workflow JSON structure
   * Based on n8n's validation requirements from the PDF
   */
  async validateWorkflowStructure(workflow: WorkflowJSON): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (!workflow.name || workflow.name.trim() === '') {
      errors.push('Workflow name is required');
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      errors.push('Workflow must have nodes array');
    } else {
      // Validate nodes
      workflow.nodes.forEach((node, index) => {
        if (!node.name) {
          errors.push(`Node at index ${index} missing name`);
        }
        if (!node.type) {
          errors.push(`Node at index ${index} missing type`);
        }
        if (!node.position || !Array.isArray(node.position)) {
          warnings.push(`Node ${node.name} missing position`);
        }
      });

      // Check for trigger nodes
      const triggerNodes = workflow.nodes.filter(node => 
        node.type.includes('trigger') || node.type.includes('Trigger')
      );
      
      if (triggerNodes.length === 0) {
        warnings.push('Workflow has no trigger nodes - it can only be executed manually');
      }
      
      if (triggerNodes.length > 1) {
        warnings.push('Workflow has multiple trigger nodes - only one will be active');
      }
    }

    // Validate connections
    if (workflow.connections && typeof workflow.connections === 'object') {
      Object.entries(workflow.connections).forEach(([nodeName, connections]) => {
        const nodeExists = workflow.nodes?.some(node => node.name === nodeName);
        if (!nodeExists) {
          errors.push(`Connection references non-existent node: ${nodeName}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Optimize workflow for AI agent execution
   * Based on best practices from the PDF
   */
  async optimizeForAI(workflow: WorkflowJSON): Promise<WorkflowJSON> {
    const optimized = { ...workflow };

    // Add AI-friendly settings
    optimized.settings = {
      ...optimized.settings,
      saveManualExecutions: true,
      callerPolicy: 'workflowsFromSameOwner',
      timezone: 'UTC',
      errorWorkflow: '', // Could be set to an error handling workflow
      timeout: 300 // 5 minute timeout for AI operations
    };

    // Add AI-friendly tags
    optimized.tags = [
      ...(optimized.tags || []),
      'ai-optimized',
      'mcp-compatible'
    ];

    // Optimize node positions for readability
    if (optimized.nodes) {
      optimized.nodes.forEach((node, index) => {
        if (!node.position) {
          node.position = [index * 300, 0];
        }
      });
    }

    return optimized;
  }

  /**
   * Create common workflow patterns
   */
  async createCommonPatterns(): Promise<Record<string, WorkflowJSON>> {
    return {
      'webhook-to-email': await this.createBasicWorkflow(
        'Webhook to Email',
        {
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          parameters: {
            httpMethod: 'POST',
            path: 'webhook-endpoint'
          }
        },
        [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.emailSend',
            parameters: {
              toEmail: '={{ $json.email }}',
              subject: 'Webhook Received',
              text: '={{ JSON.stringify($json) }}'
            }
          }
        ]
      ),

      'schedule-to-slack': await this.createBasicWorkflow(
        'Schedule to Slack',
        {
          name: 'Schedule Trigger',
          type: 'n8n-nodes-base.cron',
          parameters: {
            cronExpression: '0 9 * * 1-5'
          }
        },
        [
          {
            name: 'Send Slack Message',
            type: 'n8n-nodes-base.slack',
            parameters: {
              operation: 'postMessage',
              channel: '#general',
              text: 'Good morning! Starting the day.'
            }
          }
        ]
      ),

      'mcp-tool-server': await this.createMCPServerWorkflow(
        'AI Agent Tool Server',
        [
          {
            name: 'HTTP Request Tool',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {}
          },
          {
            name: 'Calendar Tool',
            type: 'n8n-nodes-base.googleCalendar',
            parameters: {
              operation: 'create'
            }
          },
          {
            name: 'Slack Tool',
            type: 'n8n-nodes-base.slack',
            parameters: {
              operation: 'postMessage'
            }
          }
        ],
        'secure-ai-token-12345'
      )
    };
  }

  private generateNodeId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * MCP tool for creating workflow JSON structures
 */
export const createWorkflowJSONHelper = {
  name: 'create_workflow_json_helper',
  description: 'Create properly structured n8n workflow JSON based on documented patterns',
  
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['basic', 'mcp-server', 'pattern'],
        description: 'Type of workflow to create'
      },
      name: {
        type: 'string',
        description: 'Workflow name'
      },
      pattern: {
        type: 'string',
        enum: ['webhook-to-email', 'schedule-to-slack', 'mcp-tool-server'],
        description: 'Pre-built pattern to use (when type is pattern)'
      },
      triggerNode: {
        type: 'object',
        description: 'Trigger node configuration (when type is basic)',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          parameters: { type: 'object' }
        }
      },
      actionNodes: {
        type: 'array',
        description: 'Action nodes to add (when type is basic)',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            parameters: { type: 'object' }
          }
        }
      },
      toolNodes: {
        type: 'array',
        description: 'Tool nodes for MCP server (when type is mcp-server)',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            parameters: { type: 'object' }
          }
        }
      },
      authToken: {
        type: 'string',
        description: 'Authentication token for MCP server (when type is mcp-server)'
      }
    },
    required: ['type', 'name']
  }
} as const;