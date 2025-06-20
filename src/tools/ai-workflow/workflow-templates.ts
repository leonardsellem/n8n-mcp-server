/**
 * Dynamic Workflow Templates with Variable Slots
 * 
 * Provides intelligent, customizable workflow templates that AI agents
 * can use as starting points and adapt to specific requirements.
 */

import { NodeTypeInfo } from '../../data/node-types.js';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  useCase: string;
  slots: TemplateSlot[];
  structure: WorkflowStructure;
  metadata: TemplateMetadata;
}

export interface TemplateSlot {
  id: string;
  name: string;
  description: string;
  type: 'trigger' | 'processor' | 'action' | 'condition' | 'notification';
  required: boolean;
  defaultNode?: string;
  options: SlotOption[];
  parameters?: Record<string, any>;
}

export interface SlotOption {
  nodeType: string;
  displayName: string;
  description: string;
  suitability: 'perfect' | 'good' | 'alternative';
  configuraton?: Record<string, any>;
}

export interface WorkflowStructure {
  nodes: TemplateNode[];
  connections: TemplateConnection[];
  layout: 'linear' | 'branched' | 'parallel' | 'complex';
}

export interface TemplateNode {
  id: string;
  slotId: string;
  position: [number, number];
  optional?: boolean;
}

export interface TemplateConnection {
  source: string;
  target: string;
  type: 'main' | 'error';
  condition?: string;
}

export interface TemplateMetadata {
  tags: string[];
  estimatedSetupTime: string;
  skillLevel: string;
  commonErrors: string[];
  prerequisites: string[];
  examples: TemplateExample[];
}

export interface TemplateExample {
  name: string;
  scenario: string;
  slotValues: Record<string, string>;
  parameters: Record<string, Record<string, any>>;
}

