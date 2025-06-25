import { NodeTypeInfo } from '../node-types.js';

export const ifNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.if',
  displayName: 'IF',
  description: 'Route data based on conditional logic. Compare values, check conditions, and send data down different workflow paths based on true/false results.',
  category: 'Core Nodes',
  subcategory: 'Flow Control',
  properties: [
    {
      name: 'conditions',
      displayName: 'Conditions',
      type: 'collection',
      required: true,
      default: {},
      description: 'Define the conditions to evaluate',
      options: [
        {
      name: 'conditions',

      displayName: 'Conditions',
      type: 'fixedCollection',
      required: false,
      description: 'The conditions to check',
          options: [
            {
              name: 'and',
              displayName: 'AND',
              values: [
                {
      name: 'leftValue',

      displayName: 'Left Value',
      type: 'string',
      required: false,
      default: '',
                  description: 'The left value to compare',
                  placeholder: '={{$json.status}}'
                },
                {
      name: 'operation',

      displayName: 'Operation',
      type: 'options',
      required: false,
      default: 'equal',
                  options: [
                    { name: 'Equal', value: 'equal' },
                    { name: 'Not Equal', value: 'notEqual' },
                    { name: 'Larger', value: 'larger' },
                    { name: 'Larger or Equal', value: 'largerEqual' },
                    { name: 'Smaller', value: 'smaller' },
                    { name: 'Smaller or Equal', value: 'smallerEqual' },
                    { name: 'Contains', value: 'contains' },
                    { name: 'Does not contain', value: 'notContains' },
                    { name: 'Starts with', value: 'startsWith' },
                    { name: 'Ends with', value: 'endsWith' },
                    { name: 'Regex', value: 'regex' },
                    { name: 'Is Empty', value: 'isEmpty' },
                    { name: 'Is Not Empty', value: 'isNotEmpty' }
                  ]
                },
                {
      name: 'rightValue',

      displayName: 'Right Value',
      type: 'string',
      required: false,
      default: '',
                  description: 'The right value to compare against',
                  placeholder: 'success'
    }
              ]
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
    },
    {
      name: 'fallbackOutput',
      displayName: 'Fallback Output',
      type: 'options',
      required: false,
      default: 'noData',
      description: 'What to output when condition is false',
      options: [
        { name: 'No Data', value: 'noData' },
        { name: 'Input Data', value: 'inputData' },
        { name: 'Empty Object', value: 'emptyObject' }
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
  codeable: false,
  triggerNode: false,
  defaults: {
    conditions: {
      conditions: [
        {
          leftValue: '',
          operation: 'equal',
          rightValue: ''
        }
      ]
    },
    combineOperation: 'all',
    fallbackOutput: 'noData'
  },
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'low',
    commonPatterns: [
      'Filter data based on conditions',
      'Route workflow paths conditionally',
      'Error handling and validation',
      'Status checking and branching'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Type mismatch'],
      documentation: 'Most errors in IF nodes are due to incorrect expressions or data type mismatches'
    }
  },
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
                conditions: [
                  {
                    leftValue: '={{$json.status}}',
                    operation: 'equal',
                    rightValue: 'success'
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
                conditions: [
                  {
                    leftValue: '={{$json.age}}',
                    operation: 'larger',
                    rightValue: '18'
                  },
                  {
                    leftValue: '={{$json.status}}',
                    operation: 'equal',
                    rightValue: 'active'
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
                conditions: [
                  {
                    leftValue: '={{$json.message}}',
                    operation: 'contains',
                    rightValue: 'urgent'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Error Handling',
      description: 'Route errors to different handling paths',
      workflow: {
        nodes: [
          {
            name: 'Error Router',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                conditions: [
                  {
                    leftValue: '={{$json.error}}',
                    operation: 'isEmpty',
                    rightValue: ''
                  }
                ]
              },
              fallbackOutput: 'inputData'
            }
          }
        ]
      }
    }
  ]
};