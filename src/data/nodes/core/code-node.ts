/**
 * # Code
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Code node to write custom JavaScript or Python and run it as a step in your workflow.
 * The Code node replaces the Function and Function Item nodes from version 0.198.0.
 * 
 * ## Key Features
 * 
 * - **Dual Language Support**: JavaScript (Node.js) and Python (Pyodide/WebAssembly)
 * - **Two Execution Modes**: Run once for all items or once per item
 * - **Built-in Methods**: Access to n8n's built-in variables and methods ($input, $vars, etc.)
 * - **Promise Support**: Async/await and Promise handling in JavaScript
 * - **Console Logging**: Debug with console.log() output visible in browser
 * - **External Libraries**: Limited npm modules (self-hosted) or crypto/moment (Cloud)
 * - **AI Assistance**: ChatGPT integration for code generation (Cloud only)
 * - **Keyboard Shortcuts**: Full code editor with autocomplete and multi-cursor support
 * 
 * ## Language Support
 * 
 * ### JavaScript
 * - Full Node.js support with built-in modules
 * - Promise and async/await support
 * - Console logging for debugging
 * - External npm modules (self-hosted only)
 * - Built-in crypto and moment modules (Cloud)
 * 
 * ### Python
 * - Pyodide (CPython to WebAssembly port)
 * - Limited to Pyodide-included packages
 * - Slower execution due to compilation steps
 * - Built-in methods with underscore prefix (_input, _vars)
 * 
 * ## Execution Modes
 * 
 * - **Run Once for All Items**: Execute code once with all input items
 * - **Run Once for Each Item**: Execute code separately for each input item
 * 
 * ## Limitations
 * 
 * - Cannot access file system (use Read/Write File From Disk node)
 * - Cannot make HTTP requests (use HTTP Request node)
 * - External modules limited on n8n Cloud
 * - Python slower than JavaScript due to compilation
 * 
 * ## Use Cases
 * 
 * - Custom data transformations and calculations
 * - Complex business logic implementation
 * - Data filtering, sorting, and aggregation
 * - API response processing and formatting
 * - Custom validation and data quality checks
 * - Mathematical computations and statistical analysis
 * - String manipulation and text processing
 * - Date/time calculations and formatting
 */

import { NodeTypeInfo } from '../../node-types.js';

