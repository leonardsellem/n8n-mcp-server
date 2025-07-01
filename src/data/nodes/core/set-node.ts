/**
 * # Edit Fields (Set)
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Edit Fields node to set workflow data. This node can set new data as well as overwrite data that already exists. 
 * This node is crucial in workflows which expect incoming data from previous nodes, such as when inserting values to Google Sheets or databases.
 * 
 * ## Key Features
 * 
 * - **Two Modes**: Manual Mapping (GUI) and JSON Output (code)
 * - **Drag & Drop Support**: GUI interface for easy field mapping
 * - **Expression Support**: Dynamic field values using n8n expressions
 * - **Dot Notation**: Create nested objects automatically (user.name → {user: {name: value}})
 * - **Type Conversion**: Automatic data type handling with error tolerance
 * - **Binary Data**: Optional inclusion of binary data in output
 * - **Field Filtering**: Keep only set fields or include all input data
 * - **Fixed/Expression Toggle**: Switch between static values and dynamic expressions
 * 
 * ## Modes
 * 
 * ### Manual Mapping
 * - Use GUI with drag and drop from INPUT panel
 * - Set field names and values individually
 * - Fixed/Expression toggle for each field
 * - Support for dot notation to create nested structures
 * 
 * ### JSON Output
 * - Write JSON directly with expressions
 * - Support for arrays and complex nested structures
 * - Full JavaScript expression support within JSON
 * - Control over input data inclusion
 * 
 * ## Use Cases
 * 
 * - Transform data for API integrations
 * - Add calculated fields and timestamps
 * - Rename or restructure data fields
 * - Format data for databases or spreadsheets
 * - Create complex nested object structures
 * - Clean and normalize incoming data
 * - Conditional field mapping based on input values
 * - Data enrichment and augmentation
 */

import { NodeTypeInfo } from '../../node-types.js';

