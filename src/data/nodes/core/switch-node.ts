import { NodeTypeInfo } from '../../node-types.js';

export const switchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.switch',
  displayName: 'Switch',
  description: 'Route workflow data to different outputs based on multiple conditions. Create multi-branch workflows with complex routing logic.',
  category: 'Core Nodes',
  subcategory: 'Flow Control',
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'expression',
      description: 'How to determine the routing',
      options: [
        { name: 'Expression', value: 'expression', description: 'Route based on expression results' },
        { name: 'Rules', value: 'rules', description: 'Route based on defined rules' }
      ]
    },
    {
      name: 'output',
      displayName: 'Output',
      type: 'string',
      required: true,
      default: '={{$json.category}}',
      description: 'Expression that determines which output to use',
      displayOptions: {
        show: {
          mode: ['expression']
        }
      },
      placeholder: '={{$json.status}}'
    },
    {
      name: 'rules',
      displayName: 'Routing Rules',
      type: 'collection',
      required: true,
      default: {},
      description: 'Rules to determine routing',
      displayOptions: {
        show: {
          mode: ['rules']
        }
      },
      options: [
        {
      name: 'rules',

      displayName: 'Rules',
      type: 'fixedCollection',
      required: false,
      description: 'Routing rules to evaluate',
          default: {},options: [
            {
              name: 'rule',
              displayName: 'Rule',
              values: [
                {
      name: 'output',

      displayName: 'Output',
      type: 'number',
      required: false,
                  description: 'Output index (0, 1, 2, etc.)'
    },
                {
      name: 'conditions',

      displayName: 'Conditions',
      type: 'fixedCollection',
      required: false,
      description: 'Conditions for this rule',
                  default: {},options: [
                    {
                      name: 'condition',
                      displayName: 'Condition',
                      values: [
                        {
      name: 'leftValue',

      displayName: 'Left Value',
      type: 'string',
      required: false,
                          description: 'Value to compare',
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
                            { name: 'Smaller', value: 'smaller' },
                            { name: 'Contains', value: 'contains' },
                            { name: 'Starts with', value: 'startsWith' },
                            { name: 'Ends with', value: 'endsWith' },
                            { name: 'Regex', value: 'regex' }
                          ]
                        },
                        {
      name: 'rightValue',

      displayName: 'Right Value',
      type: 'string',
      required: false,
      default: '',
                          description: 'Value to compare against'
    }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional switch options',
      options: [
        {
      name: 'fallbackOutput',

      displayName: 'Fallback Output',
      type: 'number',
      required: false,
          description: 'Output to use when no rules match (-1 for no output)',
          typeOptions: {
            minValue: -1
    }
        },
        {
      name: 'allMatchingOutputs',

      displayName: 'All Matching Outputs',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Send data to all matching outputs, not just the first'
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
      displayName: 'Output 0',
      description: 'First routing output'
    },
    {
      type: 'main',
      displayName: 'Output 1',
      description: 'Second routing output'
    },
    {
      type: 'main',
      displayName: 'Output 2',
      description: 'Third routing output'
    },
    {
      type: 'main',
      displayName: 'Output 3',
      description: 'Fourth routing output'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  defaults: {
    mode: 'expression',
    output: '={{$json.category}}',
    options: {
      fallbackOutput: -1,
      allMatchingOutputs: false
    }
  },
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Route data by category or type',
      'Multi-branch workflows based on status',
      'Content routing for different processing',
      'Error handling with multiple paths',
      'Priority-based routing',
      'Complex conditional workflows'
    ],
    prerequisites: [
      'Understanding of workflow branching',
      'Knowledge of expression syntax'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid expression', 'Output index out of range'],
      documentation: 'Switch node errors typically occur from invalid expressions or incorrect output configuration'
    }
  },
  examples: [
    {
      name: 'Route by Status',
      description: 'Route data to different outputs based on status field',
      workflow: {
        nodes: [
          {
            name: 'Status Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'expression',
              output: '={{$json.status === "urgent" ? 0 : $json.status === "normal" ? 1 : 2}}'
            }
          }
        ]
      }
    },
    {
      name: 'Multi-Rule Routing',
      description: 'Use multiple rules to route data',
      workflow: {
        nodes: [
          {
            name: 'Rule-based Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'rules',
              rules: {
                rules: [
                  {
                    output: 0,
                    conditions: {
                      condition: [
                        {
                          leftValue: '={{$json.priority}}',
                          operation: 'equal',
                          rightValue: 'high'
                        }
                      ]
                    }
                  },
                  {
                    output: 1,
                    conditions: {
                      condition: [
                        {
                          leftValue: '={{$json.type}}',
                          operation: 'equal',
                          rightValue: 'customer'
                        }
                      ]
                    }
                  }
                ]
              },
              options: {
                fallbackOutput: 2
              }
            }
          }
        ]
      }
    },
    {
      name: 'Content Type Router',
      description: 'Route different content types to specialized processors',
      workflow: {
        nodes: [
          {
            name: 'Content Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'expression',
              output: '={{$json.contentType === "image" ? 0 : $json.contentType === "video" ? 1 : $json.contentType === "text" ? 2 : 3}}'
            }
          }
        ]
      }
    },
    {
      name: 'Error Severity Router',
      description: 'Route errors to different handling paths based on severity',
      workflow: {
        nodes: [
          {
            name: 'Error Router',
            type: 'n8n-nodes-base.switch',
            parameters: {
              mode: 'rules',
              rules: {
                rules: [
                  {
                    output: 0,
                    conditions: {
                      condition: [
                        {
                          leftValue: '={{$json.severity}}',
                          operation: 'equal',
                          rightValue: 'critical'
                        }
                      ]
                    }
                  },
                  {
                    output: 1,
                    conditions: {
                      condition: [
                        {
                          leftValue: '={{$json.severity}}',
                          operation: 'equal',
                          rightValue: 'warning'
                        }
                      ]
                    }
                  }
                ]
              },
              options: {
                fallbackOutput: 2,
                allMatchingOutputs: false
              }
            }
          }
        ]
      }
    }
  ]
};