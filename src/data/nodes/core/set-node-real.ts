import { NodeTypeInfo } from '../../node-types.js';

export const setNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.set',
  displayName: 'Edit Fields (Set)',
  description: 'Add, remove, and edit the data. Set field values, rename fields, or restructure your data.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'manual',
      description: 'How to set the data',
      options: [
        { name: 'Manual', value: 'manual', description: 'Set fields manually' },
        { name: 'Expression', value: 'expression', description: 'Use JavaScript expressions' }
      ]
    },
    {
      name: 'duplicateItem',
      displayName: 'Include Input Fields',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include all input fields in the output',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      }
    },
    {
      name: 'assignments',
      displayName: 'Assignments',
      type: 'fixedCollection',
      required: true,
      default: { assignments: [] },
      description: 'Fields to set or modify',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      },
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      options: [
        {
          name: 'assignments',
          displayName: 'Assignment',
          values: [
            {
      name: 'id',

      displayName: 'ID',
      type: 'string',
      required: false,
      default: '={{$randomString(8)}}',
              description: 'Unique ID for this assignment'
            },
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              required: true,
              default: '',
              description: 'Name of the field to set',
              placeholder: 'fieldName'
            },
            {
              name: 'type',
              displayName: 'Type',
              type: 'options',
              required: true,
              default: 'string',
              description: 'Type of data to set',
              options: [
                { name: 'String', value: 'string' },
                { name: 'Number', value: 'number' },
                { name: 'Boolean', value: 'boolean' },
                { name: 'Array', value: 'array' },
                { name: 'Object', value: 'object' },
                { name: 'Date & Time', value: 'dateTime' }
              ]
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: false,
              default: '',
              description: 'Value to set for the field',
              displayOptions: {
                show: {
                  type: ['string']
                }
              },
              placeholder: '={{$json.sourceField}}'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'number',
              required: false,
              default: 0,
              description: 'Number value to set',
              displayOptions: {
                show: {
                  type: ['number']
                }
              }
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'boolean',
              required: false,
              default: false,
              description: 'Boolean value to set',
              displayOptions: {
                show: {
                  type: ['boolean']
                }
              }
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: false,
              default: '',
              description: 'Array value (JSON format)',
              displayOptions: {
                show: {
                  type: ['array']
                }
              },
              placeholder: '=["item1", "item2", "item3"]'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: false,
              default: '',
              description: 'Object value (JSON format)',
              displayOptions: {
                show: {
                  type: ['object']
                }
              },
              placeholder: '={"key": "value", "nested": {"data": true}}'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'dateTime',
              required: false,
              default: '',
              description: 'Date and time value',
              displayOptions: {
                show: {
                  type: ['dateTime']
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'jsCode',
      displayName: 'JavaScript Code',
      type: 'string',
      required: true,
      default: `// Access input data
const inputData = $input.all();

// Transform data
return inputData.map(item => ({
  json: {
    ...item.json,
    newField: 'new value',
    timestamp: new Date().toISOString()
  }
}));`,
      description: 'JavaScript code to transform the data',
      displayOptions: {
        show: {
          mode: ['expression']
        }
      },
      typeOptions: {
        codeAutocomplete: 'javascript',
        rows: 10
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional options',
      options: [
        {
      name: 'dotNotation',

      displayName: 'Dot Notation',
      type: 'boolean',
      required: false,
          description: 'Use dot notation for nested fields (e.g., user.name)'
    },
        {
      name: 'ignoreConversionErrors',

      displayName: 'Ignore Conversion Errors',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Continue processing even if value conversion fails'
    },
        {
      name: 'outputKey',

      displayName: 'Output Key',
      type: 'string',
      required: false,
      default: '',
          description: 'Key to wrap the output data in (leave empty for no wrapping)'
    }
      ]
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The modified data'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: true,
  triggerNode: false,
  webhookSupport: false,
  version: [1, 2, 3, 4],
  defaults: {
    name: 'Edit Fields',
    mode: 'manual',
    duplicateItem: true,
    assignments: {
      assignments: [
        {
          id: '{{$randomString(8)}}',
          name: 'newField',
          type: 'string',
          value: '={{$json.existingField}}'
        }
      ]
    }
  },
  aliases: ['set', 'edit', 'modify', 'fields', 'data', 'transform'],
  subtitle: '={{$parameter["mode"] === "manual" ? $parameter["assignments"]["assignments"].length + " assignment(s)" : "expression"}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'low',
    commonPatterns: [
      'Add calculated fields to data',
      'Rename or restructure data fields',
      'Add timestamps or metadata',
      'Format data for external APIs',
      'Convert data types',
      'Clean and normalize data',
      'Merge multiple data sources',
      'Extract nested properties'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Property access error', 'Type conversion error'],
      documentation: 'Errors typically occur due to invalid expressions or accessing non-existent properties'
    }
  },
  examples: [
    {
      name: 'Add Timestamp and ID',
      description: 'Add current timestamp and unique ID to each data item',
      workflow: {
        nodes: [
          {
            name: 'Add Metadata',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              duplicateItem: true,
              assignments: {
                assignments: [
                  {
                    id: 'timestamp_field',
                    name: 'timestamp',
                    type: 'string',
                    value: '={{$now}}'
                  },
                  {
                    id: 'id_field',
                    name: 'id',
                    type: 'string',
                    value: '={{$randomString(10)}}'
                  },
                  {
                    id: 'processed_field',
                    name: 'processed',
                    type: 'boolean',
                    value: true
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Transform Data Structure',
      description: 'Restructure data using assignments without including input fields',
      workflow: {
        nodes: [
          {
            name: 'Restructure Data',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              duplicateItem: false,
              assignments: {
                assignments: [
                  {
                    id: 'fullname_field',
                    name: 'fullName',
                    type: 'string',
                    value: '={{$json.firstName}} {{$json.lastName}}'
                  },
                  {
                    id: 'email_field',
                    name: 'email',
                    type: 'string',
                    value: '={{$json.emailAddress.toLowerCase()}}'
                  },
                  {
                    id: 'profile_field',
                    name: 'profile',
                    type: 'object',
                    value: '={"age": {{$json.age}}, "department": "{{$json.dept}}"}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Complex Data Transformation',
      description: 'Use JavaScript expression mode for complex transformations',
      workflow: {
        nodes: [
          {
            name: 'Transform with JS',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'expression',
              jsCode: `// Get all input items
const items = $input.all();

// Transform each item
return items.map(item => {
  const data = item.json;
  
  // Complex transformation logic
  const processedData = {
    // Original data
    ...data,
    
    // Calculated fields
    fullName: \`\${data.firstName || ''} \${data.lastName || ''}\`.trim(),
    isAdult: (data.age || 0) >= 18,
    emailDomain: data.email ? data.email.split('@')[1] : null,
    
    // Metadata
    processedAt: new Date().toISOString(),
    source: 'n8n-workflow',
    
    // Conditional logic
    status: data.active ? 'active' : 'inactive',
    priority: data.urgent ? 'high' : data.important ? 'medium' : 'low',
    
    // Data cleaning
    phone: data.phone ? data.phone.replace(/[^0-9]/g, '') : null,
    tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : []
  };
  
  return {
    json: processedData
  };
});`
            }
          }
        ]
      }
    },
    {
      name: 'API Data Preparation',
      description: 'Prepare data for external API with specific field structure',
      workflow: {
        nodes: [
          {
            name: 'Prepare for API',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              duplicateItem: false,
              assignments: {
                assignments: [
                  {
                    id: 'api_id',
                    name: 'user_id',
                    type: 'string',
                    value: '={{$json.id}}'
                  },
                  {
                    id: 'api_action',
                    name: 'action',
                    type: 'string',
                    value: 'update_profile'
                  },
                  {
                    id: 'api_data',
                    name: 'payload',
                    type: 'object',
                    value: '={"name": "{{$json.name}}", "email": "{{$json.email}}", "lastUpdated": "{{$now}}"}'
                  },
                  {
                    id: 'api_metadata',
                    name: 'metadata',
                    type: 'object',
                    value: '={"source": "n8n", "version": "1.0", "requestId": "{{$randomString(12)}}"}'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
};