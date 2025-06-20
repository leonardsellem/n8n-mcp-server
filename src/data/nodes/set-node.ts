import { NodeTypeInfo } from '../node-types.js';

export const setNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.set',
  displayName: 'Set',
  description: 'Modify, add, or remove data from your workflow. Transform data fields, add new properties, rename fields, or restructure your data format.',
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
        { name: 'Manual', value: 'manual', description: 'Manually define each field' },
        { name: 'Expression', value: 'expression', description: 'Use JavaScript expressions' }
      ]
    },
    {
      name: 'keepOnlySet',
      displayName: 'Keep Only Set',
      type: 'boolean',
      required: false,
      default: false,
      description: 'If set to true, only the set fields will be kept and all others removed',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      }
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'collection',
      required: true,
      default: {},
      description: 'The fields to set',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      },
      options: [
        {
          name: 'values',
          displayName: 'Values',
          type: 'fixedCollection',
          description: 'The fields to set',
          default: {},
          options: [
            {
              name: 'string',
              displayName: 'String',
              values: [
                {
                  name: 'name',
                  displayName: 'Name',
                  type: 'string',
                  default: '',
                  description: 'Name of the field to set',
                  placeholder: 'propertyName'
                },
                {
                  name: 'value',
                  displayName: 'Value',
                  type: 'string',
                  default: '',
                  description: 'Value to set for the field',
                  placeholder: '={{$json.originalField}}'
                }
              ]
            },
            {
              name: 'number',
              displayName: 'Number',
              values: [
                {
                  name: 'name',
                  displayName: 'Name',
                  type: 'string',
                  default: '',
                  description: 'Name of the field to set'
                },
                {
                  name: 'value',
                  displayName: 'Value',
                  type: 'number',
                  default: 0,
                  description: 'Number value to set'
                }
              ]
            },
            {
              name: 'boolean',
              displayName: 'Boolean',
              values: [
                {
                  name: 'name',
                  displayName: 'Name',
                  type: 'string',
                  default: '',
                  description: 'Name of the field to set'
                },
                {
                  name: 'value',
                  displayName: 'Value',
                  type: 'boolean',
                  default: false,
                  description: 'Boolean value to set'
                }
              ]
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
      default: 'return {\n  newField: $input.first().json.originalField,\n  timestamp: new Date().toISOString()\n};',
      description: 'JavaScript code to transform the data',
      displayOptions: {
        show: {
          mode: ['expression']
        }
      },
      typeOptions: {
        codeAutocomplete: 'javascript'
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      options: [
        {
          name: 'dotNotation',
          displayName: 'Dot Notation',
          type: 'boolean',
          default: true,
          description: 'Use dot notation for nested fields (e.g., user.name)'
        },
        {
          name: 'ignoreConversionErrors',
          displayName: 'Ignore Conversion Errors',
          type: 'boolean',
          default: false,
          description: 'Continue processing even if value conversion fails'
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
      description: 'The modified data'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: true,
  triggerNode: false,
  defaults: {
    mode: 'manual',
    keepOnlySet: false,
    fields: {
      values: [
        {
          name: 'newField',
          value: '={{$json.existingField}}'
        }
      ]
    }
  },
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'low',
    commonPatterns: [
      'Add calculated fields to data',
      'Rename or restructure data fields',
      'Add timestamps or metadata',
      'Format data for external APIs',
      'Convert data types',
      'Clean and normalize data'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Property access error'],
      documentation: 'Errors typically occur due to invalid expressions or accessing non-existent properties'
    }
  },
  examples: [
    {
      name: 'Add Timestamp',
      description: 'Add current timestamp to data',
      workflow: {
        nodes: [
          {
            name: 'Add Timestamp',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'timestamp',
                    value: '={{new Date().toISOString()}}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Rename Fields',
      description: 'Rename data fields and keep only selected ones',
      workflow: {
        nodes: [
          {
            name: 'Rename Fields',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              keepOnlySet: true,
              fields: {
                values: [
                  {
                    name: 'fullName',
                    value: '={{$json.first_name}} {{$json.last_name}}'
                  },
                  {
                    name: 'email',
                    value: '={{$json.email_address}}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Data Transformation with Expression',
      description: 'Use JavaScript to transform complex data structures',
      workflow: {
        nodes: [
          {
            name: 'Transform Data',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'expression',
              jsCode: `
// Transform and calculate data
const input = $input.first().json;
return {
  id: input.user_id,
  profile: {
    name: input.name.trim().toLowerCase(),
    age: parseInt(input.age),
    isAdult: parseInt(input.age) >= 18
  },
  processedAt: new Date().toISOString(),
  source: 'automated'
};`
            }
          }
        ]
      }
    },
    {
      name: 'Conditional Field Setting',
      description: 'Set fields based on conditions',
      workflow: {
        nodes: [
          {
            name: 'Conditional Set',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'priority',
                    value: '={{$json.urgent === true ? "high" : "normal"}}'
                  },
                  {
                    name: 'category',
                    value: '={{$json.type || "general"}}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'API Data Preparation',
      description: 'Prepare data for external API calls',
      workflow: {
        nodes: [
          {
            name: 'API Prep',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              keepOnlySet: true,
              fields: {
                values: [
                  {
                    name: 'user_id',
                    value: '={{$json.id}}'
                  },
                  {
                    name: 'action',
                    value: 'update_profile'
                  },
                  {
                    name: 'data',
                    value: '={{JSON.stringify({name: $json.name, email: $json.email})}}'
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