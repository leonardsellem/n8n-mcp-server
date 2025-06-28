import { NodeTypeInfo } from '../../node-types.js';

export const webhookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webhook',
  displayName: 'Webhook',
  description: 'Starts the workflow when a webhook is called. Essential for creating API endpoints and receiving real-time data from external services.',
  category: 'Core',
  subcategory: 'Trigger',
  properties: [
    {
      name: 'httpMethod',
      displayName: 'HTTP Method',
      type: 'options',
      required: true,
      default: 'GET',
      description: 'The HTTP method that will trigger this webhook',
      options: [
        { name: 'GET', value: 'GET', description: 'Triggered by GET requests' },
        { name: 'POST', value: 'POST', description: 'Triggered by POST requests' },
        { name: 'PUT', value: 'PUT', description: 'Triggered by PUT requests' },
        { name: 'DELETE', value: 'DELETE', description: 'Triggered by DELETE requests' },
        { name: 'PATCH', value: 'PATCH', description: 'Triggered by PATCH requests' },
        { name: 'HEAD', value: 'HEAD', description: 'Triggered by HEAD requests' },
        { name: 'OPTIONS', value: 'OPTIONS', description: 'Triggered by OPTIONS requests' }
      ]
    },
    {
      name: 'path',
      displayName: 'Path',
      type: 'string',
      required: false,
      default: '',
      description: 'The path for the webhook URL (e.g., "my-webhook"). Leave empty for a random path.'
    },
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Authentication method for the webhook',
      options: [
        { name: 'None', value: 'none', description: 'No authentication required' },
        { name: 'Basic Auth', value: 'basicAuth', description: 'Username and password authentication' },
        { name: 'Header Auth', value: 'headerAuth', description: 'Custom header authentication' },
        { name: 'Query Auth', value: 'queryAuth', description: 'Query parameter authentication' }
      ]
    },
    {
      name: 'responseMode',
      displayName: 'Response',
      type: 'options',
      required: false,
      default: 'onReceived',
      description: 'When to respond to the webhook call',
      options: [
        { name: 'Immediately', value: 'onReceived', description: 'Respond immediately when webhook is received' },
        { name: 'When Last Node Finishes', value: 'lastNode', description: 'Respond when the workflow completes' },
        { name: 'Using Respond to Webhook Node', value: 'responseNode', description: 'Use a separate Respond to Webhook node' }
      ]
    },
    {
      name: 'responseCode',
      displayName: 'Response Code',
      type: 'number',
      required: false,
      default: 200,
      description: 'HTTP status code to return in the response'
    },
    {
      name: 'responseData',
      displayName: 'Response Data',
      type: 'options',
      required: false,
      default: 'firstEntryJson',
      description: 'What data to return in the response',
      options: [
        { name: 'First Entry JSON', value: 'firstEntryJson', description: 'Return the JSON of the first entry' },
        { name: 'First Entry Binary', value: 'firstEntryBinary', description: 'Return the binary data of the first entry' },
        { name: 'All Entries', value: 'allEntries', description: 'Return all entries as JSON array' },
        { name: 'No Data', value: 'noData', description: 'Return no data, just status code' }
      ]
    },
    {
      name: 'responseHeaders',
      displayName: 'Response Headers',
      type: 'collection',
      required: false,
      default: {},
      description: 'Custom headers to include in the response'
    },
    {
      name: 'binaryPropertyName',
      displayName: 'Binary Property Name',
      type: 'string',
      required: false,
      default: 'data',
      description: 'Name of the binary property for file uploads'
    },
    {
      name: 'ignoreBots',
      displayName: 'Ignore Bots',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to ignore requests from bots and crawlers'
    },
    {
      name: 'isFullPath',
      displayName: 'Is Full Path',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the path is the full webhook URL path'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when webhook is called'
    }
  ],
  triggerNode: true,
  webhookSupport: true,
  polling: false,
  examples: [
    {
      name: 'Simple GET Webhook',
      description: 'Create a basic GET webhook endpoint',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'GET',
              path: 'my-api',
              responseMode: 'onReceived',
              responseCode: 200
            }
          }
        ]
      }
    },
    {
      name: 'POST Data Handler',
      description: 'Receive and process POST data',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: 'submit-data',
              responseMode: 'lastNode',
              responseCode: 201,
              responseHeaders: {
                'Content-Type': 'application/json'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Secure Webhook with Auth',
      description: 'Webhook with basic authentication',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: 'secure-endpoint',
              authentication: 'basicAuth',
              responseMode: 'onReceived',
              responseCode: 200
            }
          }
        ]
      }
    },
    {
      name: 'File Upload Webhook',
      description: 'Receive file uploads via webhook',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: 'file-upload',
              binaryPropertyName: 'uploadedFile',
              responseMode: 'lastNode',
              responseCode: 200,
              responseData: 'noData'
            }
          }
        ]
      }
    },
    {
      name: 'REST API Endpoint',
      description: 'Create a full REST API endpoint with custom responses',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: 'api/users',
              responseMode: 'responseNode',
              responseHeaders: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            }
          }
        ]
      }
    },
    {
      name: 'GitHub Webhook Handler',
      description: 'Handle GitHub webhook events',
      workflow: {
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
              httpMethod: 'POST',
              path: 'github-webhook',
              authentication: 'headerAuth',
              responseMode: 'onReceived',
              responseCode: 200,
              responseData: 'noData'
            }
          }
        ]
      }
    }
  ]
};

