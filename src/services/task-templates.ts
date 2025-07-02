/**
 * Task Templates Service
 * 
 * Provides pre-configured node settings for common tasks.
 * This helps AI agents quickly configure nodes for specific use cases.
 */

export interface TaskTemplate {
  task: string;
  description: string;
  nodeType: string;
  configuration: Record<string, any>;
  userMustProvide: Array<{
    property: string;
    description: string;
    example?: any;
  }>;
  optionalEnhancements?: Array<{
    property: string;
    description: string;
    when?: string;
  }>;
  notes?: string[];
}

export class TaskTemplates {
  private static templates: Record<string, TaskTemplate> = {
    // HTTP Request Tasks
    'get_api_data': {
      task: 'get_api_data',
      description: 'Make a simple GET request to retrieve data from an API',
      nodeType: 'nodes-base.httpRequest',
      configuration: {
        method: 'GET',
        url: '',
        authentication: 'none'
      },
      userMustProvide: [
        {
          property: 'url',
          description: 'The API endpoint URL',
          example: 'https://api.example.com/users'
        }
      ],
      optionalEnhancements: [
        {
          property: 'authentication',
          description: 'Add authentication if the API requires it',
          when: 'API requires authentication'
        },
        {
          property: 'sendHeaders',
          description: 'Add custom headers if needed',
          when: 'API requires specific headers'
        }
      ]
    },
    
    'post_json_request': {
      task: 'post_json_request',
      description: 'Send JSON data to an API endpoint',
      nodeType: 'nodes-base.httpRequest',
      configuration: {
        method: 'POST',
        url: '',
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: ''
      },
      userMustProvide: [
        {
          property: 'url',
          description: 'The API endpoint URL',
          example: 'https://api.example.com/users'
        },
        {
          property: 'jsonBody',
          description: 'The JSON data to send',
          example: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
        }
      ],
      optionalEnhancements: [
        {
          property: 'authentication',
          description: 'Add authentication if required'
        }
      ],
      notes: [
        'Make sure jsonBody contains valid JSON',
        'Content-Type header is automatically set to application/json'
      ]
    },
    
    'call_api_with_auth': {
      task: 'call_api_with_auth',
      description: 'Make an authenticated API request',
      nodeType: 'nodes-base.httpRequest',
      configuration: {
        method: 'GET',
        url: '',
        authentication: 'genericCredentialType',
        genericAuthType: 'headerAuth',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: '',
              value: ''
            }
          ]
        }
      },
      userMustProvide: [
        {
          property: 'url',
          description: 'The API endpoint URL'
        },
        {
          property: 'headerParameters.parameters[0].name',
          description: 'The header name for authentication',
          example: 'Authorization'
        },
        {
          property: 'headerParameters.parameters[0].value',
          description: 'The authentication value',
          example: 'Bearer YOUR_API_KEY'
        }
      ],
      optionalEnhancements: [
        {
          property: 'method',
          description: 'Change to POST/PUT/DELETE as needed'
        }
      ]
    },
    
    // Webhook Tasks
    'receive_webhook': {
      task: 'receive_webhook',
      description: 'Set up a webhook to receive data from external services',
      nodeType: 'nodes-base.webhook',
      configuration: {
        httpMethod: 'POST',
        path: 'webhook',
        responseMode: 'lastNode',
        responseData: 'allEntries'
      },
      userMustProvide: [
        {
          property: 'path',
          description: 'The webhook path (will be appended to your n8n URL)',
          example: 'github-webhook'
        }
      ],
      optionalEnhancements: [
        {
          property: 'httpMethod',
          description: 'Change if the service sends GET/PUT/etc'
        },
        {
          property: 'responseCode',
          description: 'Set custom response code (default 200)'
        }
      ],
      notes: [
        'The full webhook URL will be: https://your-n8n.com/webhook/[path]',
        'Test URL will be different from production URL'
      ]
    },
    
    'webhook_with_response': {
      task: 'webhook_with_response',
      description: 'Receive webhook and send custom response',
      nodeType: 'nodes-base.webhook',
      configuration: {
        httpMethod: 'POST',
        path: 'webhook',
        responseMode: 'responseNode',
        responseData: 'firstEntryJson',
        responseCode: 200
      },
      userMustProvide: [
        {
          property: 'path',
          description: 'The webhook path'
        }
      ],
      notes: [
        'Use with a Respond to Webhook node to send custom response',
        'responseMode: responseNode requires a Respond to Webhook node'
      ]
    },
    
    // Database Tasks
    'query_postgres': {
      task: 'query_postgres',
      description: 'Query data from PostgreSQL database',
      nodeType: 'nodes-base.postgres',
      configuration: {
        operation: 'executeQuery',
        query: ''
      },
      userMustProvide: [
        {
          property: 'query',
          description: 'The SQL query to execute',
          example: 'SELECT * FROM users WHERE active = true LIMIT 10'
        }
      ],
      optionalEnhancements: [
        {
          property: 'additionalFields.queryParams',
          description: 'Use parameterized queries for security',
          when: 'Using dynamic values'
        }
      ],
      notes: [
        'Always use parameterized queries to prevent SQL injection',
        'Configure PostgreSQL credentials in n8n'
      ]
    },
    
    'insert_postgres_data': {
      task: 'insert_postgres_data',
      description: 'Insert data into PostgreSQL table',
      nodeType: 'nodes-base.postgres',
      configuration: {
        operation: 'insert',
        table: '',
        columns: '',
        returnFields: '*'
      },
      userMustProvide: [
        {
          property: 'table',
          description: 'The table name',
          example: 'users'
        },
        {
          property: 'columns',
          description: 'Comma-separated column names',
          example: 'name,email,created_at'
        }
      ],
      notes: [
        'Input data should match the column structure',
        'Use expressions like {{ $json.fieldName }} to map data'
      ]
    },
    
    // AI/LangChain Tasks
    'chat_with_ai': {
      task: 'chat_with_ai',
      description: 'Send a message to an AI model and get response',
      nodeType: 'nodes-base.openAi',
      configuration: {
        resource: 'chat',
        operation: 'message',
        modelId: 'gpt-3.5-turbo',
        messages: {
          values: [
            {
              role: 'user',
              content: ''
            }
          ]
        }
      },
      userMustProvide: [
        {
          property: 'messages.values[0].content',
          description: 'The message to send to the AI',
          example: '{{ $json.userMessage }}'
        }
      ],
      optionalEnhancements: [
        {
          property: 'modelId',
          description: 'Change to gpt-4 for better results'
        },
        {
          property: 'options.temperature',
          description: 'Adjust creativity (0-1)'
        },
        {
          property: 'options.maxTokens',
          description: 'Limit response length'
        }
      ]
    },
    
    'ai_agent_workflow': {
      task: 'ai_agent_workflow',
      description: 'Create an AI agent that can use tools',
      nodeType: 'nodes-langchain.agent',
      configuration: {
        text: '',
        outputType: 'output',
        systemMessage: 'You are a helpful assistant.'
      },
      userMustProvide: [
        {
          property: 'text',
          description: 'The input prompt for the agent',
          example: '{{ $json.query }}'
        }
      ],
      optionalEnhancements: [
        {
          property: 'systemMessage',
          description: 'Customize the agent\'s behavior'
        }
      ],
      notes: [
        'Connect tool nodes to give the agent capabilities',
        'Configure the AI model credentials'
      ]
    },
    
    // Data Processing Tasks
    'transform_data': {
      task: 'transform_data',
      description: 'Transform data structure using JavaScript',
      nodeType: 'nodes-base.code',
      configuration: {
        language: 'javaScript',
        jsCode: `// Transform each item
const results = [];

for (const item of items) {
  results.push({
    json: {
      // Transform your data here
      id: item.json.id,
      processedAt: new Date().toISOString()
    }
  });
}

return results;`
      },
      userMustProvide: [],
      notes: [
        'Access input data via items array',
        'Each item has a json property with the data',
        'Return array of objects with json property'
      ]
    },
    
    'filter_data': {
      task: 'filter_data',
      description: 'Filter items based on conditions',
      nodeType: 'nodes-base.if',
      configuration: {
        conditions: {
          conditions: [
            {
              leftValue: '',
              rightValue: '',
              operator: {
                type: 'string',
                operation: 'equals'
              }
            }
          ]
        }
      },
      userMustProvide: [
        {
          property: 'conditions.conditions[0].leftValue',
          description: 'The value to check',
          example: '{{ $json.status }}'
        },
        {
          property: 'conditions.conditions[0].rightValue',
          description: 'The value to compare against',
          example: 'active'
        }
      ],
      notes: [
        'True output contains matching items',
        'False output contains non-matching items'
      ]
    },
    
    // Communication Tasks
    'send_slack_message': {
      task: 'send_slack_message',
      description: 'Send a message to Slack channel',
      nodeType: 'nodes-base.slack',
      configuration: {
        resource: 'message',
        operation: 'post',
        channel: '',
        text: ''
      },
      userMustProvide: [
        {
          property: 'channel',
          description: 'The Slack channel',
          example: '#general'
        },
        {
          property: 'text',
          description: 'The message text',
          example: 'New order received: {{ $json.orderId }}'
        }
      ],
      optionalEnhancements: [
        {
          property: 'attachments',
          description: 'Add rich message attachments'
        },
        {
          property: 'blocks',
          description: 'Use Block Kit for advanced formatting'
        }
      ]
    },
    
    'send_email': {
      task: 'send_email',
      description: 'Send an email notification',
      nodeType: 'nodes-base.emailSend',
      configuration: {
        fromEmail: '',
        toEmail: '',
        subject: '',
        text: ''
      },
      userMustProvide: [
        {
          property: 'fromEmail',
          description: 'Sender email address',
          example: 'notifications@company.com'
        },
        {
          property: 'toEmail',
          description: 'Recipient email address',
          example: '{{ $json.customerEmail }}'
        },
        {
          property: 'subject',
          description: 'Email subject',
          example: 'Order Confirmation #{{ $json.orderId }}'
        },
        {
          property: 'text',
          description: 'Email body (plain text)',
          example: 'Thank you for your order!'
        }
      ],
      optionalEnhancements: [
        {
          property: 'html',
          description: 'Use HTML for rich formatting'
        },
        {
          property: 'attachments',
          description: 'Attach files to the email'
        }
      ]
    },
    
    // AI Tool Usage Tasks
    'use_google_sheets_as_tool': {
      task: 'use_google_sheets_as_tool',
      description: 'Use Google Sheets as an AI tool for reading/writing data',
      nodeType: 'nodes-base.googleSheets',
      configuration: {
        operation: 'append',
        sheetId: '={{ $fromAI("sheetId", "The Google Sheets ID") }}',
        range: '={{ $fromAI("range", "The range to append to, e.g. A:Z") }}',
        dataMode: 'autoMap'
      },
      userMustProvide: [
        {
          property: 'Google Sheets credentials',
          description: 'Configure Google Sheets API credentials in n8n'
        },
        {
          property: 'Tool name in AI Agent',
          description: 'Give it a descriptive name like "Log Results to Sheet"'
        },
        {
          property: 'Tool description',
          description: 'Describe when and how the AI should use this tool'
        }
      ],
      notes: [
        'Connect this node to the ai_tool port of an AI Agent node',
        'The AI can dynamically determine sheetId and range using $fromAI',
        'Works great for logging AI analysis results or reading data for processing'
      ]
    },
    
    'use_slack_as_tool': {
      task: 'use_slack_as_tool',
      description: 'Use Slack as an AI tool for sending notifications',
      nodeType: 'nodes-base.slack',
      configuration: {
        resource: 'message',
        operation: 'post',
        channel: '={{ $fromAI("channel", "The Slack channel, e.g. #general") }}',
        text: '={{ $fromAI("message", "The message to send") }}',
        attachments: []
      },
      userMustProvide: [
        {
          property: 'Slack credentials',
          description: 'Configure Slack OAuth2 credentials in n8n'
        },
        {
          property: 'Tool configuration in AI Agent',
          description: 'Name it something like "Send Slack Notification"'
        }
      ],
      notes: [
        'Perfect for AI agents that need to notify teams',
        'The AI determines channel and message content dynamically',
        'Can be enhanced with blocks for rich formatting'
      ]
    },
    
    'multi_tool_ai_agent': {
      task: 'multi_tool_ai_agent',
      description: 'AI agent with multiple tools for complex automation',
      nodeType: 'nodes-langchain.agent',
      configuration: {
        text: '={{ $json.query }}',
        outputType: 'output',
        systemMessage: 'You are an intelligent assistant with access to multiple tools. Use them wisely to complete tasks.'
      },
      userMustProvide: [
        {
          property: 'AI model credentials',
          description: 'OpenAI, Anthropic, or other LLM credentials'
        },
        {
          property: 'Multiple tool nodes',
          description: 'Connect various nodes to the ai_tool port'
        },
        {
          property: 'Tool descriptions',
          description: 'Clear descriptions for each connected tool'
        }
      ],
      optionalEnhancements: [
        {
          property: 'Memory',
          description: 'Add memory nodes for conversation context'
        },
        {
          property: 'Custom tools',
          description: 'Create Code nodes as custom tools'
        }
      ],
      notes: [
        'Connect multiple nodes: HTTP Request, Slack, Google Sheets, etc.',
        'Each tool should have a clear, specific purpose',
        'Test each tool individually before combining',
        'Set N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true for community nodes'
      ]
    }
  };
  
  /**
   * Get all available tasks
   */
  static getAllTasks(): string[] {
    return Object.keys(this.templates);
  }
  
  /**
   * Get tasks for a specific node type
   */
  static getTasksForNode(nodeType: string): string[] {
    return Object.entries(this.templates)
      .filter(([_, template]) => template.nodeType === nodeType)
      .map(([task, _]) => task);
  }
  
  /**
   * Get a specific task template
   */
  static getTaskTemplate(task: string): TaskTemplate | undefined {
    return this.templates[task];
  }
  
  /**
   * Search for tasks by keyword
   */
  static searchTasks(keyword: string): string[] {
    const lower = keyword.toLowerCase();
    return Object.entries(this.templates)
      .filter(([task, template]) => 
        task.toLowerCase().includes(lower) ||
        template.description.toLowerCase().includes(lower) ||
        template.nodeType.toLowerCase().includes(lower)
      )
      .map(([task, _]) => task);
  }
  
  /**
   * Get task categories
   */
  static getTaskCategories(): Record<string, string[]> {
    return {
      'HTTP/API': ['get_api_data', 'post_json_request', 'call_api_with_auth'],
      'Webhooks': ['receive_webhook', 'webhook_with_response'],
      'Database': ['query_postgres', 'insert_postgres_data'],
      'AI/LangChain': ['chat_with_ai', 'ai_agent_workflow', 'multi_tool_ai_agent'],
      'Data Processing': ['transform_data', 'filter_data'],
      'Communication': ['send_slack_message', 'send_email'],
      'AI Tool Usage': ['use_google_sheets_as_tool', 'use_slack_as_tool', 'multi_tool_ai_agent']
    };
  }
}