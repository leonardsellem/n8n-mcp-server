/**
 * Clean Node Catalog - Centralized, well-organized node registry
 * 
 * This is the single source of truth for all n8n nodes with proper tagging
 * and organization for AI agent search functionality.
 */

export interface NodeProperty {
  displayName: string;
  name: string;
  type: string;
  default?: any;
  description?: string;
  required?: boolean;
  options?: Array<{
    name: string;
    value: any;
    description?: string;
    displayName?: string;
    values?: NodeProperty[];
  }>;
  placeholder?: string;
  hint?: string;
  noDataExpression?: boolean;
  typeOptions?: {
    alwaysOpenEditWindow?: boolean;
    codeAutocomplete?: string;
    editor?: string;
    rows?: number;
    multipleValues?: boolean;
    multipleValueButtonText?: string;
    editorLanguage?: string;
  };
  displayOptions?: {
    show?: { [key: string]: any[] };
    hide?: { [key: string]: any[] };
  };
}

export interface NodeCredential {
  name: string;
  displayName: string;
  required?: boolean;
  testedBy?: string;
  displayOptions?: any;
}

export interface NodeInfo {
  name: string;
  displayName: string;
  description: string;
  version: number;
  category: string;
  subcategory?: string;
  tags: string[];
  icon?: string;
  iconData?: {
    type: 'file' | 'svg';
    fileBuffer?: string;
    svg?: string;
  };
  
  // Node type configuration
  triggerNode: boolean;
  webhookNode?: boolean;
  pollingNode?: boolean;
  codeable?: boolean;
  
  // Inputs and outputs
  inputs: Array<{
    type: string;
    displayName: string;
    required?: boolean;
    maxConnections?: number;
  }>;
  outputs: Array<{
    type: string;
    displayName: string;
  }>;
  
  // Properties and configuration
  properties: NodeProperty[];
  credentials?: NodeCredential[];
  
  // Webhook configuration (for webhook nodes)
  webhooks?: Array<{
    name: string;
    httpMethod: string | string[];
    responseMode: string;
    path: string;
  }>;
  
  // Execution configuration
  defaults: {
    name: string;
    color?: string;
  };
  
  // AI Agent helpers
  commonUseCase: string;
  exampleConfiguration?: { [key: string]: any };
  commonParameters?: { [key: string]: any };
  documentation: string;
  
  // Workflow patterns this node fits into
  workflowPatterns?: string[];
  
  // Function code (for function nodes)
  functionTemplate?: string;
  
  // SQL template (for database nodes)
  sqlTemplate?: string;
}

/**
 * Core Workflow Nodes - Essential building blocks
 */
export const CORE_NODES: NodeInfo[] = [
  {
    name: 'n8n-nodes-base.webhook',
    displayName: 'Webhook',
    description: 'Receive HTTP requests and trigger workflows',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'HTTP',
    tags: ['trigger', 'http', 'webhook', 'api', 'receive', 'rest'],
    icon: 'webhook.svg',
    triggerNode: true,
    webhookNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'HTTP Method',
        name: 'httpMethod',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' },
          { name: 'HEAD', value: 'HEAD' }
        ],
        default: 'POST',
        description: 'The HTTP method to listen for'
      },
      {
        displayName: 'Path',
        name: 'path',
        type: 'string',
        default: '',
        placeholder: 'webhook-path',
        description: 'The path for the webhook URL'
      },
      {
        displayName: 'Response Mode',
        name: 'responseMode',
        type: 'options',
        options: [
          { name: 'On Received', value: 'onReceived' },
          { name: 'Last Node', value: 'lastNode' }
        ],
        default: 'onReceived',
        description: 'When to respond to the webhook'
      }
    ],
    webhooks: [{
      name: 'default',
      httpMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
      responseMode: 'onReceived',
      path: 'webhook'
    }],
    defaults: {
      name: 'Webhook',
      color: '#885577'
    },
    commonUseCase: 'Start workflows from external HTTP requests, APIs, or services',
    exampleConfiguration: {
      httpMethod: 'POST',
      path: 'my-webhook',
      responseMode: 'onReceived'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/',
    workflowPatterns: ['webhook_to_email', 'ai_processing', 'notification_system', 'data_transformation']
  },
  {
    name: 'n8n-nodes-base.httpRequest',
    displayName: 'HTTP Request',
    description: 'Make HTTP requests to any URL',
    version: 3,
    category: 'Regular Nodes',
    subcategory: 'HTTP',
    tags: ['http', 'request', 'api', 'call', 'get', 'post', 'put', 'delete', 'rest'],
    icon: 'httprequest.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Request Method',
        name: 'requestMethod',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' },
          { name: 'HEAD', value: 'HEAD' }
        ],
        default: 'GET',
        description: 'The request method to use'
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://httpbin.org/get',
        required: true,
        description: 'The URL to make the request to'
      },
      {
        displayName: 'Response Format',
        name: 'responseFormat',
        type: 'options',
        options: [
          { name: 'Autodetect', value: 'autodetect' },
          { name: 'JSON', value: 'json' },
          { name: 'String', value: 'string' }
        ],
        default: 'autodetect',
        description: 'The format in which the response should be returned'
      }
    ],
    defaults: {
      name: 'HTTP Request',
      color: '#d0b402'
    },
    commonUseCase: 'Call external APIs and services, fetch data from web endpoints',
    exampleConfiguration: {
      requestMethod: 'GET',
      url: 'https://api.example.com/data',
      responseFormat: 'json'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/',
    workflowPatterns: ['database_sync', 'ai_processing', 'data_transformation']
  },
  {
    name: 'n8n-nodes-base.set',
    displayName: 'Set',
    description: 'Set node data and manipulate it',
    version: 2,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: ['data', 'set', 'manipulate', 'transform', 'modify', 'assign', 'map'],
    icon: 'set.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Keep Only Set',
        name: 'keepOnlySet',
        type: 'boolean',
        default: false,
        description: 'If only the values set on this node should be kept and all others removed'
      },
      {
        displayName: 'Values to Set',
        name: 'values',
        placeholder: 'Add Value',
        type: 'fixedCollection',
        description: 'The value to set',
        default: {},
        options: [
          {
            name: 'boolean',
            displayName: 'Boolean',
            value: 'boolean',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: 'propertyName',
                description: 'Name of the property to write data to'
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'boolean',
                default: false,
                description: 'The boolean value to write in the property'
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'Set',
      color: '#0000FF'
    },
    commonUseCase: 'Transform and set data values in workflows, prepare data for next nodes',
    exampleConfiguration: {
      keepOnlySet: false,
      values: {
        string: [
          {
            name: 'greeting',
            value: 'Hello World!'
          }
        ]
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/',
    workflowPatterns: ['webhook_to_email', 'ai_processing', 'data_transformation', 'email_automation']
  },
  {
    name: 'n8n-nodes-base.function',
    displayName: 'Function',
    description: 'Execute JavaScript code',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Code',
    tags: ['javascript', 'code', 'function', 'custom', 'logic', 'script', 'transform'],
    icon: 'function.svg',
    triggerNode: false,
    codeable: true,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'JavaScript Code',
        name: 'functionCode',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          codeAutocomplete: 'function',
          editor: 'code',
          rows: 10
        },
        default: `// Code here will run once per input item.
// More info and help: https://docs.n8n.io/code-examples/javascript-functions/

// You can write logs to browser console
console.log('My log message');

// Return data to pass to next node
return $input.all();`,
        description: 'The JavaScript code to execute',
        required: true
      }
    ],
    defaults: {
      name: 'Function',
      color: '#FF9922'
    },
    commonUseCase: 'Custom data processing and business logic, complex transformations',
    exampleConfiguration: {
      functionCode: `// Process each item
for (const item of $input.all()) {
  item.json.processedAt = new Date().toISOString();
  item.json.uppercase = item.json.text?.toUpperCase();
}
return $input.all();`
    },
    functionTemplate: `// Code here will run once per input item.
// Access input data: $input.all() or $input.first()
// Access node context: $('Node Name').all()
// Return data: return $input.all();

for (const item of $input.all()) {
  // Process each item
  item.json.processed = true;
}

return $input.all();`,
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function/',
    workflowPatterns: ['ai_processing', 'data_transformation', 'database_sync']
  },
  {
    name: 'n8n-nodes-base.if',
    displayName: 'IF',
    description: 'Split workflow based on conditions',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow',
    tags: ['condition', 'if', 'logic', 'branch', 'decision', 'split', 'conditional'],
    icon: 'if.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [
      { type: 'main', displayName: 'True' },
      { type: 'main', displayName: 'False' }
    ],
    properties: [
      {
        displayName: 'Conditions',
        name: 'conditions',
        placeholder: 'Add Condition',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true
        },
        description: 'The type of values to compare',
        default: {},
        options: [
          {
            name: 'boolean',
            displayName: 'Boolean',
            value: 'boolean',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'boolean',
                default: false,
                description: 'The value to compare with the second one'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'Equal', value: 'equal' },
                  { name: 'Not Equal', value: 'notEqual' }
                ],
                default: 'equal',
                description: 'Operation to decide where the the data should be mapped to'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'boolean',
                default: false,
                description: 'The value to compare with the first one'
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'IF',
      color: '#408000'
    },
    commonUseCase: 'Conditional workflow branching, decision making based on data',
    exampleConfiguration: {
      conditions: {
        boolean: [
          {
            value1: '={{$json["status"]}}',
            operation: 'equal',
            value2: true
          }
        ]
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/',
    workflowPatterns: ['notification_system', 'email_automation']
  },
  {
    name: 'n8n-nodes-base.merge',
    displayName: 'Merge',
    description: 'Merge data from multiple inputs',
    version: 2,
    category: 'Regular Nodes',
    subcategory: 'Flow',
    tags: ['merge', 'combine', 'join', 'data', 'multiple', 'union'],
    icon: 'merge.svg',
    triggerNode: false,
    inputs: [
      { type: 'main', displayName: 'Input 1', required: true },
      { type: 'main', displayName: 'Input 2', required: true }
    ],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'Append', value: 'append' },
          { name: 'Pass-through', value: 'passThrough' },
          { name: 'Wait', value: 'wait' }
        ],
        default: 'append',
        description: 'How data should be merged'
      }
    ],
    defaults: {
      name: 'Merge',
      color: '#00cc22'
    },
    commonUseCase: 'Combine data from multiple workflow paths',
    exampleConfiguration: {
      mode: 'append'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/'
  },
  {
    name: 'n8n-nodes-base.filter',
    displayName: 'Filter',
    description: 'Filter items based on a condition. If the item meets the condition, the Filter node passes it on to the next node in the Filter node output. If the item doesn\'t meet the condition, the Filter node omits the item from its output.',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow',
    tags: ['filter', 'conditions', 'data filtering', 'conditional filtering', 'keep items', 'remove items', 'condition matching', 'data processing'],
    icon: 'filter.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Conditions',
        name: 'conditions',
        placeholder: 'Add Condition',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          multipleValueButtonText: 'Add condition'
        },
        description: 'Create filter comparison conditions to perform your filter',
        default: {},
        options: [
          {
            name: 'string',
            displayName: 'String',
            value: 'string',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'string',
                default: '',
                description: 'The value to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' },
                  { name: 'is equal to', value: 'equal' },
                  { name: 'is not equal to', value: 'notEqual' },
                  { name: 'contains', value: 'contains' },
                  { name: 'does not contain', value: 'notContains' },
                  { name: 'starts with', value: 'startsWith' },
                  { name: 'does not start with', value: 'notStartsWith' },
                  { name: 'ends with', value: 'endsWith' },
                  { name: 'does not end with', value: 'notEndsWith' },
                  { name: 'matches regex', value: 'regex' },
                  { name: 'does not match regex', value: 'notRegex' }
                ],
                default: 'equal',
                description: 'The comparison operation'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'string',
                default: '',
                description: 'The value to compare against'
              }
            ]
          },
          {
            name: 'number',
            displayName: 'Number',
            value: 'number',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'number',
                default: 0,
                description: 'The number to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' },
                  { name: 'is equal to', value: 'equal' },
                  { name: 'is not equal to', value: 'notEqual' },
                  { name: 'is greater than', value: 'greaterThan' },
                  { name: 'is less than', value: 'lessThan' },
                  { name: 'is greater than or equal to', value: 'greaterThanOrEqual' },
                  { name: 'is less than or equal to', value: 'lessThanOrEqual' }
                ],
                default: 'equal',
                description: 'The comparison operation'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'number',
                default: 0,
                description: 'The number to compare against'
              }
            ]
          },
          {
            name: 'dateTime',
            displayName: 'Date & Time',
            value: 'dateTime',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'dateTime',
                default: '',
                description: 'The date/time to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' },
                  { name: 'is equal to', value: 'equal' },
                  { name: 'is not equal to', value: 'notEqual' },
                  { name: 'is after', value: 'after' },
                  { name: 'is before', value: 'before' },
                  { name: 'is after or equal to', value: 'afterOrEqual' },
                  { name: 'is before or equal to', value: 'beforeOrEqual' }
                ],
                default: 'equal',
                description: 'The comparison operation'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'dateTime',
                default: '',
                description: 'The date/time to compare against'
              }
            ]
          },
          {
            name: 'boolean',
            displayName: 'Boolean',
            value: 'boolean',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'boolean',
                default: false,
                description: 'The boolean value to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' },
                  { name: 'is true', value: 'true' },
                  { name: 'is false', value: 'false' },
                  { name: 'is equal to', value: 'equal' },
                  { name: 'is not equal to', value: 'notEqual' }
                ],
                default: 'equal',
                description: 'The comparison operation'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'boolean',
                default: false,
                description: 'The boolean value to compare against'
              }
            ]
          },
          {
            name: 'array',
            displayName: 'Array',
            value: 'array',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'string',
                default: '',
                description: 'The array to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' },
                  { name: 'contains', value: 'contains' },
                  { name: 'does not contain', value: 'notContains' },
                  { name: 'length equal to', value: 'lengthEqual' },
                  { name: 'length not equal to', value: 'lengthNotEqual' },
                  { name: 'length greater than', value: 'lengthGreaterThan' },
                  { name: 'length less than', value: 'lengthLessThan' },
                  { name: 'length greater than or equal to', value: 'lengthGreaterThanOrEqual' },
                  { name: 'length less than or equal to', value: 'lengthLessThanOrEqual' }
                ],
                default: 'contains',
                description: 'The comparison operation'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'string',
                default: '',
                description: 'The value to compare against'
              }
            ]
          },
          {
            name: 'object',
            displayName: 'Object',
            value: 'object',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'string',
                default: '',
                description: 'The object to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'exists', value: 'exists' },
                  { name: 'does not exist', value: 'notExists' },
                  { name: 'is empty', value: 'isEmpty' },
                  { name: 'is not empty', value: 'isNotEmpty' }
                ],
                default: 'exists',
                description: 'The comparison operation'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Combine Conditions',
        name: 'combineOperation',
        type: 'options',
        options: [
          { name: 'AND', value: 'and', description: 'Keep items when they meet all conditions' },
          { name: 'OR', value: 'or', description: 'Keep items when they meet any of the conditions' }
        ],
        default: 'and',
        description: 'How to combine multiple conditions'
      }
    ],
    defaults: {
      name: 'Filter',
      color: '#229954'
    },
    commonUseCase: 'Filter data based on conditions, keep only items that match criteria, remove unwanted data items',
    exampleConfiguration: {
      conditions: {
        string: [
          {
            value1: '={{$json["status"]}}',
            operation: 'equal',
            value2: 'active'
          }
        ]
      },
      combineOperation: 'and'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.filter/',
    workflowPatterns: ['data_transformation', 'conditional_processing', 'data_cleaning', 'quality_control']
  }
];

/**
 * AI & Language Model Nodes
 */
export const AI_NODES: NodeInfo[] = [
  {
    name: '@n8n/n8n-nodes-langchain.chatOpenAi',
    displayName: 'OpenAI Chat Model',
    description: 'Use OpenAI models like GPT-4 for conversational AI',
    version: 1,
    category: 'AI',
    subcategory: 'Language Models',
    tags: ['ai', 'openai', 'gpt', 'chat', 'language model', 'conversation', 'llm'],
    icon: 'openai.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
          { name: 'gpt-4', value: 'gpt-4' },
          { name: 'gpt-4-turbo', value: 'gpt-4-turbo' },
          { name: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' }
        ],
        default: 'gpt-3.5-turbo',
        description: 'The model which will generate the completion'
      },
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
          rows: 4
        },
        default: '',
        description: 'The prompt to send to the model',
        required: true
      }
    ],
    credentials: [
      {
        name: 'openAiApi',
        displayName: 'OpenAI',
        required: true
      }
    ],
    defaults: {
      name: 'OpenAI Chat Model',
      color: '#10A37F'
    },
    commonUseCase: 'AI-powered text generation and conversation, content creation',
    exampleConfiguration: {
      model: 'gpt-4',
      prompt: 'Analyze the following data and provide insights: {{$json.data}}'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.chatopenai/',
    workflowPatterns: ['ai_processing', 'email_automation']
  },
  {
    name: '@n8n/n8n-nodes-langchain.chatAnthropic',
    displayName: 'Anthropic Chat Model',
    description: 'Use Anthropic Claude models for AI conversations',
    version: 1,
    category: 'AI',
    subcategory: 'Language Models',
    tags: ['ai', 'anthropic', 'claude', 'chat', 'language model', 'conversation', 'llm'],
    icon: 'anthropic.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
          { name: 'claude-3-opus-20240229', value: 'claude-3-opus-20240229' },
          { name: 'claude-3-sonnet-20240229', value: 'claude-3-sonnet-20240229' },
          { name: 'claude-3-haiku-20240307', value: 'claude-3-haiku-20240307' }
        ],
        default: 'claude-3-sonnet-20240229',
        description: 'The model which will generate the completion'
      }
    ],
    credentials: [
      {
        name: 'anthropicApi',
        displayName: 'Anthropic',
        required: true
      }
    ],
    defaults: {
      name: 'Anthropic Chat Model',
      color: '#D97757'
    },
    commonUseCase: 'AI conversations with Claude models for analysis and content creation',
    documentation: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.chatanthropic/',
    workflowPatterns: ['ai_processing']
  },
  {
    name: '@n8n/n8n-nodes-langchain.vectorStoreSupabase',
    displayName: 'Supabase Vector Store',
    description: 'Store and query vectors using Supabase',
    version: 1,
    category: 'AI',
    subcategory: 'Vector Databases',
    tags: ['ai', 'vector', 'supabase', 'database', 'embeddings', 'search', 'rag'],
    icon: 'supabase.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'Get Many', value: 'load' },
          { name: 'Insert Documents', value: 'insert' },
          { name: 'Search', value: 'search' }
        ],
        default: 'search',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'supabaseApi',
        displayName: 'Supabase',
        required: true
      }
    ],
    defaults: {
      name: 'Supabase Vector Store',
      color: '#3ECF8E'
    },
    commonUseCase: 'Vector similarity search and RAG systems, semantic search',
    documentation: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.vectorstoresupabase/'
  },
  {
    name: '@n8n/n8n-nodes-langchain.embeddingsOpenAi',
    displayName: 'OpenAI Embeddings',
    description: 'Generate embeddings using OpenAI models',
    version: 1,
    category: 'AI',
    subcategory: 'Embeddings',
    tags: ['ai', 'openai', 'embeddings', 'vector', 'text', 'similarity'],
    icon: 'openai.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
          { name: 'text-embedding-ada-002', value: 'text-embedding-ada-002' },
          { name: 'text-embedding-3-small', value: 'text-embedding-3-small' },
          { name: 'text-embedding-3-large', value: 'text-embedding-3-large' }
        ],
        default: 'text-embedding-ada-002',
        description: 'The model which will generate the embeddings'
      }
    ],
    credentials: [
      {
        name: 'openAiApi',
        displayName: 'OpenAI',
        required: true
      }
    ],
    defaults: {
      name: 'OpenAI Embeddings',
      color: '#10A37F'
    },
    commonUseCase: 'Convert text to vector embeddings for similarity search',
    documentation: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsopenai/'
  }
];

/**
 * Communication & Messaging Nodes
 */
export const COMMUNICATION_NODES: NodeInfo[] = [
  {
    name: 'n8n-nodes-base.gmail',
    displayName: 'Gmail',
    description: 'Comprehensive Gmail automation with full support for drafts, labels, messages, and threads. Manage your Gmail account programmatically with complete CRUD operations across all Gmail resources.',
    version: 2,
    category: 'Communication',
    subcategory: 'Email',
    tags: [
      'gmail', 'google', 'email', 'send email', 'receive email', 'email automation', 'message management',
      'draft', 'label', 'message', 'thread', 'email labels', 'email threads', 'email drafts',
      'create draft', 'delete draft', 'get draft', 'get many drafts',
      'create label', 'delete label', 'get label', 'get many labels',
      'send message', 'get message', 'get many messages', 'delete message', 'add label to message', 'remove label from message',
      'mark message as read', 'mark message as unread', 'reply to message',
      'get thread', 'get many threads', 'delete thread', 'add label to thread', 'remove label from thread',
      'reply to thread', 'trash thread', 'untrash thread',
      'email management', 'gmail api', 'google workspace', 'office automation', 'communication automation'
    ],
    icon: 'gmail.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Draft', value: 'draft', description: 'Manage email drafts' },
          { name: 'Label', value: 'label', description: 'Manage Gmail labels' },
          { name: 'Message', value: 'message', description: 'Manage individual messages' },
          { name: 'Thread', value: 'thread', description: 'Manage email threads' }
        ],
        default: 'message',
        description: 'The Gmail resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['draft']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a draft' },
          { name: 'Delete', value: 'delete', description: 'Delete a draft' },
          { name: 'Get', value: 'get', description: 'Get a draft' },
          { name: 'Get Many', value: 'getMany', description: 'Get many drafts' }
        ],
        default: 'create',
        description: 'The operation to perform on drafts'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['label']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a label' },
          { name: 'Delete', value: 'delete', description: 'Delete a label' },
          { name: 'Get', value: 'get', description: 'Get a label' },
          { name: 'Get Many', value: 'getMany', description: 'Get many labels' }
        ],
        default: 'create',
        description: 'The operation to perform on labels'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Send', value: 'send', description: 'Send a message' },
          { name: 'Get', value: 'get', description: 'Get a message' },
          { name: 'Get Many', value: 'getMany', description: 'Get many messages' },
          { name: 'Delete', value: 'delete', description: 'Delete a message' },
          { name: 'Add Label', value: 'addLabel', description: 'Add label to message' },
          { name: 'Remove Label', value: 'removeLabel', description: 'Remove label from message' },
          { name: 'Mark as Read', value: 'markAsRead', description: 'Mark message as read' },
          { name: 'Mark as Unread', value: 'markAsUnread', description: 'Mark message as unread' },
          { name: 'Reply', value: 'reply', description: 'Reply to message' }
        ],
        default: 'send',
        description: 'The operation to perform on messages'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['thread']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a thread' },
          { name: 'Get Many', value: 'getMany', description: 'Get many threads' },
          { name: 'Delete', value: 'delete', description: 'Delete a thread' },
          { name: 'Add Label', value: 'addLabel', description: 'Add label to thread' },
          { name: 'Remove Label', value: 'removeLabel', description: 'Remove label from thread' },
          { name: 'Reply', value: 'reply', description: 'Reply to thread' },
          { name: 'Trash', value: 'trash', description: 'Move thread to trash' },
          { name: 'Untrash', value: 'untrash', description: 'Remove thread from trash' }
        ],
        default: 'get',
        description: 'The operation to perform on threads'
      }
    ],
    credentials: [
      {
        name: 'googleOAuth2Api',
        displayName: 'Google OAuth2 API',
        required: true,
        testedBy: 'testGoogleAuth'
      }
    ],
    defaults: {
      name: 'Gmail',
      color: '#EA4335'
    },
    commonUseCase: 'Comprehensive Gmail automation including email sending, receiving, draft management, label organization, and thread handling for complete email workflow automation',
    exampleConfiguration: {
      resource: 'message',
      operation: 'send',
      to: 'recipient@example.com',
      subject: 'Automated Gmail Message',
      message: 'This is a comprehensive automated email sent via n8n Gmail integration with full feature support.'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/',
    workflowPatterns: [
      'webhook_to_email',
      'email_automation',
      'notification_system',
      'email_processing',
      'customer_communication',
      'automated_responses',
      'email_management',
      'gmail_organization'
    ]
  },
  {
    name: 'n8n-nodes-base.slack',
    displayName: 'Slack',
    description: 'Send messages and interact with Slack',
    version: 2,
    category: 'Communication',
    subcategory: 'Team Chat',
    tags: ['slack', 'message', 'chat', 'team', 'notification', 'channel'],
    icon: 'slack.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Message', value: 'message' },
          { name: 'User', value: 'user' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Post', value: 'post' },
          { name: 'Update', value: 'update' },
          { name: 'Delete', value: 'delete' }
        ],
        default: 'post',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'slackOAuth2Api',
        displayName: 'Slack OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Slack',
      color: '#4A154B'
    },
    commonUseCase: 'Team notifications and communication, workflow status updates',
    exampleConfiguration: {
      resource: 'message',
      operation: 'post',
      channel: '#general',
      text: 'Workflow completed successfully!'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.slack/',
    workflowPatterns: ['notification_system', 'email_automation']
  },
  {
    name: 'n8n-nodes-base.microsoftOutlook',
    displayName: 'Microsoft Outlook',
    description: 'Manage emails and calendar in Outlook',
    version: 2,
    category: 'Communication',
    subcategory: 'Email',
    tags: ['outlook', 'microsoft', 'email', 'calendar', 'office365', 'mail'],
    icon: 'microsoftoutlook.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Calendar', value: 'calendar' },
          { name: 'Contact', value: 'contact' },
          { name: 'Draft', value: 'draft' },
          { name: 'Folder', value: 'folder' },
          { name: 'Folder Message', value: 'folderMessage' },
          { name: 'Message', value: 'message' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      }
    ],
    credentials: [
      {
        name: 'microsoftOutlookOAuth2Api',
        displayName: 'Microsoft Outlook OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Microsoft Outlook',
      color: '#0078D4'
    },
    commonUseCase: 'Outlook email and calendar automation, enterprise email workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsoftoutlook/',
    workflowPatterns: ['email_automation']
  }
];

