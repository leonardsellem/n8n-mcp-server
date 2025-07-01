/**
 * # Webhook
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * Use the Webhook node to create webhooks, which can receive data from apps and services when an event occurs. 
 * It's a trigger node, which means it can start an n8n workflow. This allows services to connect to n8n and run a workflow.
 * 
 * ## Key Features
 * 
 * - **HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
 * - **Authentication**: Basic auth, Header auth, JWT auth, or None
 * - **Custom Paths**: Define custom webhook paths with route parameters
 * - **Response Modes**: Immediate response, wait for workflow completion, or custom response
 * - **Security**: IP whitelisting, authentication, bot filtering
 * - **CORS Support**: Configure cross-origin resource sharing
 * - **Binary Data**: Handle file uploads and binary data
 * - **Custom Headers**: Send custom response headers
 * - **Test vs Production**: Separate URLs for development and production
 * 
 * ## Workflow Development Process
 * 
 * n8n provides different Webhook URLs for testing and production:
 * - **Test URL**: For development with "Listen for test event" option
 * - **Production URL**: For live workflows when activated
 * 
 * ## Use Cases
 * 
 * - Receive webhook notifications from external services
 * - Create API endpoints for custom integrations  
 * - Handle form submissions from websites
 * - Process payment notifications (Stripe, PayPal)
 * - Receive GitHub/GitLab events for CI/CD
 * - Accept data from IoT devices
 * - Handle chatbot interactions
 * - Process file uploads and binary data
 */

import { NodeTypeInfo } from '../../node-types.js';