export const codeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.code',
  displayName: 'Code',
  description: 'Write custom JavaScript or Python code to transform data, implement business logic, and perform complex calculations.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',

  properties: [
    {
      name: 'language',
      displayName: 'Language',
      type: 'options',
      required: true,
      default: 'javaScript',
      description: 'Programming language to execute',
      options: [
        {
          name: 'JavaScript',
          value: 'javaScript',
          description: 'Execute JavaScript code'
        },
        {
          name: 'Python',
          value: 'python',
          description: 'Execute Python code'
        }
      ]
    },
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'runOnceForAllItems',
      description: 'How to execute the code',
      options: [
        {
          name: 'Run Once for All Items',
          value: 'runOnceForAllItems',
          description: 'Execute code once with all input items'
        },
        {
          name: 'Run Once for Each Item',
          value: 'runOnceForEachItem',
          description: 'Execute code separately for each input item'
        }
      ]
    },
    {
      name: 'jsCode',
      displayName: 'JavaScript Code',
      type: 'string',
      required: true,
      default: `// Loop over input items and add a new field
for (const item of $input.all()) {
  item.json.myNewField = 'Hello World!';
}

return $input.all();`,
      description: 'JavaScript code to execute',
      typeOptions: {
        rows: 10
      },
      displayOptions: {
        show: {
          language: ['javaScript']
        }
      }
    },
    {
      name: 'pythonCode',
      displayName: 'Python Code',
      type: 'string',
      required: true,
      default: `# Loop over input items and add a new field
for item in _input.all():
    item['json']['myNewField'] = 'Hello World!'

return _input.all()`,
      description: 'Python code to execute',
      typeOptions: {
        rows: 10
      },
      displayOptions: {
        show: {
          language: ['python']
        }
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional execution options',
      options: [
        {
          name: 'continueOnFail',
          displayName: 'Continue on Fail',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Continue workflow execution even if this node fails'
        },
        {
          name: 'includeItems',
          displayName: 'Include Items',
          type: 'multiOptions',
          required: false,
          default: ['json'],
          description: 'What data to include in the execution context',
          options: [
            { name: 'JSON', value: 'json' },
            { name: 'Binary', value: 'binary' },
            { name: 'Headers', value: 'headers' }
          ]
        },
        {
          name: 'timeout',
          displayName: 'Timeout',
          type: 'number',
          required: false,
          default: 30,
          description: 'Maximum execution time in seconds',
          typeOptions: {
            minValue: 1,
            maxValue: 300
          }
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from code execution'
    }
  ],

  credentials: [],
  regularNode: true,
  codeable: true,
  
  version: [1, 2],
  defaults: {
    name: 'Code'
  },

  aliases: ['code', 'javascript', 'python', 'script', 'function', 'custom'],

  examples: [
    {
      name: 'Basic Data Transformation',
      description: 'Transform input data by adding calculated fields',
      workflow: {
        nodes: [
          {
            name: 'Transform Data',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javaScript',
              mode: 'runOnceForAllItems',
              jsCode: `// Add calculated fields to each item
for (const item of $input.all()) {
  item.json.fullName = \`\${item.json.firstName} \${item.json.lastName}\`;
  item.json.isAdult = item.json.age >= 18;
  item.json.timestamp = new Date().toISOString();
}

return $input.all();`
            }
          }
        ]
      }
    },
    {
      name: 'Data Filtering and Sorting',
      description: 'Filter and sort data based on custom criteria',
      workflow: {
        nodes: [
          {
            name: 'Filter and Sort',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javaScript',
              mode: 'runOnceForAllItems',
              jsCode: `// Filter items and sort by price
const items = $input.all();

// Filter items with price > 100
const filteredItems = items.filter(item => item.json.price > 100);

// Sort by price descending
filteredItems.sort((a, b) => b.json.price - a.json.price);

return filteredItems;`
            }
          }
        ]
      }
    },
    {
      name: 'API Response Processing',
      description: 'Process complex API responses with nested data',
      workflow: {
        nodes: [
          {
            name: 'Process API Response',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javaScript',
              mode: 'runOnceForEachItem',
              jsCode: `// Extract and flatten nested API data
const item = $input.item();
const result = [];

// Process nested orders
if (item.json.orders && Array.isArray(item.json.orders)) {
  for (const order of item.json.orders) {
    result.push({
      json: {
        customerId: item.json.id,
        customerName: item.json.name,
        orderId: order.id,
        orderDate: order.date,
        total: order.total,
        status: order.status
      }
    });
  }
}

return result;`
            }
          }
        ]
      }
    },
    {
      name: 'Python Data Analysis',
      description: 'Perform data analysis and calculations using Python',
      workflow: {
        nodes: [
          {
            name: 'Data Analysis',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'python',
              mode: 'runOnceForAllItems',
              pythonCode: `import statistics
import json

# Get all input items
items = _input.all()

# Extract values for analysis
values = [item['json']['value'] for item in items if 'value' in item['json']]

# Calculate statistics
stats = {
    'count': len(values),
    'sum': sum(values),
    'average': statistics.mean(values) if values else 0,
    'median': statistics.median(values) if values else 0,
    'min': min(values) if values else 0,
    'max': max(values) if values else 0
}

# Return results
return [{'json': stats}]`
            }
          }
        ]
      }
    },
    {
      name: 'Custom Validation Logic',
      description: 'Implement complex validation rules',
      workflow: {
        nodes: [
          {
            name: 'Custom Validation',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javaScript',
              mode: 'runOnceForEachItem',
              jsCode: `// Custom validation logic
const item = $input.item();
const data = item.json;

// Validation rules
const validations = {
  hasEmail: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(data.email || ''),
  hasPhone: /^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$/.test(data.phone || ''),
  hasName: (data.name || '').length >= 2,
  isAdult: (data.age || 0) >= 18
};

// Add validation results
data.validations = validations;
data.isValid = Object.values(validations).every(v => v);
data.validationErrors = Object.entries(validations)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

return [{ json: data }];`
            }
          }
        ]
      }
    },
    {
      name: 'Date and Time Processing',
      description: 'Advanced date and time calculations',
      workflow: {
        nodes: [
          {
            name: 'Date Processing',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javaScript',
              mode: 'runOnceForEachItem',
              jsCode: `// Date and time processing
const item = $input.item();
const data = item.json;

// Parse input date
const inputDate = new Date(data.date);
const now = new Date();

// Calculate various date values
data.processedDate = {
  iso: inputDate.toISOString(),
  unix: Math.floor(inputDate.getTime() / 1000),
  dayOfWeek: inputDate.toLocaleDateString('en-US', { weekday: 'long' }),
  month: inputDate.toLocaleDateString('en-US', { month: 'long' }),
  year: inputDate.getFullYear(),
  quarter: Math.ceil((inputDate.getMonth() + 1) / 3),
  isWeekend: [0, 6].includes(inputDate.getDay()),
  daysFromNow: Math.ceil((inputDate - now) / (1000 * 60 * 60 * 24)),
  isOverdue: inputDate < now
};

return [{ json: data }];`
            }
          }
        ]
      }
    }
  ],

  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'high',
    commonPatterns: [
      'Transform and manipulate JSON data structures',
      'Filter and sort large datasets',
      'Process complex API responses',
      'Implement custom validation logic',
      'Perform mathematical calculations',
      'Handle date and time operations',
      'Parse and format strings',
      'Merge data from multiple sources',
      'Create custom business logic',
      'Data type conversions and formatting'
    ],
    errorHandling: {
      retryableErrors: ['Timeout', 'Memory limit exceeded'],
      nonRetryableErrors: ['Syntax error', 'Runtime error', 'Type error'],
      documentation: 'Code node errors typically occur due to syntax errors, runtime exceptions, or timeout issues. Use try-catch blocks for error handling.'
    },
    prerequisites: [
      'Basic JavaScript or Python knowledge',
      'Understanding of n8n data structure',
      'Familiarity with JSON manipulation'
    ]
  },

  usageNotes: 'The Code node allows you to execute custom JavaScript or Python code within your workflow. Use it for complex data transformations, calculations, and custom logic that cannot be achieved with other nodes. Remember to handle errors appropriately and consider performance implications.',
  integrationGuide: 'Access input data using $input.all() or $input.item() in JavaScript, or _input.all() in Python. Return data in the same format as input. Use console.log() for debugging. Consider using "Run Once for Each Item" mode for item-by-item processing or "Run Once for All Items" for batch operations.'
};

export default codeNode;
