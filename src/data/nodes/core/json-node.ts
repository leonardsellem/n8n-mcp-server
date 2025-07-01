/**
 * # JSON
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Parse, manipulate, validate, and transform JSON data with advanced operations.
 * This node provides comprehensive JSON processing capabilities for complex data
 * transformations, validation, and formatting tasks in workflows.
 * 
 * ## Key Features
 * 
 * - **JSON Parsing**: Parse JSON strings into objects
 * - **JSON Stringification**: Convert objects to JSON strings
 * - **Schema Validation**: Validate JSON against schemas
 * - **Path Operations**: JSONPath queries and modifications
 * - **Deep Merging**: Merge nested JSON objects
 * - **Data Transformation**: Transform structure and values
 * - **Array Operations**: Manipulate JSON arrays
 * - **Type Conversion**: Convert between data types
 * - **Formatting**: Pretty print and minify JSON
 * - **Error Handling**: Robust error detection and recovery
 * - **Schema Generation**: Generate schemas from data
 * - **Diff Operations**: Compare JSON structures
 * 
 * ## Supported Operations
 * 
 * ### Basic Operations
 * - **Parse**: Convert JSON string to object
 * - **Stringify**: Convert object to JSON string
 * - **Validate**: Check JSON syntax and structure
 * - **Format**: Pretty print or minify JSON
 * - **Clone**: Deep copy JSON objects
 * - **Type Check**: Verify data types
 * 
 * ### Advanced Operations
 * - **JSONPath Query**: Query using JSONPath expressions
 * - **JSONPath Update**: Modify values using JSONPath
 * - **Schema Validation**: Validate against JSON Schema
 * - **Merge**: Deep merge multiple JSON objects
 * - **Transform**: Apply transformation rules
 * - **Filter**: Filter based on conditions
 * 
 * ### Array Operations
 * - **Map**: Transform array elements
 * - **Filter**: Filter array elements
 * - **Reduce**: Reduce array to single value
 * - **Sort**: Sort array elements
 * - **Group**: Group elements by criteria
 * - **Flatten**: Flatten nested arrays
 * 
 * ## Use Cases
 * 
 * - **API Data Processing**: Parse and transform API responses
 * - **Configuration Management**: Handle JSON configuration files
 * - **Data Validation**: Validate incoming JSON data
 * - **Report Generation**: Transform data for reporting
 * - **Data Migration**: Convert between JSON formats
 * - **Schema Enforcement**: Ensure data compliance
 * - **Debug Operations**: Format JSON for debugging
 * - **Data Analysis**: Extract insights from JSON data
 * - **Integration Tasks**: Transform data between systems
 * - **Webhook Processing**: Handle webhook payloads
 * - **Log Processing**: Parse and analyze JSON logs
 * - **Template Processing**: Generate dynamic JSON
 */

import { NodeTypeInfo } from '../../node-types.js';