export const webhookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webhook',
  displayName: 'Webhook',
  description: 'Create webhooks to receive data from apps and services. Triggers workflows and can return data like an API endpoint.',
  category: 'Core Nodes',
  subcategory: 'Triggers',

  properties: [
    {
      name: 'httpMethod',
      displayName: 'HTTP Method',
      type: 'options',
      required: true,
      default: 'GET',
      description: 'The HTTP method to listen for',
      options: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' },
        { name: 'DELETE', value: 'DELETE' },
        { name: 'PATCH', value: 'PATCH' },
        { name: 'HEAD', value: 'HEAD' },
        { name: 'OPTIONS', value: 'OPTIONS' }
      ]
    },
    {
      name: 'path',
      displayName: 'Path',
      type: 'string',
      required: true,
      default: '',
      description: 'The path for the webhook URL (e.g., "/my-webhook")',
      placeholder: '/webhook-path'
    },
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Type of authentication required for the webhook',
      options: [
        { name: 'None', value: 'none' },
        { name: 'Basic Auth', value: 'basicAuth' },
        { name: 'Header Auth', value: 'headerAuth' },
        { name: 'Query Auth', value: 'queryAuth' }
      ]
    },
    {
      name: 'authenticationData',
      displayName: 'Authentication Data',
      type: 'collection',
      required: false,
      default: {},
      description: 'Authentication configuration',
      displayOptions: {
        hide: {
          authentication: ['none']
        }
      },
      options: [
        {
          name: 'user',
          displayName: 'User',
          type: 'string',
          required: false,
          default: '',
          description: 'Username for Basic Auth',
          displayOptions: {
            show: {
              '/authentication': ['basicAuth']
            }
          }
        },
        {
          name: 'password',
          displayName: 'Password',
          type: 'string',
          required: false,
          default: '',
          description: 'Password for Basic Auth',
          displayOptions: {
            show: {
              '/authentication': ['basicAuth']
            }
          }
        },
        {
          name: 'name',
          displayName: 'Header/Query Name',
          type: 'string',
          required: false,
          default: '',
          description: 'Name of the header or query parameter',
          displayOptions: {
            show: {
              '/authentication': ['headerAuth', 'queryAuth']
            }
          }
        },
        {
          name: 'value',
          displayName: 'Expected Value',
          type: 'string',
          required: false,
          default: '',
          description: 'Expected value for authentication',
          displayOptions: {
            show: {
              '/authentication': ['headerAuth', 'queryAuth']
            }
          }
        }
      ]
    },
    {
      name: 'responseMode',
      displayName: 'Response',
      type: 'options',
      required: false,
      default: 'onReceived',
      description: 'When to respond and what response to return',
      options: [
        { 
          name: 'On Received', 
          value: 'onReceived', 
          description: 'Respond immediately when webhook is received' 
        },
        { 
          name: 'When Last Node Finishes', 
          value: 'lastNode', 
          description: 'Respond when the last node in the workflow finishes' 
        },
        { 
          name: 'Using Response Node', 
          value: 'responseNode', 
          description: 'Use a Respond to Webhook node to send response' 
        }
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
          responseMode: ['onReceived']
        }
      }
    },
    {
      name: 'responseData',
      displayName: 'Response Data',
      type: 'string',
      required: false,
      default: 'success',
      description: 'Data to return in the response',
      displayOptions: {
        show: {
          responseMode: ['onReceived']
        }
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional webhook options',
      options: [
        {
          name: 'binaryPropertyName',
          displayName: 'Binary Property Name',
          type: 'string',
          required: false,
          default: 'data',
          description: 'Name of the binary property to store file uploads'
        },
        {
          name: 'ignoreBots',
          displayName: 'Ignore Bots',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Ignore requests from web crawlers and bots'
        },
        {
          name: 'allowedOrigins',
          displayName: 'Allowed Origins',
          type: 'string',
          required: false,
          default: '',
          description: 'Comma-separated list of allowed origins for CORS (leave empty to allow all)',
          placeholder: 'https://example.com, https://app.example.com'
        },
        {
          name: 'rawBody',
          displayName: 'Raw Body',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Return the raw body instead of parsed JSON'
        }
      ]
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Webhook Data',
      description: 'Data received from the HTTP request'
    }
  ],

  credentials: [],
  webhookSupport: true,
  triggerNode: true,
  
  version: [1, 1.1, 1.2, 2],
  defaults: {
    name: 'Webhook'
  },

  aliases: ['webhook', 'http', 'api', 'endpoint', 'listener'],

  examples: [
    {
      name: 'Simple API Endpoint',
      description: 'Create a basic API endpoint that accepts POST requests',
      workflow: {
        nodes: [
          {
            name: 'API Endpoint',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/api/data',
              responseMode: 'onReceived',
              responseCode: 200,
              responseData: '{"status": "received", "timestamp": "{{ new Date().toISOString() }}"}'
            }
          }
        ]
      }
    },
    {
      name: 'Secure Webhook with Authentication',
      description: 'Webhook with header authentication for secure integrations',
      workflow: {
        nodes: [
          {
            name: 'Secure Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/secure/webhook',
              authentication: 'headerAuth',
              authenticationData: {
                name: 'X-API-Key',
                value: 'your-secret-api-key'
              },
              responseMode: 'lastNode'
            }
          }
        ]
      }
    },
    {
      name: 'File Upload Endpoint',
      description: 'Accept file uploads via webhook',
      workflow: {
        nodes: [
          {
            name: 'File Upload',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/upload',
              responseMode: 'onReceived',
              options: {
                binaryPropertyName: 'fileData',
                allowedOrigins: 'https://myapp.com'
              }
            }
          }
        ]
      }
    },
    {
      name: 'GitHub Webhook Integration',
      description: 'Receive GitHub webhook events for CI/CD automation',
      workflow: {
        nodes: [
          {
            name: 'GitHub Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/github/webhook',
              authentication: 'headerAuth',
              authenticationData: {
                name: 'X-GitHub-Event',
                value: 'push'
              },
              responseMode: 'responseNode'
            }
          }
        ]
      }
    },
    {
      name: 'Stripe Payment Webhook',
      description: 'Handle Stripe payment notifications',
      workflow: {
        nodes: [
          {
            name: 'Stripe Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/stripe/webhook',
              responseMode: 'lastNode',
              options: {
                rawBody: true,
                ignoreBots: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Contact Form Handler',
      description: 'Handle contact form submissions from website',
      workflow: {
        nodes: [
          {
            name: 'Contact Form',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: '/contact',
              responseMode: 'onReceived',
              responseCode: 200,
              responseData: '{"message": "Thank you for your message. We will get back to you soon!"}',
              options: {
                allowedOrigins: 'https://mywebsite.com',
                ignoreBots: true
              }
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
      'Receive webhook notifications from external services',
      'Create API endpoints for custom integrations',
      'Handle form submissions from websites',
      'Process payment notifications (Stripe, PayPal)',
      'Receive GitHub/GitLab events for CI/CD',
      'Accept data from IoT devices',
      'Handle chat bot interactions',
      'Process file uploads'
    ],
    errorHandling: {
      retryableErrors: ['Timeout', 'Connection refused'],
      nonRetryableErrors: ['Authentication failed', 'Invalid path', 'Method not allowed'],
      documentation: 'Webhook errors typically occur due to authentication issues, invalid paths, or network connectivity problems'
    }
  },

  usageNotes: 'The Webhook node creates HTTP endpoints that can receive data from external services. Configure authentication for security and choose appropriate response modes based on your workflow needs.',
  integrationGuide: 'Use webhooks to receive real-time data from external services. Set up authentication for secure endpoints and configure CORS for web applications. The webhook URL will be generated automatically based on your n8n instance and the path you specify.'
};

export default webhookNode;