/**
 * Database & Storage Nodes
 */
export const DATABASE_NODES: NodeInfo[] = [
  {
    name: 'n8n-nodes-base.postgres',
    displayName: 'PostgreSQL',
    description: 'Execute queries on PostgreSQL database',
    version: 2,
    category: 'Database',
    subcategory: 'SQL',
    tags: [
      'database', 'postgresql', 'sql', 'query', 'data', 'postgres',
      'execute query', 'insert data', 'update data', 'delete data', 'select data',
      'delete table or rows', 'execute a sql query', 'insert row in a table',
      'insert or update rows in a table', 'select rows from a table', 'update rows in a table',
      'database operations', 'sql database', 'relational database', 'data storage'
    ],
    icon: 'postgres.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Execute Query', value: 'executeQuery', description: 'Execute a SQL query' },
          { name: 'Insert', value: 'insert', description: 'Insert row in a table' },
          { name: 'Update', value: 'update', description: 'Update rows in a table' },
          { name: 'Delete', value: 'delete', description: 'Delete table or rows' },
          { name: 'Select', value: 'select', description: 'Select rows from a table' },
          { name: 'Insert or Update', value: 'upsert', description: 'Insert or update rows in a table' }
        ],
        default: 'executeQuery',
        description: 'The operation to perform'
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          editor: 'code',
          editorLanguage: 'sql'
        },
        default: '',
        placeholder: 'SELECT * FROM table_name',
        required: true,
        displayOptions: {
          show: {
            operation: ['executeQuery']
          }
        },
        description: 'The SQL query to execute'
      },
      {
        displayName: 'Table',
        name: 'table',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['insert', 'update', 'delete', 'select', 'upsert']
          }
        },
        description: 'Name of the table to operate on'
      }
    ],
    credentials: [
      {
        name: 'postgres',
        displayName: 'PostgreSQL',
        required: true
      }
    ],
    defaults: {
      name: 'PostgreSQL',
      color: '#336791'
    },
    commonUseCase: 'Database operations and data storage, SQL queries, CRUD operations',
    exampleConfiguration: {
      operation: 'executeQuery',
      query: 'SELECT * FROM users WHERE status = \'active\''
    },
    sqlTemplate: `-- Sample PostgreSQL queries

-- Select rows from a table
SELECT * FROM table_name
WHERE condition = 'value'
ORDER BY column_name;

-- Insert row in a table
INSERT INTO table_name (column1, column2, column3)
VALUES ('value1', 'value2', 'value3');

-- Update rows in a table
UPDATE table_name
SET column1 = 'new_value'
WHERE condition = 'value';

-- Delete table or rows
DELETE FROM table_name
WHERE condition = 'value';

-- Insert or update rows in a table (UPSERT)
INSERT INTO table_name (id, column1, column2)
VALUES (1, 'value1', 'value2')
ON CONFLICT (id) DO UPDATE SET
column1 = EXCLUDED.column1,
column2 = EXCLUDED.column2;`,
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/',
    workflowPatterns: ['database_sync']
  },
  {
    name: 'n8n-nodes-base.supabase',
    displayName: 'Supabase',
    description: 'Interact with Supabase database and services',
    version: 1,
    category: 'Database',
    subcategory: 'Cloud Database',
    tags: ['supabase', 'database', 'postgresql', 'cloud', 'api', 'backend'],
    icon: 'supabase.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Row', value: 'row' }
        ],
        default: 'row',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get Many', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'supabaseApi',
        displayName: 'Supabase',
        required: true
      }
    ],
    defaults: {
      name: 'Supabase',
      color: '#3ECF8E'
    },
    commonUseCase: 'Cloud database operations with Supabase, modern app backends',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/'
  },
  {
    name: '@n8n/n8n-nodes-langchain.vectorStorePostgres',
    displayName: 'Postgres PGVector Store',
    description: 'Store and query vectors using PostgreSQL with pgvector extension',
    version: 1,
    category: 'AI',
    subcategory: 'Vector Databases',
    tags: [
      'ai', 'vector', 'postgres', 'pgvector', 'database', 'embeddings', 'search', 'rag',
      'get ranked documents from vector store', 'add documents to vector store',
      'retrieve documents for Chain/Tool as Vector Store', 'retrieve documents for AI Agent as Tool',
      'vector similarity search', 'document retrieval', 'semantic search'
    ],
    icon: 'postgres.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'Get Ranked Documents', value: 'load', description: 'Get ranked documents from vector store' },
          { name: 'Add Documents', value: 'insert', description: 'Add documents to vector store' },
          { name: 'Retrieve for Chain/Tool', value: 'search', description: 'Retrieve documents for Chain/Tool as Vector Store' },
          { name: 'Retrieve for AI Agent', value: 'agent', description: 'Retrieve documents for AI Agent as Tool' }
        ],
        default: 'search',
        description: 'The operation to perform'
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'The search query for document retrieval',
        displayOptions: {
          show: {
            mode: ['search', 'load', 'agent']
          }
        }
      },
      {
        displayName: 'Documents',
        name: 'documents',
        type: 'string',
        typeOptions: {
          rows: 4
        },
        default: '',
        description: 'Documents to add to the vector store',
        displayOptions: {
          show: {
            mode: ['insert']
          }
        }
      },
      {
        displayName: 'Top K',
        name: 'topK',
        type: 'number',
        default: 5,
        description: 'Number of top results to return',
        displayOptions: {
          show: {
            mode: ['search', 'load', 'agent']
          }
        }
      }
    ],
    credentials: [
      {
        name: 'postgres',
        displayName: 'PostgreSQL',
        required: true
      }
    ],
    defaults: {
      name: 'Postgres PGVector Store',
      color: '#336791'
    },
    commonUseCase: 'Vector similarity search with PostgreSQL pgvector, RAG systems, semantic document retrieval',
    exampleConfiguration: {
      mode: 'search',
      query: 'Find documents about machine learning',
      topK: 5
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.vectorstorepostgres/',
    workflowPatterns: ['ai_processing', 'database_sync']
  }
];

/**
 * Trigger Nodes for Workflow Automation
 */
