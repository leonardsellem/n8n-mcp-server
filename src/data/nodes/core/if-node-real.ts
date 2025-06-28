import { NodeTypeInfo } from '../../node-types.js';

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
      type: 'filter',
      required: true,
      default: {
        options: {
          version: 2,
          leftValue: '',
          caseSensitive: true,
          typeValidation: 'strict'
        },
        combinator: 'and',
        conditions: []
      },
      description: 'Define the conditions to evaluate',
      typeOptions: {
        filter: {
          supportedTypes: ['string', 'number', 'boolean', 'array', 'object', 'dateTime'],
          supportedOperators: [
            'equals',
            'notEquals',
            'contains',
            'notContains',
            'startsWith',
            'notStartsWith',
            'endsWith',
            'notEndsWith',
            'regex',
            'notRegex',
            'greater',
            'greaterEqual',
            'lesser',
            'lesserEqual',
            'lengthEquals',
            'lengthNotEquals',
            'lengthGreater',
            'lengthLesser',
            'isEmpty',
            'isNotEmpty',
            'isTrue',
            'isFalse',
            'exists',
            'notExists',
            'after',
            'before'
          ]
        }
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional options for the conditional logic',
      options: [
        {
      name: 'looseTypeValidation',
      displayName: 'Loose Type Validation',
      type: 'boolean',
      required: false,
          description: 'When enabled, type validation will be less strict'
    },
        {
      name: 'fallbackOutput',
      displayName: 'Fallback Output',
      type: 'options',
      required: false,
      default: 'noData',
          description: 'What to output when condition is false',
          options: [
            { name: 'No Data', value: 'noData'
    },
            { name: 'Input Data', value: 'inputData' },
            { name: 'Empty Object', value: 'emptyObject' }
          ]
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
  webhookSupport: false,
  version: [1, 2],
  defaults: {
    name: 'IF',
    conditions: {
      options: {
        version: 2,
        leftValue: '',
        caseSensitive: true,
        typeValidation: 'strict'
      },
      combinator: 'and',
      conditions: [
        {
          id: '{{$randomString(8)}}',
          operator: {
            type: 'string',
            operation: 'equals'
          },
          leftValue: '={{$json.field}}',
          rightValue: 'expectedValue'
        }
      ]
    }
  },
  aliases: ['if', 'condition', 'branch', 'route', 'filter', 'conditional'],
  subtitle: '={{$parameter["conditions"]["conditions"] ? $parameter["conditions"]["conditions"].length + " condition(s)" : "no conditions"}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'low',
    commonPatterns: [
      'Filter data based on conditions',
      'Route workflow paths conditionally',
      'Error handling and validation',
      'Status checking and branching',
      'Data quality filtering',
      'Business logic implementation',
      'Multi-path decision making'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Type mismatch', 'Property not found'],
      documentation: 'Most errors in IF nodes are due to incorrect expressions or data type mismatches'
    }
  },
  examples: [
    {
      name: 'Simple Status Check',
      description: 'Route data based on status field value',
      workflow: {
        nodes: [
          {
            name: 'Status Check',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                options: {
                  version: 2,
                  caseSensitive: true,
                  typeValidation: 'strict'
                },
                combinator: 'and',
                conditions: [
                  {
                    id: 'status_check',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.status}}',
                    rightValue: 'active'
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
                options: {
                  version: 2,
                  caseSensitive: true,
                  typeValidation: 'strict'
                },
                combinator: 'and',
                conditions: [
                  {
                    id: 'age_check',
                    operator: {
                      type: 'number',
                      operation: 'greater'
                    },
                    leftValue: '={{$json.age}}',
                    rightValue: 18
                  },
                  {
                    id: 'status_check',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.status}}',
                    rightValue: 'verified'
                  },
                  {
                    id: 'email_check',
                    operator: {
                      type: 'string',
                      operation: 'contains'
                    },
                    leftValue: '={{$json.email}}',
                    rightValue: '@company.com'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'OR Conditions',
      description: 'Check if any of multiple conditions are true',
      workflow: {
        nodes: [
          {
            name: 'OR Condition Check',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                options: {
                  version: 2,
                  caseSensitive: false,
                  typeValidation: 'strict'
                },
                combinator: 'or',
                conditions: [
                  {
                    id: 'priority_urgent',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.priority}}',
                    rightValue: 'urgent'
                  },
                  {
                    id: 'priority_critical',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.priority}}',
                    rightValue: 'critical'
                  },
                  {
                    id: 'escalated_flag',
                    operator: {
                      type: 'boolean',
                      operation: 'true'
                    },
                    leftValue: '={{$json.escalated}}'
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
      description: 'Check if date is within a specific range',
      workflow: {
        nodes: [
          {
            name: 'Date Range Check',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                options: {
                  version: 2,
                  typeValidation: 'strict'
                },
                combinator: 'and',
                conditions: [
                  {
                    id: 'date_after',
                    operator: {
                      type: 'dateTime',
                      operation: 'after'
                    },
                    leftValue: '={{$json.createdAt}}',
                    rightValue: '2024-01-01T00:00:00.000Z'
                  },
                  {
                    id: 'date_before',
                    operator: {
                      type: 'dateTime',
                      operation: 'before'
                    },
                    leftValue: '={{$json.createdAt}}',
                    rightValue: '={{$now}}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Array and Object Checks',
      description: 'Validate array length and object properties',
      workflow: {
        nodes: [
          {
            name: 'Data Validation',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                options: {
                  version: 2,
                  typeValidation: 'strict'
                },
                combinator: 'and',
                conditions: [
                  {
                    id: 'tags_length',
                    operator: {
                      type: 'array',
                      operation: 'lengthGreater'
                    },
                    leftValue: '={{$json.tags}}',
                    rightValue: 0
                  },
                  {
                    id: 'profile_exists',
                    operator: {
                      type: 'object',
                      operation: 'exists'
                    },
                    leftValue: '={{$json.profile}}'
                  },
                  {
                    id: 'email_not_empty',
                    operator: {
                      type: 'string',
                      operation: 'isNotEmpty'
                    },
                    leftValue: '={{$json.email}}'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Error Handling with Fallback',
      description: 'Route errors to different handling paths with fallback',
      workflow: {
        nodes: [
          {
            name: 'Error Router',
            type: 'n8n-nodes-base.if',
            parameters: {
              conditions: {
                options: {
                  version: 2,
                  typeValidation: 'loose'
                },
                combinator: 'or',
                conditions: [
                  {
                    id: 'no_error',
                    operator: {
                      type: 'string',
                      operation: 'isEmpty'
                    },
                    leftValue: '={{$json.error}}'
                  },
                  {
                    id: 'success_status',
                    operator: {
                      type: 'string',
                      operation: 'equals'
                    },
                    leftValue: '={{$json.status}}',
                    rightValue: 'success'
                  }
                ]
              },
              options: {
                fallbackOutput: 'inputData'
              }
            }
          }
        ]
      }
    }
  ]
};