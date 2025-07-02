/**
 * ExampleGenerator Service
 * 
 * Provides concrete, working examples for n8n nodes to help AI agents
 * understand how to configure them properly.
 */

export interface NodeExamples {
  minimal: Record<string, any>;
  common?: Record<string, any>;
  advanced?: Record<string, any>;
}

export class ExampleGenerator {
  /**
   * Curated examples for the most commonly used nodes.
   * Each example is a valid configuration that can be used directly.
   */
  private static NODE_EXAMPLES: Record<string, NodeExamples> = {
    // HTTP Request - Most versatile node
    'nodes-base.httpRequest': {
      minimal: {
        url: 'https://api.example.com/data'
      },
      common: {
        method: 'POST',
        url: 'https://api.example.com/users',
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
      },
      advanced: {
        method: 'POST',
        url: 'https://api.example.com/protected/resource',
        authentication: 'genericCredentialType',
        genericAuthType: 'headerAuth',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: 'X-API-Version',
              value: 'v2'
            }
          ]
        },
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: '{\n  "action": "update",\n  "data": {}\n}'
      }
    },
    
    // Webhook - Entry point for workflows
    'nodes-base.webhook': {
      minimal: {
        path: 'my-webhook',
        httpMethod: 'POST'
      },
      common: {
        path: 'webhook-endpoint',
        httpMethod: 'POST',
        responseMode: 'lastNode',
        responseData: 'allEntries',
        responseCode: 200
      }
    },
    
    // Code - Custom logic
    'nodes-base.code': {
      minimal: {
        language: 'javaScript',
        jsCode: 'return items;'
      },
      common: {
        language: 'javaScript',
        jsCode: `// Access input items
const results = [];

for (const item of items) {
  // Process each item
  results.push({
    json: {
      ...item.json,
      processed: true,
      timestamp: new Date().toISOString()
    }
  });
}

return results;`
      },
      advanced: {
        language: 'python',
        pythonCode: `import json
from datetime import datetime

# Access input items
results = []

for item in items:
    # Process each item
    processed_item = item.json.copy()
    processed_item['processed'] = True
    processed_item['timestamp'] = datetime.now().isoformat()
    
    results.append({'json': processed_item})

return results`
      }
    },
    
    // Set - Data manipulation
    'nodes-base.set': {
      minimal: {
        mode: 'manual',
        assignments: {
          assignments: [
            {
              id: '1',
              name: 'status',
              value: 'active',
              type: 'string'
            }
          ]
        }
      },
      common: {
        mode: 'manual',
        includeOtherFields: true,
        assignments: {
          assignments: [
            {
              id: '1',
              name: 'status',
              value: 'processed',
              type: 'string'
            },
            {
              id: '2',
              name: 'processedAt',
              value: '={{ $now.toISO() }}',
              type: 'string'
            },
            {
              id: '3',
              name: 'itemCount',
              value: '={{ $items().length }}',
              type: 'number'
            }
          ]
        }
      }
    },
    
    // If - Conditional logic
    'nodes-base.if': {
      minimal: {
        conditions: {
          conditions: [
            {
              id: '1',
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
      common: {
        conditions: {
          conditions: [
            {
              id: '1',
              leftValue: '={{ $json.status }}',
              rightValue: 'active',
              operator: {
                type: 'string',
                operation: 'equals'
              }
            },
            {
              id: '2',
              leftValue: '={{ $json.count }}',
              rightValue: 10,
              operator: {
                type: 'number',
                operation: 'gt'
              }
            }
          ]
        },
        combineOperation: 'all'
      }
    },
    
    // PostgreSQL - Database operations
    'nodes-base.postgres': {
      minimal: {
        operation: 'executeQuery',
        query: 'SELECT * FROM users LIMIT 10'
      },
      common: {
        operation: 'insert',
        table: 'users',
        columns: 'name,email,created_at',
        additionalFields: {}
      },
      advanced: {
        operation: 'executeQuery',
        query: `INSERT INTO users (name, email, status)
VALUES ($1, $2, $3)
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  updated_at = NOW()
RETURNING *;`,
        additionalFields: {
          queryParams: '={{ $json.name }},{{ $json.email }},active'
        }
      }
    },
    
    // OpenAI - AI operations
    'nodes-base.openAi': {
      minimal: {
        resource: 'chat',
        operation: 'message',
        modelId: 'gpt-3.5-turbo',
        messages: {
          values: [
            {
              role: 'user',
              content: 'Hello, how can you help me?'
            }
          ]
        }
      },
      common: {
        resource: 'chat',
        operation: 'message',
        modelId: 'gpt-4',
        messages: {
          values: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes text concisely.'
            },
            {
              role: 'user',
              content: '={{ $json.text }}'
            }
          ]
        },
        options: {
          maxTokens: 150,
          temperature: 0.7
        }
      }
    },
    
    // Google Sheets - Spreadsheet operations
    'nodes-base.googleSheets': {
      minimal: {
        operation: 'read',
        documentId: {
          __rl: true,
          value: 'https://docs.google.com/spreadsheets/d/your-sheet-id',
          mode: 'url'
        },
        sheetName: 'Sheet1'
      },
      common: {
        operation: 'append',
        documentId: {
          __rl: true,
          value: 'your-sheet-id',
          mode: 'id'
        },
        sheetName: 'Sheet1',
        dataStartRow: 2,
        columns: {
          mappingMode: 'defineBelow',
          value: {
            'Name': '={{ $json.name }}',
            'Email': '={{ $json.email }}',
            'Date': '={{ $now.toISO() }}'
          }
        }
      }
    },
    
    // Slack - Messaging
    'nodes-base.slack': {
      minimal: {
        resource: 'message',
        operation: 'post',
        channel: '#general',
        text: 'Hello from n8n!'
      },
      common: {
        resource: 'message',
        operation: 'post',
        channel: '#notifications',
        text: 'New order received!',
        attachments: [
          {
            color: '#36a64f',
            title: 'Order #{{ $json.orderId }}',
            fields: {
              item: [
                {
                  title: 'Customer',
                  value: '{{ $json.customerName }}',
                  short: true
                },
                {
                  title: 'Amount',
                  value: '${{ $json.amount }}',
                  short: true
                }
              ]
            }
          }
        ]
      }
    },
    
    // Email - Email operations
    'nodes-base.emailSend': {
      minimal: {
        fromEmail: 'sender@example.com',
        toEmail: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email from n8n.'
      },
      common: {
        fromEmail: 'notifications@company.com',
        toEmail: '={{ $json.email }}',
        subject: 'Welcome to our service, {{ $json.name }}!',
        html: `<h1>Welcome!</h1>
<p>Hi {{ $json.name }},</p>
<p>Thank you for signing up. We're excited to have you on board!</p>
<p>Best regards,<br>The Team</p>`,
        options: {
          ccEmail: 'admin@company.com'
        }
      }
    },
    
    // Merge - Combining data
    'nodes-base.merge': {
      minimal: {
        mode: 'append'
      },
      common: {
        mode: 'mergeByKey',
        propertyName1: 'id',
        propertyName2: 'userId'
      }
    },
    
    // Function - Legacy custom functions
    'nodes-base.function': {
      minimal: {
        functionCode: 'return items;'
      },
      common: {
        functionCode: `// Add a timestamp to each item
const processedItems = items.map(item => {
  return {
    ...item,
    json: {
      ...item.json,
      processedAt: new Date().toISOString()
    }
  };
});

return processedItems;`
      }
    },
    
    // Split In Batches - Batch processing
    'nodes-base.splitInBatches': {
      minimal: {
        batchSize: 10
      },
      common: {
        batchSize: 100,
        options: {
          reset: false
        }
      }
    },
    
    // Redis - Cache operations
    'nodes-base.redis': {
      minimal: {
        operation: 'set',
        key: 'myKey',
        value: 'myValue'
      },
      common: {
        operation: 'set',
        key: 'user:{{ $json.userId }}',
        value: '={{ JSON.stringify($json) }}',
        expire: true,
        ttl: 3600
      }
    },
    
    // MongoDB - NoSQL operations
    'nodes-base.mongoDb': {
      minimal: {
        operation: 'find',
        collection: 'users'
      },
      common: {
        operation: 'findOneAndUpdate',
        collection: 'users',
        query: '{ "email": "{{ $json.email }}" }',
        update: '{ "$set": { "lastLogin": "{{ $now.toISO() }}" } }',
        options: {
          upsert: true,
          returnNewDocument: true
        }
      }
    },
    
    // MySQL - Database operations
    'nodes-base.mySql': {
      minimal: {
        operation: 'executeQuery',
        query: 'SELECT * FROM products WHERE active = 1'
      },
      common: {
        operation: 'insert',
        table: 'orders',
        columns: 'customer_id,product_id,quantity,order_date',
        options: {
          queryBatching: 'independently'
        }
      }
    },
    
    // FTP - File transfer
    'nodes-base.ftp': {
      minimal: {
        operation: 'download',
        path: '/files/data.csv'
      },
      common: {
        operation: 'upload',
        path: '/uploads/',
        fileName: 'report_{{ $now.format("yyyy-MM-dd") }}.csv',
        binaryData: true,
        binaryPropertyName: 'data'
      }
    },
    
    // SSH - Remote execution
    'nodes-base.ssh': {
      minimal: {
        resource: 'command',
        operation: 'execute',
        command: 'ls -la'
      },
      common: {
        resource: 'command',
        operation: 'execute',
        command: 'cd /var/logs && tail -n 100 app.log | grep ERROR',
        cwd: '/home/user'
      }
    },
    
    // Execute Command - Local execution
    'nodes-base.executeCommand': {
      minimal: {
        command: 'echo "Hello from n8n"'
      },
      common: {
        command: 'node process-data.js --input "{{ $json.filename }}"',
        cwd: '/app/scripts'
      }
    },
    
    // GitHub - Version control
    'nodes-base.github': {
      minimal: {
        resource: 'issue',
        operation: 'get',
        owner: 'n8n-io',
        repository: 'n8n',
        issueNumber: 123
      },
      common: {
        resource: 'issue',
        operation: 'create',
        owner: '={{ $json.organization }}',
        repository: '={{ $json.repo }}',
        title: 'Bug: {{ $json.title }}',
        body: `## Description
{{ $json.description }}

## Steps to Reproduce
{{ $json.steps }}

## Expected Behavior
{{ $json.expected }}`,
        assignees: ['maintainer'],
        labels: ['bug', 'needs-triage']
      }
    }
  };
  
  /**
   * Get examples for a specific node type
   */
  static getExamples(nodeType: string, essentials?: any): NodeExamples {
    // Return curated examples if available
    const examples = this.NODE_EXAMPLES[nodeType];
    if (examples) {
      return examples;
    }
    
    // Generate basic examples for unconfigured nodes
    return this.generateBasicExamples(nodeType, essentials);
  }
  
  /**
   * Generate basic examples for nodes without curated ones
   */
  private static generateBasicExamples(nodeType: string, essentials?: any): NodeExamples {
    const minimal: Record<string, any> = {};
    
    // Add required fields with sensible defaults
    if (essentials?.required) {
      for (const prop of essentials.required) {
        minimal[prop.name] = this.getDefaultValue(prop);
      }
    }
    
    // Add first common property if no required fields
    if (Object.keys(minimal).length === 0 && essentials?.common?.length > 0) {
      const firstCommon = essentials.common[0];
      minimal[firstCommon.name] = this.getDefaultValue(firstCommon);
    }
    
    return { minimal };
  }
  
  /**
   * Generate a sensible default value for a property
   */
  private static getDefaultValue(prop: any): any {
    // Use configured default if available
    if (prop.default !== undefined) {
      return prop.default;
    }
    
    // Generate based on type and name
    switch (prop.type) {
      case 'string':
        return this.getStringDefault(prop);
      
      case 'number':
        return prop.name.includes('port') ? 80 : 
               prop.name.includes('timeout') ? 30000 : 
               prop.name.includes('limit') ? 10 : 0;
      
      case 'boolean':
        return false;
      
      case 'options':
      case 'multiOptions':
        return prop.options?.[0]?.value || '';
      
      case 'json':
        return '{\n  "key": "value"\n}';
      
      case 'collection':
      case 'fixedCollection':
        return {};
      
      default:
        return '';
    }
  }
  
  /**
   * Get default value for string properties based on name
   */
  private static getStringDefault(prop: any): string {
    const name = prop.name.toLowerCase();
    
    // URL/endpoint fields
    if (name.includes('url') || name === 'endpoint') {
      return 'https://api.example.com';
    }
    
    // Email fields
    if (name.includes('email')) {
      return name.includes('from') ? 'sender@example.com' : 'recipient@example.com';
    }
    
    // Path fields
    if (name.includes('path')) {
      return name.includes('webhook') ? 'my-webhook' : '/path/to/file';
    }
    
    // Name fields
    if (name === 'name' || name.includes('username')) {
      return 'John Doe';
    }
    
    // Key fields
    if (name.includes('key')) {
      return 'myKey';
    }
    
    // Query fields
    if (name === 'query' || name.includes('sql')) {
      return 'SELECT * FROM table_name LIMIT 10';
    }
    
    // Collection/table fields
    if (name === 'collection' || name === 'table') {
      return 'users';
    }
    
    // Use placeholder if available
    if (prop.placeholder) {
      return prop.placeholder;
    }
    
    return '';
  }
  
  /**
   * Get example for a specific use case
   */
  static getTaskExample(nodeType: string, task: string): Record<string, any> | undefined {
    const examples = this.NODE_EXAMPLES[nodeType];
    if (!examples) return undefined;
    
    // Map common tasks to example types
    const taskMap: Record<string, keyof NodeExamples> = {
      'basic': 'minimal',
      'simple': 'minimal',
      'typical': 'common',
      'standard': 'common',
      'complex': 'advanced',
      'full': 'advanced'
    };
    
    const exampleType = taskMap[task] || 'common';
    return examples[exampleType] || examples.minimal;
  }
}