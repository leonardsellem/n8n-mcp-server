/**
 * If Node
 * 
 * Use the If node to split a workflow conditionally based on comparison operations.
 * Supports multiple data types and comparison operations with AND/OR logic.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ifNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.if',
  displayName: 'IF',
  description: 'Route data based on conditional logic. Compare values, check conditions, and send data down different workflow paths based on true/false results.',
  category: 'Core',
  subcategory: 'Flow Control',

  properties: [
    {
      name: 'conditions',
      displayName: 'Conditions',
      type: 'fixedCollection',
      required: true,
      default: {},
      description: 'The conditions to check. Data passes through when conditions are met.',
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'boolean',
          displayName: 'Boolean',
          values: [
            {
              name: 'value1',
              displayName: 'Value 1',
              type: 'string',
              required: true,
              default: '',
              description: 'The first value to compare',
              placeholder: '={{$json.fieldName}}'
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation',
              options: [
                { name: 'exists', value: 'exists' },
                { name: 'does not exist', value: 'notExists' },
                { name: 'is empty', value: 'isEmpty' },
                { name: 'is not empty', value: 'isNotEmpty' },
                { name: 'is true', value: 'isTrue' },
                { name: 'is false', value: 'isFalse' },
                { name: 'is equal to', value: 'equal' },
                { name: 'is not equal to', value: 'notEqual' }
              ]
            },
            {
              name: 'value2',
              displayName: 'Value 2',
              type: 'string',
              required: false,
              default: '',
              description: 'The second value to compare',
              displayOptions: {
                show: {
                  operation: ['equal', 'notEqual']
                }
              }
            }
          ]
        },
        {
          name: 'string',
          displayName: 'String',
          values: [
            {
              name: 'value1',
              displayName: 'Value 1',
              type: 'string',
              required: true,
              default: '',
              description: 'The first value to compare',
              placeholder: '={{$json.fieldName}}'
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation',
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
              ]
            },
            {
              name: 'value2',
              displayName: 'Value 2',
              type: 'string',
              required: false,
              default: '',
              description: 'The second value to compare',
              displayOptions: {
                show: {
                  operation: ['equal', 'notEqual', 'contains', 'notContains', 'startsWith', 'notStartsWith', 'endsWith', 'notEndsWith', 'regex', 'notRegex']
                }
              }
            }
          ]
        },
        {
          name: 'number',
          displayName: 'Number',
          values: [
            {
              name: 'value1',
              displayName: 'Value 1',
              type: 'string',
              required: true,
              default: '',
              description: 'The first value to compare',
              placeholder: '={{$json.fieldName}}'
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation',
              options: [
                { name: 'exists', value: 'exists' },
                { name: 'does not exist', value: 'notExists' },
                { name: 'is empty', value: 'isEmpty' },
                { name: 'is not empty', value: 'isNotEmpty' },
                { name: 'is equal to', value: 'equal' },
                { name: 'is not equal to', value: 'notEqual' },
                { name: 'is greater than', value: 'larger' },
                { name: 'is less than', value: 'smaller' },
                { name: 'is greater than or equal to', value: 'largerEqual' },
                { name: 'is less than or equal to', value: 'smallerEqual' }
              ]
            },
            {
              name: 'value2',
              displayName: 'Value 2',
              type: 'string',
              required: false,
              default: '',
              description: 'The second value to compare',
              displayOptions: {
                show: {
                  operation: ['equal', 'notEqual', 'larger', 'smaller', 'largerEqual', 'smallerEqual']
                }
              }
            }
          ]
        },
        {
          name: 'dateTime',
          displayName: 'Date & Time',
          values: [
            {
              name: 'value1',
              displayName: 'Value 1',
              type: 'string',
              required: true,
              default: '',
              description: 'The first value to compare',
              placeholder: '={{$json.fieldName}}'
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation',
              options: [
                { name: 'exists', value: 'exists' },
                { name: 'does not exist', value: 'notExists' },
                { name: 'is empty', value: 'isEmpty' },
                { name: 'is not empty', value: 'isNotEmpty' },
                { name: 'is equal to', value: 'equal' },
                { name: 'is not equal to', value: 'notEqual' },
                { name: 'is after', value: 'after' },
                { name: 'is before', value: 'before' },
                { name: 'is after or equal to', value: 'afterEqual' },
                { name: 'is before or equal to', value: 'beforeEqual' }
              ]
            },
            {
              name: 'value2',
              displayName: 'Value 2',
              type: 'string',
              required: false,
              default: '',
              description: 'The second value to compare',
              displayOptions: {
                show: {
                  operation: ['equal', 'notEqual', 'after', 'before', 'afterEqual', 'beforeEqual']
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'combineOperation',
      displayName: 'Combine',
      type: 'options',
      required: false,
      default: 'all',
      description: 'How to combine multiple conditions',
      options: [
        { name: 'ALL conditions must be true', value: 'all' },
        { name: 'ANY condition can be true', value: 'any' }
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
      displayName: 'True',
      description: 'Data when condition is true'
    },
    {
      type: 'main',
      displayName: 'False',
      description: 'Data when condition is false'
    }
  ],

  credentials: [],
  regularNode: true,
  
  version: [1, 1.1, 2],
  defaults: {
    name: 'IF'
  },

  aliases: ['condition', 'conditional', 'branch', 'filter', 'logic'],

  examples: [
    {
      name: 'Simple Status Check',
      description: 'Route data based on status field',
      workflow: {
        nodes: [
          {
            name: 'Status Check',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                string: [
                  {
                    value1: '={{$json.status}}',
                    operation: 'equal',
                    value2: 'success'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Numeric Comparison',
      description: 'Filter data based on numeric values',
      workflow: {
        nodes: [
          {
            name: 'Age Filter',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                number: [
                  {
                    value1: '={{$json.age}}',
                    operation: 'larger',
                    value2: '18'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Multiple Conditions (AND)',
      description: 'Check multiple conditions that must all be true',
      workflow: {
        nodes: [
          {
            name: 'Multi Condition Check',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                number: [
                  {
                    value1: '={{$json.age}}',
                    operation: 'larger',
                    value2: '18'
                  }
                ],
                string: [
                  {
                    value1: '={{$json.status}}',
                    operation: 'equal',
                    value2: 'active'
                  }
                ]
              },
              combineOperation: 'all'
            }
          }
        ]
      }
    },
    {
      name: 'Text Contains Check',
      description: 'Check if text contains specific keywords',
      workflow: {
        nodes: [
          {
            name: 'Keyword Filter',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                string: [
                  {
                    value1: '={{$json.message}}',
                    operation: 'contains',
                    value2: 'urgent'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Date Comparison',
      description: 'Filter data based on date ranges',
      workflow: {
        nodes: [
          {
            name: 'Date Filter',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                dateTime: [
                  {
                    value1: '={{$json.createdAt}}',
                    operation: 'after',
                    value2: '2024-01-01'
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
      'Filter data based on conditions',
      'Route workflow paths conditionally',
      'Error handling and validation',
      'Status checking and branching',
      'Data quality checks',
      'User permission filtering'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Type mismatch', 'Invalid regex pattern'],
      documentation: 'Most errors in IF nodes are due to incorrect expressions or data type mismatches'
    }
  },

  usageNotes: 'The If node is essential for creating conditional logic in workflows. Use appropriate data types for accurate comparisons and combine multiple conditions with AND/OR logic.',
  integrationGuide: 'Select the correct data type (String, Number, Date & Time, Boolean, Array, Object) for your comparison. Use expressions to reference input data dynamically.'
};

export default ifNode;