export const TRIGGER_NODES: NodeInfo[] = [
  {
    name: 'n8n-nodes-base.scheduleTrigger',
    displayName: 'Schedule Trigger',
    description: 'Trigger workflows on a schedule',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'Time',
    tags: ['trigger', 'schedule', 'time', 'cron', 'interval', 'timer'],
    icon: 'scheduletrigger.svg',
    triggerNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Trigger Times',
        name: 'triggerTimes',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          multipleValueButtonText: 'Add Time'
        },
        default: {},
        description: 'Triggers for the workflow',
        placeholder: 'Add Cron Time',
        options: [
          {
            name: 'item',
            displayName: 'Item',
            value: 'item',
            values: [
              {
                displayName: 'Mode',
                name: 'mode',
                type: 'options',
                options: [
                  { name: 'Every Minute', value: 'everyMinute' },
                  { name: 'Every Hour', value: 'everyHour' },
                  { name: 'Every Day', value: 'everyDay' },
                  { name: 'Every Week', value: 'everyWeek' },
                  { name: 'Every Month', value: 'everyMonth' },
                  { name: 'Custom', value: 'custom' }
                ],
                default: 'everyDay',
                description: 'How often to trigger'
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'Schedule Trigger',
      color: '#00FF00'
    },
    commonUseCase: 'Scheduled workflow execution, periodic data processing',
    exampleConfiguration: {
      triggerTimes: {
        item: [
          {
            mode: 'everyDay',
            hour: 9,
            minute: 0
          }
        ]
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/',
    workflowPatterns: ['database_sync']
  },
  {
    name: 'n8n-nodes-base.manualTrigger',
    displayName: 'Manual Trigger',
    description: 'Manually trigger workflow execution',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'Manual',
    tags: ['trigger', 'manual', 'start', 'execute', 'test'],
    icon: 'manualtrigger.svg',
    triggerNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [],
    defaults: {
      name: 'Manual Trigger',
      color: '#00D4AA'
    },
    commonUseCase: 'Manual workflow testing and execution, development workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualtrigger/'
  }
];

/**
 * Additional Essential Nodes - High-Priority Integrations
 * Based on official n8n documentation with complete action sets
 */
export const ESSENTIAL_NODES: NodeInfo[] = [
  // Action Network - Political activism platform
  {
    name: 'n8n-nodes-base.actionNetwork',
    displayName: 'Action Network',
    description: 'Automate work in Action Network for political activism',
    version: 1,
    category: 'Communication',
    subcategory: 'Activism',
    tags: [
      'action network', 'activism', 'political', 'events', 'people', 'petitions', 'tags',
      'get attendee', 'get all attendees', 'create event', 'get event', 'get all events',
      'create person', 'get person', 'get all people', 'update person',
      'add person tag', 'remove person tag', 'create petition', 'get petition',
      'get all petitions', 'update petition', 'get signature', 'get all signatures',
      'update signature', 'create tag', 'get tag', 'get all tags'
    ],
    icon: 'actionnetwork.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Attendee', value: 'attendee' },
          { name: 'Event', value: 'event' },
          { name: 'Person', value: 'person' },
          { name: 'Person Tag', value: 'personTag' },
          { name: 'Petition', value: 'petition' },
          { name: 'Signature', value: 'signature' },
          { name: 'Tag', value: 'tag' }
        ],
        default: 'person',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['person']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create person' },
          { name: 'Get', value: 'get', description: 'Get person' },
          { name: 'Get All', value: 'getAll', description: 'Get all people' },
          { name: 'Update', value: 'update', description: 'Update person' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'actionNetworkApi',
        displayName: 'Action Network API',
        required: true
      }
    ],
    defaults: {
      name: 'Action Network',
      color: '#00ac41'
    },
    commonUseCase: 'Political activism automation, event management, supporter engagement',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.actionnetwork/',
    workflowPatterns: ['email_automation', 'notification_system']
  },

  // ActiveCampaign - Marketing automation platform
  {
    name: 'n8n-nodes-base.activeCampaign',
    displayName: 'ActiveCampaign',
    description: 'Automate work in ActiveCampaign marketing platform',
    version: 1,
    category: 'Marketing',
    subcategory: 'Email Marketing',
    tags: [
      'activecampaign', 'marketing', 'email', 'automation', 'crm', 'contacts', 'deals',
      'create account', 'delete account', 'get data of account', 'get data of all accounts', 'update account',
      'create association', 'delete association', 'update association',
      'create contact', 'delete contact', 'get data of contact', 'get data of all contact', 'update contact',
      'add contact to list', 'remove contact from list', 'add tag to contact',
      'create connection', 'delete connection', 'get data of connection', 'get data of all connections', 'update connection',
      'create deal', 'delete deal', 'get data of deal', 'get data of all deals', 'update deal',
      'create deal note', 'update deal note', 'create order', 'delete order', 'get data of order',
      'get data of all orders', 'update order'
    ],
    icon: 'activecampaign.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Account Contact', value: 'accountContact' },
          { name: 'Contact', value: 'contact' },
          { name: 'Contact List', value: 'contactList' },
          { name: 'Contact Tag', value: 'contactTag' },
          { name: 'Connection', value: 'connection' },
          { name: 'Deal', value: 'deal' },
          { name: 'E-commerce Order', value: 'ecommerceOrder' }
        ],
        default: 'contact',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['contact']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create contact' },
          { name: 'Delete', value: 'delete', description: 'Delete contact' },
          { name: 'Get', value: 'get', description: 'Get data of contact' },
          { name: 'Get All', value: 'getAll', description: 'Get data of all contact' },
          { name: 'Update', value: 'update', description: 'Update contact' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'activeCampaignApi',
        displayName: 'ActiveCampaign API',
        required: true
      }
    ],
    defaults: {
      name: 'ActiveCampaign',
      color: '#356AE6'
    },
    commonUseCase: 'Marketing automation, email campaigns, lead nurturing, CRM management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.activecampaign/',
    workflowPatterns: ['email_automation', 'database_sync']
  },

  // Airtable - Database/Spreadsheet integration
  {
    name: 'n8n-nodes-base.airtable',
    displayName: 'Airtable',
    description: 'Automate work in Airtable, and integrate Airtable with other applications. Read, write, and manage data in Airtable databases with support for creating, reading, listing, updating and deleting tables.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Database',
    tags: [
      'airtable', 'database', 'spreadsheet', 'table', 'records', 'data management', 'no-code database',
      'append the data to a table', 'delete data from a table', 'list data from a table',
      'read data from a table', 'update data in a table',
      'append record', 'delete record', 'list records', 'read record', 'update record',
      'bulk operations', 'filter records', 'sort records', 'base management', 'table operations',
      'content management', 'project tracking', 'database sync', 'data transformation'
    ],
    icon: 'airtable.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Append', value: 'append', description: 'Append the data to a table' },
          { name: 'Delete', value: 'delete', description: 'Delete data from a table' },
          { name: 'List', value: 'list', description: 'List data from a table' },
          { name: 'Read', value: 'read', description: 'Read data from a table' },
          { name: 'Update', value: 'update', description: 'Update data in a table' }
        ],
        default: 'list',
        description: 'The operation to perform'
      },
      {
        displayName: 'Base ID',
        name: 'baseId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the base to operate on'
      },
      {
        displayName: 'Table',
        name: 'table',
        type: 'string',
        default: '',
        required: true,
        description: 'The name of the table to operate on'
      }
    ],
    credentials: [
      {
        name: 'airtableTokenApi',
        displayName: 'Airtable Personal Access Token',
        required: true
      }
    ],
    defaults: {
      name: 'Airtable',
      color: '#18BFFF'
    },
    commonUseCase: 'Database management, content management, project tracking, no-code database operations',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtable/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // Adalo - No-Code App Database
  {
    name: 'n8n-nodes-base.adalo',
    displayName: 'Adalo',
    description: 'Automate work in Adalo and integrate with other applications. Create, get, update and delete databases, records, and collections.',
    version: 1,
    category: 'Development',
    subcategory: 'No-Code',
    tags: [
      'adalo', 'no-code', 'app development', 'database', 'collection', 'records',
      'create record', 'delete record', 'get record', 'get many records',
      'mobile app', 'web app', 'backend', 'data management'
    ],
    icon: 'adalo.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Collection', value: 'collection' }
        ],
        default: 'collection',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['collection']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new record in collection' },
          { name: 'Delete', value: 'delete', description: 'Delete a record from collection' },
          { name: 'Get', value: 'get', description: 'Get a record from collection' },
          { name: 'Get Many', value: 'getAll', description: 'Get many records from collection' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'adaloApi',
        displayName: 'Adalo API',
        required: true
      }
    ],
    defaults: {
      name: 'Adalo',
      color: '#1976d2'
    },
    commonUseCase: 'No-code app backend automation, mobile app data management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.adalo/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // Affinity - Relationship Intelligence CRM
  {
    name: 'n8n-nodes-base.affinity',
    displayName: 'Affinity',
    description: 'Automate work in Affinity CRM and integrate with other applications. Create, get, update and delete lists, entries, organization, and persons.',
    version: 1,
    category: 'Sales & CRM',
    subcategory: 'CRM',
    tags: [
      'affinity', 'crm', 'relationship intelligence', 'lists', 'entries', 'organizations', 'persons',
      'get all lists', 'create list entry', 'delete list entry', 'get list entry', 'get all list entries',
      'create organization', 'delete organization', 'get organization', 'get all organizations', 'update organization',
      'create person', 'delete person', 'get person', 'get all persons', 'update person',
      'ai tool', 'relationship management', 'contact management', 'deal tracking'
    ],
    icon: 'affinity.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'List', value: 'list' },
          { name: 'List Entry', value: 'listEntry' },
          { name: 'Organization', value: 'organization' },
          { name: 'Person', value: 'person' }
        ],
        default: 'person',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['list']
          }
        },
        options: [
          { name: 'Get All', value: 'getAll', description: 'Get all lists' }
        ],
        default: 'getAll',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['listEntry']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a list entry' },
          { name: 'Delete', value: 'delete', description: 'Delete a list entry' },
          { name: 'Get', value: 'get', description: 'Get a list entry' },
          { name: 'Get All', value: 'getAll', description: 'Get all list entries' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['organization']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an organization' },
          { name: 'Delete', value: 'delete', description: 'Delete an organization' },
          { name: 'Get', value: 'get', description: 'Get an organization' },
          { name: 'Get All', value: 'getAll', description: 'Get all organizations' },
          { name: 'Update', value: 'update', description: 'Update an organization' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['person']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a person' },
          { name: 'Delete', value: 'delete', description: 'Delete a person' },
          { name: 'Get', value: 'get', description: 'Get a person' },
          { name: 'Get All', value: 'getAll', description: 'Get all persons' },
          { name: 'Update', value: 'update', description: 'Update a person' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'affinityApi',
        displayName: 'Affinity API',
        required: true
      }
    ],
    defaults: {
      name: 'Affinity',
      color: '#00D4AA'
    },
    commonUseCase: 'CRM automation, relationship intelligence, contact management, deal tracking',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.affinity/',
    workflowPatterns: ['database_sync', 'email_automation']
  },

  // Agile CRM - Customer Relationship Management
  {
    name: 'n8n-nodes-base.agileCrm',
    displayName: 'Agile CRM',
    description: 'Automate work in Agile CRM and integrate with other applications. Create, get, update and delete companies, contacts, and deals.',
    version: 1,
    category: 'Sales & CRM',
    subcategory: 'CRM',
    tags: [
      'agile crm', 'crm', 'customer relationship management', 'companies', 'contacts', 'deals',
      'create company', 'delete company', 'get company', 'get all companies', 'update company',
      'create contact', 'delete contact', 'get contact', 'get all contacts', 'update contact',
      'create deal', 'delete deal', 'get deal', 'get all deals', 'update deal',
      'sales automation', 'lead management', 'customer management'
    ],
    icon: 'agilecrm.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Company', value: 'company' },
          { name: 'Contact', value: 'contact' },
          { name: 'Deal', value: 'deal' }
        ],
        default: 'contact',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['company']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a company' },
          { name: 'Delete', value: 'delete', description: 'Delete a company' },
          { name: 'Get', value: 'get', description: 'Get a company' },
          { name: 'Get All', value: 'getAll', description: 'Get all companies' },
          { name: 'Update', value: 'update', description: 'Update a company' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['contact']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a contact' },
          { name: 'Delete', value: 'delete', description: 'Delete a contact' },
          { name: 'Get', value: 'get', description: 'Get a contact' },
          { name: 'Get All', value: 'getAll', description: 'Get all contacts' },
          { name: 'Update', value: 'update', description: 'Update a contact' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['deal']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a deal' },
          { name: 'Delete', value: 'delete', description: 'Delete a deal' },
          { name: 'Get', value: 'get', description: 'Get a deal' },
          { name: 'Get All', value: 'getAll', description: 'Get all deals' },
          { name: 'Update', value: 'update', description: 'Update a deal' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'agileCrmApi',
        displayName: 'Agile CRM API',
        required: true
      }
    ],
    defaults: {
      name: 'Agile CRM',
      color: '#ea4500'
    },
    commonUseCase: 'CRM automation, sales pipeline management, lead tracking, customer data management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.agilecrm/',
    workflowPatterns: ['database_sync', 'email_automation']
  },

  // Airtop - Cloud-based Browser Automation
  {
    name: 'n8n-nodes-base.airtop',
    displayName: 'Airtop',
    description: 'Automate work in Airtop, and integrate Airtop with other applications. Control a cloud-based web browser for tasks like querying, scraping, and interacting with web pages.',
    version: 1,
    category: 'Development',
    subcategory: 'Browser Automation',
    tags: [
      'airtop', 'browser automation', 'web scraping', 'web browser', 'cloud browser', 'web interaction',
      'create session', 'save profile on termination', 'terminate session',
      'create a new browser window', 'load url', 'take screenshot', 'close window',
      'query page', 'query page with pagination', 'smart scrape page',
      'click an element', 'hover on an element', 'type',
      'automation', 'scraping', 'web automation', 'browser control', 'page interaction'
    ],
    icon: 'airtop.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Session', value: 'session' },
          { name: 'Browser', value: 'browser' },
          { name: 'Extraction', value: 'extraction' },
          { name: 'Interaction', value: 'interaction' }
        ],
        default: 'session',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['session']
          }
        },
        options: [
          { name: 'Create Session', value: 'createSession', description: 'Create session' },
          { name: 'Save Profile on Termination', value: 'saveProfile', description: 'Save profile on termination' },
          { name: 'Terminate Session', value: 'terminateSession', description: 'Terminate session' }
        ],
        default: 'createSession',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['browser']
          }
        },
        options: [
          { name: 'Create New Browser Window', value: 'createWindow', description: 'Create a new browser window' },
          { name: 'Load URL', value: 'loadUrl', description: 'Load URL' },
          { name: 'Take Screenshot', value: 'takeScreenshot', description: 'Take screenshot' },
          { name: 'Close Window', value: 'closeWindow', description: 'Close window' }
        ],
        default: 'createWindow',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['extraction']
          }
        },
        options: [
          { name: 'Query Page', value: 'queryPage', description: 'Query page' },
          { name: 'Query Page with Pagination', value: 'queryPagePagination', description: 'Query page with pagination' },
          { name: 'Smart Scrape Page', value: 'smartScrapePage', description: 'Smart scrape page' }
        ],
        default: 'queryPage',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['interaction']
          }
        },
        options: [
          { name: 'Click Element', value: 'clickElement', description: 'Click an element' },
          { name: 'Hover Element', value: 'hoverElement', description: 'Hover on an element' },
          { name: 'Type', value: 'type', description: 'Type' }
        ],
        default: 'clickElement',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'airtopApi',
        displayName: 'Airtop API',
        required: true
      }
    ],
    defaults: {
      name: 'Airtop',
      color: '#00D4AA'
    },
    commonUseCase: 'Browser automation, web scraping, automated web testing, data extraction from websites',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtop/',
    workflowPatterns: ['data_transformation', 'ai_processing']
  },

  // AMQP Sender - Message Queue Communication
  {
    name: 'n8n-nodes-base.amqpSender',
    displayName: 'AMQP Sender',
    description: 'Use the AMQP Sender node to automate work in AMQP Sender, and integrate AMQP Sender with other applications. n8n has built-in support for a wide range of AMQP Sender features, including sending messages.',
    version: 1,
    category: 'Communication',
    subcategory: 'Message Queue',
    tags: [
      'amqp', 'message queue', 'messaging', 'rabbitmq', 'queue', 'broker', 'communication',
      'send message', 'publish message', 'message broker', 'async messaging', 'distributed systems',
      'microservices', 'event driven', 'message publishing', 'queue management', 'amqp protocol',
      'advanced message queuing protocol', 'message routing', 'reliable messaging'
    ],
    icon: 'amqp.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Send Message', value: 'sendMessage', description: 'Send message' }
        ],
        default: 'sendMessage',
        description: 'The operation to perform'
      },
      {
        displayName: 'Queue / Exchange',
        name: 'destination',
        type: 'string',
        default: '',
        required: true,
        description: 'Queue or exchange name to send message to'
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4
        },
        default: '',
        required: true,
        description: 'The message to send'
      },
      {
        displayName: 'Content Type',
        name: 'contentType',
        type: 'string',
        default: 'application/json',
        description: 'Content type of the message'
      },
      {
        displayName: 'Headers',
        name: 'headers',
        type: 'string',
        typeOptions: {
          rows: 3
        },
        default: '{}',
        description: 'Additional headers as JSON object'
      }
    ],
    credentials: [
      {
        name: 'amqp',
        displayName: 'AMQP',
        required: true
      }
    ],
    defaults: {
      name: 'AMQP Sender',
      color: '#FF6600'
    },
    commonUseCase: 'Send messages to AMQP message brokers like RabbitMQ, enable async communication between services',
    exampleConfiguration: {
      operation: 'sendMessage',
      destination: 'task_queue',
      message: '{"task": "process_data", "data": "{{$json.data}}"}',
      options: {
        contentType: 'application/json'
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.amqpsender/',
    workflowPatterns: ['notification_system', 'database_sync', 'microservices']
  },

  // APITemplate.io - Document and Image Generation
  {
    name: 'n8n-nodes-base.apiTemplateIo',
    displayName: 'APITemplate.io',
    description: 'Use the APITemplate.io node to automate work in APITemplate.io, and integrate APITemplate.io with other applications. n8n has built-in support for a wide range of APITemplate.io features, including getting and creating accounts and PDF.',
    version: 1,
    category: 'Communication',
    subcategory: 'Document Generation',
    tags: [
      'apitemplate.io', 'document generation', 'pdf generation', 'image generation', 'template processing',
      'get account', 'get all accounts', 'create image', 'create pdf',
      'automated document creation', 'report generation', 'invoice generation', 'certificate generation',
      'template engine', 'document automation', 'pdf creator', 'image creator', 'dynamic content',
      'data to pdf', 'data to image', 'mail merge', 'document templating', 'visual content generation'
    ],
    icon: 'apitemplate.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Image', value: 'image' },
          { name: 'PDF', value: 'pdf' }
        ],
        default: 'pdf',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['account']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get account' },
          { name: 'Get All', value: 'getAll', description: 'Get all accounts' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['image']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create image' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['pdf']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create PDF' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Template ID',
        name: 'templateId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['image', 'pdf'],
            operation: ['create']
          }
        },
        description: 'The template ID to use for generation'
      },
      {
        displayName: 'Template Data',
        name: 'templateData',
        type: 'string',
        typeOptions: {
          rows: 5
        },
        default: '{}',
        displayOptions: {
          show: {
            resource: ['image', 'pdf'],
            operation: ['create']
          }
        },
        description: 'Data to merge with template as JSON object'
      }
    ],
    credentials: [
      {
        name: 'apiTemplateIoApi',
        displayName: 'APITemplate.io API',
        required: true
      }
    ],
    defaults: {
      name: 'APITemplate.io',
      color: '#FF6B35'
    },
    commonUseCase: 'Generate PDFs and images from templates, automate document creation, create reports and invoices',
    exampleConfiguration: {
      resource: 'pdf',
      operation: 'create',
      templateId: 'template_123',
      templateData: '{"customer_name": "John Doe", "amount": "$100.00", "date": "2024-01-15"}'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.apitemplateio/',
    workflowPatterns: ['email_automation', 'data_transformation', 'notification_system']
  },

  // Asana - Project Management and Team Collaboration
  {
    name: 'n8n-nodes-base.asana',
    displayName: 'Asana',
    description: 'Automate work in Asana, and integrate Asana with other applications. Create, get, update and delete projects, tasks, teams, users, custom fields, stories, and tags.',
    version: 2,
    category: 'Productivity',
    subcategory: 'Project Management',
    tags: [
      'asana', 'project management', 'task management', 'team collaboration', 'productivity', 'workspace',
      'create project', 'delete project', 'get project', 'get all projects', 'update project',
      'create task', 'delete task', 'get task', 'get all tasks', 'update task', 'add task to project',
      'remove task from project', 'create team', 'get team', 'get all teams',
      'get user', 'get all users', 'get me', 'create custom field', 'get custom field', 'get all custom fields',
      'update custom field', 'create story', 'delete story', 'get story', 'get all stories', 'update story',
      'create tag', 'get tag', 'get all tags', 'update tag',
      'task tracking', 'project tracking', 'team management', 'workflow automation', 'collaboration',
      'milestone tracking', 'deadline management', 'assignment management', 'progress tracking'
    ],
    icon: 'asana.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Project', value: 'project' },
          { name: 'Task', value: 'task' },
          { name: 'Team', value: 'team' },
          { name: 'User', value: 'user' },
          { name: 'Custom Field', value: 'customField' },
          { name: 'Story', value: 'story' },
          { name: 'Tag', value: 'tag' }
        ],
        default: 'task',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['project']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a project' },
          { name: 'Delete', value: 'delete', description: 'Delete a project' },
          { name: 'Get', value: 'get', description: 'Get a project' },
          { name: 'Get All', value: 'getAll', description: 'Get all projects' },
          { name: 'Update', value: 'update', description: 'Update a project' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['task']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a task' },
          { name: 'Delete', value: 'delete', description: 'Delete a task' },
          { name: 'Get', value: 'get', description: 'Get a task' },
          { name: 'Get All', value: 'getAll', description: 'Get all tasks' },
          { name: 'Update', value: 'update', description: 'Update a task' },
          { name: 'Add to Project', value: 'addProject', description: 'Add task to project' },
          { name: 'Remove from Project', value: 'removeProject', description: 'Remove task from project' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['team']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a team' },
          { name: 'Get', value: 'get', description: 'Get a team' },
          { name: 'Get All', value: 'getAll', description: 'Get all teams' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['user']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a user' },
          { name: 'Get All', value: 'getAll', description: 'Get all users' },
          { name: 'Get Me', value: 'getMe', description: 'Get current user' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['customField']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a custom field' },
          { name: 'Get', value: 'get', description: 'Get a custom field' },
          { name: 'Get All', value: 'getAll', description: 'Get all custom fields' },
          { name: 'Update', value: 'update', description: 'Update a custom field' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['story']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a story' },
          { name: 'Delete', value: 'delete', description: 'Delete a story' },
          { name: 'Get', value: 'get', description: 'Get a story' },
          { name: 'Get All', value: 'getAll', description: 'Get all stories' },
          { name: 'Update', value: 'update', description: 'Update a story' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['tag']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a tag' },
          { name: 'Get', value: 'get', description: 'Get a tag' },
          { name: 'Get All', value: 'getAll', description: 'Get all tags' },
          { name: 'Update', value: 'update', description: 'Update a tag' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Task Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['task'],
            operation: ['create']
          }
        },
        description: 'The name of the task'
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['task'],
            operation: ['create']
          }
        },
        description: 'The ID of the project to create the task in'
      }
    ],
    credentials: [
      {
        name: 'asanaOAuth2Api',
        displayName: 'Asana OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Asana',
      color: '#f06a6a'
    },
    commonUseCase: 'Project management automation, task tracking, team collaboration, workflow management',
    exampleConfiguration: {
      resource: 'task',
      operation: 'create',
      name: 'New automated task',
      projectId: '1234567890',
      options: {
        notes: 'This task was created automatically via n8n workflow',
        assignee: 'user@example.com'
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.asana/',
    workflowPatterns: ['notification_system', 'database_sync', 'email_automation']
  },

  // Atlassian Jira - Issue Tracking and Project Management
  {
    name: 'n8n-nodes-base.jira',
    displayName: 'Atlassian Jira',
    description: 'Automate work in Jira, and integrate Jira with other applications. Create, get, update and delete issues, users, and issue attachments.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Issue Tracking',
    tags: [
      'jira', 'atlassian', 'issue tracking', 'project management', 'bug tracking', 'agile', 'scrum',
      'create issue', 'delete issue', 'get issue', 'get all issues', 'update issue', 'transition issue',
      'get issue changelog', 'notify issue', 'get issue comments', 'add issue comment', 'get issue watchers',
      'add issue watcher', 'remove issue watcher', 'create user', 'delete user', 'get user', 'get all users',
      'add attachment to issue', 'get issue attachment', 'get all issue attachments', 'remove issue attachment',
      'ticket management', 'workflow automation', 'software development', 'task tracking',
      'sprint management', 'release management', 'team collaboration', 'development process'
    ],
    icon: 'jira.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Issue', value: 'issue' },
          { name: 'Issue Attachment', value: 'issueAttachment' },
          { name: 'Issue Comment', value: 'issueComment' },
          { name: 'User', value: 'user' }
        ],
        default: 'issue',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issue']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an issue' },
          { name: 'Delete', value: 'delete', description: 'Delete an issue' },
          { name: 'Get', value: 'get', description: 'Get an issue' },
          { name: 'Get All', value: 'getAll', description: 'Get all issues' },
          { name: 'Update', value: 'update', description: 'Update an issue' },
          { name: 'Transition', value: 'transition', description: 'Transition an issue' },
          { name: 'Get Changelog', value: 'changelog', description: 'Get issue changelog' },
          { name: 'Notify', value: 'notify', description: 'Notify issue' },
          { name: 'Get Comments', value: 'getComments', description: 'Get issue comments' },
          { name: 'Add Comment', value: 'addComment', description: 'Add comment to issue' },
          { name: 'Get Watchers', value: 'getWatchers', description: 'Get issue watchers' },
          { name: 'Add Watcher', value: 'addWatcher', description: 'Add watcher to issue' },
          { name: 'Remove Watcher', value: 'removeWatcher', description: 'Remove watcher from issue' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issueAttachment']
          }
        },
        options: [
          { name: 'Add', value: 'add', description: 'Add attachment to issue' },
          { name: 'Get', value: 'get', description: 'Get an issue attachment' },
          { name: 'Get All', value: 'getAll', description: 'Get all issue attachments' },
          { name: 'Remove', value: 'remove', description: 'Remove an issue attachment' }
        ],
        default: 'add',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issueComment']
          }
        },
        options: [
          { name: 'Add', value: 'add', description: 'Add comment to issue' },
          { name: 'Get', value: 'get', description: 'Get a comment' },
          { name: 'Get All', value: 'getAll', description: 'Get all comments' },
          { name: 'Remove', value: 'remove', description: 'Remove a comment' },
          { name: 'Update', value: 'update', description: 'Update a comment' }
        ],
        default: 'add',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['user']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a user' },
          { name: 'Delete', value: 'delete', description: 'Delete a user' },
          { name: 'Get', value: 'get', description: 'Get a user' },
          { name: 'Get All', value: 'getAll', description: 'Get all users' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Issue Key',
        name: 'issueKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['issue'],
            operation: ['get', 'update', 'delete', 'transition', 'changelog', 'notify', 'getComments', 'addComment', 'getWatchers', 'addWatcher', 'removeWatcher']
          }
        },
        description: 'Issue key (e.g., TEST-1)'
      },
      {
        displayName: 'Project Key',
        name: 'projectKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['issue'],
            operation: ['create']
          }
        },
        description: 'Project key (e.g., TEST)'
      },
      {
        displayName: 'Issue Type',
        name: 'issueType',
        type: 'string',
        default: 'Task',
        required: true,
        displayOptions: {
          show: {
            resource: ['issue'],
            operation: ['create']
          }
        },
        description: 'Type of issue (e.g., Task, Bug, Story)'
      },
      {
        displayName: 'Summary',
        name: 'summary',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['issue'],
            operation: ['create']
          }
        },
        description: 'Summary/title of the issue'
      }
    ],
    credentials: [
      {
        name: 'jiraCloudApi',
        displayName: 'Jira Cloud API',
        required: true
      }
    ],
    defaults: {
      name: 'Atlassian Jira',
      color: '#2684FF'
    },
    commonUseCase: 'Issue tracking automation, project management, bug tracking, development workflow integration',
    exampleConfiguration: {
      resource: 'issue',
      operation: 'create',
      projectKey: 'TEST',
      issueType: 'Task',
      summary: 'Automated issue from n8n workflow',
      description: 'This issue was created automatically via n8n integration'
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.jira/',
    workflowPatterns: ['notification_system', 'database_sync', 'email_automation']
  },

  // AWS S3 - Amazon Simple Storage Service
  {
    name: 'n8n-nodes-base.awsS3',
    displayName: 'AWS S3',
    description: 'Automate work in AWS S3, and integrate AWS S3 with other applications. Create, get, update and delete buckets and files.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'aws', 's3', 'amazon', 'cloud storage', 'file storage', 'object storage', 'bucket', 'files',
      'create bucket', 'delete bucket', 'get all buckets', 'search bucket',
      'copy file', 'delete file', 'download file', 'get all files', 'upload file',
      'cloud backup', 'file management', 'data storage', 'file synchronization',
      'media storage', 'static assets', 'content delivery', 'data archiving',
      'file upload', 'file download', 'object management', 'cloud infrastructure'
    ],
    icon: 'aws.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Bucket', value: 'bucket' },
          { name: 'File', value: 'file' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['bucket']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a bucket' },
          { name: 'Delete', value: 'delete', description: 'Delete a bucket' },
          { name: 'Get All', value: 'getAll', description: 'Get all buckets' },
          { name: 'Search', value: 'search', description: 'Search within a bucket' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get All', value: 'getAll', description: 'Get all files' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Bucket Name',
        name: 'bucketName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['bucket'],
            operation: ['create', 'delete', 'search']
          }
        },
        description: 'Name of the S3 bucket'
      },
      {
        displayName: 'Bucket Name',
        name: 'bucketName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        description: 'Name of the S3 bucket'
      },
      {
        displayName: 'File Key',
        name: 'fileKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['copy', 'delete', 'download']
          }
        },
        description: 'Key (path) of the file in S3'
      },
      {
        displayName: 'File Key',
        name: 'fileKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['upload']
          }
        },
        description: 'Key (path) where the file will be stored in S3'
      }
    ],
    credentials: [
      {
        name: 'aws',
        displayName: 'AWS',
        required: true
      }
    ],
    defaults: {
      name: 'AWS S3',
      color: '#FF9900'
    },
    commonUseCase: 'Cloud file storage, backup automation, static asset management, data archiving',
    exampleConfiguration: {
      resource: 'file',
      operation: 'upload',
      bucketName: 'my-storage-bucket',
      fileKey: 'uploads/document.pdf',
      options: {
        storageClass: 'STANDARD',
        serverSideEncryption: 'AES256'
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.awss3/',
    workflowPatterns: ['data_transformation', 'database_sync']
  },

  // Baserow - Open Source No-Code Database
  {
    name: 'n8n-nodes-base.baserow',
    displayName: 'Baserow',
    description: 'Automate work in Baserow, and integrate Baserow with other applications. Create, get, update and delete rows.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Database',
    tags: [
      'baserow', 'no-code database', 'open source', 'database', 'table', 'rows', 'data management',
      'create row', 'delete row', 'get row', 'get all rows', 'update row',
      'airtable alternative', 'collaborative database', 'data storage', 'spreadsheet database',
      'team collaboration', 'project management', 'content management', 'database operations',
      'data synchronization', 'record management', 'table operations'
    ],
    icon: 'baserow.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create Row', value: 'create', description: 'Create a row' },
          { name: 'Delete Row', value: 'delete', description: 'Delete a row' },
          { name: 'Get Row', value: 'get', description: 'Get a row' },
          { name: 'Get All Rows', value: 'getAll', description: 'Get all rows' },
          { name: 'Update Row', value: 'update', description: 'Update a row' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Database ID',
        name: 'databaseId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the Baserow database'
      },
      {
        displayName: 'Table ID',
        name: 'tableId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the table in the database'
      },
      {
        displayName: 'Row ID',
        name: 'rowId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete']
          }
        },
        description: 'ID of the row to operate on'
      }
    ],
    credentials: [
      {
        name: 'baserowApi',
        displayName: 'Baserow API',
        required: true
      }
    ],
    defaults: {
      name: 'Baserow',
      color: '#4285F4'
    },
    commonUseCase: 'No-code database operations, collaborative data management, open-source database automation',
    exampleConfiguration: {
      operation: 'create',
      databaseId: '123',
      tableId: '456',
      data: {
        Name: 'John Doe',
        Email: 'john@example.com',
        Status: 'Active'
      }
    },
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.baserow/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // Box - Cloud Storage and Content Management
  {
    name: 'n8n-nodes-base.box',
    displayName: 'Box',
    description: 'Automate work in Box, and integrate Box with other applications. Create, get, update and delete files and folders.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'box', 'cloud storage', 'file storage', 'content management', 'file sharing', 'collaboration',
      'create file', 'delete file', 'download file', 'get file', 'update file', 'upload file',
      'create folder', 'delete folder', 'get folder', 'get all folders', 'update folder',
      'file management', 'document storage', 'team collaboration', 'enterprise storage',
      'secure file sharing', 'content collaboration', 'document management'
    ],
    icon: 'box.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'File', value: 'file' },
          { name: 'Folder', value: 'folder' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get', value: 'get', description: 'Get a file' },
          { name: 'Share', value: 'share', description: 'Share a file' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'Get', value: 'get', description: 'Get a folder' },
          { name: 'Get All', value: 'getAll', description: 'Get all folders' },
          { name: 'Share', value: 'share', description: 'Share a folder' },
          { name: 'Update', value: 'update', description: 'Update a folder' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'boxOAuth2Api',
        displayName: 'Box OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Box',
      color: '#0061D5'
    },
    commonUseCase: 'Enterprise file storage, document management, secure file sharing, content collaboration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.box/',
    workflowPatterns: ['data_transformation', 'database_sync']
  },

  // Calendly - Scheduling and Appointment Management
  {
    name: 'n8n-nodes-base.calendly',
    displayName: 'Calendly',
    description: 'Automate work in Calendly, and integrate Calendly with other applications. Create, get, update and delete scheduled events and invitees.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Scheduling',
    tags: [
      'calendly', 'scheduling', 'appointments', 'calendar', 'booking', 'meetings',
      'get scheduled event', 'get all scheduled events', 'cancel scheduled event',
      'get event invitee', 'get all event invitees', 'get invitee no show',
      'get all invitee no shows', 'create invitee no show', 'delete invitee no show',
      'appointment booking', 'meeting scheduling', 'calendar integration',
      'automated scheduling', 'booking management', 'event management'
    ],
    icon: 'calendly.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Scheduled Event', value: 'scheduledEvent' },
          { name: 'Event Invitee', value: 'eventInvitee' },
          { name: 'Invitee No Show', value: 'inviteeNoShow' }
        ],
        default: 'scheduledEvent',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['scheduledEvent']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a scheduled event' },
          { name: 'Get All', value: 'getAll', description: 'Get all scheduled events' },
          { name: 'Cancel', value: 'cancel', description: 'Cancel a scheduled event' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['eventInvitee']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get an event invitee' },
          { name: 'Get All', value: 'getAll', description: 'Get all event invitees' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['inviteeNoShow']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get an invitee no show' },
          { name: 'Get All', value: 'getAll', description: 'Get all invitee no shows' },
          { name: 'Create', value: 'create', description: 'Create an invitee no show' },
          { name: 'Delete', value: 'delete', description: 'Delete an invitee no show' }
        ],
        default: 'get',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'calendlyOAuth2Api',
        displayName: 'Calendly OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Calendly',
      color: '#006BFF'
    },
    commonUseCase: 'Automated scheduling workflows, appointment management, meeting coordination',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.calendly/',
    workflowPatterns: ['notification_system', 'email_automation']
  },

  // ClickUp - Project Management and Productivity
  {
    name: 'n8n-nodes-base.clickUp',
    displayName: 'ClickUp',
    description: 'Automate work in ClickUp, and integrate ClickUp with other applications. Create, get, update and delete tasks, lists, folders, spaces, and goals.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Project Management',
    tags: [
      'clickup', 'project management', 'task management', 'productivity', 'team collaboration',
      'create task', 'delete task', 'get task', 'get all tasks', 'update task',
      'create list', 'delete list', 'get list', 'get all lists', 'update list',
      'create folder', 'delete folder', 'get folder', 'get all folders', 'update folder',
      'create space', 'delete space', 'get space', 'get all spaces', 'update space',
      'create goal', 'delete goal', 'get goal', 'get all goals', 'update goal',
      'workspace management', 'team productivity', 'project tracking', 'workflow automation'
    ],
    icon: 'clickup.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Task', value: 'task' },
          { name: 'List', value: 'list' },
          { name: 'Folder', value: 'folder' },
          { name: 'Space', value: 'space' },
          { name: 'Goal', value: 'goal' }
        ],
        default: 'task',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['task']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a task' },
          { name: 'Delete', value: 'delete', description: 'Delete a task' },
          { name: 'Get', value: 'get', description: 'Get a task' },
          { name: 'Get All', value: 'getAll', description: 'Get all tasks' },
          { name: 'Update', value: 'update', description: 'Update a task' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['list']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a list' },
          { name: 'Delete', value: 'delete', description: 'Delete a list' },
          { name: 'Get', value: 'get', description: 'Get a list' },
          { name: 'Get All', value: 'getAll', description: 'Get all lists' },
          { name: 'Update', value: 'update', description: 'Update a list' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'Get', value: 'get', description: 'Get a folder' },
          { name: 'Get All', value: 'getAll', description: 'Get all folders' },
          { name: 'Update', value: 'update', description: 'Update a folder' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['space']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a space' },
          { name: 'Delete', value: 'delete', description: 'Delete a space' },
          { name: 'Get', value: 'get', description: 'Get a space' },
          { name: 'Get All', value: 'getAll', description: 'Get all spaces' },
          { name: 'Update', value: 'update', description: 'Update a space' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['goal']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a goal' },
          { name: 'Delete', value: 'delete', description: 'Delete a goal' },
          { name: 'Get', value: 'get', description: 'Get a goal' },
          { name: 'Get All', value: 'getAll', description: 'Get all goals' },
          { name: 'Update', value: 'update', description: 'Update a goal' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'clickUpApi',
        displayName: 'ClickUp API',
        required: true
      }
    ],
    defaults: {
      name: 'ClickUp',
      color: '#7B68EE'
    },
    commonUseCase: 'Project management automation, task tracking, team collaboration, productivity workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.clickup/',
    workflowPatterns: ['notification_system', 'database_sync', 'email_automation']
  },

  // Discord - Team Communication and Bot Integration
  {
    name: 'n8n-nodes-base.discord',
    displayName: 'Discord',
    description: 'Automate work in Discord, and integrate Discord with other applications. Send messages and interact with Discord servers.',
    version: 1,
    category: 'Communication',
    subcategory: 'Team Chat',
    tags: [
      'discord', 'chat', 'messaging', 'gaming', 'community', 'bot', 'server', 'channel',
      'send message', 'get message', 'edit message', 'delete message',
      'create invite', 'get invite', 'delete invite',
      'get member', 'get all members', 'get server', 'get all servers',
      'team communication', 'community management', 'bot automation', 'notifications'
    ],
    icon: 'discord.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Member', value: 'member' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Send', value: 'send', description: 'Send a message' },
          { name: 'Get', value: 'get', description: 'Get a message' },
          { name: 'Edit', value: 'edit', description: 'Edit a message' },
          { name: 'Delete', value: 'delete', description: 'Delete a message' }
        ],
        default: 'send',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['member']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a member' },
          { name: 'Get All', value: 'getAll', description: 'Get all members' }
        ],
        default: 'get',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'discordBotApi',
        displayName: 'Discord Bot API',
        required: true
      }
    ],
    defaults: {
      name: 'Discord',
      color: '#5865F2'
    },
    commonUseCase: 'Team notifications, community management, bot automation, gaming server integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.discord/',
    workflowPatterns: ['notification_system', 'email_automation']
  },

  // Dropbox - Cloud Storage and File Sharing
  {
    name: 'n8n-nodes-base.dropbox',
    displayName: 'Dropbox',
    description: 'Automate work in Dropbox, and integrate Dropbox with other applications. Create, get, update and delete files and folders.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'dropbox', 'cloud storage', 'file storage', 'file sharing', 'sync', 'backup',
      'copy file', 'delete file', 'download file', 'get file', 'move file', 'upload file',
      'create folder', 'delete folder', 'get folder', 'get all folders',
      'search files', 'get sharing link', 'file synchronization', 'document storage',
      'personal cloud', 'team collaboration', 'file management'
    ],
    icon: 'dropbox.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'File', value: 'file' },
          { name: 'Folder', value: 'folder' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get', value: 'get', description: 'Get a file' },
          { name: 'Move', value: 'move', description: 'Move a file' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'Get', value: 'get', description: 'Get a folder' },
          { name: 'Get All', value: 'getAll', description: 'Get all folders' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'dropboxOAuth2Api',
        displayName: 'Dropbox OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Dropbox',
      color: '#0061FF'
    },
    commonUseCase: 'File backup automation, document storage, file synchronization, team file sharing',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.dropbox/',
    workflowPatterns: ['data_transformation', 'database_sync']
  },

  // GitHub - Version Control and Development Workflows
  {
    name: 'n8n-nodes-base.github',
    displayName: 'GitHub',
    description: 'Automate work in GitHub, and integrate GitHub with other applications. Create, get, update and delete repositories, issues, pull requests, and releases.',
    version: 1,
    category: 'Development',
    subcategory: 'Version Control',
    tags: [
      'github', 'git', 'version control', 'development', 'code', 'repositories', 'issues', 'pull requests',
      'create repository', 'get repository', 'get all repositories', 'update repository',
      'create issue', 'delete issue', 'get issue', 'get all issues', 'update issue',
      'create file', 'delete file', 'edit file', 'get file',
      'create release', 'delete release', 'get release', 'get all releases', 'update release',
      'get user', 'get all users', 'create organization', 'get organization',
      'software development', 'ci/cd', 'code management', 'project management'
    ],
    icon: 'github.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Repository', value: 'repository' },
          { name: 'Issue', value: 'issue' },
          { name: 'File', value: 'file' },
          { name: 'Release', value: 'release' },
          { name: 'User', value: 'user' },
          { name: 'Organization', value: 'organization' }
        ],
        default: 'repository',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['repository']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a repository' },
          { name: 'Get', value: 'get', description: 'Get a repository' },
          { name: 'Get All', value: 'getAll', description: 'Get all repositories' },
          { name: 'Get Issues', value: 'getIssues', description: 'Get repository issues' },
          { name: 'Get Profile', value: 'getProfile', description: 'Get repository profile' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issue']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an issue' },
          { name: 'Create Comment', value: 'createComment', description: 'Create issue comment' },
          { name: 'Edit', value: 'edit', description: 'Edit an issue' },
          { name: 'Get', value: 'get', description: 'Get an issue' },
          { name: 'Lock', value: 'lock', description: 'Lock an issue' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Edit', value: 'edit', description: 'Edit a file' },
          { name: 'Get', value: 'get', description: 'Get a file' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['release']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a release' },
          { name: 'Delete', value: 'delete', description: 'Delete a release' },
          { name: 'Get', value: 'get', description: 'Get a release' },
          { name: 'Get All', value: 'getAll', description: 'Get all releases' },
          { name: 'Update', value: 'update', description: 'Update a release' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['user']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a user' },
          { name: 'Get Repositories', value: 'getRepositories', description: 'Get user repositories' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['organization']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get an organization' },
          { name: 'Get Repositories', value: 'getRepositories', description: 'Get organization repositories' }
        ],
        default: 'get',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'githubOAuth2Api',
        displayName: 'GitHub OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'GitHub',
      color: '#24292e'
    },
    commonUseCase: 'Development workflow automation, CI/CD integration, issue tracking, release management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.github/',
    workflowPatterns: ['notification_system', 'database_sync']
  },

  // Google Drive - Cloud Storage and File Management
  {
    name: 'n8n-nodes-base.googleDrive',
    displayName: 'Google Drive',
    description: 'Automate work in Google Drive, and integrate Google Drive with other applications. Create, get, update and delete files and folders.',
    version: 3,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'google drive', 'google', 'cloud storage', 'file storage', 'file sharing', 'documents',
      'copy file', 'delete file', 'download file', 'get file', 'share file', 'update file', 'upload file',
      'create folder', 'delete folder', 'get folder', 'update folder',
      'google workspace', 'document management', 'collaboration', 'file synchronization'
    ],
    icon: 'googledrive.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'File', value: 'file' },
          { name: 'Folder', value: 'folder' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get', value: 'get', description: 'Get a file' },
          { name: 'Share', value: 'share', description: 'Share a file' },
          { name: 'Update', value: 'update', description: 'Update a file' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'Get', value: 'get', description: 'Get a folder' },
          { name: 'Update', value: 'update', description: 'Update a folder' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'googleDriveOAuth2Api',
        displayName: 'Google Drive OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Google Drive',
      color: '#4285F4'
    },
    commonUseCase: 'Document management, file backup automation, Google Workspace integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/',
    workflowPatterns: ['data_transformation', 'database_sync']
  },

  // Google Sheets - Spreadsheet Automation
  {
    name: 'n8n-nodes-base.googleSheets',
    displayName: 'Google Sheets',
    description: 'Automate work in Google Sheets, and integrate Google Sheets with other applications. Create, get, update and delete spreadsheet data.',
    version: 4,
    category: 'Data & Storage',
    subcategory: 'Spreadsheet',
    tags: [
      'google sheets', 'google', 'spreadsheet', 'data', 'excel', 'csv', 'tables',
      'append row', 'clear sheet', 'create sheet', 'delete rows', 'get all rows', 'get sheet', 'remove duplicates',
      'update row', 'lookup values', 'data manipulation', 'google workspace', 'automation',
      'data entry', 'reporting', 'data analysis', 'bulk operations'
    ],
    icon: 'googlesheets.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Append Row', value: 'append', description: 'Append row to sheet' },
          { name: 'Clear', value: 'clear', description: 'Clear data from sheet' },
          { name: 'Create', value: 'create', description: 'Create a new sheet' },
          { name: 'Delete Rows', value: 'deleteRows', description: 'Delete rows from sheet' },
          { name: 'Get All', value: 'getAll', description: 'Get all rows from sheet' },
          { name: 'Get Sheet', value: 'get', description: 'Get sheet data' },
          { name: 'Remove Duplicates', value: 'removeDuplicates', description: 'Remove duplicate rows' },
          { name: 'Update Row', value: 'update', description: 'Update row in sheet' }
        ],
        default: 'append',
        description: 'The operation to perform'
      },
      {
        displayName: 'Spreadsheet ID',
        name: 'sheetId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the Google Sheets spreadsheet'
      },
      {
        displayName: 'Range',
        name: 'range',
        type: 'string',
        default: 'A1:Z1000',
        description: 'The range to operate on (e.g., A1:Z1000)'
      }
    ],
    credentials: [
      {
        name: 'googleSheetsOAuth2Api',
        displayName: 'Google Sheets OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Google Sheets',
      color: '#0FA763'
    },
    commonUseCase: 'Data automation, reporting, spreadsheet management, bulk data operations',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // HubSpot - CRM and Marketing Automation
  {
    name: 'n8n-nodes-base.hubspot',
    displayName: 'HubSpot',
    description: 'Automate work in HubSpot, and integrate HubSpot with other applications. Create, get, update and delete contacts, companies, deals, and tickets.',
    version: 2,
    category: 'Sales & CRM',
    subcategory: 'CRM',
    tags: [
      'hubspot', 'crm', 'marketing', 'sales', 'contacts', 'companies', 'deals', 'tickets',
      'create contact', 'delete contact', 'get contact', 'get all contacts', 'update contact',
      'create company', 'delete company', 'get company', 'get all companies', 'update company',
      'create deal', 'delete deal', 'get deal', 'get all deals', 'update deal',
      'create ticket', 'delete ticket', 'get ticket', 'get all tickets', 'update ticket',
      'lead management', 'customer management', 'pipeline management'
    ],
    icon: 'hubspot.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Company', value: 'company' },
          { name: 'Deal', value: 'deal' },
          { name: 'Ticket', value: 'ticket' }
        ],
        default: 'contact',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['contact']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a contact' },
          { name: 'Delete', value: 'delete', description: 'Delete a contact' },
          { name: 'Get', value: 'get', description: 'Get a contact' },
          { name: 'Get All', value: 'getAll', description: 'Get all contacts' },
          { name: 'Update', value: 'update', description: 'Update a contact' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['company']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a company' },
          { name: 'Delete', value: 'delete', description: 'Delete a company' },
          { name: 'Get', value: 'get', description: 'Get a company' },
          { name: 'Get All', value: 'getAll', description: 'Get all companies' },
          { name: 'Update', value: 'update', description: 'Update a company' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['deal']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a deal' },
          { name: 'Delete', value: 'delete', description: 'Delete a deal' },
          { name: 'Get', value: 'get', description: 'Get a deal' },
          { name: 'Get All', value: 'getAll', description: 'Get all deals' },
          { name: 'Update', value: 'update', description: 'Update a deal' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['ticket']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a ticket' },
          { name: 'Delete', value: 'delete', description: 'Delete a ticket' },
          { name: 'Get', value: 'get', description: 'Get a ticket' },
          { name: 'Get All', value: 'getAll', description: 'Get all tickets' },
          { name: 'Update', value: 'update', description: 'Update a ticket' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'hubspotOAuth2Api',
        displayName: 'HubSpot OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'HubSpot',
      color: '#FF7A59'
    },
    commonUseCase: 'CRM automation, lead management, sales pipeline management, customer support workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.hubspot/',
    workflowPatterns: ['database_sync', 'email_automation']
  },

  // IMAP Email - Email Processing and Management
  {
    name: 'n8n-nodes-base.imap',
    displayName: 'IMAP Email',
    description: 'Automate work with IMAP email servers, and integrate IMAP with other applications. Receive and process emails from any IMAP server.',
    version: 1,
    category: 'Communication',
    subcategory: 'Email',
    tags: [
      'imap', 'email', 'mail', 'inbox', 'receive', 'fetch', 'email processing',
      'get emails', 'mark as read', 'move email', 'delete email',
      'email automation', 'email parsing', 'attachment processing', 'email monitoring',
      'email server', 'mail server', 'email integration', 'inbox management'
    ],
    icon: 'imap.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Get Emails', value: 'getEmails', description: 'Get emails from mailbox' },
          { name: 'Mark as Read', value: 'markAsRead', description: 'Mark email as read' },
          { name: 'Move Email', value: 'moveEmail', description: 'Move email to folder' },
          { name: 'Delete Email', value: 'deleteEmail', description: 'Delete email' }
        ],
        default: 'getEmails',
        description: 'The operation to perform'
      },
      {
        displayName: 'Mailbox',
        name: 'mailbox',
        type: 'string',
        default: 'INBOX',
        description: 'The mailbox to operate on'
      },
      {
        displayName: 'Criteria',
        name: 'criteria',
        type: 'string',
        default: 'UNSEEN',
        displayOptions: {
          show: {
            operation: ['getEmails']
          }
        },
        description: 'Search criteria for emails (e.g., UNSEEN, FROM "sender@example.com")'
      }
    ],
    credentials: [
      {
        name: 'imap',
        displayName: 'IMAP',
        required: true
      }
    ],
    defaults: {
      name: 'IMAP Email',
      color: '#1f4788'
    },
    commonUseCase: 'Email processing automation, inbox monitoring, email parsing and routing',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.imap/',
    workflowPatterns: ['email_automation', 'notification_system']
  },

  // MySQL - Database Management
  {
    name: 'n8n-nodes-base.mySql',
    displayName: 'MySQL',
    description: 'Automate work in MySQL, and integrate MySQL with other applications. Execute queries and manage data in MySQL databases.',
    version: 2,
    category: 'Database',
    subcategory: 'SQL',
    tags: [
      'mysql', 'database', 'sql', 'query', 'data', 'relational database',
      'execute query', 'insert data', 'update data', 'delete data', 'select data',
      'database operations', 'data management', 'mysql server', 'mariadb',
      'sql operations', 'database automation', 'data synchronization'
    ],
    icon: 'mysql.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Execute Query', value: 'executeQuery', description: 'Execute a SQL query' },
          { name: 'Insert', value: 'insert', description: 'Insert rows in table' },
          { name: 'Update', value: 'update', description: 'Update rows in table' },
          { name: 'Delete', value: 'delete', description: 'Delete rows from table' }
        ],
        default: 'executeQuery',
        description: 'The operation to perform'
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          editor: 'code',
          editorLanguage: 'sql'
        },
        default: '',
        placeholder: 'SELECT * FROM table_name',
        required: true,
        displayOptions: {
          show: {
            operation: ['executeQuery']
          }
        },
        description: 'The SQL query to execute'
      }
    ],
    credentials: [
      {
        name: 'mySql',
        displayName: 'MySQL',
        required: true
      }
    ],
    defaults: {
      name: 'MySQL',
      color: '#f29111'
    },
    commonUseCase: 'Database operations, data synchronization, SQL automation, web application backends',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mysql/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // Notion - Note-taking and Database Management
  {
    name: 'n8n-nodes-base.notion',
    displayName: 'Notion',
    description: 'Automate work in Notion, and integrate Notion with other applications. Create, get, update and delete pages, databases, and blocks.',
    version: 2,
    category: 'Productivity',
    subcategory: 'Notes & Documentation',
    tags: [
      'notion', 'notes', 'documentation', 'database', 'wiki', 'knowledge base',
      'create page', 'get page', 'update page', 'delete page',
      'create database item', 'get database item', 'update database item', 'query database',
      'get users', 'get blocks', 'append blocks', 'content management',
      'team collaboration', 'project management', 'documentation automation'
    ],
    icon: 'notion.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Page', value: 'page' },
          { name: 'Database Page', value: 'databasePage' },
          { name: 'User', value: 'user' },
          { name: 'Block', value: 'block' }
        ],
        default: 'page',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['page']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a page' },
          { name: 'Get', value: 'get', description: 'Get a page' },
          { name: 'Update', value: 'update', description: 'Update a page' },
          { name: 'Archive', value: 'archive', description: 'Archive a page' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['databasePage']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a database page' },
          { name: 'Get', value: 'get', description: 'Get a database page' },
          { name: 'Get Many', value: 'getAll', description: 'Get many database pages' },
          { name: 'Update', value: 'update', description: 'Update a database page' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'notionApi',
        displayName: 'Notion API',
        required: true
      }
    ],
    defaults: {
      name: 'Notion',
      color: '#000000'
    },
    commonUseCase: 'Knowledge management, documentation automation, project tracking, content management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.notion/',
    workflowPatterns: ['database_sync', 'data_transformation', 'notification_system']
  },

  // Stripe - Payment Processing
  {
    name: 'n8n-nodes-base.stripe',
    displayName: 'Stripe',
    description: 'Automate work in Stripe, and integrate Stripe with other applications. Create, get, update and delete customers, charges, subscriptions, and products.',
    version: 1,
    category: 'Finance',
    subcategory: 'Payment Processing',
    tags: [
      'stripe', 'payments', 'billing', 'subscriptions', 'ecommerce', 'finance',
      'create customer', 'update customer', 'delete customer', 'get customer', 'get all customers',
      'create charge', 'get charge', 'get all charges', 'capture charge', 'refund charge',
      'create subscription', 'cancel subscription', 'get subscription', 'update subscription',
      'create product', 'delete product', 'get product', 'update product',
      'payment processing', 'billing automation', 'subscription management'
    ],
    icon: 'stripe.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Customer', value: 'customer' },
          { name: 'Charge', value: 'charge' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Product', value: 'product' }
        ],
        default: 'customer',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['customer']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer' },
          { name: 'Get All', value: 'getAll', description: 'Get all customers' },
          { name: 'Update', value: 'update', description: 'Update a customer' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['charge']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a charge' },
          { name: 'Get', value: 'get', description: 'Get a charge' },
          { name: 'Get All', value: 'getAll', description: 'Get all charges' },
          { name: 'Capture', value: 'capture', description: 'Capture a charge' },
          { name: 'Refund', value: 'refund', description: 'Refund a charge' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'stripeApi',
        displayName: 'Stripe API',
        required: true
      }
    ],
    defaults: {
      name: 'Stripe',
      color: '#6772E5'
    },
    commonUseCase: 'Payment processing automation, subscription management, billing workflows, ecommerce integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.stripe/',
    workflowPatterns: ['email_automation', 'notification_system', 'database_sync']
  },

  // Telegram - Messaging and Bot Integration
  {
    name: 'n8n-nodes-base.telegram',
    displayName: 'Telegram',
    description: 'Automate work in Telegram, and integrate Telegram with other applications. Send messages, photos, and files through Telegram bots.',
    version: 1,
    category: 'Communication',
    subcategory: 'Messaging',
    tags: [
      'telegram', 'messaging', 'bot', 'chat', 'instant messaging', 'notifications',
      'send message', 'send photo', 'send document', 'send animation', 'send audio',
      'send location', 'send sticker', 'send video', 'edit message', 'delete message',
      'get chat', 'get chat administrators', 'get chat member', 'get chat members count',
      'answer callback query', 'answer inline query', 'pin chat message', 'unpin chat message',
      'bot automation', 'instant notifications', 'team communication'
    ],
    icon: 'telegram.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Chat', value: 'chat' },
          { name: 'File', value: 'file' },
          { name: 'Callback', value: 'callback' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Send Text', value: 'sendMessage', description: 'Send a text message' },
          { name: 'Send Photo', value: 'sendPhoto', description: 'Send a photo' },
          { name: 'Send Document', value: 'sendDocument', description: 'Send a document' },
          { name: 'Send Location', value: 'sendLocation', description: 'Send a location' },
          { name: 'Edit Text', value: 'editMessageText', description: 'Edit a text message' },
          { name: 'Delete', value: 'deleteMessage', description: 'Delete a message' }
        ],
        default: 'sendMessage',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'telegramApi',
        displayName: 'Telegram API',
        required: true
      }
    ],
    defaults: {
      name: 'Telegram',
      color: '#0088cc'
    },
    commonUseCase: 'Instant notifications, bot automation, team communication, alert systems',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/',
    workflowPatterns: ['notification_system', 'email_automation']
  },

  // Trello - Project Management and Board Organization
  {
    name: 'n8n-nodes-base.trello',
    displayName: 'Trello',
    description: 'Automate work in Trello, and integrate Trello with other applications. Create, get, update and delete boards, lists, cards, and checklists.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Project Management',
    tags: [
      'trello', 'project management', 'kanban', 'boards', 'cards', 'lists', 'organization',
      'create board', 'get board', 'get all boards', 'update board',
      'create list', 'get list', 'get all lists', 'update list',
      'create card', 'delete card', 'get card', 'get all cards', 'update card',
      'create checklist', 'delete checklist', 'get checklist', 'get all checklists', 'update checklist',
      'task management', 'workflow organization', 'team collaboration'
    ],
    icon: 'trello.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Board', value: 'board' },
          { name: 'Card', value: 'card' },
          { name: 'Checklist', value: 'checklist' },
          { name: 'List', value: 'list' }
        ],
        default: 'card',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['board']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a board' },
          { name: 'Get', value: 'get', description: 'Get a board' },
          { name: 'Get All', value: 'getAll', description: 'Get all boards' },
          { name: 'Update', value: 'update', description: 'Update a board' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['card']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a card' },
          { name: 'Delete', value: 'delete', description: 'Delete a card' },
          { name: 'Get', value: 'get', description: 'Get a card' },
          { name: 'Get All', value: 'getAll', description: 'Get all cards' },
          { name: 'Update', value: 'update', description: 'Update a card' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'trelloApi',
        displayName: 'Trello API',
        required: true
      }
    ],
    defaults: {
      name: 'Trello',
      color: '#0079BF'
    },
    commonUseCase: 'Project management automation, kanban board management, task tracking, team collaboration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.trello/',
    workflowPatterns: ['notification_system', 'database_sync', 'email_automation']
  },

  // Twilio - SMS and Voice Communication
  {
    name: 'n8n-nodes-base.twilio',
    displayName: 'Twilio',
    description: 'Automate work in Twilio, and integrate Twilio with other applications. Send SMS messages, make phone calls, and manage communication services.',
    version: 1,
    category: 'Communication',
    subcategory: 'SMS & Voice',
    tags: [
      'twilio', 'sms', 'text message', 'phone call', 'voice', 'communication',
      'send sms', 'make call', 'get call', 'get all calls',
      'get message', 'get all messages',
      'phone automation', 'sms automation', 'voice automation', 'notifications'
    ],
    icon: 'twilio.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'SMS', value: 'sms' },
          { name: 'Call', value: 'call' }
        ],
        default: 'sms',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['sms']
          }
        },
        options: [
          { name: 'Send', value: 'send', description: 'Send an SMS' },
          { name: 'Get', value: 'get', description: 'Get an SMS' },
          { name: 'Get All', value: 'getAll', description: 'Get all SMS messages' }
        ],
        default: 'send',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['call']
          }
        },
        options: [
          { name: 'Make', value: 'make', description: 'Make a call' },
          { name: 'Get', value: 'get', description: 'Get a call' },
          { name: 'Get All', value: 'getAll', description: 'Get all calls' }
        ],
        default: 'make',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'twilioApi',
        displayName: 'Twilio API',
        required: true
      }
    ],
    defaults: {
      name: 'Twilio',
      color: '#F22F46'
    },
    commonUseCase: 'SMS notifications, phone call automation, two-factor authentication, customer communication',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.twilio/',
    workflowPatterns: ['notification_system', 'email_automation']
  },

  // Wait - Timing and Delay Node
  {
    name: 'n8n-nodes-base.wait',
    displayName: 'Wait',
    description: 'Wait before continuing with workflow execution. Add delays and timing controls to workflows.',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow Control',
    tags: [
      'wait', 'delay', 'pause', 'timing', 'schedule', 'interval',
      'wait for time', 'wait for webhook', 'wait for date time',
      'flow control', 'timing control', 'execution delay', 'workflow pause'
    ],
    icon: 'wait.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resume',
        name: 'resume',
        type: 'options',
        options: [
          { name: 'After Time Interval', value: 'timeInterval' },
          { name: 'At Specified Time', value: 'specificTime' },
          { name: 'On Webhook Call', value: 'webhook' }
        ],
        default: 'timeInterval',
        description: 'Determines when the workflow should continue'
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 1,
        displayOptions: {
          show: {
            resume: ['timeInterval']
          }
        },
        description: 'The amount of time to wait'
      },
      {
        displayName: 'Unit',
        name: 'unit',
        type: 'options',
        displayOptions: {
          show: {
            resume: ['timeInterval']
          }
        },
        options: [
          { name: 'Seconds', value: 'seconds' },
          { name: 'Minutes', value: 'minutes' },
          { name: 'Hours', value: 'hours' },
          { name: 'Days', value: 'days' }
        ],
        default: 'seconds',
        description: 'The time unit for the amount specified'
      }
    ],
    defaults: {
      name: 'Wait',
      color: '#804080'
    },
    commonUseCase: 'Add delays between operations, rate limiting, scheduled execution, webhook waiting',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/',
    workflowPatterns: ['notification_system', 'email_automation', 'api_rate_limiting']
  },

  // Webhook Trigger - Enhanced Webhook Listener
  {
    name: 'n8n-nodes-base.webhookTrigger',
    displayName: 'Webhook Trigger',
    description: 'Receive HTTP requests and trigger workflows with enhanced webhook functionality',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'HTTP',
    tags: [
      'webhook trigger', 'http trigger', 'api trigger', 'receive http', 'http listener',
      'webhook automation', 'api automation', 'http request listener', 'webhook receiver'
    ],
    icon: 'webhook.svg',
    triggerNode: true,
    webhookNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'HTTP Method',
        name: 'httpMethod',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' },
          { name: 'HEAD', value: 'HEAD' }
        ],
        default: 'POST',
        description: 'The HTTP method to listen for'
      },
      {
        displayName: 'Path',
        name: 'path',
        type: 'string',
        default: '',
        placeholder: 'webhook-path',
        description: 'The path for the webhook URL'
      }
    ],
    webhooks: [{
      name: 'default',
      httpMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
      responseMode: 'onReceived',
      path: 'webhook'
    }],
    defaults: {
      name: 'Webhook Trigger',
      color: '#885577'
    },
    commonUseCase: 'Advanced webhook handling, API integrations, external system triggers',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/',
    workflowPatterns: ['webhook_to_email', 'ai_processing', 'notification_system', 'data_transformation']
  },

  // Email Trigger - IMAP Email Listener
  {
    name: 'n8n-nodes-base.emailReadImap',
    displayName: 'Email Trigger (IMAP)',
    description: 'Trigger workflows when new emails are received via IMAP',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'Email',
    tags: [
      'email trigger', 'imap trigger', 'email automation', 'inbox monitoring',
      'email listener', 'mail trigger', 'email polling', 'email notifications'
    ],
    icon: 'imap.svg',
    triggerNode: true,
    pollingNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Mailbox',
        name: 'mailbox',
        type: 'string',
        default: 'INBOX',
        description: 'The mailbox to monitor for new emails'
      },
      {
        displayName: 'Search Criteria',
        name: 'searchCriteria',
        type: 'string',
        default: 'UNSEEN',
        description: 'IMAP search criteria for filtering emails'
      }
    ],
    credentials: [
      {
        name: 'imap',
        displayName: 'IMAP',
        required: true
      }
    ],
    defaults: {
      name: 'Email Trigger (IMAP)',
      color: '#1f4788'
    },
    commonUseCase: 'Email-driven workflows, support ticket automation, email processing pipelines',
    documentation: 'https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.emailreadimap/',
    workflowPatterns: ['email_automation', 'notification_system', 'support_automation']
  },

  // FTP - File Transfer Protocol
  {
    name: 'n8n-nodes-base.ftp',
    displayName: 'FTP',
    description: 'Automate work with FTP servers, and integrate FTP with other applications. Upload, download, and manage files on FTP servers.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'File Transfer',
    tags: [
      'ftp', 'file transfer', 'file upload', 'file download', 'file management', 'server files',
      'upload file', 'download file', 'list files', 'delete file', 'rename file',
      'create directory', 'file operations', 'remote files', 'file synchronization'
    ],
    icon: 'ftp.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Protocol',
        name: 'protocol',
        type: 'options',
        options: [
          { name: 'FTP', value: 'ftp' },
          { name: 'SFTP', value: 'sftp' }
        ],
        default: 'ftp',
        description: 'The protocol to use'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'List', value: 'list', description: 'List files and folders' },
          { name: 'Rename', value: 'rename', description: 'Rename a file' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'download',
        description: 'The operation to perform'
      },
      {
        displayName: 'Path',
        name: 'path',
        type: 'string',
        default: '/',
        description: 'The path on the server'
      }
    ],
    credentials: [
      {
        name: 'ftp',
        displayName: 'FTP',
        required: true
      }
    ],
    defaults: {
      name: 'FTP',
      color: '#FF6600'
    },
    commonUseCase: 'File transfer automation, server file management, backup operations, file synchronization',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.ftp/',
    workflowPatterns: ['data_transformation', 'backup_automation', 'file_processing']
  },

  // JSON - JSON Data Processing
  {
    name: 'n8n-nodes-base.json',
    displayName: 'JSON',
    description: 'Process and manipulate JSON data with various operations',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'json', 'parse', 'stringify', 'data processing', 'json manipulation',
      'json parse', 'json stringify', 'data transformation', 'json operations'
    ],
    icon: 'json.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Parse', value: 'parse', description: 'Parse JSON string to object' },
          { name: 'Stringify', value: 'stringify', description: 'Convert object to JSON string' }
        ],
        default: 'parse',
        description: 'The operation to perform'
      },
      {
        displayName: 'Property Name',
        name: 'propertyName',
        type: 'string',
        default: 'data',
        description: 'Name of the property containing the JSON data'
      }
    ],
    defaults: {
      name: 'JSON',
      color: '#d4af00'
    },
    commonUseCase: 'JSON data parsing, string conversion, data format transformation',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.json/',
    workflowPatterns: ['data_transformation', 'api_integration', 'data_processing']
  },

  // Move Binary Data - File Operations
  {
    name: 'n8n-nodes-base.moveBinaryData',
    displayName: 'Move Binary Data',
    description: 'Move binary data between JSON and binary properties',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'binary data', 'move data', 'file operations', 'data transfer',
      'json to binary', 'binary to json', 'data conversion', 'file handling'
    ],
    icon: 'fa:exchange-alt',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'JSON to Binary', value: 'jsonToBinary', description: 'Move data from JSON to binary property' },
          { name: 'Binary to JSON', value: 'binaryToJson', description: 'Move data from binary to JSON property' }
        ],
        default: 'jsonToBinary',
        description: 'The mode of operation'
      },
      {
        displayName: 'Set All Data',
        name: 'setAllData',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: {
            mode: ['jsonToBinary']
          }
        },
        description: 'Whether to set all JSON data or only specific properties'
      }
    ],
    defaults: {
      name: 'Move Binary Data',
      color: '#7722CC'
    },
    commonUseCase: 'File processing, data format conversion, binary data handling',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.movebinarydata/',
    workflowPatterns: ['file_processing', 'data_transformation', 'binary_operations']
  },

  // Execute Command - System Operations
  {
    name: 'n8n-nodes-base.executeCommand',
    displayName: 'Execute Command',
    description: 'Execute system commands and shell scripts',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'System',
    tags: [
      'execute command', 'shell', 'bash', 'cmd', 'system', 'terminal',
      'command line', 'shell script', 'system operations', 'process execution'
    ],
    icon: 'terminal.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Command',
        name: 'command',
        type: 'string',
        default: '',
        placeholder: 'echo "Hello World"',
        required: true,
        description: 'The command to execute'
      },
      {
        displayName: 'Arguments',
        name: 'arguments',
        type: 'string',
        default: '',
        description: 'Arguments to pass to the command'
      }
    ],
    defaults: {
      name: 'Execute Command',
      color: '#004080'
    },
    commonUseCase: 'System automation, script execution, file operations, system integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/',
    workflowPatterns: ['system_automation', 'file_processing', 'deployment_automation']
  },

  // No Operation (NoOp) - Workflow Testing
  {
    name: 'n8n-nodes-base.noOp',
    displayName: 'No Operation',
    description: 'Pass data through without any changes - useful for workflow testing and debugging',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow Control',
    tags: [
      'no operation', 'noop', 'pass through', 'testing', 'debugging',
      'workflow testing', 'data passthrough', 'no change', 'placeholder'
    ],
    icon: 'fa:ban',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [],
    defaults: {
      name: 'No Operation',
      color: '#b0b0b0'
    },
    commonUseCase: 'Workflow testing, debugging, placeholder operations, data flow testing',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.noop/',
    workflowPatterns: ['testing', 'debugging', 'development']
  },

  // Stop and Error - Workflow Control
  {
    name: 'n8n-nodes-base.stopAndError',
    displayName: 'Stop and Error',
    description: 'Stop workflow execution and optionally throw an error with a custom message',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow Control',
    tags: [
      'stop', 'error', 'halt', 'workflow control', 'exception', 'error handling',
      'workflow termination', 'error message', 'stop execution'
    ],
    icon: 'fa:stop-circle',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [],
    properties: [
      {
        displayName: 'Error Message',
        name: 'errorMessage',
        type: 'string',
        default: 'Workflow stopped',
        description: 'The error message to display when stopping'
      }
    ],
    defaults: {
      name: 'Stop and Error',
      color: '#ff6d5a'
    },
    commonUseCase: 'Error handling, workflow validation, conditional stopping, debugging',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.stopanderror/',
    workflowPatterns: ['error_handling', 'workflow_control', 'validation']
  },

  // MongoDB - NoSQL Database Operations
  {
    name: 'n8n-nodes-base.mongoDb',
    displayName: 'MongoDB',
    description: 'Automate work in MongoDB, and integrate MongoDB with other applications. Execute operations on MongoDB collections and documents.',
    version: 1,
    category: 'Database',
    subcategory: 'NoSQL',
    tags: [
      'mongodb', 'nosql', 'database', 'document database', 'collection', 'documents',
      'find documents', 'find one document', 'insert document', 'insert many documents',
      'update document', 'update many documents', 'delete document', 'delete many documents',
      'aggregate', 'count documents', 'distinct', 'find and replace', 'find and update',
      'document operations', 'collection operations', 'nosql operations', 'mongo queries'
    ],
    icon: 'mongodb.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Aggregate', value: 'aggregate', description: 'Aggregate documents' },
          { name: 'Delete', value: 'delete', description: 'Delete documents' },
          { name: 'Delete Many', value: 'deleteMany', description: 'Delete many documents' },
          { name: 'Distinct', value: 'distinct', description: 'Get distinct values' },
          { name: 'Find', value: 'find', description: 'Find documents' },
          { name: 'Find and Replace', value: 'findOneAndReplace', description: 'Find and replace a document' },
          { name: 'Find and Update', value: 'findOneAndUpdate', description: 'Find and update a document' },
          { name: 'Find One', value: 'findOne', description: 'Find one document' },
          { name: 'Insert', value: 'insert', description: 'Insert a document' },
          { name: 'Insert Many', value: 'insertMany', description: 'Insert many documents' },
          { name: 'Update', value: 'update', description: 'Update documents' },
          { name: 'Update Many', value: 'updateMany', description: 'Update many documents' }
        ],
        default: 'find',
        description: 'The operation to perform'
      },
      {
        displayName: 'Collection',
        name: 'collection',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the MongoDB collection'
      }
    ],
    credentials: [
      {
        name: 'mongoDb',
        displayName: 'MongoDB',
        required: true
      }
    ],
    defaults: {
      name: 'MongoDB',
      color: '#47A248'
    },
    commonUseCase: 'NoSQL database operations, document storage, modern web applications, JSON-based data management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mongodb/',
    workflowPatterns: ['database_sync', 'data_transformation']
  },

  // Microsoft Excel - Spreadsheet Operations
  {
    name: 'n8n-nodes-base.microsoftExcel',
    displayName: 'Microsoft Excel',
    description: 'Automate work in Microsoft Excel, and integrate Excel with other applications. Create, get, update and delete workbooks, worksheets, and data.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Spreadsheet',
    tags: [
      'microsoft excel', 'excel', 'spreadsheet', 'microsoft', 'office365', 'workbook', 'worksheet',
      'add row', 'delete row', 'get row', 'get all rows', 'update row',
      'create table', 'get table', 'get all tables', 'update table',
      'create workbook', 'get workbook', 'update workbook',
      'create worksheet', 'delete worksheet', 'get worksheet', 'get all worksheets',
      'office automation', 'data analysis', 'reporting', 'business intelligence'
    ],
    icon: 'microsoftexcel.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Table', value: 'table' },
          { name: 'Workbook', value: 'workbook' },
          { name: 'Worksheet', value: 'worksheet' }
        ],
        default: 'table',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['table']
          }
        },
        options: [
          { name: 'Add Row', value: 'addRow', description: 'Add a row' },
          { name: 'Get Columns', value: 'getColumns', description: 'Get columns' },
          { name: 'Get Rows', value: 'getRows', description: 'Get rows' },
          { name: 'Lookup', value: 'lookup', description: 'Look up a specific row' },
          { name: 'Update Row', value: 'updateRow', description: 'Update a row' }
        ],
        default: 'addRow',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'microsoftExcelOAuth2Api',
        displayName: 'Microsoft Excel OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Microsoft Excel',
      color: '#217346'
    },
    commonUseCase: 'Excel automation, data analysis, reporting, business intelligence, spreadsheet management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsoftexcel/',
    workflowPatterns: ['database_sync', 'data_transformation', 'reporting']
  },

  // Microsoft Teams - Team Communication
  {
    name: 'n8n-nodes-base.microsoftTeams',
    displayName: 'Microsoft Teams',
    description: 'Automate work in Microsoft Teams, and integrate Teams with other applications. Send messages, manage channels, and collaborate with team members.',
    version: 1,
    category: 'Communication',
    subcategory: 'Team Chat',
    tags: [
      'microsoft teams', 'teams', 'microsoft', 'office365', 'chat', 'messaging', 'collaboration',
      'send message', 'send message to channel', 'send message to user',
      'get message', 'get all messages', 'update message',
      'create channel', 'get channel', 'get all channels', 'update channel',
      'get team', 'get all teams', 'get team member', 'get all team members',
      'team collaboration', 'enterprise messaging', 'workplace communication'
    ],
    icon: 'microsoftteams.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Channel Message', value: 'channelMessage' },
          { name: 'Chat Message', value: 'chatMessage' },
          { name: 'Team', value: 'team' }
        ],
        default: 'channelMessage',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['channelMessage']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a channel message' },
          { name: 'Get', value: 'get', description: 'Get a channel message' },
          { name: 'Get All', value: 'getAll', description: 'Get all channel messages' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'microsoftTeamsOAuth2Api',
        displayName: 'Microsoft Teams OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Microsoft Teams',
      color: '#6264A7'
    },
    commonUseCase: 'Enterprise team communication, workplace notifications, collaboration automation, project updates',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsoftteams/',
    workflowPatterns: ['notification_system', 'email_automation', 'team_collaboration']
  },

  // Microsoft ToDo - Task Management
  {
    name: 'n8n-nodes-base.microsoftToDo',
    displayName: 'Microsoft To Do',
    description: 'Automate work in Microsoft To Do, and integrate To Do with other applications. Create, get, update and delete tasks and task lists.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Task Management',
    tags: [
      'microsoft todo', 'todo', 'microsoft', 'office365', 'tasks', 'task management', 'productivity',
      'create task', 'complete task', 'delete task', 'get task', 'get all tasks', 'update task',
      'create linked resource', 'delete linked resource', 'get linked resource', 'get all linked resources', 'update linked resource',
      'create task list', 'delete task list', 'get task list', 'get all task lists', 'update task list',
      'personal productivity', 'task tracking', 'to-do lists', 'task automation'
    ],
    icon: 'microsofttodo.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Linked Resource', value: 'linkedResource' },
          { name: 'Task', value: 'task' },
          { name: 'Task List', value: 'taskList' }
        ],
        default: 'task',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['task']
          }
        },
        options: [
          { name: 'Complete', value: 'complete', description: 'Complete a task' },
          { name: 'Create', value: 'create', description: 'Create a task' },
          { name: 'Delete', value: 'delete', description: 'Delete a task' },
          { name: 'Get', value: 'get', description: 'Get a task' },
          { name: 'Get All', value: 'getAll', description: 'Get all tasks' },
          { name: 'Update', value: 'update', description: 'Update a task' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'microsoftToDoOAuth2Api',
        displayName: 'Microsoft To Do OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Microsoft To Do',
      color: '#2564CF'
    },
    commonUseCase: 'Personal task automation, productivity workflows, task tracking, reminder systems',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsofttodo/',
    workflowPatterns: ['task_automation', 'productivity', 'notification_system']
  },

  // OpenAI - Direct AI Integration
  {
    name: 'n8n-nodes-base.openAi',
    displayName: 'OpenAI',
    description: 'Automate work with OpenAI, and integrate OpenAI with other applications. Generate text, images, audio, and more using AI models.',
    version: 1,
    category: 'AI',
    subcategory: 'AI Services',
    tags: [
      'openai', 'ai', 'artificial intelligence', 'gpt', 'chatgpt', 'text generation', 'image generation',
      'create completion', 'create chat completion', 'create edit', 'create embedding',
      'create image', 'create image edit', 'create image variation',
      'create moderation', 'create transcription', 'create translation',
      'machine learning', 'natural language processing', 'computer vision', 'speech processing'
    ],
    icon: 'openai.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Audio', value: 'audio' },
          { name: 'Chat', value: 'chat' },
          { name: 'Image', value: 'image' },
          { name: 'Text', value: 'text' }
        ],
        default: 'text',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['text']
          }
        },
        options: [
          { name: 'Complete', value: 'complete', description: 'Create a completion' },
          { name: 'Edit', value: 'edit', description: 'Create an edit' },
          { name: 'Embedding', value: 'embedding', description: 'Create an embedding' },
          { name: 'Moderate', value: 'moderate', description: 'Create a moderation' }
        ],
        default: 'complete',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a chat completion' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['image']
          }
        },
        options: [
          { name: 'Generate', value: 'generate', description: 'Create an image' },
          { name: 'Edit', value: 'edit', description: 'Create an image edit' },
          { name: 'Variation', value: 'variation', description: 'Create an image variation' }
        ],
        default: 'generate',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['audio']
          }
        },
        options: [
          { name: 'Transcribe', value: 'transcribe', description: 'Create a transcription' },
          { name: 'Translate', value: 'translate', description: 'Create a translation' }
        ],
        default: 'transcribe',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'openAiApi',
        displayName: 'OpenAI API',
        required: true
      }
    ],
    defaults: {
      name: 'OpenAI',
      color: '#10A37F'
    },
    commonUseCase: 'AI-powered content generation, text processing, image creation, audio transcription, chatbots',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/',
    workflowPatterns: ['ai_processing', 'content_generation', 'data_transformation']
  },

  // Code - Advanced JavaScript Execution
  {
    name: 'n8n-nodes-base.code',
    displayName: 'Code',
    description: 'Execute custom JavaScript or Python code with full access to libraries and advanced programming features',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Code',
    tags: [
      'code', 'javascript', 'python', 'programming', 'custom logic', 'scripting', 'advanced',
      'run javascript', 'run python', 'execute code', 'custom functions', 'data processing',
      'business logic', 'complex transformations', 'custom operations', 'programming logic'
    ],
    icon: 'code.svg',
    triggerNode: false,
    codeable: true,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Language',
        name: 'language',
        type: 'options',
        options: [
          { name: 'JavaScript', value: 'javaScript' },
          { name: 'Python', value: 'python' }
        ],
        default: 'javaScript',
        description: 'The programming language to use'
      },
      {
        displayName: 'JavaScript Code',
        name: 'jsCode',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          codeAutocomplete: 'function',
          editor: 'code',
          editorLanguage: 'javascript',
          rows: 15
        },
        displayOptions: {
          show: {
            language: ['javaScript']
          }
        },
        default: `// Access input data
const items = $input.all();

// Process each item
for (const item of items) {
  // Your custom logic here
  item.json.processed = true;
  item.json.timestamp = new Date().toISOString();
}

// Return processed data
return items;`,
        description: 'JavaScript code to execute',
        required: true
      },
      {
        displayName: 'Python Code',
        name: 'pythonCode',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          editor: 'code',
          editorLanguage: 'python',
          rows: 15
        },
        displayOptions: {
          show: {
            language: ['python']
          }
        },
        default: `# Access input data
items = _input.all()

# Process each item
for item in items:
    # Your custom logic here
    item['json']['processed'] = True
    item['json']['timestamp'] = str(datetime.now())

# Return processed data
return items`,
        description: 'Python code to execute',
        required: true
      }
    ],
    defaults: {
      name: 'Code',
      color: '#FF9922'
    },
    commonUseCase: 'Advanced data processing, custom business logic, complex transformations, API integrations',
    functionTemplate: `// Advanced JavaScript execution
// Access input data: $input.all() or $input.first()
// Access node data: $('Node Name').all()
// Use any JavaScript features and libraries

const items = $input.all();

// Your custom processing logic
for (const item of items) {
  // Transform data
  item.json.processedAt = new Date().toISOString();
  item.json.customField = item.json.someField?.toUpperCase();
  
  // Complex calculations
  if (item.json.numbers) {
    item.json.sum = item.json.numbers.reduce((a, b) => a + b, 0);
  }
}

return items;`,
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/',
    workflowPatterns: ['ai_processing', 'data_transformation', 'custom_logic', 'api_integration']
  },

  // DateTime - Date and Time Operations
  {
    name: 'n8n-nodes-base.dateTime',
    displayName: 'Date & Time',
    description: 'Manipulate and transform date and time values with various formatting and calculation options',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'datetime', 'date', 'time', 'timestamp', 'formatting', 'calculation', 'timezone',
      'format date', 'parse date', 'add time', 'subtract time', 'timezone conversion',
      'date arithmetic', 'time manipulation', 'date formatting', 'timestamp conversion'
    ],
    icon: 'fa:calendar',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        options: [
          { name: 'Calculate a Date', value: 'calculate' },
          { name: 'Format a Date', value: 'format' },
          { name: 'Get Current Date', value: 'getCurrentDate' }
        ],
        default: 'format',
        description: 'The action to perform'
      },
      {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        default: '={{$json["date"]}}',
        displayOptions: {
          show: {
            action: ['format', 'calculate']
          }
        },
        description: 'The date/time value to work with'
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
          { name: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
          { name: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          { name: 'ISO 8601', value: 'YYYY-MM-DDTHH:mm:ss.SSSZ' },
          { name: 'Unix Timestamp', value: 'X' },
          { name: 'Custom', value: 'custom' }
        ],
        default: 'YYYY-MM-DD',
        displayOptions: {
          show: {
            action: ['format']
          }
        },
        description: 'Output format for the date'
      }
    ],
    defaults: {
      name: 'Date & Time',
      color: '#408000'
    },
    commonUseCase: 'Date formatting, time calculations, timezone conversions, timestamp processing',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.datetime/',
    workflowPatterns: ['data_transformation', 'reporting', 'scheduling']
  },

  // Edit Image - Image Processing
  {
    name: 'n8n-nodes-base.editImage',
    displayName: 'Edit Image',
    description: 'Edit and manipulate images with various operations like resize, crop, rotate, and apply filters',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Media',
    tags: [
      'image editing', 'image processing', 'resize', 'crop', 'rotate', 'filter', 'transform',
      'composite', 'blur', 'sharpen', 'grayscale', 'sepia', 'thumbnail generation',
      'image manipulation', 'graphics processing', 'photo editing', 'media processing'
    ],
    icon: 'fa:image',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Blur', value: 'blur' },
          { name: 'Border', value: 'border' },
          { name: 'Composite', value: 'composite' },
          { name: 'Crop', value: 'crop' },
          { name: 'Get Information', value: 'information' },
          { name: 'Multi Step', value: 'multiStep' },
          { name: 'Resize', value: 'resize' },
          { name: 'Rotate', value: 'rotate' },
          { name: 'Shear', value: 'shear' },
          { name: 'Text', value: 'text' }
        ],
        default: 'resize',
        description: 'The operation to perform on the image'
      },
      {
        displayName: 'Data Property Name',
        name: 'dataPropertyName',
        type: 'string',
        default: 'data',
        description: 'Name of the binary property containing the image data'
      }
    ],
    defaults: {
      name: 'Edit Image',
      color: '#553399'
    },
    commonUseCase: 'Image processing, thumbnail generation, photo editing, graphics manipulation, media workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.editimage/',
    workflowPatterns: ['media_processing', 'content_generation', 'automation']
  },

  // Filter - Data Filtering
  {
    name: 'n8n-nodes-base.filter',
    displayName: 'Filter',
    description: 'Filter items based on conditions, keeping only items that match specified criteria',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Flow',
    tags: [
      'filter', 'conditions', 'keep if', 'remove if', 'data filtering', 'conditional filtering',
      'array filtering', 'data selection', 'criteria matching', 'item filtering',
      'data processing', 'conditional logic', 'data refinement'
    ],
    icon: 'fa:filter',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Conditions',
        name: 'conditions',
        placeholder: 'Add Condition',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true
        },
        description: 'The conditions to filter by',
        default: {},
        options: [
          {
            name: 'boolean',
            displayName: 'Boolean',
            value: 'boolean',
            values: [
              {
                displayName: 'Value 1',
                name: 'value1',
                type: 'string',
                default: '',
                description: 'The first value to compare'
              },
              {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                  { name: 'Equal', value: 'equal' },
                  { name: 'Not Equal', value: 'notEqual' },
                  { name: 'Contains', value: 'contains' },
                  { name: 'Not Contains', value: 'notContains' },
                  { name: 'Starts With', value: 'startsWith' },
                  { name: 'Ends With', value: 'endsWith' },
                  { name: 'Regex', value: 'regex' }
                ],
                default: 'equal',
                description: 'Operation to decide where the the data should be mapped to'
              },
              {
                displayName: 'Value 2',
                name: 'value2',
                type: 'string',
                default: '',
                description: 'The second value to compare'
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'Filter',
      color: '#229954'
    },
    commonUseCase: 'Data filtering, conditional data processing, removing unwanted items, data refinement',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.filter/',
    workflowPatterns: ['data_transformation', 'data_processing', 'conditional_logic']
  },

  // Switch - Multiple Path Routing
  {
    name: 'n8n-nodes-base.switch',
    displayName: 'Switch',
    description: 'Route data to different paths based on defined rules and conditions with multiple output options',
    version: 3,
    category: 'Regular Nodes',
    subcategory: 'Flow',
    tags: [
      'switch', 'route', 'conditional routing', 'multiple paths', 'branching', 'decision tree',
      'conditional logic', 'data routing', 'path selection', 'multiple outputs',
      'workflow routing', 'conditional branching', 'rule-based routing'
    ],
    icon: 'fa:code-branch',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [
      { type: 'main', displayName: 'Output 1' },
      { type: 'main', displayName: 'Output 2' },
      { type: 'main', displayName: 'Output 3' },
      { type: 'main', displayName: 'Output 4' }
    ],
    properties: [
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'Expression', value: 'expression' },
          { name: 'Rules', value: 'rules' }
        ],
        default: 'rules',
        description: 'How to determine to which output to route data to'
      },
      {
        displayName: 'Rules',
        name: 'rules',
        placeholder: 'Add Rule',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true
        },
        default: {},
        displayOptions: {
          show: {
            mode: ['rules']
          }
        },
        options: [
          {
            name: 'rules',
            displayName: 'Rules',
            value: 'rules',
            values: [
              {
                displayName: 'Conditions',
                name: 'conditions',
                placeholder: 'Add Condition',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true
                },
                default: {},
                options: [
                  {
                    name: 'string',
                    displayName: 'String',
                    value: 'string',
                    values: [
                      {
                        displayName: 'Value 1',
                        name: 'value1',
                        type: 'string',
                        default: '',
                        description: 'The value to compare'
                      },
                      {
                        displayName: 'Operation',
                        name: 'operation',
                        type: 'options',
                        options: [
                          { name: 'Contains', value: 'contains' },
                          { name: 'Ends With', value: 'endsWith' },
                          { name: 'Equal', value: 'equal' },
                          { name: 'Not Contains', value: 'notContains' },
                          { name: 'Not Equal', value: 'notEqual' },
                          { name: 'Regex', value: 'regex' },
                          { name: 'Starts With', value: 'startsWith' }
                        ],
                        default: 'equal',
                        description: 'The operation to perform'
                      },
                      {
                        displayName: 'Value 2',
                        name: 'value2',
                        type: 'string',
                        default: '',
                        description: 'The value to compare against'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'Switch',
      color: '#506000'
    },
    commonUseCase: 'Multi-path routing, conditional workflow branching, data classification, decision trees',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/',
    workflowPatterns: ['conditional_routing', 'data_classification', 'workflow_branching']
  },

  // Zapier - Automation Platform Integration
  {
    name: 'n8n-nodes-base.zapier',
    displayName: 'Zapier',
    description: 'Automate work with Zapier, and integrate Zapier with other applications. Trigger Zaps and send data to Zapier.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Automation',
    tags: [
      'zapier', 'automation', 'integration platform', 'workflow automation', 'trigger zap',
      'send to zapier', 'automation platform', 'workflow trigger', 'integration hub',
      'productivity automation', 'business automation', 'app integration'
    ],
    icon: 'zapier.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Send Data', value: 'send', description: 'Send data to Zapier' }
        ],
        default: 'send',
        description: 'The operation to perform'
      },
      {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        default: '',
        required: true,
        description: 'The Zapier webhook URL to send data to'
      }
    ],
    defaults: {
      name: 'Zapier',
      color: '#FF4F00'
    },
    commonUseCase: 'Integration with Zapier automation platform, trigger external workflows, cross-platform automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.zapier/',
    workflowPatterns: ['automation_integration', 'cross_platform', 'workflow_trigger']
  },

  // Zendesk - Customer Support Platform
  {
    name: 'n8n-nodes-base.zendesk',
    displayName: 'Zendesk',
    description: 'Automate work in Zendesk, and integrate Zendesk with other applications. Create, get, update and delete tickets, users, and organizations.',
    version: 1,
    category: 'Customer Support',
    subcategory: 'Help Desk',
    tags: [
      'zendesk', 'customer support', 'help desk', 'ticketing', 'support automation',
      'create ticket', 'update ticket', 'get ticket', 'get all tickets', 'delete ticket',
      'create user', 'update user', 'get user', 'get all users', 'delete user',
      'create organization', 'update organization', 'get organization', 'get all organizations',
      'customer service', 'support ticketing', 'issue tracking', 'customer management'
    ],
    icon: 'zendesk.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Ticket', value: 'ticket' },
          { name: 'Ticket Field', value: 'ticketField' },
          { name: 'User', value: 'user' },
          { name: 'Organization', value: 'organization' }
        ],
        default: 'ticket',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['ticket']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a ticket' },
          { name: 'Delete', value: 'delete', description: 'Delete a ticket' },
          { name: 'Get', value: 'get', description: 'Get a ticket' },
          { name: 'Get All', value: 'getAll', description: 'Get all tickets' },
          { name: 'Update', value: 'update', description: 'Update a ticket' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'zendeskApi',
        displayName: 'Zendesk API',
        required: true
      }
    ],
    defaults: {
      name: 'Zendesk',
      color: '#78A300'
    },
    commonUseCase: 'Customer support automation, ticket management, help desk workflows, customer service integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.zendesk/',
    workflowPatterns: ['customer_support', 'ticket_automation', 'service_management']
  },

  // Zoom - Video Conferencing
  {
    name: 'n8n-nodes-base.zoom',
    displayName: 'Zoom',
    description: 'Automate work in Zoom, and integrate Zoom with other applications. Create, get, update and delete meetings, webinars, and users.',
    version: 1,
    category: 'Communication',
    subcategory: 'Video Conferencing',
    tags: [
      'zoom', 'video conferencing', 'meetings', 'webinars', 'online meetings',
      'create meeting', 'update meeting', 'delete meeting', 'get meeting', 'get all meetings',
      'create webinar', 'update webinar', 'delete webinar', 'get webinar', 'get all webinars',
      'get user', 'get all users', 'create user', 'update user', 'delete user',
      'video calls', 'conference automation', 'meeting management'
    ],
    icon: 'zoom.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Meeting', value: 'meeting' },
          { name: 'Recording', value: 'recording' },
          { name: 'Webinar', value: 'webinar' }
        ],
        default: 'meeting',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['meeting']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a meeting' },
          { name: 'Delete', value: 'delete', description: 'Delete a meeting' },
          { name: 'Get', value: 'get', description: 'Get a meeting' },
          { name: 'Get All', value: 'getAll', description: 'Get all meetings' },
          { name: 'Update', value: 'update', description: 'Update a meeting' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'zoomOAuth2Api',
        displayName: 'Zoom OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Zoom',
      color: '#2D8CFF'
    },
    commonUseCase: 'Meeting automation, video conference scheduling, webinar management, virtual event coordination',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.zoom/',
    workflowPatterns: ['meeting_automation', 'calendar_integration', 'event_management']
  },

  // YouTube - Video Platform Integration
  {
    name: 'n8n-nodes-base.youTube',
    displayName: 'YouTube',
    description: 'Automate work with YouTube, and integrate YouTube with other applications. Upload videos, manage playlists, and get channel analytics.',
    version: 1,
    category: 'Media',
    subcategory: 'Video Platform',
    tags: [
      'youtube', 'video platform', 'video upload', 'video management', 'content creation',
      'upload video', 'get video', 'update video', 'delete video',
      'create playlist', 'get playlist', 'update playlist', 'delete playlist',
      'get channel', 'get channel statistics', 'video analytics', 'content management',
      'social media', 'video marketing', 'content automation'
    ],
    icon: 'youtube.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Playlist', value: 'playlist' },
          { name: 'Playlist Item', value: 'playlistItem' },
          { name: 'Video', value: 'video' },
          { name: 'Video Category', value: 'videoCategory' }
        ],
        default: 'video',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['video']
          }
        },
        options: [
          { name: 'Delete', value: 'delete', description: 'Delete a video' },
          { name: 'Get', value: 'get', description: 'Get a video' },
          { name: 'Get All', value: 'getAll', description: 'Get all videos' },
          { name: 'Rate', value: 'rate', description: 'Rate a video' },
          { name: 'Update', value: 'update', description: 'Update a video' },
          { name: 'Upload', value: 'upload', description: 'Upload a video' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'youTubeOAuth2Api',
        displayName: 'YouTube OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'YouTube',
      color: '#FF0000'
    },
    commonUseCase: 'Video content automation, YouTube channel management, video marketing, content publishing workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.youtube/',
    workflowPatterns: ['content_automation', 'social_media_management', 'video_processing']
  },

  // XML - XML Data Processing
  {
    name: 'n8n-nodes-base.xml',
    displayName: 'XML',
    description: 'Parse and manipulate XML data with various operations for XML processing and transformation',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'xml', 'parse xml', 'xml processing', 'data transformation', 'xml manipulation',
      'xml to json', 'json to xml', 'xml parsing', 'data conversion', 'xml operations'
    ],
    icon: 'fa:code',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          { name: 'XML to JSON', value: 'xmlToJson' },
          { name: 'JSON to XML', value: 'jsonToXml' }
        ],
        default: 'xmlToJson',
        description: 'The conversion mode'
      },
      {
        displayName: 'Property Name',
        name: 'propertyName',
        type: 'string',
        default: 'data',
        description: 'Name of the property containing the XML/JSON data'
      }
    ],
    defaults: {
      name: 'XML',
      color: '#d4af00'
    },
    commonUseCase: 'XML data parsing, format conversion, legacy system integration, data transformation',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.xml/',
    workflowPatterns: ['data_transformation', 'legacy_integration', 'format_conversion']
  },

  // HTML Extract - Web Scraping and HTML Processing
  {
    name: 'n8n-nodes-base.htmlExtract',
    displayName: 'HTML Extract',
    description: 'Extract data from HTML content using CSS selectors and XPath expressions',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'html extract', 'web scraping', 'html parsing', 'css selectors', 'xpath',
      'extract data', 'html processing', 'web data extraction', 'scraping',
      'content extraction', 'html manipulation', 'web automation'
    ],
    icon: 'fa:code',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: true }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Extraction Values',
        name: 'extractionValues',
        placeholder: 'Add Value',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true
        },
        default: {},
        options: [
          {
            name: 'values',
            displayName: 'Extraction Value',
            value: 'values',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                description: 'The key to assign the extracted value to'
              },
              {
                displayName: 'CSS Selector',
                name: 'cssSelector',
                type: 'string',
                default: '',
                description: 'The CSS selector to use for extraction'
              },
              {
                displayName: 'Return Value',
                name: 'returnValue',
                type: 'options',
                options: [
                  { name: 'Text', value: 'text' },
                  { name: 'HTML', value: 'html' },
                  { name: 'Attribute', value: 'attribute' }
                ],
                default: 'text',
                description: 'What to return from the selected element'
              }
            ]
          }
        ]
      }
    ],
    defaults: {
      name: 'HTML Extract',
      color: '#3355cc'
    },
    commonUseCase: 'Web scraping, data extraction from websites, HTML parsing, content automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.htmlextract/',
    workflowPatterns: ['web_scraping', 'data_extraction', 'content_automation']
  },

  // RSS Feed Read - Content Syndication
  {
    name: 'n8n-nodes-base.rssFeedRead',
    displayName: 'RSS Feed Read',
    description: 'Read and parse RSS feeds to get the latest content and updates from websites',
    version: 1,
    category: 'Regular Nodes',
    subcategory: 'Data',
    tags: [
      'rss', 'feed', 'news', 'content syndication', 'blog posts', 'articles',
      'read rss', 'parse feed', 'content automation', 'news aggregation',
      'website updates', 'content monitoring', 'feed reader'
    ],
    icon: 'fa:rss',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/feed.xml',
        required: true,
        description: 'The URL of the RSS feed to read'
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Maximum number of items to return'
      }
    ],
    defaults: {
      name: 'RSS Feed Read',
      color: '#FF6600'
    },
    commonUseCase: 'Content monitoring, news aggregation, blog post automation, content syndication workflows',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.rssfeedread/',
    workflowPatterns: ['content_monitoring', 'news_automation', 'content_aggregation']
  },

  // Cron - Advanced Scheduling
  {
    name: 'n8n-nodes-base.cron',
    displayName: 'Cron',
    description: 'Advanced scheduling trigger using cron expressions for precise timing control',
    version: 1,
    category: 'Trigger Nodes',
    subcategory: 'Time',
    tags: [
      'cron', 'schedule', 'timer', 'trigger', 'advanced scheduling', 'cron expression',
      'precise timing', 'scheduled execution', 'automation trigger', 'time-based trigger'
    ],
    icon: 'fa:clock',
    triggerNode: true,
    inputs: [],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Cron Expression',
        name: 'cronExpression',
        type: 'string',
        default: '0 0 * * *',
        placeholder: '0 0 * * *',
        required: true,
        description: 'Cron expression for scheduling (e.g., "0 0 * * *" for daily at midnight)'
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: 'UTC',
        description: 'Timezone for the cron schedule'
      }
    ],
    defaults: {
      name: 'Cron',
      color: '#00FF00'
    },
    commonUseCase: 'Advanced scheduling, precise timing control, complex recurring tasks, automated maintenance',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.cron/',
    workflowPatterns: ['advanced_scheduling', 'maintenance_automation', 'complex_timing']
  },

  // Email Send (SMTP) - Email Sending
  {
    name: 'n8n-nodes-base.emailSend',
    displayName: 'Send Email',
    description: 'Send emails via SMTP with support for attachments, HTML content, and multiple recipients',
    version: 2,
    category: 'Communication',
    subcategory: 'Email',
    tags: [
      'email', 'smtp', 'send email', 'mail', 'email sending', 'notifications',
      'html email', 'attachments', 'email automation', 'bulk email', 'transactional email'
    ],
    icon: 'fa:envelope',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'From Email',
        name: 'fromEmail',
        type: 'string',
        default: '',
        placeholder: 'sender@example.com',
        required: true,
        description: 'Email address of the sender'
      },
      {
        displayName: 'To Email',
        name: 'toEmail',
        type: 'string',
        default: '',
        placeholder: 'recipient@example.com',
        required: true,
        description: 'Email address of the recipient'
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        placeholder: 'Subject line',
        required: true,
        description: 'Subject of the email'
      },
      {
        displayName: 'Email Type',
        name: 'emailType',
        type: 'options',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'HTML', value: 'html' }
        ],
        default: 'text',
        description: 'Type of email content'
      }
    ],
    credentials: [
      {
        name: 'smtp',
        displayName: 'SMTP',
        required: true
      }
    ],
    defaults: {
      name: 'Send Email',
      color: '#00bb88'
    },
    commonUseCase: 'Email notifications, transactional emails, automated messaging, alert systems',
    documentation: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/',
    workflowPatterns: ['email_automation', 'notification_system', 'transactional_email']
  },
  // Redis - In-Memory Database
  {
    name: 'n8n-nodes-base.redis',
    displayName: 'Redis',
    description: 'Automate work in Redis, and integrate Redis with other applications. Execute operations on Redis databases including key-value, list, hash, set, and sorted set operations.',
    version: 1,
    category: 'Database',
    subcategory: 'NoSQL',
    tags: [
      'redis', 'cache', 'in-memory database', 'nosql', 'key-value store', 'session storage',
      'delete key', 'get key', 'set key', 'increment key', 'decrement key', 'exists key',
      'expire key', 'get hash', 'set hash', 'delete hash field', 'get hash all',
      'push to list', 'pop from list', 'get list', 'get list range', 'list length',
      'add to set', 'remove from set', 'get set members', 'set intersection', 'set union',
      'caching', 'session management', 'real-time data', 'high-performance database'
    ],
    icon: 'redis.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Delete', value: 'delete', description: 'Delete a key' },
          { name: 'Get', value: 'get', description: 'Get value of a key' },
          { name: 'Set', value: 'set', description: 'Set value of a key' },
          { name: 'Increment', value: 'incr', description: 'Increment a key' },
          { name: 'Decrement', value: 'decr', description: 'Decrement a key' },
          { name: 'Exists', value: 'exists', description: 'Check if key exists' },
          { name: 'Expire', value: 'expire', description: 'Set key expiration' },
          { name: 'Get Hash', value: 'hget', description: 'Get hash field value' },
          { name: 'Set Hash', value: 'hset', description: 'Set hash field value' },
          { name: 'List Push', value: 'lpush', description: 'Push to list' },
          { name: 'List Pop', value: 'lpop', description: 'Pop from list' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Key',
        name: 'key',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the key to operate on'
      }
    ],
    credentials: [
      {
        name: 'redis',
        displayName: 'Redis',
        required: true
      }
    ],
    defaults: {
      name: 'Redis',
      color: '#DC382D'
    },
    commonUseCase: 'Caching, session storage, real-time data, high-performance database operations, microservices data sharing',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.redis/',
    workflowPatterns: ['database_sync', 'caching', 'real_time_data', 'microservices']
  },

  // Linear - Issue Tracking for Development Teams
  {
    name: 'n8n-nodes-base.linear',
    displayName: 'Linear',
    description: 'Automate work in Linear, and integrate Linear with other applications. Create, get, update and delete issues, projects, teams, and comments.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Issue Tracking',
    tags: [
      'linear', 'issue tracking', 'project management', 'development', 'software development', 'bug tracking',
      'create issue', 'update issue', 'get issue', 'get all issues', 'delete issue',
      'create comment', 'update comment', 'get comment', 'get all comments',
      'get team', 'get all teams', 'get project', 'get all projects',
      'get user', 'get all users', 'create attachment', 'get attachments',
      'agile development', 'sprint management', 'development workflow', 'team collaboration'
    ],
    icon: 'linear.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Issue', value: 'issue' },
          { name: 'Comment', value: 'comment' },
          { name: 'Team', value: 'team' },
          { name: 'Project', value: 'project' },
          { name: 'User', value: 'user' },
          { name: 'Attachment', value: 'attachment' }
        ],
        default: 'issue',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issue']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an issue' },
          { name: 'Delete', value: 'delete', description: 'Delete an issue' },
          { name: 'Get', value: 'get', description: 'Get an issue' },
          { name: 'Get All', value: 'getAll', description: 'Get all issues' },
          { name: 'Update', value: 'update', description: 'Update an issue' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'linearApi',
        displayName: 'Linear API',
        required: true
      }
    ],
    defaults: {
      name: 'Linear',
      color: '#5E6AD2'
    },
    commonUseCase: 'Development workflow automation, issue tracking, project management, sprint planning, development team collaboration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.linear/',
    workflowPatterns: ['development_automation', 'issue_tracking', 'project_management', 'notification_system']
  },

  // Shopify - E-commerce Platform
  {
    name: 'n8n-nodes-base.shopify',
    displayName: 'Shopify',
    description: 'Automate work in Shopify, and integrate Shopify with other applications. Create, get, update and delete products, orders, customers, and inventory.',
    version: 1,
    category: 'E-commerce',
    subcategory: 'Store Management',
    tags: [
      'shopify', 'ecommerce', 'e-commerce', 'online store', 'products', 'orders', 'customers', 'inventory',
      'create product', 'update product', 'get product', 'get all products', 'delete product',
      'create order', 'update order', 'get order', 'get all orders', 'cancel order', 'fulfill order',
      'create customer', 'update customer', 'get customer', 'get all customers', 'delete customer',
      'get inventory item', 'update inventory level', 'get inventory level',
      'store management', 'product catalog', 'order processing', 'customer management'
    ],
    icon: 'shopify.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Product', value: 'product' },
          { name: 'Product Variant', value: 'productVariant' },
          { name: 'Order', value: 'order' },
          { name: 'Customer', value: 'customer' },
          { name: 'Inventory Item', value: 'inventoryItem' },
          { name: 'Inventory Level', value: 'inventoryLevel' }
        ],
        default: 'product',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['product']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a product' },
          { name: 'Delete', value: 'delete', description: 'Delete a product' },
          { name: 'Get', value: 'get', description: 'Get a product' },
          { name: 'Get All', value: 'getAll', description: 'Get all products' },
          { name: 'Update', value: 'update', description: 'Update a product' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'shopifyApi',
        displayName: 'Shopify API',
        required: true
      }
    ],
    defaults: {
      name: 'Shopify',
      color: '#96BF48'
    },
    commonUseCase: 'E-commerce automation, inventory management, order processing, customer management, product catalog sync',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.shopify/',
    workflowPatterns: ['ecommerce_automation', 'inventory_management', 'order_processing', 'customer_management']
  },

  // WhatsApp Business - Business Messaging
  {
    name: 'n8n-nodes-base.whatsAppBusiness',
    displayName: 'WhatsApp Business',
    description: 'Automate work with WhatsApp Business, and integrate WhatsApp Business with other applications. Send messages, manage contacts, and handle business communications.',
    version: 1,
    category: 'Communication',
    subcategory: 'Messaging',
    tags: [
      'whatsapp', 'whatsapp business', 'messaging', 'business messaging', 'instant messaging', 'customer communication',
      'send message', 'send template message', 'send media message', 'send document', 'send image', 'send audio',
      'get message', 'mark as read', 'get media', 'upload media',
      'business communication', 'customer support', 'marketing messages', 'automated messaging'
    ],
    icon: 'whatsapp.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Template', value: 'template' },
          { name: 'Media', value: 'media' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Send Text', value: 'sendText', description: 'Send a text message' },
          { name: 'Send Template', value: 'sendTemplate', description: 'Send a template message' },
          { name: 'Send Image', value: 'sendImage', description: 'Send an image' },
          { name: 'Send Document', value: 'sendDocument', description: 'Send a document' },
          { name: 'Send Audio', value: 'sendAudio', description: 'Send an audio message' },
          { name: 'Get', value: 'get', description: 'Get a message' },
          { name: 'Mark as Read', value: 'markAsRead', description: 'Mark message as read' }
        ],
        default: 'sendText',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'whatsAppBusinessApi',
        displayName: 'WhatsApp Business API',
        required: true
      }
    ],
    defaults: {
      name: 'WhatsApp Business',
      color: '#25D366'
    },
    commonUseCase: 'Business messaging, customer support, marketing automation, order notifications, appointment reminders',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsappbusiness/',
    workflowPatterns: ['business_messaging', 'customer_support', 'notification_system', 'marketing_automation']
  },

  // Monday.com - Work Management Platform
  {
    name: 'n8n-nodes-base.mondayCom',
    displayName: 'Monday.com',
    description: 'Automate work in Monday.com, and integrate Monday.com with other applications. Create, get, update and delete boards, items, columns, and updates.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Project Management',
    tags: [
      'monday.com', 'monday', 'work management', 'project management', 'team collaboration', 'boards', 'items',
      'create board', 'get board', 'get all boards', 'update board', 'archive board',
      'create item', 'get item', 'get all items', 'update item', 'delete item', 'move item',
      'create column', 'get column', 'get all columns', 'update column', 'delete column',
      'create update', 'get update', 'get all updates', 'delete update',
      'team management', 'workflow automation', 'task tracking', 'progress monitoring'
    ],
    icon: 'monday.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Board', value: 'board' },
          { name: 'Item', value: 'item' },
          { name: 'Column', value: 'column' },
          { name: 'Update', value: 'update' }
        ],
        default: 'item',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['board']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a board' },
          { name: 'Get', value: 'get', description: 'Get a board' },
          { name: 'Get All', value: 'getAll', description: 'Get all boards' },
          { name: 'Update', value: 'update', description: 'Update a board' },
          { name: 'Archive', value: 'archive', description: 'Archive a board' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['item']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an item' },
          { name: 'Delete', value: 'delete', description: 'Delete an item' },
          { name: 'Get', value: 'get', description: 'Get an item' },
          { name: 'Get All', value: 'getAll', description: 'Get all items' },
          { name: 'Update', value: 'update', description: 'Update an item' },
          { name: 'Move', value: 'move', description: 'Move item to board' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'mondayComApi',
        displayName: 'Monday.com API',
        required: true
      }
    ],
    defaults: {
      name: 'Monday.com',
      color: '#FF158A'
    },
    commonUseCase: 'Work management automation, project tracking, team collaboration, task management, progress monitoring',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mondaycom/',
    workflowPatterns: ['work_management', 'project_tracking', 'team_collaboration', 'task_automation']
  },

  // Pipedrive - CRM and Sales Pipeline
  {
    name: 'n8n-nodes-base.pipedrive',
    displayName: 'Pipedrive',
    description: 'Automate work in Pipedrive, and integrate Pipedrive with other applications. Create, get, update and delete deals, persons, organizations, and activities.',
    version: 1,
    category: 'Sales & CRM',
    subcategory: 'CRM',
    tags: [
      'pipedrive', 'crm', 'sales', 'pipeline management', 'deals', 'leads', 'contacts',
      'create deal', 'update deal', 'get deal', 'get all deals', 'delete deal', 'move deal',
      'create person', 'update person', 'get person', 'get all persons', 'delete person',
      'create organization', 'update organization', 'get organization', 'get all organizations', 'delete organization',
      'create activity', 'update activity', 'get activity', 'get all activities', 'delete activity',
      'create note', 'update note', 'get note', 'get all notes', 'delete note',
      'sales automation', 'lead management', 'deal tracking', 'customer relationship management'
    ],
    icon: 'pipedrive.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Deal', value: 'deal' },
          { name: 'Person', value: 'person' },
          { name: 'Organization', value: 'organization' },
          { name: 'Activity', value: 'activity' },
          { name: 'Note', value: 'note' },
          { name: 'File', value: 'file' }
        ],
        default: 'deal',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['deal']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a deal' },
          { name: 'Delete', value: 'delete', description: 'Delete a deal' },
          { name: 'Get', value: 'get', description: 'Get a deal' },
          { name: 'Get All', value: 'getAll', description: 'Get all deals' },
          { name: 'Update', value: 'update', description: 'Update a deal' },
          { name: 'Duplicate', value: 'duplicate', description: 'Duplicate a deal' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'pipedriveApi',
        displayName: 'Pipedrive API',
        required: true
      }
    ],
    defaults: {
      name: 'Pipedrive',
      color: '#2F6AFF'
    },
    commonUseCase: 'Sales automation, CRM management, lead tracking, deal pipeline management, sales reporting',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.pipedrive/',
    workflowPatterns: ['sales_automation', 'crm_management', 'lead_tracking', 'pipeline_management']
  },

  // SQLite - Lightweight Database
  {
    name: 'n8n-nodes-base.sqlite',
    displayName: 'SQLite',
    description: 'Automate work in SQLite, and integrate SQLite with other applications. Execute queries and manage data in SQLite databases.',
    version: 1,
    category: 'Database',
    subcategory: 'SQL',
    tags: [
      'sqlite', 'database', 'sql', 'lightweight database', 'embedded database', 'local database',
      'execute query', 'insert data', 'update data', 'delete data', 'select data',
      'create table', 'drop table', 'alter table', 'database operations',
      'local storage', 'file database', 'embedded sql', 'database automation'
    ],
    icon: 'sqlite.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Execute Query', value: 'executeQuery', description: 'Execute a SQL query' },
          { name: 'Insert', value: 'insert', description: 'Insert rows in table' },
          { name: 'Update', value: 'update', description: 'Update rows in table' },
          { name: 'Delete', value: 'delete', description: 'Delete rows from table' }
        ],
        default: 'executeQuery',
        description: 'The operation to perform'
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          editor: 'code',
          editorLanguage: 'sql'
        },
        default: '',
        placeholder: 'SELECT * FROM table_name',
        required: true,
        displayOptions: {
          show: {
            operation: ['executeQuery']
          }
        },
        description: 'The SQL query to execute'
      }
    ],
    credentials: [
      {
        name: 'sqlite',
        displayName: 'SQLite',
        required: true
      }
    ],
    defaults: {
      name: 'SQLite',
      color: '#003B57'
    },
    commonUseCase: 'Local database operations, embedded applications, lightweight data storage, development and testing',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.sqlite/',
    workflowPatterns: ['local_database', 'embedded_storage', 'development_testing', 'lightweight_data']
  },

  // Clearbit - Data Enrichment
  {
    name: 'n8n-nodes-base.clearbit',
    displayName: 'Clearbit',
    description: 'Automate work with Clearbit, and integrate Clearbit with other applications. Enrich company and person data with comprehensive business intelligence.',
    version: 1,
    category: 'Data & Analytics',
    subcategory: 'Data Enrichment',
    tags: [
      'clearbit', 'data enrichment', 'company data', 'person data', 'business intelligence', 'lead enrichment',
      'enrich company', 'get company', 'find company', 'company lookup',
      'enrich person', 'get person', 'find person', 'person lookup', 'email lookup',
      'prospecting', 'lead qualification', 'sales intelligence', 'marketing automation',
      'data enhancement', 'company information', 'contact enrichment', 'sales enablement'
    ],
    icon: 'clearbit.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Company', value: 'company' },
          { name: 'Person', value: 'person' }
        ],
        default: 'company',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['company']
          }
        },
        options: [
          { name: 'Enrich', value: 'enrich', description: 'Enrich a company' },
          { name: 'Find', value: 'find', description: 'Find a company' },
          { name: 'Autocomplete', value: 'autocomplete', description: 'Get company suggestions' }
        ],
        default: 'enrich',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['person']
          }
        },
        options: [
          { name: 'Enrich', value: 'enrich', description: 'Enrich a person' },
          { name: 'Find', value: 'find', description: 'Find a person' }
        ],
        default: 'enrich',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'clearbitApi',
        displayName: 'Clearbit API',
        required: true
      }
    ],
    defaults: {
      name: 'Clearbit',
      color: '#5A31FB'
    },
    commonUseCase: 'Lead enrichment, sales intelligence, company research, contact data enhancement, marketing automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.clearbit/',
    workflowPatterns: ['data_enrichment', 'sales_intelligence', 'lead_qualification', 'marketing_automation']
  },

  // Elasticsearch - Search and Analytics Engine
  {
    name: 'n8n-nodes-base.elasticsearch',
    displayName: 'Elasticsearch',
    description: 'Automate work in Elasticsearch, and integrate Elasticsearch with other applications. Index, search, and analyze data with powerful search capabilities.',
    version: 1,
    category: 'Database',
    subcategory: 'Search Engine',
    tags: [
      'elasticsearch', 'search engine', 'full-text search', 'analytics', 'indexing', 'data analysis',
      'index document', 'get document', 'update document', 'delete document', 'bulk operations',
      'search documents', 'query documents', 'aggregations', 'mapping', 'index management',
      'create index', 'delete index', 'get index', 'update mapping', 'index settings',
      'search analytics', 'log analysis', 'real-time search', 'distributed search'
    ],
    icon: 'elasticsearch.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Document', value: 'document' },
          { name: 'Index', value: 'index' }
        ],
        default: 'document',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['document']
          }
        },
        options: [
          { name: 'Index', value: 'index', description: 'Index a document' },
          { name: 'Get', value: 'get', description: 'Get a document' },
          { name: 'Update', value: 'update', description: 'Update a document' },
          { name: 'Delete', value: 'delete', description: 'Delete a document' },
          { name: 'Search', value: 'search', description: 'Search documents' },
          { name: 'Bulk', value: 'bulk', description: 'Bulk operations' }
        ],
        default: 'index',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['index']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an index' },
          { name: 'Delete', value: 'delete', description: 'Delete an index' },
          { name: 'Get', value: 'get', description: 'Get index information' },
          { name: 'Update Mapping', value: 'updateMapping', description: 'Update index mapping' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'elasticsearchApi',
        displayName: 'Elasticsearch API',
        required: true
      }
    ],
    defaults: {
      name: 'Elasticsearch',
      color: '#00A9E5'
    },
    commonUseCase: 'Full-text search, log analysis, data analytics, real-time search, content discovery',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.elasticsearch/',
    workflowPatterns: ['search_analytics', 'log_processing', 'data_analysis', 'content_discovery']
  },

  // Jenkins - CI/CD Pipeline Automation
  {
    name: 'n8n-nodes-base.jenkins',
    displayName: 'Jenkins',
    description: 'Automate work in Jenkins, and integrate Jenkins with other applications. Trigger builds, manage jobs, and automate CI/CD pipelines.',
    version: 1,
    category: 'Development',
    subcategory: 'CI/CD',
    tags: [
      'jenkins', 'ci/cd', 'continuous integration', 'continuous deployment', 'build automation', 'devops',
      'build job', 'trigger build', 'get build', 'get all builds', 'stop build',
      'create job', 'get job', 'get all jobs', 'update job', 'delete job', 'enable job', 'disable job',
      'get build log', 'get build artifacts', 'get build status', 'build parameters',
      'pipeline automation', 'deployment automation', 'software delivery', 'automated testing'
    ],
    icon: 'jenkins.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Build', value: 'build' },
          { name: 'Job', value: 'job' }
        ],
        default: 'build',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['build']
          }
        },
        options: [
          { name: 'Trigger', value: 'trigger', description: 'Trigger a build' },
          { name: 'Get', value: 'get', description: 'Get build information' },
          { name: 'Get All', value: 'getAll', description: 'Get all builds' },
          { name: 'Stop', value: 'stop', description: 'Stop a build' },
          { name: 'Get Log', value: 'getLog', description: 'Get build log' }
        ],
        default: 'trigger',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['job']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a job' },
          { name: 'Get', value: 'get', description: 'Get job information' },
          { name: 'Get All', value: 'getAll', description: 'Get all jobs' },
          { name: 'Update', value: 'update', description: 'Update a job' },
          { name: 'Delete', value: 'delete', description: 'Delete a job' },
          { name: 'Enable', value: 'enable', description: 'Enable a job' },
          { name: 'Disable', value: 'disable', description: 'Disable a job' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'jenkinsApi',
        displayName: 'Jenkins API',
        required: true
      }
    ],
    defaults: {
      name: 'Jenkins',
      color: '#D33833'
    },
    commonUseCase: 'CI/CD pipeline automation, build triggering, deployment automation, development workflow integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.jenkins/',
    workflowPatterns: ['cicd_automation', 'development_workflow', 'deployment_automation', 'build_management']
  },

  // Docker - Container Management
  {
    name: 'n8n-nodes-base.docker',
    displayName: 'Docker',
    description: 'Automate work with Docker, and integrate Docker with other applications. Manage containers, images, networks, and volumes.',
    version: 1,
    category: 'Development',
    subcategory: 'Container Management',
    tags: [
      'docker', 'containers', 'containerization', 'devops', 'microservices', 'orchestration',
      'create container', 'start container', 'stop container', 'restart container', 'remove container',
      'get container', 'get all containers', 'container logs', 'container stats',
      'list images', 'pull image', 'push image', 'build image', 'remove image', 'tag image',
      'create network', 'get network', 'get all networks', 'remove network',
      'create volume', 'get volume', 'get all volumes', 'remove volume',
      'container orchestration', 'application deployment', 'infrastructure automation'
    ],
    icon: 'docker.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Container', value: 'container' },
          { name: 'Image', value: 'image' },
          { name: 'Network', value: 'network' },
          { name: 'Volume', value: 'volume' }
        ],
        default: 'container',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['container']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a container' },
          { name: 'Start', value: 'start', description: 'Start a container' },
          { name: 'Stop', value: 'stop', description: 'Stop a container' },
          { name: 'Restart', value: 'restart', description: 'Restart a container' },
          { name: 'Remove', value: 'remove', description: 'Remove a container' },
          { name: 'Get', value: 'get', description: 'Get container information' },
          { name: 'Get All', value: 'getAll', description: 'Get all containers' },
          { name: 'Logs', value: 'logs', description: 'Get container logs' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['image']
          }
        },
        options: [
          { name: 'List', value: 'list', description: 'List images' },
          { name: 'Pull', value: 'pull', description: 'Pull an image' },
          { name: 'Push', value: 'push', description: 'Push an image' },
          { name: 'Build', value: 'build', description: 'Build an image' },
          { name: 'Remove', value: 'remove', description: 'Remove an image' },
          { name: 'Tag', value: 'tag', description: 'Tag an image' }
        ],
        default: 'list',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'dockerApi',
        displayName: 'Docker API',
        required: true
      }
    ],
    defaults: {
      name: 'Docker',
      color: '#2496ED'
    },
    commonUseCase: 'Container management, application deployment, microservices orchestration, development automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.docker/',
    workflowPatterns: ['container_management', 'deployment_automation', 'microservices', 'infrastructure_automation']
  },

  // Kubernetes - Container Orchestration
  {
    name: 'n8n-nodes-base.kubernetes',
    displayName: 'Kubernetes',
    description: 'Automate work with Kubernetes, and integrate Kubernetes with other applications. Manage pods, deployments, services, and cluster resources.',
    version: 1,
    category: 'Development',
    subcategory: 'Container Orchestration',
    tags: [
      'kubernetes', 'k8s', 'container orchestration', 'microservices', 'cloud native', 'devops',
      'create pod', 'get pod', 'get all pods', 'delete pod', 'pod logs', 'pod status',
      'create deployment', 'get deployment', 'get all deployments', 'update deployment', 'delete deployment', 'scale deployment',
      'create service', 'get service', 'get all services', 'update service', 'delete service',
      'create namespace', 'get namespace', 'get all namespaces', 'delete namespace',
      'get nodes', 'get node', 'cluster management', 'workload management', 'service mesh'
    ],
    icon: 'kubernetes.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Pod', value: 'pod' },
          { name: 'Deployment', value: 'deployment' },
          { name: 'Service', value: 'service' },
          { name: 'Namespace', value: 'namespace' },
          { name: 'Node', value: 'node' }
        ],
        default: 'pod',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['pod']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a pod' },
          { name: 'Get', value: 'get', description: 'Get a pod' },
          { name: 'Get All', value: 'getAll', description: 'Get all pods' },
          { name: 'Delete', value: 'delete', description: 'Delete a pod' },
          { name: 'Logs', value: 'logs', description: 'Get pod logs' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['deployment']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a deployment' },
          { name: 'Get', value: 'get', description: 'Get a deployment' },
          { name: 'Get All', value: 'getAll', description: 'Get all deployments' },
          { name: 'Update', value: 'update', description: 'Update a deployment' },
          { name: 'Delete', value: 'delete', description: 'Delete a deployment' },
          { name: 'Scale', value: 'scale', description: 'Scale a deployment' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'kubernetesApi',
        displayName: 'Kubernetes API',
        required: true
      }
    ],
    defaults: {
      name: 'Kubernetes',
      color: '#326CE5'
    },
    commonUseCase: 'Container orchestration, microservices management, cloud-native applications, cluster automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.kubernetes/',
    workflowPatterns: ['container_orchestration', 'microservices', 'cloud_native', 'cluster_management']
  },

  // RabbitMQ - Message Queue
  {
    name: 'n8n-nodes-base.rabbitmq',
    displayName: 'RabbitMQ',
    description: 'Automate work with RabbitMQ, and integrate RabbitMQ with other applications. Send and receive messages, manage queues, and handle message routing.',
    version: 1,
    category: 'Communication',
    subcategory: 'Message Queue',
    tags: [
      'rabbitmq', 'message queue', 'messaging', 'amqp', 'message broker', 'async messaging',
      'send message', 'receive message', 'publish message', 'consume message', 'message routing',
      'create queue', 'delete queue', 'get queue', 'bind queue', 'unbind queue',
      'create exchange', 'delete exchange', 'get exchange', 'bind exchange',
      'message acknowledgment', 'message persistence', 'distributed systems', 'microservices communication'
    ],
    icon: 'rabbitmq.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Queue', value: 'queue' },
          { name: 'Exchange', value: 'exchange' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Send', value: 'send', description: 'Send a message' },
          { name: 'Receive', value: 'receive', description: 'Receive messages' },
          { name: 'Acknowledge', value: 'ack', description: 'Acknowledge a message' },
          { name: 'Reject', value: 'reject', description: 'Reject a message' }
        ],
        default: 'send',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['queue']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a queue' },
          { name: 'Delete', value: 'delete', description: 'Delete a queue' },
          { name: 'Get', value: 'get', description: 'Get queue information' },
          { name: 'Bind', value: 'bind', description: 'Bind queue to exchange' },
          { name: 'Unbind', value: 'unbind', description: 'Unbind queue from exchange' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['exchange']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an exchange' },
          { name: 'Delete', value: 'delete', description: 'Delete an exchange' },
          { name: 'Get', value: 'get', description: 'Get exchange information' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'rabbitmqApi',
        displayName: 'RabbitMQ',
        required: true
      }
    ],
    defaults: {
      name: 'RabbitMQ',
      color: '#FF6600'
    },
    commonUseCase: 'Message queuing, asynchronous communication, microservices messaging, distributed system coordination',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.rabbitmq/',
    workflowPatterns: ['message_queuing', 'async_communication', 'microservices', 'distributed_systems']
  },

  // AWS Lambda - Serverless Functions
  {
    name: 'n8n-nodes-base.awsLambda',
    displayName: 'AWS Lambda',
    description: 'Automate work with AWS Lambda, and integrate AWS Lambda with other applications. Invoke functions, manage function configurations.',
    version: 1,
    category: 'Development',
    subcategory: 'Serverless',
    tags: [
      'aws lambda', 'aws', 'serverless', 'functions', 'cloud computing', 'amazon web services',
      'invoke function', 'get function', 'list functions', 'create function', 'update function', 'delete function',
      'function configuration', 'environment variables', 'function versions', 'function aliases',
      'serverless computing', 'cloud functions', 'event-driven computing', 'microservices'
    ],
    icon: 'aws.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Invoke', value: 'invoke', description: 'Invoke a function' },
          { name: 'Get', value: 'get', description: 'Get function configuration' },
          { name: 'List', value: 'list', description: 'List functions' }
        ],
        default: 'invoke',
        description: 'The operation to perform'
      },
      {
        displayName: 'Function Name',
        name: 'functionName',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the Lambda function'
      }
    ],
    credentials: [
      {
        name: 'aws',
        displayName: 'AWS',
        required: true
      }
    ],
    defaults: {
      name: 'AWS Lambda',
      color: '#FF9900'
    },
    commonUseCase: 'Serverless function execution, event-driven processing, microservices automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.awslambda/',
    workflowPatterns: ['serverless_automation', 'event_processing', 'microservices', 'cloud_computing']
  },

  // Firebase Cloud Firestore - NoSQL Database
  {
    name: 'n8n-nodes-base.firebaseCloudFirestore',
    displayName: 'Firebase Cloud Firestore',
    description: 'Automate work with Firebase Cloud Firestore, and integrate Firestore with other applications. Create, get, update and delete documents and collections.',
    version: 1,
    category: 'Database',
    subcategory: 'NoSQL',
    tags: [
      'firebase', 'firestore', 'google', 'nosql', 'cloud database', 'document database', 'real-time database',
      'create document', 'get document', 'update document', 'delete document', 'get all documents',
      'create collection', 'get collection', 'delete collection', 'query documents',
      'real-time sync', 'mobile backend', 'web backend', 'cloud storage'
    ],
    icon: 'firebase.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create', description: 'Create a document' },
          { name: 'Delete', value: 'delete', description: 'Delete a document' },
          { name: 'Get', value: 'get', description: 'Get a document' },
          { name: 'Get All', value: 'getAll', description: 'Get all documents' },
          { name: 'Update', value: 'update', description: 'Update a document' },
          { name: 'Query', value: 'query', description: 'Query documents' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        description: 'Firebase project ID'
      },
      {
        displayName: 'Collection',
        name: 'collection',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the Firestore collection'
      }
    ],
    credentials: [
      {
        name: 'googleFirebaseCloudFirestore',
        displayName: 'Firebase Cloud Firestore',
        required: true
      }
    ],
    defaults: {
      name: 'Firebase Cloud Firestore',
      color: '#FFA000'
    },
    commonUseCase: 'Real-time database operations, mobile app backends, web app data storage',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.firebasecloudfirestore/',
    workflowPatterns: ['real_time_data', 'mobile_backend', 'web_backend', 'cloud_database']
  },

  // Typeform - Online Forms and Surveys
  {
    name: 'n8n-nodes-base.typeform',
    displayName: 'Typeform',
    description: 'Automate work with Typeform, and integrate Typeform with other applications. Get forms, responses, and manage form submissions.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Forms & Surveys',
    tags: [
      'typeform', 'forms', 'surveys', 'questionnaires', 'data collection', 'feedback',
      'get form', 'get all forms', 'create form', 'update form', 'delete form',
      'get responses', 'get all responses', 'create webhook', 'delete webhook',
      'form builder', 'survey automation', 'lead generation', 'customer feedback'
    ],
    icon: 'typeform.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Form', value: 'form' },
          { name: 'Response', value: 'response' }
        ],
        default: 'form',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['form']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a form' },
          { name: 'Get All', value: 'getAll', description: 'Get all forms' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['response']
          }
        },
        options: [
          { name: 'Get All', value: 'getAll', description: 'Get all responses' }
        ],
        default: 'getAll',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'typeformApi',
        displayName: 'Typeform API',
        required: true
      }
    ],
    defaults: {
      name: 'Typeform',
      color: '#262627'
    },
    commonUseCase: 'Form automation, survey data processing, lead generation, customer feedback collection',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.typeform/',
    workflowPatterns: ['form_automation', 'survey_processing', 'lead_generation', 'data_collection']
  },

  // Mailchimp - Email Marketing
  {
    name: 'n8n-nodes-base.mailchimp',
    displayName: 'Mailchimp',
    description: 'Automate work in Mailchimp, and integrate Mailchimp with other applications. Manage lists, campaigns, and subscribers.',
    version: 1,
    category: 'Marketing',
    subcategory: 'Email Marketing',
    tags: [
      'mailchimp', 'email marketing', 'newsletters', 'campaigns', 'subscribers', 'lists',
      'create campaign', 'get campaign', 'get all campaigns', 'send campaign', 'update campaign',
      'create list', 'get list', 'get all lists', 'update list', 'delete list',
      'add member', 'remove member', 'get member', 'get all members', 'update member',
      'marketing automation', 'email campaigns', 'subscriber management', 'list management'
    ],
    icon: 'mailchimp.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Campaign', value: 'campaign' },
          { name: 'List', value: 'list' },
          { name: 'Member', value: 'member' }
        ],
        default: 'member',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['member']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Add member to list' },
          { name: 'Delete', value: 'delete', description: 'Remove member from list' },
          { name: 'Get', value: 'get', description: 'Get member' },
          { name: 'Get All', value: 'getAll', description: 'Get all members' },
          { name: 'Update', value: 'update', description: 'Update member' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'mailchimpApi',
        displayName: 'Mailchimp API',
        required: true
      }
    ],
    defaults: {
      name: 'Mailchimp',
      color: '#FFE01B'
    },
    commonUseCase: 'Email marketing automation, subscriber management, newsletter campaigns, marketing funnels',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mailchimp/',
    workflowPatterns: ['email_marketing', 'subscriber_management', 'campaign_automation', 'marketing_funnels']
  },

  // Salesforce - CRM Platform
  {
    name: 'n8n-nodes-base.salesforce',
    displayName: 'Salesforce',
    description: 'Automate work in Salesforce, and integrate Salesforce with other applications. Manage leads, accounts, contacts, opportunities, and cases.',
    version: 1,
    category: 'Sales & CRM',
    subcategory: 'CRM',
    tags: [
      'salesforce', 'crm', 'sales', 'leads', 'accounts', 'contacts', 'opportunities', 'cases',
      'create lead', 'update lead', 'get lead', 'get all leads', 'delete lead', 'convert lead',
      'create account', 'update account', 'get account', 'get all accounts', 'delete account',
      'create contact', 'update contact', 'get contact', 'get all contacts', 'delete contact',
      'create opportunity', 'update opportunity', 'get opportunity', 'get all opportunities', 'delete opportunity',
      'create case', 'update case', 'get case', 'get all cases', 'delete case',
      'enterprise crm', 'sales automation', 'customer management', 'sales pipeline'
    ],
    icon: 'salesforce.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Case', value: 'case' },
          { name: 'Contact', value: 'contact' },
          { name: 'Lead', value: 'lead' },
          { name: 'Opportunity', value: 'opportunity' }
        ],
        default: 'lead',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['lead']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a lead' },
          { name: 'Delete', value: 'delete', description: 'Delete a lead' },
          { name: 'Get', value: 'get', description: 'Get a lead' },
          { name: 'Get All', value: 'getAll', description: 'Get all leads' },
          { name: 'Update', value: 'update', description: 'Update a lead' },
          { name: 'Get Summary', value: 'getSummary', description: 'Get lead summary' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'salesforceOAuth2Api',
        displayName: 'Salesforce OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Salesforce',
      color: '#00A1E0'
    },
    commonUseCase: 'Enterprise CRM automation, sales pipeline management, lead tracking, customer relationship management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.salesforce/',
    workflowPatterns: ['enterprise_crm', 'sales_automation', 'lead_management', 'customer_management']
  },

  // Intercom - Customer Messaging
  {
    name: 'n8n-nodes-base.intercom',
    displayName: 'Intercom',
    description: 'Automate work in Intercom, and integrate Intercom with other applications. Manage users, conversations, and customer support.',
    version: 1,
    category: 'Customer Support',
    subcategory: 'Customer Messaging',
    tags: [
      'intercom', 'customer support', 'messaging', 'conversations', 'users', 'customer service',
      'create user', 'update user', 'get user', 'get all users', 'delete user',
      'create company', 'update company', 'get company', 'get all companies',
      'get conversation', 'get all conversations', 'reply to conversation', 'close conversation',
      'send message', 'create note', 'customer messaging', 'live chat', 'support automation'
    ],
    icon: 'intercom.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Company', value: 'company' },
          { name: 'User', value: 'user' }
        ],
        default: 'user',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['user']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a user' },
          { name: 'Delete', value: 'delete', description: 'Delete a user' },
          { name: 'Get', value: 'get', description: 'Get a user' },
          { name: 'Get All', value: 'getAll', description: 'Get all users' },
          { name: 'Update', value: 'update', description: 'Update a user' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'intercomApi',
        displayName: 'Intercom API',
        required: true
      }
    ],
    defaults: {
      name: 'Intercom',
      color: '#1F8CEB'
    },
    commonUseCase: 'Customer support automation, user management, conversation handling, customer messaging',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.intercom/',
    workflowPatterns: ['customer_support', 'user_management', 'messaging_automation', 'support_workflows']
  },

  // Mattermost - Team Communication
  {
    name: 'n8n-nodes-base.mattermost',
    displayName: 'Mattermost',
    description: 'Automate work in Mattermost, and integrate Mattermost with other applications. Send messages, manage channels, and collaborate with team members.',
    version: 1,
    category: 'Communication',
    subcategory: 'Team Chat',
    tags: [
      'mattermost', 'team chat', 'messaging', 'collaboration', 'channels', 'notifications',
      'send message', 'create channel', 'get channel', 'get all channels', 'delete channel',
      'get user', 'get all users', 'create user', 'update user',
      'get team', 'get all teams', 'create team', 'update team',
      'team communication', 'workplace messaging', 'open source chat'
    ],
    icon: 'mattermost.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Message', value: 'message' },
          { name: 'User', value: 'user' }
        ],
        default: 'message',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message']
          }
        },
        options: [
          { name: 'Post', value: 'post', description: 'Post a message' },
          { name: 'Post Ephemeral', value: 'postEphemeral', description: 'Post an ephemeral message' }
        ],
        default: 'post',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'mattermostApi',
        displayName: 'Mattermost API',
        required: true
      }
    ],
    defaults: {
      name: 'Mattermost',
      color: '#0058CC'
    },
    commonUseCase: 'Team communication automation, notification broadcasting, workflow status updates',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mattermost/',
    workflowPatterns: ['team_communication', 'notification_system', 'collaboration_automation']
  },

  // Microsoft SQL Server - Database Management
  {
    name: 'n8n-nodes-base.microsoftSql',
    displayName: 'Microsoft SQL Server',
    description: 'Automate work in Microsoft SQL Server, and integrate SQL Server with other applications. Execute queries and manage data in SQL Server databases.',
    version: 1,
    category: 'Database',
    subcategory: 'SQL',
    tags: [
      'microsoft sql server', 'mssql', 'sql server', 'database', 'sql', 'microsoft', 'enterprise database',
      'execute query', 'insert data', 'update data', 'delete data', 'select data',
      'stored procedures', 'database operations', 'enterprise data', 'relational database',
      'sql automation', 'data management', 'business intelligence', 'data warehousing'
    ],
    icon: 'microsoftsqlserver.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Execute Query', value: 'executeQuery', description: 'Execute a SQL query' },
          { name: 'Insert', value: 'insert', description: 'Insert rows in table' },
          { name: 'Update', value: 'update', description: 'Update rows in table' },
          { name: 'Delete', value: 'delete', description: 'Delete rows from table' }
        ],
        default: 'executeQuery',
        description: 'The operation to perform'
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          editor: 'code',
          editorLanguage: 'sql'
        },
        default: '',
        placeholder: 'SELECT * FROM table_name',
        required: true,
        displayOptions: {
          show: {
            operation: ['executeQuery']
          }
        },
        description: 'The SQL query to execute'
      }
    ],
    credentials: [
      {
        name: 'microsoftSql',
        displayName: 'Microsoft SQL Server',
        required: true
      }
    ],
    defaults: {
      name: 'Microsoft SQL Server',
      color: '#CC2927'
    },
    commonUseCase: 'Enterprise database operations, business intelligence, data warehousing, SQL automation',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsoftsql/',
    workflowPatterns: ['enterprise_database', 'business_intelligence', 'data_warehousing', 'sql_automation']
  },

  // Stripe - Payment Processing (already referenced above, completing implementation)
  {
    name: 'n8n-nodes-base.stripe',
    displayName: 'Stripe',
    description: 'Automate work in Stripe, and integrate Stripe with other applications. Create, get, update and delete customers, charges, subscriptions, and products.',
    version: 1,
    category: 'Finance',
    subcategory: 'Payment Processing',
    tags: [
      'stripe', 'payments', 'billing', 'subscriptions', 'ecommerce', 'finance',
      'create customer', 'update customer', 'delete customer', 'get customer', 'get all customers',
      'create charge', 'get charge', 'get all charges', 'capture charge', 'refund charge',
      'create payment intent', 'confirm payment intent', 'get payment intent', 'cancel payment intent',
      'create subscription', 'cancel subscription', 'get subscription', 'update subscription', 'get all subscriptions',
      'create product', 'delete product', 'get product', 'update product', 'get all products',
      'create price', 'update price', 'get price', 'get all prices',
      'create invoice', 'pay invoice', 'get invoice', 'get all invoices', 'update invoice',
      'payment processing', 'billing automation', 'subscription management', 'revenue operations'
    ],
    icon: 'stripe.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Charge', value: 'charge' },
          { name: 'Customer', value: 'customer' },
          { name: 'Invoice', value: 'invoice' },
          { name: 'Payment Intent', value: 'paymentIntent' },
          { name: 'Price', value: 'price' },
          { name: 'Product', value: 'product' },
          { name: 'Subscription', value: 'subscription' }
        ],
        default: 'charge',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['charge']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a charge' },
          { name: 'Get', value: 'get', description: 'Get a charge' },
          { name: 'Get All', value: 'getAll', description: 'Get all charges' },
          { name: 'Update', value: 'update', description: 'Update a charge' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['customer']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer' },
          { name: 'Get All', value: 'getAll', description: 'Get all customers' },
          { name: 'Update', value: 'update', description: 'Update a customer' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'stripeApi',
        displayName: 'Stripe API',
        required: true
      }
    ],
    defaults: {
      name: 'Stripe',
      color: '#6772E5'
    },
    commonUseCase: 'Payment processing automation, subscription management, billing workflows, ecommerce integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.stripe/',
    workflowPatterns: ['payment_processing', 'ecommerce_automation', 'subscription_management', 'billing_automation']
  },

  // Shopify - E-commerce Platform (complete implementation)
  {
    name: 'n8n-nodes-base.shopify',
    displayName: 'Shopify',
    description: 'Automate work in Shopify, and integrate Shopify with other applications. Create, get, update and delete products, orders, customers, and inventory.',
    version: 1,
    category: 'E-commerce',
    subcategory: 'Store Management',
    tags: [
      'shopify', 'ecommerce', 'e-commerce', 'online store', 'products', 'orders', 'customers', 'inventory',
      'create product', 'update product', 'get product', 'get all products', 'delete product',
      'create order', 'update order', 'get order', 'get all orders', 'cancel order', 'fulfill order', 'close order',
      'create customer', 'update customer', 'get customer', 'get all customers', 'delete customer',
      'get inventory item', 'update inventory level', 'get inventory level',
      'create collection', 'get collection', 'get all collections', 'update collection', 'delete collection',
      'store management', 'product catalog', 'order processing', 'customer management', 'inventory tracking'
    ],
    icon: 'shopify.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Customer', value: 'customer' },
          { name: 'Inventory Item', value: 'inventoryItem' },
          { name: 'Inventory Level', value: 'inventoryLevel' },
          { name: 'Order', value: 'order' },
          { name: 'Product', value: 'product' },
          { name: 'Product Variant', value: 'productVariant' }
        ],
        default: 'product',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['product']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a product' },
          { name: 'Delete', value: 'delete', description: 'Delete a product' },
          { name: 'Get', value: 'get', description: 'Get a product' },
          { name: 'Get All', value: 'getAll', description: 'Get all products' },
          { name: 'Update', value: 'update', description: 'Update a product' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['order']
          }
        },
        options: [
          { name: 'Cancel', value: 'cancel', description: 'Cancel an order' },
          { name: 'Close', value: 'close', description: 'Close an order' },
          { name: 'Create', value: 'create', description: 'Create an order' },
          { name: 'Delete', value: 'delete', description: 'Delete an order' },
          { name: 'Fulfill', value: 'fulfill', description: 'Fulfill an order' },
          { name: 'Get', value: 'get', description: 'Get an order' },
          { name: 'Get All', value: 'getAll', description: 'Get all orders' },
          { name: 'Update', value: 'update', description: 'Update an order' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['customer']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer' },
          { name: 'Get All', value: 'getAll', description: 'Get all customers' },
          { name: 'Update', value: 'update', description: 'Update a customer' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'shopifyApi',
        displayName: 'Shopify API',
        required: true
      }
    ],
    defaults: {
      name: 'Shopify',
      color: '#96BF48'
    },
    commonUseCase: 'E-commerce automation, inventory management, order processing, customer management, product catalog sync',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.shopify/',
    workflowPatterns: ['ecommerce_automation', 'inventory_management', 'order_processing', 'customer_management']
  },

  // WooCommerce - WordPress E-commerce
  {
    name: 'n8n-nodes-base.wooCommerce',
    displayName: 'WooCommerce',
    description: 'Automate work in WooCommerce, and integrate WooCommerce with other applications. Create, get, update and delete products, orders, customers, and coupons.',
    version: 1,
    category: 'E-commerce',
    subcategory: 'WordPress',
    tags: [
      'woocommerce', 'wordpress', 'ecommerce', 'e-commerce', 'online store', 'products', 'orders', 'customers',
      'create product', 'update product', 'get product', 'get all products', 'delete product',
      'create order', 'update order', 'get order', 'get all orders', 'delete order',
      'create customer', 'update customer', 'get customer', 'get all customers', 'delete customer',
      'create coupon', 'update coupon', 'get coupon', 'get all coupons', 'delete coupon',
      'wordpress ecommerce', 'store management', 'product management', 'order fulfillment'
    ],
    icon: 'woocommerce.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Coupon', value: 'coupon' },
          { name: 'Customer', value: 'customer' },
          { name: 'Order', value: 'order' },
          { name: 'Product', value: 'product' }
        ],
        default: 'product',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['product']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a product' },
          { name: 'Delete', value: 'delete', description: 'Delete a product' },
          { name: 'Get', value: 'get', description: 'Get a product' },
          { name: 'Get All', value: 'getAll', description: 'Get all products' },
          { name: 'Update', value: 'update', description: 'Update a product' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['order']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create an order' },
          { name: 'Delete', value: 'delete', description: 'Delete an order' },
          { name: 'Get', value: 'get', description: 'Get an order' },
          { name: 'Get All', value: 'getAll', description: 'Get all orders' },
          { name: 'Update', value: 'update', description: 'Update an order' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['customer']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer' },
          { name: 'Get All', value: 'getAll', description: 'Get all customers' },
          { name: 'Update', value: 'update', description: 'Update a customer' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['coupon']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a coupon' },
          { name: 'Delete', value: 'delete', description: 'Delete a coupon' },
          { name: 'Get', value: 'get', description: 'Get a coupon' },
          { name: 'Get All', value: 'getAll', description: 'Get all coupons' },
          { name: 'Update', value: 'update', description: 'Update a coupon' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'wooCommerceApi',
        displayName: 'WooCommerce API',
        required: true
      }
    ],
    defaults: {
      name: 'WooCommerce',
      color: '#96588A'
    },
    commonUseCase: 'WordPress e-commerce automation, product management, order processing, customer management',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.woocommerce/',
    workflowPatterns: ['ecommerce_automation', 'wordpress_integration', 'order_processing', 'product_management']
  },

  // Google Analytics - Web Analytics
  {
    name: 'n8n-nodes-base.googleAnalytics',
    displayName: 'Google Analytics',
    description: 'Automate work with Google Analytics, and integrate Google Analytics with other applications. Get reports, user activity, and website analytics data.',
    version: 1,
    category: 'Analytics',
    subcategory: 'Web Analytics',
    tags: [
      'google analytics', 'analytics', 'google', 'web analytics', 'website analytics', 'user tracking', 'reports',
      'get report', 'get all reports', 'get user activity', 'get all user activity',
      'get real time data', 'get audience data', 'get acquisition data', 'get behavior data', 'get conversion data',
      'website performance', 'traffic analysis', 'user behavior', 'conversion tracking',
      'business intelligence', 'marketing analytics', 'data reporting', 'website optimization'
    ],
    icon: 'googleanalytics.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Report', value: 'report' },
          { name: 'User Activity', value: 'userActivity' }
        ],
        default: 'report',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['report']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get a report' },
          { name: 'Get All', value: 'getAll', description: 'Get all reports' }
        ],
        default: 'get',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['userActivity']
          }
        },
        options: [
          { name: 'Get', value: 'get', description: 'Get user activity' },
          { name: 'Search', value: 'search', description: 'Search user activity' }
        ],
        default: 'get',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'googleAnalyticsOAuth2',
        displayName: 'Google Analytics OAuth2',
        required: true
      }
    ],
    defaults: {
      name: 'Google Analytics',
      color: '#E37400'
    },
    commonUseCase: 'Web analytics reporting, traffic analysis, user behavior tracking, marketing performance monitoring',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googleanalytics/',
    workflowPatterns: ['analytics_reporting', 'business_intelligence', 'marketing_analytics', 'website_optimization']
  },

  // Dropbox - Cloud Storage (complete implementation)
  {
    name: 'n8n-nodes-base.dropbox',
    displayName: 'Dropbox',
    description: 'Automate work in Dropbox, and integrate Dropbox with other applications. Create, get, update and delete files and folders.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'dropbox', 'cloud storage', 'file storage', 'file sharing', 'sync', 'backup',
      'copy file', 'delete file', 'download file', 'get file', 'move file', 'upload file',
      'create folder', 'delete folder', 'get folder', 'get all folders',
      'search files', 'get sharing link', 'file synchronization', 'document storage',
      'personal cloud', 'team collaboration', 'file management'
    ],
    icon: 'dropbox.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'File', value: 'file' },
          { name: 'Folder', value: 'folder' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get', value: 'get', description: 'Get a file' },
          { name: 'Move', value: 'move', description: 'Move a file' },
          { name: 'Search', value: 'search', description: 'Search files' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'List', value: 'list', description: 'List folder contents' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'dropboxOAuth2Api',
        displayName: 'Dropbox OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Dropbox',
      color: '#0061FF'
    },
    commonUseCase: 'File backup automation, document storage, file synchronization, team file sharing',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.dropbox/',
    workflowPatterns: ['cloud_storage', 'file_management', 'backup_automation', 'document_sharing']
  },

  // Box - Enterprise Cloud Storage (complete implementation)
  {
    name: 'n8n-nodes-base.box',
    displayName: 'Box',
    description: 'Automate work in Box, and integrate Box with other applications. Create, get, update and delete files and folders.',
    version: 1,
    category: 'Data & Storage',
    subcategory: 'Cloud Storage',
    tags: [
      'box', 'cloud storage', 'file storage', 'content management', 'file sharing', 'collaboration',
      'create file', 'delete file', 'download file', 'get file', 'update file', 'upload file',
      'create folder', 'delete folder', 'get folder', 'get all folders', 'update folder',
      'file management', 'document storage', 'team collaboration', 'enterprise storage',
      'secure file sharing', 'content collaboration', 'document management'
    ],
    icon: 'box.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'File', value: 'file' },
          { name: 'Folder', value: 'folder' }
        ],
        default: 'file',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['file']
          }
        },
        options: [
          { name: 'Copy', value: 'copy', description: 'Copy a file' },
          { name: 'Delete', value: 'delete', description: 'Delete a file' },
          { name: 'Download', value: 'download', description: 'Download a file' },
          { name: 'Get', value: 'get', description: 'Get a file' },
          { name: 'Share', value: 'share', description: 'Share a file' },
          { name: 'Upload', value: 'upload', description: 'Upload a file' }
        ],
        default: 'upload',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['folder']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a folder' },
          { name: 'Delete', value: 'delete', description: 'Delete a folder' },
          { name: 'Get', value: 'get', description: 'Get a folder' },
          { name: 'Get All', value: 'getAll', description: 'Get all folders' },
          { name: 'Share', value: 'share', description: 'Share a folder' },
          { name: 'Update', value: 'update', description: 'Update a folder' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'boxOAuth2Api',
        displayName: 'Box OAuth2 API',
        required: true
      }
    ],
    defaults: {
      name: 'Box',
      color: '#0061D5'
    },
    commonUseCase: 'Enterprise file storage, document management, secure file sharing, content collaboration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.box/',
    workflowPatterns: ['enterprise_storage', 'document_management', 'secure_sharing', 'content_collaboration']
  },

  // Jira - Issue Tracking (complete implementation)
  {
    name: 'n8n-nodes-base.jira',
    displayName: 'Jira',
    description: 'Automate work in Jira, and integrate Jira with other applications. Create, get, update and delete issues, users, and issue attachments.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Issue Tracking',
    tags: [
      'jira', 'atlassian', 'issue tracking', 'project management', 'bug tracking', 'agile', 'scrum',
      'create issue', 'delete issue', 'get issue', 'get all issues', 'update issue', 'transition issue',
      'get issue changelog', 'notify issue', 'get issue comments', 'add issue comment', 'get issue watchers',
      'add issue watcher', 'remove issue watcher', 'create user', 'delete user', 'get user', 'get all users',
      'add attachment to issue', 'get issue attachment', 'get all issue attachments', 'remove issue attachment',
      'ticket management', 'workflow automation', 'software development', 'task tracking',
      'sprint management', 'release management', 'team collaboration', 'development process'
    ],
    icon: 'jira.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Issue', value: 'issue' },
          { name: 'Issue Attachment', value: 'issueAttachment' },
          { name: 'Issue Comment', value: 'issueComment' },
          { name: 'User', value: 'user' }
        ],
        default: 'issue',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issue']
          }
        },
        options: [
          { name: 'Changelog', value: 'changelog', description: 'Get issue changelog' },
          { name: 'Create', value: 'create', description: 'Create an issue' },
          { name: 'Delete', value: 'delete', description: 'Delete an issue' },
          { name: 'Get', value: 'get', description: 'Get an issue' },
          { name: 'Get All', value: 'getAll', description: 'Get all issues' },
          { name: 'Notify', value: 'notify', description: 'Notify issue' },
          { name: 'Transition', value: 'transition', description: 'Transition an issue' },
          { name: 'Update', value: 'update', description: 'Update an issue' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issueAttachment']
          }
        },
        options: [
          { name: 'Add', value: 'add', description: 'Add attachment to issue' },
          { name: 'Get', value: 'get', description: 'Get an issue attachment' },
          { name: 'Get All', value: 'getAll', description: 'Get all issue attachments' },
          { name: 'Remove', value: 'remove', description: 'Remove an issue attachment' }
        ],
        default: 'add',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['issueComment']
          }
        },
        options: [
          { name: 'Add', value: 'add', description: 'Add comment to issue' },
          { name: 'Get', value: 'get', description: 'Get a comment' },
          { name: 'Get All', value: 'getAll', description: 'Get all comments' },
          { name: 'Remove', value: 'remove', description: 'Remove a comment' },
          { name: 'Update', value: 'update', description: 'Update a comment' }
        ],
        default: 'add',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'jiraCloudApi',
        displayName: 'Jira Cloud API',
        required: true
      }
    ],
    defaults: {
      name: 'Jira',
      color: '#2684FF'
    },
    commonUseCase: 'Issue tracking automation, project management, bug tracking, development workflow integration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.jira/',
    workflowPatterns: ['project_management', 'issue_tracking', 'development_automation', 'bug_tracking']
  },

  // Confluence - Knowledge Management
  {
    name: 'n8n-nodes-base.confluence',
    displayName: 'Confluence',
    description: 'Automate work in Confluence, and integrate Confluence with other applications. Create, get, update and delete pages and spaces.',
    version: 1,
    category: 'Productivity',
    subcategory: 'Documentation',
    tags: [
      'confluence', 'atlassian', 'documentation', 'wiki', 'knowledge management', 'pages', 'spaces',
      'create page', 'delete page', 'get page', 'get all pages', 'update page',
      'create space', 'get space', 'get all spaces', 'update space', 'delete space',
      'documentation automation', 'knowledge base', 'team collaboration', 'content management',
      'technical documentation', 'project documentation', 'knowledge sharing'
    ],
    icon: 'confluence.svg',
    triggerNode: false,
    inputs: [{ type: 'main', displayName: 'Main', required: false }],
    outputs: [{ type: 'main', displayName: 'Main' }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Page', value: 'page' },
          { name: 'Space', value: 'space' }
        ],
        default: 'page',
        description: 'The resource to operate on'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['page']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a page' },
          { name: 'Delete', value: 'delete', description: 'Delete a page' },
          { name: 'Get', value: 'get', description: 'Get a page' },
          { name: 'Get All', value: 'getAll', description: 'Get all pages' },
          { name: 'Update', value: 'update', description: 'Update a page' }
        ],
        default: 'create',
        description: 'The operation to perform'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['space']
          }
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a space' },
          { name: 'Delete', value: 'delete', description: 'Delete a space' },
          { name: 'Get', value: 'get', description: 'Get a space' },
          { name: 'Get All', value: 'getAll', description: 'Get all spaces' },
          { name: 'Update', value: 'update', description: 'Update a space' }
        ],
        default: 'create',
        description: 'The operation to perform'
      }
    ],
    credentials: [
      {
        name: 'confluenceCloudApi',
        displayName: 'Confluence Cloud API',
        required: true
      }
    ],
    defaults: {
      name: 'Confluence',
      color: '#172B4D'
    },
    commonUseCase: 'Documentation automation, knowledge management, content creation, team collaboration',
    documentation: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.confluence/',
    workflowPatterns: ['documentation_automation', 'knowledge_management', 'content_creation', 'team_collaboration']
  }
];

