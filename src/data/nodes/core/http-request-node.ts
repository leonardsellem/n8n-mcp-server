/**
 * # HTTP Request
 * 
 * **Status**: Active  
 * **Category**: Core Nodes
 * **Subcategory**: Data
 * 
 * ## Description
 * 
 * The HTTP Request node is one of the most versatile nodes in n8n. It allows you to make HTTP requests 
 * to query data from any app or service with a REST API. You can use the HTTP Request node as a regular 
 * node or attached to an AI agent to use as a tool.
 * 
 * ## Key Features
 * 
 * - All HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * - Multiple authentication types: Basic, OAuth1/2, Header, Query, Digest, Custom
 * - Predefined credential support for known services
 * - Comprehensive body formats: JSON, Form-Data, URLEncoded, Raw, Binary Files
 * - Query parameters and custom headers
 * - Advanced options: Pagination, Batching, SSL settings, Redirects, Proxy
 * - Response optimization for AI tools
 * - Import cURL commands directly
 * - Built-in pagination variables and response handling
 * 
 * ## Use Cases
 * 
 * - REST API integrations with external services
 * - Custom operations for existing n8n nodes
 * - Webhook sending and API calls
 * - File uploads and downloads
 * - Data synchronization between systems
 * - API monitoring and health checks
 * - AI agent web scraping and data fetching
 * - Authentication testing and API exploration
 */

import { NodeTypeInfo } from '../../node-types.js';

