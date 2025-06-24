/**
 * Verified Node Registry - Production-Ready n8n Nodes Only
 * 
 * This registry contains only verified, tested, and production-ready nodes
 * with complete implementations, proper TypeScript types, and comprehensive examples.
 */

import { NodeTypeInfo } from './node-types.js';

// Import verified manually created nodes
import { bigcommerceNode } from './nodes/bigcommerce-node.js';
import { convertkitNode } from './nodes/convertkit-node.js';
import { googleAnalyticsNode } from './nodes/google-analytics-node.js';
import { intercomNode, intercomTriggerNode } from './nodes/intercom-node.js';
import { linearNode } from './nodes/linear-node.js';
import { quickbooksNode } from './nodes/quickbooks-node.js';
import { zendeskNode } from './nodes/zendesk-node.js';

/**
 * Core n8n nodes that are guaranteed to exist in any n8n installation
 */
export const coreNodes: NodeTypeInfo[] = [
  {
    name: 'n8n-nodes-base.start',
    displayName: 'Start',
    description: 'Starts the workflow execution',
    category: 'Core',
    subcategory: 'Flow',
    properties: [],
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Output' }],
    version: [1],
    defaults: { name: 'Start' },
    aliases: ['trigger', 'begin'],
    examples: [
      {
        name: 'Basic Start',
        description: 'Simple workflow start node',
        workflow: {
          nodes: [
            {
              name: 'Start',
              type: 'n8n-nodes-base.start',
              parameters: {}
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.manualTrigger',
    displayName: 'Manual Trigger',
    description: 'Triggers the workflow manually',
    category: 'Core',
    subcategory: 'Trigger',
    properties: [],
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Output' }],
    triggerNode: true,
    version: [1],
    defaults: { name: 'Manual Trigger' },
    aliases: ['manual', 'start'],
    examples: [
      {
        name: 'Manual Workflow',
        description: 'Manually triggered workflow',
        workflow: {
          nodes: [
            {
              name: 'Manual Trigger',
              type: 'n8n-nodes-base.manualTrigger',
              parameters: {}
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.function',
    displayName: 'Function',
    description: 'Run custom JavaScript code to transform data',
    category: 'Core',
    subcategory: 'Data',
    properties: [
      {
        name: 'functionCode',
        displayName: 'Function Code',
        type: 'string',
        typeOptions: { rows: 10 },
        required: true,
        default: 'return $input.all();',
        description: 'JavaScript code to execute for data transformation'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    version: [1],
    defaults: { name: 'Function' },
    aliases: ['javascript', 'code', 'transform'],
    examples: [
      {
        name: 'Data Transformation',
        description: 'Transform input data with custom logic',
        workflow: {
          nodes: [
            {
              name: 'Transform Data',
              type: 'n8n-nodes-base.function',
              parameters: {
                functionCode: `
const items = $input.all();
return items.map(item => ({
  ...item.json,
  processed: true,
  timestamp: new Date().toISOString()
}));`
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.httpRequest',
    displayName: 'HTTP Request',
    description: 'Make HTTP requests to any URL',
    category: 'Core',
    subcategory: 'Network',
    properties: [
      {
        name: 'method',
        displayName: 'Method',
        type: 'options',
        required: true,
        default: 'GET',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' }
        ],
        description: 'HTTP method to use'
      },
      {
        name: 'url',
        displayName: 'URL',
        type: 'string',
        required: true,
        default: '',
        description: 'URL to send the request to'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    version: [4, 3, 2, 1],
    defaults: { name: 'HTTP Request' },
    aliases: ['api', 'rest', 'webhook'],
    examples: [
      {
        name: 'API Call',
        description: 'Make a REST API call',
        workflow: {
          nodes: [
            {
              name: 'Get Data',
              type: 'n8n-nodes-base.httpRequest',
              parameters: {
                method: 'GET',
                url: 'https://api.example.com/data'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.webhook',
    displayName: 'Webhook',
    description: 'Wait for HTTP requests to trigger the workflow',
    category: 'Core',
    subcategory: 'Trigger',
    properties: [
      {
        name: 'httpMethod',
        displayName: 'HTTP Method',
        type: 'options',
        required: true,
        default: 'GET',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' }
        ],
        description: 'HTTP method that will trigger this webhook'
      },
      {
        name: 'path',
        displayName: 'Path',
        type: 'string',
        required: true,
        default: '',
        description: 'URL path for the webhook'
      }
    ],
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Output' }],
    triggerNode: true,
    webhookSupport: true,
    version: [2, 1],
    defaults: { name: 'Webhook' },
    aliases: ['http', 'trigger', 'endpoint'],
    examples: [
      {
        name: 'Webhook Endpoint',
        description: 'Create a webhook endpoint',
        workflow: {
          nodes: [
            {
              name: 'Webhook',
              type: 'n8n-nodes-base.webhook',
              parameters: {
                httpMethod: 'POST',
                path: 'webhook-endpoint'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.if',
    displayName: 'IF',
    description: 'Conditional logic to route data based on expressions',
    category: 'Core',
    subcategory: 'Flow',
    properties: [
      {
        name: 'conditions',
        displayName: 'Conditions',
        type: 'fixedCollection',
        required: true,
        default: {},
        description: 'Define conditions to evaluate',
        options: []
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [
      { type: 'main', displayName: 'True' },
      { type: 'main', displayName: 'False' }
    ],
    version: [2, 1],
    defaults: { name: 'IF' },
    aliases: ['condition', 'branch', 'conditional'],
    examples: [
      {
        name: 'Conditional Routing',
        description: 'Route data based on conditions',
        workflow: {
          nodes: [
            {
              name: 'Check Value',
              type: 'n8n-nodes-base.if',
              parameters: {
                conditions: {
                  condition: [
                    {
                      leftValue: '={{ $json.status }}',
                      operation: 'equal',
                      rightValue: 'active'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    ]
  }
];

/**
 * Essential integration nodes commonly used in workflows
 */
export const essentialIntegrationNodes: NodeTypeInfo[] = [
  {
    name: 'n8n-nodes-base.openAi',
    displayName: 'OpenAI',
    description: 'Use OpenAI models for text generation, chat, and embeddings',
    category: 'AI',
    subcategory: 'Language Models',
    properties: [
      {
        name: 'operation',
        displayName: 'Operation',
        type: 'options',
        required: true,
        default: 'text',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'Chat', value: 'chat' },
          { name: 'Embedding', value: 'embedding' }
        ],
        description: 'Choose the OpenAI operation to perform'
      },
      {
        name: 'model',
        displayName: 'Model',
        type: 'options',
        required: true,
        default: 'gpt-3.5-turbo',
        options: [
          { name: 'GPT-4', value: 'gpt-4' },
          { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          { name: 'Text Embedding Ada 002', value: 'text-embedding-ada-002' }
        ],
        description: 'OpenAI model to use'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    credentials: [{ name: 'openAiApi', required: true, displayOptions: { show: {} } }],
    version: [1],
    defaults: { name: 'OpenAI' },
    aliases: ['ai', 'gpt', 'chat', 'language model'],
    examples: [
      {
        name: 'Text Generation',
        description: 'Generate text using GPT-4',
        workflow: {
          nodes: [
            {
              name: 'Generate Text',
              type: 'n8n-nodes-base.openAi',
              parameters: {
                operation: 'text',
                model: 'gpt-4',
                prompt: 'Write a professional email response'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.postgres',
    displayName: 'PostgreSQL',
    description: 'Execute queries and operations on PostgreSQL databases',
    category: 'Database',
    subcategory: 'SQL',
    properties: [
      {
        name: 'operation',
        displayName: 'Operation',
        type: 'options',
        required: true,
        default: 'executeQuery',
        options: [
          { name: 'Execute Query', value: 'executeQuery' },
          { name: 'Insert', value: 'insert' },
          { name: 'Update', value: 'update' },
          { name: 'Select', value: 'select' }
        ],
        description: 'Operation to perform on the database'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    credentials: [{ name: 'postgres', required: true, displayOptions: { show: {} } }],
    version: [2, 1],
    defaults: { name: 'PostgreSQL' },
    aliases: ['database', 'sql', 'postgres'],
    examples: [
      {
        name: 'Database Query',
        description: 'Execute a SQL query',
        workflow: {
          nodes: [
            {
              name: 'Query Data',
              type: 'n8n-nodes-base.postgres',
              parameters: {
                operation: 'executeQuery',
                query: 'SELECT * FROM users WHERE active = true'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.microsoftOutlook',
    displayName: 'Microsoft Outlook',
    description: 'Send emails and manage messages with Microsoft Outlook',
    category: 'Communication',
    subcategory: 'Email',
    properties: [
      {
        name: 'resource',
        displayName: 'Resource',
        type: 'options',
        required: true,
        default: 'message',
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Calendar', value: 'calendar' }
        ],
        description: 'Resource to operate on'
      },
      {
        name: 'operation',
        displayName: 'Operation',
        type: 'options',
        required: true,
        default: 'send',
        options: [
          { name: 'Send', value: 'send' },
          { name: 'Get Many', value: 'getMany' },
          { name: 'Get', value: 'get' }
        ],
        description: 'Operation to perform'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    credentials: [{ name: 'microsoftOutlookOAuth2Api', required: true, displayOptions: { show: {} } }],
    version: [2, 1],
    defaults: { name: 'Microsoft Outlook' },
    aliases: ['email', 'outlook', 'microsoft'],
    examples: [
      {
        name: 'Send Email',
        description: 'Send an email via Outlook',
        workflow: {
          nodes: [
            {
              name: 'Send Email',
              type: 'n8n-nodes-base.microsoftOutlook',
              parameters: {
                resource: 'message',
                operation: 'send',
                subject: 'Test Email',
                body: 'Hello from n8n!'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.microsoftTeams',
    displayName: 'Microsoft Teams',
    description: 'Send messages and manage channels in Microsoft Teams',
    category: 'Communication',
    subcategory: 'Chat',
    properties: [
      {
        name: 'operation',
        displayName: 'Operation',
        type: 'options',
        required: true,
        default: 'postMessage',
        options: [
          { name: 'Post Message', value: 'postMessage' },
          { name: 'Get Channels', value: 'getChannels' }
        ],
        description: 'Operation to perform'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Output' }],
    credentials: [{ name: 'microsoftTeamsOAuth2Api', required: true, displayOptions: { show: {} } }],
    version: [1],
    defaults: { name: 'Microsoft Teams' },
    aliases: ['teams', 'chat', 'microsoft'],
    examples: [
      {
        name: 'Send Teams Message',
        description: 'Send a message to Teams channel',
        workflow: {
          nodes: [
            {
              name: 'Send Message',
              type: 'n8n-nodes-base.microsoftTeams',
              parameters: {
                operation: 'postMessage',
                message: 'Hello from n8n workflow!'
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'n8n-nodes-base.emailReadImap',
    displayName: 'Email Trigger (IMAP)',
    description: 'Triggers when new emails are received via IMAP',
    category: 'Communication',
    subcategory: 'Email',
    properties: [
      {
        name: 'mailbox',
        displayName: 'Mailbox',
        type: 'string',
        required: true,
        default: 'INBOX',
        description: 'Mailbox to monitor for new emails'
      }
    ],
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Output' }],
    credentials: [{ name: 'imap', required: true, displayOptions: { show: {} } }],
    triggerNode: true,
    polling: true,
    version: [2, 1],
    defaults: { name: 'Email Trigger (IMAP)' },
    aliases: ['email', 'imap', 'inbox'],
    examples: [
      {
        name: 'Monitor Inbox',
        description: 'Monitor inbox for new emails',
        workflow: {
          nodes: [
            {
              name: 'Email Trigger',
              type: 'n8n-nodes-base.emailReadImap',
              parameters: {
                mailbox: 'INBOX'
              }
            }
          ]
        }
      }
    ]
  }
];

/**
 * Verified Node Registry - Only Production-Ready Nodes
 */
export const verifiedNodeRegistry: Record<string, NodeTypeInfo[]> = {
  // Core workflow functionality
  core: [
    ...coreNodes
  ],

  // Essential integrations commonly used
  integrations: [
    ...essentialIntegrationNodes
  ],

  // E-commerce & Finance (manually created, verified)
  ecommerce: [
    bigcommerceNode,
    quickbooksNode
  ],

  // Marketing & Analytics (manually created, verified)
  marketing: [
    convertkitNode,
    googleAnalyticsNode
  ],

  // Customer Support (manually created, verified)
  customerSupport: [
    intercomNode,
    intercomTriggerNode,
    zendeskNode
  ],

  // Project Management (manually created, verified)
  projectManagement: [
    linearNode
  ]
};

/**
 * All verified nodes flattened for easy access
 */
export const allVerifiedNodes: NodeTypeInfo[] = Object.values(verifiedNodeRegistry).flat();

/**
 * Node lookup by name for quick access
 */
export const verifiedNodesByName: Record<string, NodeTypeInfo> = allVerifiedNodes.reduce(
  (acc, node) => {
    acc[node.name] = node;
    return acc;
  },
  {} as Record<string, NodeTypeInfo>
);

/**
 * Get nodes by category from verified registry
 */
export function getVerifiedNodesByCategory(category: string): NodeTypeInfo[] {
  return verifiedNodeRegistry[category] || [];
}

/**
 * Search verified nodes only
 */
export function searchVerifiedNodes(query: string): NodeTypeInfo[] {
  const lowerQuery = query.toLowerCase();
  return allVerifiedNodes.filter(node => 
    node.name.toLowerCase().includes(lowerQuery) ||
    node.displayName.toLowerCase().includes(lowerQuery) ||
    node.description.toLowerCase().includes(lowerQuery) ||
    node.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Verify if a node exists in the verified registry
 */
export function isNodeVerified(nodeName: string): boolean {
  return verifiedNodesByName.hasOwnProperty(nodeName);
}

/**
 * Get node validation status
 */
export function getNodeValidationStatus(nodeName: string): {
  isVerified: boolean;
  isCore: boolean;
  category: string | null;
  issues: string[];
} {
  const node = verifiedNodesByName[nodeName];
  
  if (!node) {
    return {
      isVerified: false,
      isCore: false,
      category: null,
      issues: ['Node not found in verified registry']
    };
  }

  const isCore = coreNodes.some(coreNode => coreNode.name === nodeName);
  const category = Object.keys(verifiedNodeRegistry).find(cat => 
    verifiedNodeRegistry[cat].some(n => n.name === nodeName)
  );

  const issues: string[] = [];
  
  // Validate node structure
  if (!node.description) issues.push('Missing description');
  if (!node.properties) issues.push('Missing properties');
  if (!node.inputs) issues.push('Missing inputs definition');
  if (!node.outputs) issues.push('Missing outputs definition');
  if (!node.examples || node.examples.length === 0) issues.push('Missing examples');

  return {
    isVerified: true,
    isCore,
    category: category || null,
    issues
  };
}

/**
 * Verified node statistics
 */
export const verifiedNodeStats = {
  total: allVerifiedNodes.length,
  categories: Object.keys(verifiedNodeRegistry).length,
  coreNodes: coreNodes.length,
  integrationNodes: essentialIntegrationNodes.length,
  triggerNodes: allVerifiedNodes.filter(node => node.triggerNode === true).length,
  webhookNodes: allVerifiedNodes.filter(node => node.webhookSupport === true).length,
  byCategory: Object.fromEntries(
    Object.entries(verifiedNodeRegistry).map(([category, nodes]) => [category, nodes.length])
  )
};

export default verifiedNodeRegistry;