export const setNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.set',
  displayName: 'Edit Fields (Set)',
  description: 'Set workflow data by creating new fields or overwriting existing ones. Essential for data transformation and API preparation.',
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
        { 
          name: 'Manual Mapping', 
          value: 'manual', 
          description: 'Edit fields using the GUI with drag and drop support' 
        },
        { 
          name: 'JSON Output', 
          value: 'jsonOutput', 
          description: 'Write JSON that n8n adds to the input data' 
        }
      ]
    },
    {
      name: 'fields',
      displayName: 'Fields to Set',
      type: 'fixedCollection',
      required: true,
      default: {},
      description: 'The fields to set in the data',
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
          name: 'values',
          displayName: 'Values',
          values: [
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
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: true,
              default: '',
              description: 'Value to set for the field',
              placeholder: '={{$json.originalField}}'
            }
          ]
        }
      ]
    },
    {
      name: 'jsonOutput',
      displayName: 'JSON Output',
      type: 'json',
      required: true,
      default: '{\n  "newField": "={{ $json.existingField }}",\n  "timestamp": "={{ new Date().toISOString() }}"\n}',
      description: 'JSON to add to the input data. Use expressions to access input values.',
      displayOptions: {
        show: {
          mode: ['jsonOutput']
        }
      },
      typeOptions: {
        codeAutocomplete: 'json'
      }
    },
    {
      name: 'keepOnlySet',
      displayName: 'Keep Only Set Fields',
      type: 'boolean',
      required: false,
      default: false,
      description: 'If enabled, discard any input data not used in Fields to Set',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      }
    },
    {
      name: 'includeInOutput',
      displayName: 'Include in Output',
      type: 'options',
      required: false,
      default: 'all',
      description: 'Choose which input data to include in the output',
      displayOptions: {
        show: {
          mode: ['jsonOutput']
        }
      },
      options: [
        { name: 'All Input Fields', value: 'all' },
        { name: 'No Input Fields', value: 'none' },
        { name: 'Selected Input Fields', value: 'selected' }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for the node',
      options: [
        {
          name: 'includeBinaryData',
          displayName: 'Include Binary Data',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Whether to include binary data in the output'
        },
        {
          name: 'ignoreConversionErrors',
          displayName: 'Ignore Type Conversion Errors',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Ignore data type errors when mapping fields (Manual Mapping only)',
          displayOptions: {
            show: {
              '/mode': ['manual']
            }
          }
        },
        {
          name: 'dotNotation',
          displayName: 'Support Dot Notation',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Use dot notation for nested fields (e.g., user.name creates nested objects)'
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
      description: 'The modified data with set fields'
    }
  ],

  credentials: [],
  regularNode: true,
  codeable: true,
  
  version: [1, 2, 3, 3.1, 3.2, 3.3, 3.4],
  defaults: {
    name: 'Edit Fields (Set)'
  },

  aliases: ['set', 'transform', 'map', 'modify', 'edit', 'fields'],

  examples: [
    {
      name: 'Add Timestamp',
      description: 'Add current timestamp to incoming data',
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
                    value: '={{ new Date().toISOString() }}'
                  },
                  {
                    name: 'processedBy',
                    value: 'n8n-workflow'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Rename and Transform Fields',
      description: 'Rename fields and keep only selected data',
      workflow: {
        nodes: [
          {
            name: 'Transform Data',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              keepOnlySet: true,
              fields: {
                values: [
                  {
                    name: 'fullName',
                    value: '={{ $json.firstName }} {{ $json.lastName }}'
                  },
                  {
                    name: 'email',
                    value: '={{ $json.emailAddress }}'
                  },
                  {
                    name: 'userId',
                    value: '={{ $json.id }}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Complex JSON Transformation',
      description: 'Use JSON mode to create complex nested structures',
      workflow: {
        nodes: [
          {
            name: 'Create User Profile',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'jsonOutput',
              includeInOutput: 'selected',
              jsonOutput: `{
  "user": {
    "id": "{{ $json.id }}",
    "profile": {
      "name": "{{ $json.name }}",
      "email": "{{ $json.email }}",
      "age": {{ $json.age }},
      "isActive": {{ $json.status === 'active' }}
    },
    "metadata": {
      "createdAt": "{{ $json.created }}",
      "updatedAt": "{{ new Date().toISOString() }}",
      "source": "api"
    }
  },
  "tags": ["{{ $json.department }}", "verified"]
}`
            }
          }
        ]
      }
    },
    {
      name: 'Conditional Field Setting',
      description: 'Set fields based on conditions using expressions',
      workflow: {
        nodes: [
          {
            name: 'Conditional Fields',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'priority',
                    value: '={{ $json.urgent === true ? "high" : "normal" }}'
                  },
                  {
                    name: 'category',
                    value: '={{ $json.type || "general" }}'
                  },
                  {
                    name: 'dueDate',
                    value: '={{ $json.urgent ? new Date(Date.now() + 24*60*60*1000).toISOString() : new Date(Date.now() + 7*24*60*60*1000).toISOString() }}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Nested Object Creation',
      description: 'Create nested objects using dot notation',
      workflow: {
        nodes: [
          {
            name: 'Create Nested Structure',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'user.personal.firstName',
                    value: '={{ $json.first_name }}'
                  },
                  {
                    name: 'user.personal.lastName',
                    value: '={{ $json.last_name }}'
                  },
                  {
                    name: 'user.contact.email',
                    value: '={{ $json.email }}'
                  },
                  {
                    name: 'user.contact.phone',
                    value: '={{ $json.phone }}'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ],

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
      'Create nested object structures',
      'Conditional field mapping'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Property access error', 'JSON syntax error'],
      documentation: 'Errors typically occur due to invalid expressions, accessing non-existent properties, or malformed JSON'
    }
  },

  usageNotes: 'The Edit Fields (Set) node is essential for data transformation. Use Manual Mapping for simple field operations or JSON Output for complex transformations. Drag and drop from the INPUT panel to quickly map fields.',
  integrationGuide: 'Choose Manual Mapping for straightforward field setting with GUI support, or JSON Output for complex nested structures. Use expressions to access and transform input data dynamically.'
};

export default setNode;
