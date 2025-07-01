/**
 * # Switch
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Flow Control
 * 
 * ## Description
 * 
 * Use the Switch node to route a workflow conditionally based on comparison operations. 
 * It's similar to the IF node, but supports multiple output routes.
 * 
 * ## Key Features
 * 
 * - **Two Modes**: Rules mode for GUI-based conditions, Expression mode for programmatic routing
 * - **Multiple Output Routing**: Route data to different outputs based on conditions
 * - **Data Type Aware**: Supports specific comparisons for strings, numbers, dates, booleans, arrays, objects
 * - **Fallback Handling**: Configure behavior for unmatched data (None, Extra Output, Output 0)
 * - **Advanced Options**: Case sensitivity, type validation, multiple match support
 * - **Expression Support**: Use n8n expressions for dynamic routing logic
 * - **Conditional Logic**: AND/OR combinations for complex conditions
 * - **Regex Support**: Pattern matching for advanced string operations
 * 
 * ## Modes
 * 
 * ### Rules Mode
 * - Create **Routing Rules** to define comparison conditions
 * - Use data type dropdown to select data type and comparison operation
 * - **Rename Output**: Turn on to rename the output field for matching data
 * - Support for multiple conditions with AND/OR logic
 * 
 * ### Expression Mode
 * - **Number of Outputs**: Set how many outputs the node should have
 * - **Output Index**: Create expression to calculate routing (must return a number)
 * - Programmatic control over routing logic
 * 
 * ## Rule Options
 * 
 * ### Fallback Output
 * Choose how to route workflow when item doesn't match any rules:
 * - **None**: Ignore the item (default behavior)
 * - **Extra Output**: Send items to extra, separate output
 * - **Output 0**: Send items to same output as first rule matches
 * 
 * ### Additional Options
 * - **Ignore Case**: Ignore letter case when evaluating string conditions
 * - **Less Strict Type Validation**: Attempt to convert value types based on operator
 * - **Send data to all matching outputs**: Send to all matching outputs vs first match only
 * 
 * ## Available Data Type Comparisons
 * 
 * ### String
 * exists, does not exist, is empty, is not empty, is equal to, is not equal to, 
 * contains, does not contain, starts with, does not start with, ends with, 
 * does not end with, matches regex, does not match regex
 * 
 * ### Number
 * exists, does not exist, is empty, is not empty, is equal to, is not equal to,
 * is greater than, is less than, is greater than or equal to, is less than or equal to
 * 
 * ### Date & Time
 * exists, does not exist, is empty, is not empty, is equal to, is not equal to,
 * is after, is before, is after or equal to, is before or equal to
 * 
 * ### Boolean
 * exists, does not exist, is empty, is not empty, is true, is false, is equal to, is not equal to
 * 
 * ### Array
 * exists, does not exist, is empty, is not empty, contains, does not contain,
 * length equal to, length not equal to, length greater than, length less than,
 * length greater than or equal to, length less than or equal to
 * 
 * ### Object
 * exists, does not exist, is empty, is not empty
 * 
 * ## Use Cases
 * 
 * - Route data based on status, category, or priority fields
 * - Handle different API response codes with appropriate actions
 * - Process orders based on value, customer type, or product category
 * - Implement approval workflows with different approval paths
 * - Data validation and routing to appropriate handlers
 * - Error handling with different paths for different error types
 * - Multi-tenant data routing based on organization or user
 * - Content management with different processing pipelines
 */

import { NodeTypeInfo } from '../../node-types.js';

