/**
 * Wait Node
 * 
 * Pause workflow execution for a specified duration or until a specific time.
 * Perfect for rate limiting, scheduling delays, and controlling workflow timing.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const waitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wait',
  displayName: 'Wait',
  description: 'Pause workflow execution for a specified duration or until a specific time. Perfect for rate limiting, scheduling delays, and controlling workflow timing.',
  category: 'Core',
  subcategory: 'Flow Control',

  properties: [
    {
      name: 'resume',
      displayName: 'Resume',
      type: 'options',
      required: true,
      default: 'timeInterval',
      description: 'Determines when to resume workflow execution',
      options: [
        {
          name: 'After Time Interval',
          value: 'timeInterval',
          description: 'Resume after a specified amount of time'
        },
        {
          name: 'At Specific Time',
          value: 'specificTime',
          description: 'Resume at a specific date and time'
        },
        {
          name: 'On Webhook Call',
          value: 'webhook',
          description: 'Resume when a webhook is called'
        },
        {
          name: 'On Form Submission',
          value: 'form',
          description: 'Resume when a form is submitted'
        }
      ]
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'number',
      required: true,
      default: 1,
      description: 'Amount of time to wait',
      displayOptions: {
        show: {
          resume: ['timeInterval']
        }
      },
      typeOptions: {
        minValue: 0
      }
    },
    {
      name: 'unit',
      displayName: 'Unit',
      type: 'options',
      required: true,
      default: 'seconds',
      description: 'Unit of time for the wait duration',
      displayOptions: {
        show: {
          resume: ['timeInterval']
        }
      },
      options: [
        { name: 'Seconds', value: 'seconds' },
        { name: 'Minutes', value: 'minutes' },
        { name: 'Hours', value: 'hours' },
        { name: 'Days', value: 'days' }
      ]
    },
    {
      name: 'dateTime',
      displayName: 'Date and Time',
      type: 'dateTime',
      required: true,
      default: '',
      description: 'Specific date and time to resume execution',
      displayOptions: {
        show: {
          resume: ['specificTime']
        }
      }
    },
    {
      name: 'webhookSuffix',
      displayName: 'Webhook Suffix',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional suffix for the webhook URL',
      placeholder: 'my-webhook-id',
      displayOptions: {
        show: {
          resume: ['webhook']
        }
      }
    },
    {
      name: 'approvalRequired',
      displayName: 'Approval Required',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Require approval to continue workflow execution',
      displayOptions: {
        show: {
          resume: ['webhook', 'form']
        }
      }
    },
    {
      name: 'formFields',
      displayName: 'Form Fields',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Fields to include in the form',
      displayOptions: {
        show: {
          resume: ['form']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'field',
          displayName: 'Field',
          values: [
            {
              name: 'fieldLabel',
              displayName: 'Field Label',
              type: 'string',
              required: true,
              default: '',
              description: 'Label for the form field'
            },
            {
              name: 'fieldType',
              displayName: 'Field Type',
              type: 'options',
              required: true,
              default: 'text',
              description: 'Type of form field',
              options: [
                { name: 'Text', value: 'text' },
                { name: 'Number', value: 'number' },
                { name: 'Email', value: 'email' },
                { name: 'Password', value: 'password' },
                { name: 'Textarea', value: 'textarea' },
                { name: 'Select', value: 'select' },
                { name: 'Multi-Select', value: 'multiselect' },
                { name: 'Checkbox', value: 'checkbox' },
                { name: 'Date', value: 'date' },
                { name: 'DateTime', value: 'datetime' }
              ]
            },
            {
              name: 'fieldOptions',
              displayName: 'Field Options',
              type: 'string',
              required: false,
              default: '',
              description: 'Options for select fields (comma-separated)',
              placeholder: 'Option 1, Option 2, Option 3',
              displayOptions: {
                show: {
                  fieldType: ['select', 'multiselect']
                }
              }
            },
            {
              name: 'requiredField',
              displayName: 'Required',
              type: 'boolean',
              required: false,
              default: false,
              description: 'Whether this field is required'
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
      default: {},
      description: 'Additional wait options',
      options: [
        {
          name: 'timeoutAmount',
          displayName: 'Timeout Amount',
          type: 'number',
          required: false,
          default: 0,
          description: 'Maximum time to wait (0 = no timeout)',
          typeOptions: {
            minValue: 0
          }
        },
        {
          name: 'timeoutUnit',
          displayName: 'Timeout Unit',
          type: 'options',
          required: false,
          default: 'hours',
          description: 'Unit for timeout duration',
          options: [
            { name: 'Minutes', value: 'minutes' },
            { name: 'Hours', value: 'hours' },
            { name: 'Days', value: 'days' }
          ],
          displayOptions: {
            show: {
              '/options.timeoutAmount': [{ _cnd: { gt: 0 } }]
            }
          }
        },
        {
          name: 'resumeOnTimeout',
          displayName: 'Resume on Timeout',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Whether to resume execution when timeout is reached',
          displayOptions: {
            show: {
              '/options.timeoutAmount': [{ _cnd: { gt: 0 } }]
            }
          }
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
      description: 'Data after wait period completes'
    }
  ],

  credentials: [],
  regularNode: true,
  
  version: [1, 1.1, 1.2],
  defaults: {
    name: 'Wait'
  },

  aliases: ['wait', 'delay', 'pause', 'sleep', 'timeout'],

  examples: [
    {
      name: 'Simple Delay',
      description: 'Add a 30-second delay between API calls for rate limiting',
      workflow: {
        nodes: [
          {
            name: 'Rate Limit Delay',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'timeInterval',
              amount: 30,
              unit: 'seconds'
            }
          }
        ]
      }
    },
    {
      name: 'Schedule at Specific Time',
      description: 'Wait until a specific date and time before continuing',
      workflow: {
        nodes: [
          {
            name: 'Schedule Wait',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'specificTime',
              dateTime: '2024-12-31T23:59:59.000Z'
            }
          }
        ]
      }
    },
    {
      name: 'Manual Approval Webhook',
      description: 'Wait for manual approval via webhook before processing',
      workflow: {
        nodes: [
          {
            name: 'Approval Wait',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'webhook',
              webhookSuffix: 'approve-order',
              approvalRequired: true,
              options: {
                timeoutAmount: 24,
                timeoutUnit: 'hours',
                resumeOnTimeout: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'Data Collection Form',
      description: 'Wait for user to submit additional information via form',
      workflow: {
        nodes: [
          {
            name: 'Info Collection',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'form',
              formFields: {
                field: [
                  {
                    fieldLabel: 'Priority Level',
                    fieldType: 'select',
                    fieldOptions: 'Low, Medium, High, Critical',
                    requiredField: true
                  },
                  {
                    fieldLabel: 'Additional Notes',
                    fieldType: 'textarea',
                    requiredField: false
                  },
                  {
                    fieldLabel: 'Deadline',
                    fieldType: 'date',
                    requiredField: true
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'API Rate Limiting',
      description: 'Implement progressive delays for API rate limiting',
      workflow: {
        nodes: [
          {
            name: 'Progressive Delay',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'timeInterval',
              amount: 5,
              unit: 'minutes'
            }
          }
        ]
      }
    },
    {
      name: 'Batch Processing Delay',
      description: 'Add delays between batch operations to prevent overload',
      workflow: {
        nodes: [
          {
            name: 'Batch Delay',
            type: 'n8n-nodes-base.wait',
            parameters: {
              resume: 'timeInterval',
              amount: 2,
              unit: 'seconds'
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
      'Rate limiting API calls to prevent hitting limits',
      'Adding delays between batch operations',
      'Waiting for manual approval in workflows',
      'Scheduling workflow execution at specific times',
      'Collecting additional user input during execution',
      'Preventing system overload with controlled delays',
      'Coordinating timing between different workflow branches',
      'Implementing retry delays with exponential backoff'
    ],
    errorHandling: {
      retryableErrors: ['Timeout exceeded', 'Network error'],
      nonRetryableErrors: ['Invalid date format', 'Invalid webhook configuration'],
      documentation: 'Wait node errors typically occur due to invalid time configurations or webhook setup issues'
    }
  },

  usageNotes: 'The Wait node pauses workflow execution for specified durations or until external triggers. Use it for rate limiting, manual approvals, or scheduling. Configure timeouts to prevent workflows from waiting indefinitely.',
  integrationGuide: 'Use Wait nodes strategically to control workflow timing and prevent API rate limit violations. For webhooks and forms, the generated URLs will be provided for external integration. Consider timeout settings to avoid infinite waits.'
};

export default waitNode;