/**
 * All nodes combined for easy access
 */
export const ALL_NODES: NodeInfo[] = [
  ...CORE_NODES,
  ...AI_NODES,
  ...COMMUNICATION_NODES,
  ...DATABASE_NODES,
  ...TRIGGER_NODES,
  ...ESSENTIAL_NODES
];

/**
 * Node search and filtering utilities
 */
export class NodeCatalog {
  /**
   * Search nodes by tags, name, or description
   */
  static searchNodes(query: string): NodeInfo[] {
    const searchTerm = query.toLowerCase();
    
    return ALL_NODES.filter(node => {
      return (
        node.name.toLowerCase().includes(searchTerm) ||
        node.displayName.toLowerCase().includes(searchTerm) ||
        node.description.toLowerCase().includes(searchTerm) ||
        node.category.toLowerCase().includes(searchTerm) ||
        node.subcategory?.toLowerCase().includes(searchTerm) ||
        node.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        node.commonUseCase?.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Get nodes by category
   */
  static getNodesByCategory(category: string): NodeInfo[] {
    return ALL_NODES.filter(node => 
      node.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get nodes by tags
   */
  static getNodesByTag(tag: string): NodeInfo[] {
    return ALL_NODES.filter(node =>
      node.tags.some(nodeTag => nodeTag.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get trigger nodes only
   */
  static getTriggerNodes(): NodeInfo[] {
    return ALL_NODES.filter(node => node.triggerNode);
  }

  /**
   * Get regular (non-trigger) nodes only
   */
  static getRegularNodes(): NodeInfo[] {
    return ALL_NODES.filter(node => !node.triggerNode);
  }

  /**
   * Get node by exact name
   */
  static getNodeByName(name: string): NodeInfo | undefined {
    return ALL_NODES.find(node => node.name === name);
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    return [...new Set(ALL_NODES.map(node => node.category))];
  }

  /**
   * Get all tags
   */
  static getAllTags(): string[] {
    const allTags = ALL_NODES.flatMap(node => node.tags);
    return [...new Set(allTags)].sort();
  }

  /**
   * Get nodes for common workflow patterns
   */
  static getWorkflowPattern(pattern: string): NodeInfo[] {
    const patterns: { [key: string]: string[] } = {
      'webhook_to_email': ['webhook', 'gmail'],
      'ai_processing': ['webhook', 'chatOpenAi', 'set'],
      'database_sync': ['scheduleTrigger', 'postgres', 'httpRequest'],
      'notification_system': ['webhook', 'if', 'slack'],
      'data_transformation': ['webhook', 'function', 'set'],
      'email_automation': ['gmail', 'if', 'set', 'slack']
    };

    const nodeNames = patterns[pattern.toLowerCase()] || [];
    return nodeNames.map(name => this.searchNodes(name)[0]).filter(Boolean);
  }

  /**
   * Convert to legacy format for compatibility
   */
  static toLegacyFormat(node: NodeInfo): any {
    return {
      name: node.name,
      displayName: node.displayName,
      description: node.description,
      category: node.category,
      subcategory: node.subcategory,
      triggerNode: node.triggerNode,
      regularNode: !node.triggerNode,
      webhookSupport: node.webhookNode || false,
      codeable: node.codeable || false,
      credentials: node.credentials?.map(c => c.name) || [],
      inputs: node.inputs,
      outputs: node.outputs,
      properties: node.properties,
      version: node.version.toString()
    };
  }
}