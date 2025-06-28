import { NodeTypeInfo } from '../../node-types.js';

export const functionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.function',
  displayName: 'Function',
  description: 'Execute custom JavaScript code to process workflow data. Access all input data, perform calculations, call external APIs, and return processed results.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  properties: [
    {
      name: 'functionCode',
      displayName: 'JavaScript Code',
      type: 'string',
      required: true,
      default: `// Access input data
const items = $input.all();

// Process each item
for (const item of items) {
  // Modify item data
  item.json.processedAt = new Date().toISOString();
  item.json.processed = true;
}

// Return modified items
return items;`,
      description: 'JavaScript code to execute. Access input data via $input and return processed data.',
      typeOptions: {
        codeAutocomplete: 'javascript'
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional function options',
      options: [
        {
      name: 'continueOnFail',
      displayName: 'Continue on Fail',
      type: 'boolean',
      required: false,
          description: 'Continue workflow even if function throws an error'
    },
        {
      name: 'timeout',
      displayName: 'Timeout (seconds)',
      type: 'number',
      required: false,
      default: 10,
          description: 'Maximum execution time for the function',
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
      description: 'Processed data from JavaScript function'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: true,
  triggerNode: false,
  defaults: {
    functionCode: `// Process input data
const items = $input.all();

// Transform each item
return items.map(item => ({
  json: {
    ...item.json,
    processedAt: new Date().toISOString()
  }
}));`
  },
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'high',
    commonPatterns: [
      'Complex data transformations',
      'Custom calculations and logic',
      'External API calls',
      'Data validation and cleaning',
      'Format conversions',
      'Advanced text processing',
      'Mathematical operations',
      'Custom business logic'
    ],
    prerequisites: [
      'JavaScript programming knowledge',
      'Understanding of n8n data structure',
      'Familiarity with n8n helper functions'
    ],
    errorHandling: {
      retryableErrors: ['Timeout error'],
      nonRetryableErrors: ['Syntax error', 'Reference error', 'Type error'],
      documentation: 'Function node errors are typically JavaScript runtime errors. Use try-catch blocks for error handling.'
    }
  },
  examples: [
    {
      name: 'Data Transformation',
      description: 'Transform and enrich input data',
      workflow: {
        nodes: [
          {
            name: 'Transform Data',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: `
// Get all input items
const items = $input.all();

// Transform each item
return items.map(item => {
  const data = item.json;
  
  return {
    json: {
      id: data.id,
      fullName: \`\${data.firstName} \${data.lastName}\`,
      email: data.email.toLowerCase(),
      isActive: data.status === 'active',
      joinedDate: new Date(data.created).toISOString(),
      age: new Date().getFullYear() - new Date(data.birthDate).getFullYear(),
      processedAt: new Date().toISOString()
    }
  };
});`
            }
          }
        ]
      }
    },
    {
      name: 'API Data Processing',
      description: 'Process API response data with custom logic',
      workflow: {
        nodes: [
          {
            name: 'Process API Data',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: `
const items = $input.all();
const processedItems = [];

for (const item of items) {
  const data = item.json;
  
  // Extract nested data
  if (data.results && Array.isArray(data.results)) {
    for (const result of data.results) {
      processedItems.push({
        json: {
          id: result.id,
          title: result.title,
          score: result.relevance_score || 0,
          category: result.category || 'uncategorized',
          extractedAt: new Date().toISOString(),
          source: 'api_processing'
        }
      });
    }
  }
}

return processedItems;`
            }
          }
        ]
      }
    },
    {
      name: 'Data Validation',
      description: 'Validate and filter data with custom rules',
      workflow: {
        nodes: [
          {
            name: 'Validate Data',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: `
const items = $input.all();
const validItems = [];
const errors = [];

for (const item of items) {
  const data = item.json;
  const validationErrors = [];
  
  // Validation rules
  if (!data.email || !data.email.includes('@')) {
    validationErrors.push('Invalid email format');
  }
  
  if (!data.name || data.name.length < 2) {
    validationErrors.push('Name must be at least 2 characters');
  }
  
  if (data.age && (data.age < 0 || data.age > 150)) {
    validationErrors.push('Age must be between 0 and 150');
  }
  
  if (validationErrors.length === 0) {
    validItems.push({
      json: {
        ...data,
        validatedAt: new Date().toISOString()
      }
    });
  } else {
    errors.push({
      json: {
        originalData: data,
        errors: validationErrors,
        rejectedAt: new Date().toISOString()
      }
    });
  }
}

// Return valid items (you could also output errors to a second output)
return validItems;`
            }
          }
        ]
      }
    },
    {
      name: 'Mathematical Calculations',
      description: 'Perform complex calculations on numeric data',
      workflow: {
        nodes: [
          {
            name: 'Calculate Statistics',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: `
const items = $input.all();
const values = items.map(item => item.json.value).filter(v => typeof v === 'number');

if (values.length === 0) {
  return [{ json: { error: 'No numeric values found' } }];
}

// Calculate statistics
const sum = values.reduce((acc, val) => acc + val, 0);
const mean = sum / values.length;
const sortedValues = [...values].sort((a, b) => a - b);
const median = values.length % 2 === 0 
  ? (sortedValues[values.length / 2 - 1] + sortedValues[values.length / 2]) / 2
  : sortedValues[Math.floor(values.length / 2)];

const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
const stdDev = Math.sqrt(variance);

return [{
  json: {
    count: values.length,
    sum: sum,
    mean: mean,
    median: median,
    min: Math.min(...values),
    max: Math.max(...values),
    standardDeviation: stdDev,
    variance: variance,
    calculatedAt: new Date().toISOString()
  }
}];`
            }
          }
        ]
      }
    }
  ]
};