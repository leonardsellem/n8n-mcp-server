/**
 * Switch Node
 * 
 * Route data to different outputs based on multiple conditions. Perfect for complex
 * conditional logic with multiple branches and fallback options.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const switchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.switch',
  displayName: 'Switch',
  description: 'Route data to different outputs based on multiple conditions. Handle complex conditional logic with multiple branches and fallback options.',
  category: 'Core',
  subcategory: 'Flow Control',

  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'expression',
      description: 'How to evaluate the conditions',
      options: [
        {
          name: 'Expression',
          value: 'expression',
          description: 'Use expressions to evaluate conditions'
        },
        {
          name: 'Rules',
          value: 'rules',
          description: 'Use simple rules to evaluate conditions'
        }
      ]
    },
    {
      name: 'expression',
      displayName: 'Expression',
      type: 'string',
      required: true,
      default: '',
      description: 'Expression to evaluate for routing data',
      placeholder: '{{ $json.status }}',
      displayOptions: {
        show: {
          mode: ['expression']
        }
      }
    },
    {
      name: 'rules',
      displayName: 'Rules',
      type: 'collection',
      required: false,
      default: {},
      description: 'Rules to evaluate for routing data',
      displayOptions: {
        show: {
          mode: ['rules']
        }
      },
      options: [
        {
          name: 'values',
          displayName: 'Values',
          type: 'fixedCollection',
          required: false,
          default: {},
          description: 'Values to compare against',
          options: [
            {
              name: 'rules',
              displayName: 'Rules',
              values: [
                {
                  name: 'conditions',
                  displayName: 'Conditions',
                  type: 'fixedCollection',
                  required: false,
                  default: {},
                  typeOptions: {
                    multipleValues: true
                  },
                  options: [
                    {
                      name: 'condition',
                      displayName: 'Condition',
                      values: [
                        {
                          name: 'leftValue',
                          displayName: 'Left Value',
                          type: 'string',
                          required: true,
                          default: '',
                          description: 'Left side of the comparison',
                          placeholder: '{{ $json.status }}'
                        },
                        {
                          name: 'operation',
                          displayName: 'Operation',
                          type: 'options',
                          required: true,
                          default: 'equal',
                          description: 'Operation to perform',
                          options: [
                            { name: 'Equal', value: 'equal' },
                            { name: 'Not Equal', value: 'notEqual' },
                            { name: 'Smaller', value: 'smaller' },
                            { name: 'Smaller Equal', value: 'smallerEqual' },
                            { name: 'Larger', value: 'larger' },
                            { name: 'Larger Equal', value: 'largerEqual' },
                            { name: 'Contains', value: 'contains' },
                            { name: 'Not Contains', value: 'notContains' },
                            { name: 'Starts With', value: 'startsWith' },
                            { name: 'Not Starts With', value: 'notStartsWith' },
                            { name: 'Ends With', value: 'endsWith' },
                            { name: 'Not Ends With', value: 'notEndsWith' },
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
                          description: 'Right side of the comparison',
                          placeholder: 'completed',
                          displayOptions: {
                            hide: {
                              operation: ['isEmpty', 'isNotEmpty']
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
                  default: 'AND',
                  description: 'How to combine multiple conditions',
                  options: [
                    { name: 'AND', value: 'AND' },
                    { name: 'OR', value: 'OR' }
                  ]
                },
                {
                  name: 'outputIndex',
                  displayName: 'Output',
                  type: 'number',
                  required: true,
                  default: 0,
                  description: 'Index of the output to send data to'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'outputs',
      displayName: 'Outputs',
      type: 'number',
      required: true,
      default: 4,
      description: 'Number of outputs to create',
      typeOptions: {
        minValue: 1,
        maxValue: 20
      }
    },
    {
      name: 'fallbackOutput',
      displayName: 'Fallback Output',
      type: 'options',
      required: false,
      default: 'extra',
      description: 'Where to send data that doesn\'t match any condition',
      options: [
        {
          name: 'Extra Output',
          value: 'extra',
          description: 'Send to an additional output'
        },
        {
          name: 'No Output',
          value: 'none',
          description: 'Don\'t output unmatched data'
        }
      ]
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
          name: 'allMatchingOutputs',
          displayName: 'Output to All Matching Outputs',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Send data to all matching outputs instead of just the first one'
        },
        {
          name: 'ignoreCase',
          displayName: 'Ignore Case',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Ignore case when comparing strings'
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
      displayName: 'Output 1',
      description: 'First output branch'
    },
    {
      type: 'main',
      displayName: 'Output 2',
      description: 'Second output branch'
    },
    {
      type: 'main',
      displayName: 'Output 3',
      description: 'Third output branch'
    },
    {
      type: 'main',
      displayName: 'Output 4',
      description: 'Fourth output branch'
    },
    {
      type: 'main',
      displayName: 'Fallback',
      description: 'Fallback output for unmatched data'
    }
  ],

  credentials: [],
  regularNode: true,
  
  version: [1, 2, 3],
  defaults: {
    name: 'Switch'
  },

  aliases: ['switch', 'route', 'condition', 'branch', 'case'],

  examples: [
    {
      name: 'Route by Status',
      description: 'Route data based on status field to different processing branches',
      workflow: {
        nodes: [
          {
            name: 'Route by Status',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'expression',
              expression: '{{ $json.status }}',
              outputs: 3,
              fallbackOutput: 'extra'
            }
          }
        ]
      }
    },
    {
      name: 'Complex Conditional Routing',
      description: 'Use multiple conditions to route data with AND/OR logic',
      workflow: {
        nodes: [
          {
            name: 'Complex Routing',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'rules',
              rules: {
                values: {
                  rules: [
                    {
                      conditions: {
                        condition: [
                          {
                            leftValue: '{{ $json.priority }}',
                            operation: 'equal',
                            rightValue: 'high'
                          },
                          {
                            leftValue: '{{ $json.department }}',
                            operation: 'equal',
                            rightValue: 'urgent'
                          }
                        ]
                      },
                      combineOperation: 'AND',
                      outputIndex: 0
                    }
                  ]
                }
              },
              outputs: 3
            }
          }
        ]
      }
    },
    {
      name: 'E-commerce Order Processing',
      description: 'Route orders based on value and customer type',
      workflow: {
        nodes: [
          {
            name: 'Order Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'rules',
              rules: {
                values: {
                  rules: [
                    {
                      conditions: {
                        condition: [
                          {
                            leftValue: '{{ $json.order_value }}',
                            operation: 'larger',
                            rightValue: '1000'
                          }
                        ]
                      },
                      outputIndex: 0
                    },
                    {
                      conditions: {
                        condition: [
                          {
                            leftValue: '{{ $json.customer_type }}',
                            operation: 'equal',
                            rightValue: 'premium'
                          }
                        ]
                      },
                      outputIndex: 1
                    }
                  ]
                }
              },
              outputs: 3,
              options: {
                allMatchingOutputs: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'API Response Handler',
      description: 'Handle different API response codes with appropriate actions',
      workflow: {
        nodes: [
          {
            name: 'Response Handler',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'expression',
              expression: '{{ $json.statusCode }}',
              outputs: 4,
              fallbackOutput: 'extra'
            }
          }
        ]
      }
    },
    {
      name: 'Data Validation Router',
      description: 'Route data based on validation results',
      workflow: {
        nodes: [
          {
            name: 'Validation Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'rules',
              rules: {
                values: {
                  rules: [
                    {
                      conditions: {
                        condition: [
                          {
                            leftValue: '{{ $json.email }}',
                            operation: 'regex',
                            rightValue: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
                          },
                          {
                            leftValue: '{{ $json.name }}',
                            operation: 'isNotEmpty'
                          }
                        ]
                      },
                      combineOperation: 'AND',
                      outputIndex: 0
                    }
                  ]
                }
              },
              outputs: 2,
              fallbackOutput: 'extra'
            }
          }
        ]
      }
    }
  ],

  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Route data based on status or category fields',
      'Handle different API response codes',
      'Process orders based on value or customer type',
      'Validate data and route to appropriate handlers',
      'Implement complex business logic with multiple conditions',
      'Create multi-path workflows based on data content',
      'Handle error conditions with fallback routes',
      'Implement approval workflows with different paths'
    ],
    errorHandling: {
      retryableErrors: ['Expression evaluation error'],
      nonRetryableErrors: ['Invalid output index', 'Malformed expression'],
      documentation: 'Switch node errors typically occur due to invalid expressions or output configurations'
    }
  },

  usageNotes: 'The Switch node allows you to route data to different outputs based on conditions. Use expression mode for simple routing or rules mode for complex conditional logic. Configure fallback output to handle unmatched data.',
  integrationGuide: 'Use Switch nodes to implement complex decision trees in your workflows. Combine multiple conditions with AND/OR logic for sophisticated routing. Consider using the "Output to All Matching Outputs" option when data should be processed by multiple branches.'
};

export default switchNode;