export const httprequestNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.httpRequest',
  displayName: 'HTTP Request',
  description: 'Make HTTP requests to query data from any app or service with a REST API. Supports all HTTP methods, authentication, headers, and advanced options.',
  category: 'Core Nodes',
  subcategory: 'Data',
  
  properties: [
    {
      name: 'method',
      displayName: 'Method',
      type: 'options',
      required: true,
      default: 'GET',
      description: 'The HTTP method to use for the request',
      options: [
        { name: 'DELETE', value: 'DELETE' },
        { name: 'GET', value: 'GET' },
        { name: 'HEAD', value: 'HEAD' },
        { name: 'OPTIONS', value: 'OPTIONS' },
        { name: 'PATCH', value: 'PATCH' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' }
      ]
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: true,
      default: '',
      placeholder: 'https://api.example.com/endpoint',
      description: 'The URL endpoint to send the request to'
    },
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Authentication method to use',
      options: [
        { name: 'None', value: 'none' },
        { name: 'Predefined Credential Type', value: 'predefinedCredentialType' },
        { name: 'Generic Credential Type', value: 'genericCredentialType' }
      ]
    },
    {
      name: 'sendQuery',
      displayName: 'Send Query Parameters',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add query parameters to the request URL'
    },
    {
      name: 'queryParameters',
      displayName: 'Query Parameters',
      type: 'collection',
      required: false,
      placeholder: 'Add Parameter',
      default: {},
      description: 'Query parameters to add to the request URL',
      displayOptions: {
        show: {
          sendQuery: [true]
        }
      },
      options: [
        {
          name: 'parameter',
          displayName: 'Parameter',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              default: '',
              description: 'Name of the query parameter'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              default: '',
              description: 'Value of the query parameter'
            }
          ]
        }
      ]
    },
    {
      name: 'sendHeaders',
      displayName: 'Send Headers',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add headers to the request'
    },
    {
      name: 'headerParameters',
      displayName: 'Header Parameters',
      type: 'collection',
      required: false,
      placeholder: 'Add Header',
      default: {},
      description: 'Headers to add to the request',
      displayOptions: {
        show: {
          sendHeaders: [true]
        }
      },
      options: [
        {
          name: 'parameter',
          displayName: 'Parameter',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              default: '',
              description: 'Name of the header parameter'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              default: '',
              description: 'Value of the header parameter'
            }
          ]
        }
      ]
    },
    {
      name: 'sendBody',
      displayName: 'Send Body',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Send a request body'
    },
    {
      name: 'contentType',
      displayName: 'Body Content Type',
      type: 'options',
      required: false,
      displayOptions: {
        show: {
          sendBody: [true]
        }
      },
      default: 'json',
      description: 'Format of the request body',
      options: [
        { name: 'Form URLencoded', value: 'form-urlencoded' },
        { name: 'Form-Data', value: 'form-data' },
        { name: 'JSON', value: 'json' },
        { name: 'n8n Binary File', value: 'binaryFile' },
        { name: 'Raw', value: 'raw' }
      ]
    },
    {
      name: 'jsonBody',
      displayName: 'JSON Body',
      type: 'json',
      required: false,
      displayOptions: {
        show: {
          sendBody: [true],
          contentType: ['json']
        }
      },
      default: '{}',
      description: 'JSON data to send in the request body'
    },
    {
      name: 'bodyParameters',
      displayName: 'Body Parameters',
      type: 'collection',
      required: false,
      placeholder: 'Add Parameter',
      default: {},
      description: 'Parameters to send in the request body',
      displayOptions: {
        show: {
          sendBody: [true],
          contentType: ['form-urlencoded', 'form-data']
        }
      },
      options: [
        {
          name: 'parameter',
          displayName: 'Parameter',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              default: '',
              description: 'Name of the body parameter'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              default: '',
              description: 'Value of the body parameter'
            }
          ]
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'HTTP response data'
    }
  ],

  credentials: [
    {
      name: 'httpBasicAuth',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    },
    {
      name: 'httpDigestAuth',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    },
    {
      name: 'httpHeaderAuth',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    },
    {
      name: 'httpQueryAuth',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    },
    {
      name: 'oAuth1Api',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    },
    {
      name: 'oAuth2Api',
      required: false,
      displayOptions: {
        show: {
          authentication: ['genericCredentialType']
        }
      }
    }
  ],

  regularNode: true,
  
  version: [1, 1.1, 2, 3, 4, 4.1, 4.2],
  defaults: {
    name: 'HTTP Request'
  },

  aliases: ['http', 'request', 'api', 'rest', 'web', 'curl'],
  
  examples: [
    {
      name: 'Simple GET Request',
      description: 'Fetch data from a REST API endpoint',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/posts/1'
            }
          }
        ]
      }
    },
    {
      name: 'POST with JSON Body',
      description: 'Send JSON data to an API endpoint',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'POST',
              url: 'https://jsonplaceholder.typicode.com/posts',
              sendBody: true,
              contentType: 'json',
              jsonBody: '{"title": "New Post", "body": "This is a new post", "userId": 1}'
            }
          }
        ]
      }
    },
    {
      name: 'GET with Query Parameters',
      description: 'Fetch data with filtering via query parameters',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/posts',
              sendQuery: true,
              queryParameters: {
                parameter: [
                  { name: 'userId', value: '1' },
                  { name: '_limit', value: '5' }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Request with Custom Headers',
      description: 'Send API request with custom headers',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'GET',
              url: 'https://api.example.com/data',
              sendHeaders: true,
              headerParameters: {
                parameter: [
                  { name: 'Authorization', value: 'Bearer your-token-here' },
                  { name: 'Content-Type', value: 'application/json' },
                  { name: 'User-Agent', value: 'n8n-workflow' }
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
      'REST API integration',
      'Data fetching from web services',
      'Webhook sending',
      'File uploads and downloads',
      'Authentication testing',
      'API monitoring and health checks'
    ],
    rateLimits: {
      requests: 0,
      window: 'depends on target API',
      unit: 'varies'
    },
    errorHandling: {
      retryableErrors: ['timeout', '429', '502', '503', '504'],
      nonRetryableErrors: ['400', '401', '403', '404'],
      documentation: 'Handle HTTP errors based on status codes'
    }
  },

  usageNotes: 'The HTTP Request node is fundamental for API integrations. Configure authentication, headers, and body content based on the target API requirements.',
  integrationGuide: 'Check target API documentation for required headers, authentication method, and request format. Use appropriate HTTP method for the operation (GET for reading, POST for creating, etc.)'
};

export default httprequestNode;