export const respondToWebhookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.respondToWebhook',
  displayName: 'Respond to Webhook',
  description: 'Returns data to the webhook call that triggered the workflow. Used with webhooks set to respond via separate node.',
  category: 'Core',
  subcategory: 'Response',
  properties: [
    {
      name: 'responseCode',
      displayName: 'Response Code',
      type: 'number',
      required: false,
      default: 200,
      description: 'HTTP status code to return'
    },
    {
      name: 'responseData',
      displayName: 'Response Data',
      type: 'options',
      required: false,
      default: 'firstEntryJson',
      description: 'What data to return in the response',
      options: [
        { name: 'First Entry JSON', value: 'firstEntryJson', description: 'Return the JSON of the first entry' },
        { name: 'First Entry Binary', value: 'firstEntryBinary', description: 'Return the binary data of the first entry' },
        { name: 'All Entries', value: 'allEntries', description: 'Return all entries as JSON array' },
        { name: 'No Data', value: 'noData', description: 'Return no data, just status code' },
        { name: 'Text', value: 'text', description: 'Return custom text' },
        { name: 'JSON', value: 'json', description: 'Return custom JSON' }
      ]
    },
    {
      name: 'responseBody',
      displayName: 'Response Body',
      type: 'string',
      required: false,
      default: '',
      description: 'Custom response body (when using Text or JSON response data)'
    },
    {
      name: 'responseHeaders',
      displayName: 'Response Headers',
      type: 'collection',
      required: false,
      default: {},
      description: 'Custom headers to include in the response'
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
      description: 'Data passed through after responding to webhook'
    }
  ],
  regularNode: true,
  examples: [
    {
      name: 'Custom JSON Response',
      description: 'Return custom JSON data to webhook caller',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondToWebhook',
            parameters: {
              responseCode: 200,
              responseData: 'json',
              responseBody: '{"status": "success", "message": "Data processed successfully"}',
              responseHeaders: {
                'Content-Type': 'application/json'
              }
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const webhookNodes: NodeTypeInfo[] = [webhookNode, respondToWebhookNode];

// Export common webhook use cases
export const webhookUseCases = [
  'api_endpoint',
  'github_webhook',
  'stripe_webhook',
  'slack_slash_command',
  'form_submission',
  'file_upload',
  'chatbot_integration',
  'iot_data_collection',
  'payment_notification',
  'cms_webhook'
];

// Export common HTTP status codes
export const httpStatusCodes = {
  success: [200, 201, 202, 204],
  redirect: [301, 302, 304],
  clientError: [400, 401, 403, 404, 409, 422],
  serverError: [500, 502, 503, 504]
};