/**
 * Pre-defined workflow templates for common automation patterns
 */
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'notification_system',
    name: 'Smart Notification System',
    description: 'Flexible notification system with trigger, condition, and multiple notification channels',
    category: 'Communication',
    complexity: 'beginner',
    useCase: 'Send targeted notifications based on events or conditions',
    slots: [
      {
        id: 'trigger',
        name: 'Event Trigger',
        description: 'What event starts this workflow?',
        type: 'trigger',
        required: true,
        defaultNode: 'n8n-nodes-base.webhook',
        options: [
          {
            nodeType: 'n8n-nodes-base.webhook',
            displayName: 'Webhook',
            description: 'Receive HTTP requests from external systems',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.scheduleTrigger',
            displayName: 'Schedule',
            description: 'Run on a time-based schedule',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.manualTrigger',
            displayName: 'Manual',
            description: 'Start manually for testing',
            suitability: 'alternative'
          }
        ]
      },
      {
        id: 'condition',
        name: 'Notification Condition',
        description: 'When should notifications be sent?',
        type: 'condition',
        required: false,
        defaultNode: 'n8n-nodes-base.if',
        options: [
          {
            nodeType: 'n8n-nodes-base.if',
            displayName: 'IF Condition',
            description: 'Check conditions before sending notifications',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.code',
            displayName: 'Custom Logic',
            description: 'Complex conditional logic with code',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'notification',
        name: 'Notification Channel',
        description: 'How should notifications be delivered?',
        type: 'notification',
        required: true,
        defaultNode: 'n8n-nodes-base.slack',
        options: [
          {
            nodeType: 'n8n-nodes-base.slack',
            displayName: 'Slack',
            description: 'Send messages to Slack channels or users',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.gmail',
            displayName: 'Email',
            description: 'Send email notifications',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.httpRequest',
            displayName: 'Webhook',
            description: 'Send to external webhook endpoints',
            suitability: 'good'
          }
        ]
      }
    ],
    structure: {
      nodes: [
        { id: 'node_1', slotId: 'trigger', position: [100, 100] },
        { id: 'node_2', slotId: 'condition', position: [300, 100], optional: true },
        { id: 'node_3', slotId: 'notification', position: [500, 100] }
      ],
      connections: [
        { source: 'node_1', target: 'node_2', type: 'main' },
        { source: 'node_2', target: 'node_3', type: 'main' }
      ],
      layout: 'linear'
    },
    metadata: {
      tags: ['notification', 'monitoring', 'alerts', 'communication'],
      estimatedSetupTime: '10-15 minutes',
      skillLevel: 'Beginner friendly',
      commonErrors: [
        'Forgetting to configure webhook authentication',
        'Slack channel permissions not set correctly',
        'Missing conditional logic for spam prevention'
      ],
      prerequisites: [
        'Slack workspace access (if using Slack)',
        'Email credentials configured (if using email)',
        'Understanding of webhook endpoints'
      ],
      examples: [
        {
          name: 'Server Down Alert',
          scenario: 'Monitor server health and alert team when issues occur',
          slotValues: {
            trigger: 'n8n-nodes-base.webhook',
            condition: 'n8n-nodes-base.if',
            notification: 'n8n-nodes-base.slack'
          },
          parameters: {
            trigger: { httpMethod: 'POST', path: 'server-alert' },
            condition: { 
              conditions: {
                options: {
                  version: 2,
                  caseSensitive: true,
                  typeValidation: 'strict'
                },
                combinator: 'and',
                conditions: [
                  {
                    id: 'status_check',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.status}}',
                    rightValue: 'error'
                  }
                ]
              }
            },
            notification: { 
              resource: 'message', 
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'name',
                value: 'alerts'
              },
              text: '🚨 Server Alert: {{$json.message}}'
            }
          }
        }
      ]
    }
  },

  {
    id: 'api_data_processor',
    name: 'API Data Processing Pipeline',
    description: 'Fetch data from APIs, transform it, and store or forward to other systems',
    category: 'Data Processing',
    complexity: 'intermediate',
    useCase: 'ETL operations, data synchronization, and API integrations',
    slots: [
      {
        id: 'trigger',
        name: 'Execution Trigger',
        description: 'When should this pipeline run?',
        type: 'trigger',
        required: true,
        defaultNode: 'n8n-nodes-base.scheduleTrigger',
        options: [
          {
            nodeType: 'n8n-nodes-base.scheduleTrigger',
            displayName: 'Schedule',
            description: 'Run on a regular schedule',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.webhook',
            displayName: 'Webhook',
            description: 'Trigger on external events',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'source',
        name: 'Data Source',
        description: 'Where does the data come from?',
        type: 'processor',
        required: true,
        defaultNode: 'n8n-nodes-base.httpRequest',
        options: [
          {
            nodeType: 'n8n-nodes-base.httpRequest',
            displayName: 'HTTP API',
            description: 'Fetch data from REST APIs',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.googleSheets',
            displayName: 'Google Sheets',
            description: 'Read data from spreadsheets',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.postgres',
            displayName: 'Database',
            description: 'Query database for data',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'transform',
        name: 'Data Transformation',
        description: 'How should the data be processed?',
        type: 'processor',
        required: true,
        defaultNode: 'n8n-nodes-base.code',
        options: [
          {
            nodeType: 'n8n-nodes-base.code',
            displayName: 'Custom Code',
            description: 'JavaScript/Python for complex transformations',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.set',
            displayName: 'Set Fields',
            description: 'Simple field mapping and formatting',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'destination',
        name: 'Data Destination',
        description: 'Where should the processed data go?',
        type: 'action',
        required: true,
        defaultNode: 'n8n-nodes-base.httpRequest',
        options: [
          {
            nodeType: 'n8n-nodes-base.httpRequest',
            displayName: 'HTTP API',
            description: 'Send to external API endpoints',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.postgres',
            displayName: 'Database',
            description: 'Store in database tables',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.googleSheets',
            displayName: 'Google Sheets',
            description: 'Save to spreadsheets',
            suitability: 'good'
          }
        ]
      }
    ],
    structure: {
      nodes: [
        { id: 'node_1', slotId: 'trigger', position: [100, 100] },
        { id: 'node_2', slotId: 'source', position: [300, 100] },
        { id: 'node_3', slotId: 'transform', position: [500, 100] },
        { id: 'node_4', slotId: 'destination', position: [700, 100] }
      ],
      connections: [
        { source: 'node_1', target: 'node_2', type: 'main' },
        { source: 'node_2', target: 'node_3', type: 'main' },
        { source: 'node_3', target: 'node_4', type: 'main' }
      ],
      layout: 'linear'
    },
    metadata: {
      tags: ['etl', 'data-processing', 'api', 'integration', 'automation'],
      estimatedSetupTime: '20-30 minutes',
      skillLevel: 'Intermediate',
      commonErrors: [
        'API rate limiting not handled',
        'Data validation missing',
        'Error handling for failed transformations'
      ],
      prerequisites: [
        'API credentials and documentation',
        'Understanding of data formats (JSON, CSV)',
        'Basic knowledge of data transformation concepts'
      ],
      examples: [
        {
          name: 'Daily Sales Report',
          scenario: 'Fetch daily sales data from CRM API and send summary to team',
          slotValues: {
            trigger: 'n8n-nodes-base.scheduleTrigger',
            source: 'n8n-nodes-base.httpRequest',
            transform: 'n8n-nodes-base.code',
            destination: 'n8n-nodes-base.slack'
          },
          parameters: {
            trigger: { rule: '0 9 * * 1-5', timezone: 'UTC' },
            source: { method: 'GET', url: 'https://api.crm.com/sales/daily' },
            transform: { 
              mode: 'expression',
              jsCode: `// Calculate daily totals
const inputData = $input.all();
const total = inputData.reduce((sum, item) => sum + item.json.amount, 0);
const date = new Date().toISOString().split('T')[0];

return inputData.map(item => ({
  json: {
    ...item.json,
    date: date,
    total: total,
    processed: true
  }
}));`
            },
            destination: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'name',
                value: 'sales'
              },
              text: 'Daily Sales Report: ${{$json.total}} on {{$json.date}}'
            }
          }
        }
      ]
    }
  },

  {
    id: 'ai_content_generator',
    name: 'AI Content Generation Workflow',
    description: 'Generate content using AI models with customizable prompts and output formatting',
    category: 'AI & Content',
    complexity: 'intermediate',
    useCase: 'Automated content creation, social media posts, documentation, and creative writing',
    slots: [
      {
        id: 'trigger',
        name: 'Content Trigger',
        description: 'What initiates content generation?',
        type: 'trigger',
        required: true,
        defaultNode: 'n8n-nodes-base.manualTrigger',
        options: [
          {
            nodeType: 'n8n-nodes-base.manualTrigger',
            displayName: 'Manual',
            description: 'Generate content on demand',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.scheduleTrigger',
            displayName: 'Schedule',
            description: 'Generate content automatically',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.webhook',
            displayName: 'Webhook',
            description: 'Trigger from external systems',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'prompt_prep',
        name: 'Prompt Preparation',
        description: 'How should prompts be prepared?',
        type: 'processor',
        required: true,
        defaultNode: 'n8n-nodes-base.set',
        options: [
          {
            nodeType: 'n8n-nodes-base.set',
            displayName: 'Set Fields',
            description: 'Simple prompt templates and variables',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.code',
            displayName: 'Custom Code',
            description: 'Complex prompt engineering with logic',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'ai_generator',
        name: 'AI Model',
        description: 'Which AI service should generate content?',
        type: 'processor',
        required: true,
        defaultNode: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        options: [
          {
            nodeType: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            displayName: 'OpenAI Chat Model',
            description: 'GPT models for conversational AI and text generation',
            suitability: 'perfect'
          },
          {
            nodeType: '@n8n/n8n-nodes-langchain.chainLlm',
            displayName: 'LLM Chain',
            description: 'Chain language models with prompts',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'post_process',
        name: 'Content Processing',
        description: 'How should generated content be formatted?',
        type: 'processor',
        required: false,
        defaultNode: 'n8n-nodes-base.code',
        options: [
          {
            nodeType: 'n8n-nodes-base.code',
            displayName: 'Format Content',
            description: 'Clean up and format AI output',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.set',
            displayName: 'Add Metadata',
            description: 'Add timestamps, tags, and metadata',
            suitability: 'good'
          }
        ]
      },
      {
        id: 'output',
        name: 'Content Output',
        description: 'Where should the content be published?',
        type: 'action',
        required: true,
        defaultNode: 'n8n-nodes-base.slack',
        options: [
          {
            nodeType: 'n8n-nodes-base.slack',
            displayName: 'Slack',
            description: 'Share content in team channels',
            suitability: 'perfect'
          },
          {
            nodeType: 'n8n-nodes-base.googleSheets',
            displayName: 'Google Sheets',
            description: 'Store content in spreadsheets',
            suitability: 'good'
          },
          {
            nodeType: 'n8n-nodes-base.httpRequest',
            displayName: 'HTTP API',
            description: 'Publish to external APIs and webhooks',
            suitability: 'good'
          }
        ]
      }
    ],
    structure: {
      nodes: [
        { id: 'node_1', slotId: 'trigger', position: [100, 100] },
        { id: 'node_2', slotId: 'prompt_prep', position: [300, 100] },
        { id: 'node_3', slotId: 'ai_generator', position: [500, 100] },
        { id: 'node_4', slotId: 'post_process', position: [700, 100], optional: true },
        { id: 'node_5', slotId: 'output', position: [900, 100] }
      ],
      connections: [
        { source: 'node_1', target: 'node_2', type: 'main' },
        { source: 'node_2', target: 'node_3', type: 'main' },
        { source: 'node_3', target: 'node_4', type: 'main' },
        { source: 'node_4', target: 'node_5', type: 'main' }
      ],
      layout: 'linear'
    },
    metadata: {
      tags: ['ai', 'content-generation', 'automation', 'creative', 'openai'],
      estimatedSetupTime: '15-25 minutes',
      skillLevel: 'Intermediate',
      commonErrors: [
        'Prompt engineering not optimized for consistent output',
        'Token limits exceeded for long content',
        'Missing content moderation checks'
      ],
      prerequisites: [
        'OpenAI API key with sufficient credits',
        'Understanding of prompt engineering basics',
        'Content guidelines and moderation policies'
      ],
      examples: [
        {
          name: 'Daily Blog Post Ideas',
          scenario: 'Generate blog post ideas for content marketing team',
          slotValues: {
            trigger: 'n8n-nodes-base.scheduleTrigger',
            prompt_prep: 'n8n-nodes-base.set',
            ai_generator: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            post_process: 'n8n-nodes-base.code',
            output: 'n8n-nodes-base.slack'
          },
          parameters: {
            trigger: { rule: '0 9 * * 1', timezone: 'UTC' },
            prompt_prep: {
              mode: 'manual',
              duplicateItem: true,
              assignments: {
                assignments: [
                  {
                    id: 'prompt_field',
                    name: 'prompt',
                    type: 'string',
                    value: 'Generate 5 creative blog post ideas for a tech startup. Include title and brief description for each.'
                  },
                  {
                    id: 'timestamp_field',
                    name: 'requestedAt',
                    type: 'string',
                    value: '={{$now}}'
                  }
                ]
              }
            },
            ai_generator: {
              model: 'gpt-4o',
              options: {
                temperature: 0.7,
                maxTokens: 1000
              }
            },
            output: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'name',
                value: 'content-team'
              },
              text: 'Weekly Blog Ideas:\n{{$json.content}}'
            }
          }
        }
      ]
    }
  }
];

export class WorkflowTemplateEngine {
  private templates: WorkflowTemplate[];
  
  constructor() {
    this.templates = WORKFLOW_TEMPLATES;
  }

  /**
   * Get all available templates
   */
  getTemplates(filter?: {
    category?: string;
    complexity?: string;
    tags?: string[];
  }): WorkflowTemplate[] {
    let filtered = this.templates;
    
    if (filter?.category) {
      filtered = filtered.filter(t => t.category === filter.category);
    }
    
    if (filter?.complexity) {
      filtered = filtered.filter(t => t.complexity === filter.complexity);
    }
    
    if (filter?.tags) {
      filtered = filtered.filter(t => 
        filter.tags!.some(tag => t.metadata.tags.includes(tag))
      );
    }
    
    return filtered;
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): WorkflowTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  /**
   * Generate workflow from template with slot values
   */
  generateWorkflow(
    templateId: string,
    slotValues: Record<string, string>,
    parameters?: Record<string, Record<string, any>>
  ): any {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const workflow = {
      name: template.name,
      nodes: [] as any[],
      connections: {},
      settings: {},
      staticData: {},
      meta: {
        templateId,
        generatedAt: new Date().toISOString()
      }
    };

    // Generate nodes from template structure
    for (const node of template.structure.nodes) {
      const slot = template.slots.find(s => s.id === node.slotId);
      const nodeType = slotValues[node.slotId] || slot?.defaultNode;
      
      if (nodeType && (!node.optional || slotValues[node.slotId])) {
        const workflowNode = {
          id: node.id,
          name: this.getNodeDisplayName(nodeType),
          type: nodeType,
          typeVersion: 1,
          position: node.position,
          parameters: parameters?.[node.slotId] || slot?.parameters || {}
        };
        
        workflow.nodes.push(workflowNode);
      }
    }

    // Generate connections
    const connections: any = {};
    for (const conn of template.structure.connections) {
      const sourceExists = workflow.nodes.find(n => n.id === conn.source);
      const targetExists = workflow.nodes.find(n => n.id === conn.target);
      
      if (sourceExists && targetExists) {
        if (!connections[conn.source]) {
          connections[conn.source] = { main: [[]] };
        }
        connections[conn.source].main[0].push({
          node: conn.target,
          type: conn.type,
          index: 0
        });
      }
    }
    
    workflow.connections = connections;
    
    return workflow;
  }

  /**
   * Recommend templates based on description
   */
  recommendTemplates(description: string): WorkflowTemplate[] {
    const descLower = description.toLowerCase();
    const recommendations: { template: WorkflowTemplate; score: number }[] = [];
    
    for (const template of this.templates) {
      let score = 0;
      
      // Check description match
      if (template.description.toLowerCase().includes(descLower) ||
          descLower.includes(template.name.toLowerCase())) {
        score += 10;
      }
      
      // Check tag matches
      for (const tag of template.metadata.tags) {
        if (descLower.includes(tag)) {
          score += 5;
        }
      }
      
      // Check use case match
      if (descLower.includes(template.useCase.toLowerCase()) ||
          template.useCase.toLowerCase().includes(descLower)) {
        score += 8;
      }
      
      if (score > 0) {
        recommendations.push({ template, score });
      }
    }
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.template);
  }

  /**
   * Get node display name from type
   */
  private getNodeDisplayName(nodeType: string): string {
    // This would ideally query the node catalog
    const nodeMap: Record<string, string> = {
      'n8n-nodes-base.manualTrigger': 'Manual Trigger',
      'n8n-nodes-base.scheduleTrigger': 'Schedule Trigger',
      'n8n-nodes-base.webhook': 'Webhook',
      'n8n-nodes-base.slack': 'Slack',
      'n8n-nodes-base.httpRequest': 'HTTP Request',
      'n8n-nodes-base.code': 'Code',
      'n8n-nodes-base.set': 'Edit Fields (Set)',
      'n8n-nodes-base.if': 'IF',
      'n8n-nodes-base.gmail': 'Gmail',
      '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'OpenAI Chat Model',
      '@n8n/n8n-nodes-langchain.chainLlm': 'LLM Chain',
      '@n8n/n8n-nodes-langchain.outputParserStructured': 'Structured Output Parser',
      '@n8n/n8n-nodes-langchain.textClassifier': 'Text Classifier'
    };
    
    return nodeMap[nodeType] || nodeType;
  }
}

export default WorkflowTemplateEngine;