/**
 * # Wait
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Flow Control
 * 
 * ## Description
 * 
 * Use the Wait node to pause your workflow's execution. When the workflow pauses it offloads the execution data to the database. 
 * When the resume condition is met, the workflow reloads the data and the execution continues.
 * 
 * ## Key Features
 * 
 * - **Four Resume Conditions**: Time interval, specific time, webhook call, form submission
 * - **Database Offloading**: Execution data saved to database during wait (>65 seconds)
 * - **Unique URLs**: Generated $execution.resumeUrl for webhook integrations
 * - **Authentication Support**: Basic Auth, Header Auth, JWT Auth for webhooks
 * - **Custom Forms**: Multi-field forms with validation and various input types
 * - **Timeout Limits**: Optional maximum wait times with auto-resume
 * - **Server Time**: Always uses n8n server time regardless of timezone settings
 * - **Memory Efficiency**: Short waits (<65 seconds) keep execution in memory
 * 
 * ## Resume Conditions
 * 
 * ### After Time Interval
 * - Wait for specified amount of time (seconds, minutes, hours, days)
 * - Short waits (<65 seconds) don't offload to database
 * - Uses server time regardless of workflow timezone
 * 
 * ### At Specified Time
 * - Wait until specific date and time
 * - Uses date/time picker for configuration
 * - Always uses server timezone
 * 
 * ### On Webhook Call
 * - Generate unique resume URL per execution
 * - Support for authentication (Basic, Header, JWT, None)
 * - Configurable HTTP methods and response codes
 * - Optional timeout limits and IP whitelisting
 * - Custom response data and headers
 * 
 * ### On Form Submitted
 * - Custom form with configurable fields
 * - Various field types (text, number, date, dropdown, etc.)
 * - Field validation and required field support
 * - Custom form title and description
 * - Multiple response options
 * 
 * ## Time-Based Operations
 * 
 * - Wait times less than 65 seconds keep execution in memory
 * - Longer waits offload execution data to database
 * - Server time always used (ignores workflow timezone)
 * - Timezone settings don't affect Wait node timing
 * 
 * ## Use Cases
 * 
 * - Rate limiting API calls and preventing quota exhaustion
 * - Manual approval workflows with webhook triggers
 * - Scheduled execution at specific times
 * - Data collection via custom forms
 * - Batch processing with controlled delays
 * - Workflow coordination and timing control
 * - Human-in-the-loop processes
 * - Third-party integration callbacks
 */

import { NodeTypeInfo } from '../../node-types.js';

export const waitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wait',
  displayName: 'Wait',
  description: 'Pause workflow execution until a time interval, specific time, webhook call, or form submission.',
  category: 'Core Nodes',
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
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Authentication method for webhook calls',
      displayOptions: {
        show: {
          resume: ['webhook']
        }
      },
      options: [
        { name: 'Basic Auth', value: 'basicAuth' },
        { name: 'Header Auth', value: 'headerAuth' },
        { name: 'JWT Auth', value: 'jwtAuth' },
        { name: 'None', value: 'none' }
      ]
    },
    {
      name: 'httpMethod',
      displayName: 'HTTP Method',
      type: 'options',
      required: false,
      default: 'GET',
      description: 'HTTP method the webhook should accept',
      displayOptions: {
        show: {
          resume: ['webhook']
        }
      },
      options: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' },
        { name: 'PATCH', value: 'PATCH' },
        { name: 'DELETE', value: 'DELETE' },
        { name: 'HEAD', value: 'HEAD' }
      ]
    },
    {
      name: 'responseCode',
      displayName: 'Response Code',
      type: 'number',
      required: false,
      default: 200,
      description: 'HTTP response code to return',
      displayOptions: {
        show: {
          resume: ['webhook']
        }
      }
    },
    {
      name: 'respond',
      displayName: 'Respond',
      type: 'options',
      required: false,
      default: 'immediately',
      description: 'When and how to respond to the webhook',
      displayOptions: {
        show: {
          resume: ['webhook']
        }
      },
      options: [
        { name: 'Immediately', value: 'immediately' },
        { name: 'When Last Node Finishes', value: 'lastNode' },
        { name: 'Using Respond to Webhook Node', value: 'responseNode' }
      ]
    },
    {
      name: 'formTitle',
      displayName: 'Form Title',
      type: 'string',
      required: false,
      default: 'Please provide the following information:',
      description: 'Title to display at the top of the form',
      displayOptions: {
        show: {
          resume: ['form']
        }
      }
    },
    {
      name: 'formDescription',
      displayName: 'Form Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description to display beneath the form title',
      displayOptions: {
        show: {
          resume: ['form']
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