export const switchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.switch',
  displayName: 'Switch',
  description: 'Route a workflow conditionally based on comparison operations. Supports multiple output routes with complex conditional logic.',
  category: 'Core Nodes',
  subcategory: 'Flow Control',

  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'rules',
      description: 'The mode to use for routing decisions',
      options: [
        {
          name: 'Rules',
          value: 'rules',
          description: 'Build a matching rule for each output'
        },
        {
          name: 'Expression',
          value: 'expression',
          description: 'Write an expression to return the output index programmatically'
        }
      ]
    },
    {
      name: 'numberOfOutputs',
      displayName: 'Number of Outputs',
      type: 'number',
      required: true,
      default: 4,
      description: 'How many outputs the node should have',
      typeOptions: {
        minValue: 1,
        maxValue: 20
      },
      displayOptions: {
        show: {
          mode: ['expression']
        }
      }
    },
    {
      name: 'outputIndex',
      displayName: 'Output Index',
      type: 'string',
      required: true,
      default: '0',
      description: 'Expression to calculate which input item should be routed to which output (must return a number)',
      placeholder: '{{ $json.status === "active" ? 0 : 1 }}',
      displayOptions: {
        show: {
          mode: ['expression']
        }
      }
    },
    {
      name: 'routingRules',
      displayName: 'Routing Rules',
      type: 'fixedCollection',
      required: true,
      default: {
        values: [
          {
            dataType: 'string',
            operation: 'equal',
            value1: '',
            value2: '',
            outputIndex: 0
          }
        ]
      },
      description: 'Define comparison conditions for routing',
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      displayOptions: {
        show: {
          mode: ['rules']
        }
      },
      options: [
        {
          name: 'values',
          displayName: 'Rules',
          values: [
            {
              name: 'dataType',
              displayName: 'Data Type',
              type: 'options',
              required: true,
              default: 'string',
              description: 'The data type and comparison operation type',
              options: [
                { name: 'String', value: 'string' },
                { name: 'Number', value: 'number' },
                { name: 'Date & Time', value: 'dateTime' },
                { name: 'Boolean', value: 'boolean' },
                { name: 'Array', value: 'array' },
                { name: 'Object', value: 'object' }
              ]
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation to perform',
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
                { name: 'does not match regex', value: 'notRegex' },
                { name: 'is greater than', value: 'greaterThan' },
                { name: 'is less than', value: 'lessThan' },
                { name: 'is greater than or equal to', value: 'greaterThanOrEqual' },
                { name: 'is less than or equal to', value: 'lessThanOrEqual' },
                { name: 'is after', value: 'after' },
                { name: 'is before', value: 'before' },
                { name: 'is after or equal to', value: 'afterOrEqual' },
                { name: 'is before or equal to', value: 'beforeOrEqual' },
                { name: 'is true', value: 'isTrue' },
                { name: 'is false', value: 'isFalse' },
                { name: 'length equal to', value: 'lengthEqual' },
                { name: 'length not equal to', value: 'lengthNotEqual' },
                { name: 'length greater than', value: 'lengthGreaterThan' },
                { name: 'length less than', value: 'lengthLessThan' },
                { name: 'length greater than or equal to', value: 'lengthGreaterThanOrEqual' },
                { name: 'length less than or equal to', value: 'lengthLessThanOrEqual' }
              ]
            },
            {
              name: 'value1',
              displayName: 'Value 1',
              type: 'string',
              required: true,
              default: '',
              description: 'The field or value to compare',
              placeholder: '{{ $json.status }}'
            },
            {
              name: 'value2',
              displayName: 'Value 2',
              type: 'string',
              required: false,
              default: '',
              description: 'The value to compare against',
              placeholder: 'active',
              displayOptions: {
                hide: {
                  operation: ['exists', 'notExists', 'isEmpty', 'isNotEmpty', 'isTrue', 'isFalse']
                }
              }
            },
            {
              name: 'outputIndex',
              displayName: 'Output',
              type: 'number',
              required: true,
              default: 0,
              description: 'The output index to route to when this condition matches',
              typeOptions: {
                minValue: 0,
                maxValue: 19
              }
            }
          ]
        }
      ]
    },
    {
      name: 'renameOutput',
      displayName: 'Rename Output',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Rename the output field to put matching data into',
      displayOptions: {
        show: {
          mode: ['rules']
        }
      }
    },
    {
      name: 'outputName',
      displayName: 'Output Name',
      type: 'string',
      required: false,
      default: 'output',
      description: 'Name for the output field',
      displayOptions: {
        show: {
          mode: ['rules'],
          renameOutput: [true]
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