export const jsonNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.json',
  displayName: 'JSON',
  description: 'Parse, manipulate, validate, and transform JSON data',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'parse',
      description: 'The JSON operation to perform',
      options: [
        {
          name: 'Parse',
          value: 'parse',
          description: 'Parse JSON string to object'
        },
        {
          name: 'Stringify',
          value: 'stringify',
          description: 'Convert object to JSON string'
        },
        {
          name: 'Validate',
          value: 'validate',
          description: 'Validate JSON syntax and structure'
        },
        {
          name: 'JSONPath Query',
          value: 'jsonpath',
          description: 'Query JSON using JSONPath expressions'
        },
        {
          name: 'Merge',
          value: 'merge',
          description: 'Deep merge JSON objects'
        },
        {
          name: 'Transform',
          value: 'transform',
          description: 'Transform JSON structure'
        },
        {
          name: 'Format',
          value: 'format',
          description: 'Format JSON (pretty print or minify)'
        },
        {
          name: 'Schema Validate',
          value: 'schemaValidate',
          description: 'Validate against JSON Schema'
        }
      ]
    },
    {
      name: 'jsonInput',
      displayName: 'JSON Input',
      type: 'string',
      required: true,
      default: '',
      description: 'JSON data to process',
      displayOptions: {
        show: {
          operation: ['parse', 'validate', 'format', 'jsonpath', 'schemaValidate']
        }
      },
      placeholder: '{"key": "value"}'
    },
    {
      name: 'objectInput',
      displayName: 'Object Input',
      type: 'string',
      required: true,
      default: '',
      description: 'Object to convert to JSON',
      displayOptions: {
        show: {
          operation: ['stringify']
        }
      },
      placeholder: 'Use expression: {{$json}}'
    },
    {
      name: 'jsonPathExpression',
      displayName: 'JSONPath Expression',
      type: 'string',
      required: true,
      default: '$',
      description: 'JSONPath expression to query',
      displayOptions: {
        show: {
          operation: ['jsonpath']
        }
      },
      placeholder: '$.users[*].name'
    },
    {
      name: 'mergeObjects',
      displayName: 'Objects to Merge',
      type: 'fixedCollection',
      required: true,
      default: {},
      description: 'JSON objects to merge',
      displayOptions: {
        show: {
          operation: ['merge']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Object',
          values: [
            {
              name: 'json',
              displayName: 'JSON Object',
              type: 'string',
              required: true,
              default: '',
              description: 'JSON object to merge',
              placeholder: '{"key": "value"}'
            }
          ]
        }
      ]
    },
    {
      name: 'transformRules',
      displayName: 'Transform Rules',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Transformation rules to apply',
      displayOptions: {
        show: {
          operation: ['transform']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Rule',
          values: [
            {
              name: 'source',
              displayName: 'Source Path',
              type: 'string',
              required: true,
              default: '',
              description: 'JSONPath to source field',
              placeholder: '$.user.name'
            },
            {
              name: 'target',
              displayName: 'Target Path',
              type: 'string',
              required: true,
              default: '',
              description: 'JSONPath to target field',
              placeholder: '$.fullName'
            },
            {
              name: 'operation',
              displayName: 'Transform Operation',
              type: 'options',
              required: false,
              default: 'copy',
              description: 'Type of transformation',
              options: [
                {
                  name: 'Copy',
                  value: 'copy',
                  description: 'Copy value as-is'
                },
                {
                  name: 'Uppercase',
                  value: 'uppercase',
                  description: 'Convert to uppercase'
                },
                {
                  name: 'Lowercase',
                  value: 'lowercase',
                  description: 'Convert to lowercase'
                },
                {
                  name: 'Trim',
                  value: 'trim',
                  description: 'Remove whitespace'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'jsonSchema',
      displayName: 'JSON Schema',
      type: 'string',
      required: true,
      default: '',
      description: 'JSON Schema for validation',
      displayOptions: {
        show: {
          operation: ['schemaValidate']
        }
      },
      placeholder: '{"type": "object", "properties": {...}}'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional processing options',
      options: [
        {
          name: 'prettyPrint',
          displayName: 'Pretty Print',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Format JSON with indentation',
          displayOptions: {
            show: {
              '/operation': ['stringify', 'format']
            }
          }
        },
        {
          name: 'indentSize',
          displayName: 'Indent Size',
          type: 'number',
          required: false,
          default: 2,
          description: 'Number of spaces for indentation',
          displayOptions: {
            show: {
              prettyPrint: [true]
            }
          },
          typeOptions: {
            minValue: 1,
            maxValue: 8
          }
        },
        {
          name: 'strictValidation',
          displayName: 'Strict Validation',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Use strict JSON validation',
          displayOptions: {
            show: {
              '/operation': ['validate', 'parse', 'schemaValidate']
            }
          }
        },
        {
          name: 'allowComments',
          displayName: 'Allow Comments',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Allow JavaScript-style comments',
          displayOptions: {
            show: {
              '/operation': ['parse', 'validate']
            }
          }
        },
        {
          name: 'mergeStrategy',
          displayName: 'Merge Strategy',
          type: 'options',
          required: false,
          default: 'deep',
          description: 'How to merge objects',
          displayOptions: {
            show: {
              '/operation': ['merge']
            }
          },
          options: [
            {
              name: 'Deep',
              value: 'deep',
              description: 'Deep merge nested objects'
            },
            {
              name: 'Shallow',
              value: 'shallow',
              description: 'Shallow merge top-level only'
            },
            {
              name: 'Replace',
              value: 'replace',
              description: 'Replace conflicting values'
            }
          ]
        },
        {
          name: 'continueOnError',
          displayName: 'Continue on Error',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Continue processing on validation errors'
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
      description: 'Processed JSON data'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'JSON'
  },

  aliases: ['parse', 'stringify', 'jsonpath', 'transform', 'validate'],
  
  examples: [
    {
      name: 'Parse JSON String',
      description: 'Convert JSON string to JavaScript object',
      workflow: {
        nodes: [
          {
            name: 'JSON',
            type: 'n8n-nodes-base.json',
            parameters: {
              operation: 'parse',
              jsonInput: '{"name": "John", "age": 30}',
              options: {
                strictValidation: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'JSONPath Query',
      description: 'Extract specific data using JSONPath',
      workflow: {
        nodes: [
          {
            name: 'JSON',
            type: 'n8n-nodes-base.json',
            parameters: {
              operation: 'jsonpath',
              jsonInput: '{{$json}}',
              jsonPathExpression: '$.users[?(@.active)].name'
            }
          }
        ]
      }
    },
    {
      name: 'Schema Validation',
      description: 'Validate JSON data against schema',
      workflow: {
        nodes: [
          {
            name: 'JSON',
            type: 'n8n-nodes-base.json',
            parameters: {
              operation: 'schemaValidate',
              jsonInput: '{{$json.data}}',
              jsonSchema: '{"type": "object", "required": ["id", "name"]}',
              options: {
                continueOnError: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default jsonNode;
