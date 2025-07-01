/**
 * # Respond to Webhook
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Flow Control
 * 
 * ## Description
 * 
 * Use the Respond to Webhook node to control the response to incoming webhooks. 
 * This node works with the Webhook node.
 * 
 * ## How to Use
 * 
 * 1. Add a Webhook node as the trigger node for the workflow
 * 2. In the Webhook node, set **Respond** to **Using 'Respond to Webhook' node**
 * 3. Add the Respond to Webhook node anywhere in your workflow
 * 4. If you want it to return data from other nodes, place it after those nodes
 * 
 * **⚠️ Important**: The Respond to Webhook node runs once, using the first incoming data item.
 * 
 * ## Node Parameters
 * 
 * ### Respond With
 * Choose what data to send in the webhook response:
 * 
 * - **All Incoming Items**: Respond with all the JSON items from the input
 * - **Binary File**: Respond with a binary file defined in **Response Data Source**
 * - **First Incoming Item**: Respond with the first incoming item's JSON
 * - **JSON**: Respond with a JSON object defined in **Response Body**
 * - **JWT Token**: Respond with a JSON Web Token (JWT)
 * - **No Data**: No response payload
 * - **Redirect**: Redirect to a URL set in **Redirect URL**
 * - **Text**: Respond with text set in **Response Body**
 * 
 * ## Node Options
 * 
 * - **Response Code**: Set the HTTP response code to use
 * - **Response Headers**: Define the response headers to send
 * - **Put Response in Field**: Available with **All Incoming Items** or **First Incoming Item**. 
 *   Set the field name for the field containing the response data
 * 
 * ## Output Configuration
 * 
 * ### Enable Response Output Branch
 * By default, the node has a single output branch with input data. You can enable a second 
 * output branch containing the response sent to the webhook:
 * 
 * - **Input Data**: The original output, passing on the node's input
 * - **Response**: The response object sent to the webhook
 * 
 * ## Workflow Behavior
 * 
 * - **Workflow finishes without executing**: Returns standard message with 200 status
 * - **Workflow errors before execution**: Returns error message with 500 status
 * - **Second Respond to Webhook executes**: Workflow ignores it
 * - **No webhook present**: Workflow ignores the Respond to Webhook node
 * 
 * ## Key Features
 * 
 * - **Multiple response formats**: Support for JSON, text, binary files, redirects, and JWT tokens
 * - **Custom response codes**: Set any HTTP status code
 * - **Custom headers**: Define response headers for API requirements
 * - **Dual output branches**: Access both input data and response data
 * - **Webhook integration**: Works seamlessly with Webhook trigger nodes
 * - **Error handling**: Automatic error responses for failed workflows
 * 
 * ## Use Cases
 * 
 * - Create REST API endpoints with custom responses
 * - Build webhook receivers with data processing
 * - Implement chatbots with formatted responses
 * - Create file download endpoints
 * - Build authentication systems with JWT responses
 * - Implement redirect services
 * - Create data validation APIs with detailed error responses
 * 
 * ## Common Patterns
 * 
 * ### API Endpoint Creation
 * - Process incoming data and return formatted JSON responses
 * - Validate input and return appropriate HTTP status codes
 * - Transform data and return in required format
 * 
 * ### Error Handling
 * - Return 400 for validation errors
 * - Return 404 for resource not found
 * - Return 500 for processing errors
 * 
 * ### File Operations
 * - Process uploaded files and return confirmation
 * - Generate files and return for download
 * - Transform file formats and return converted files
 */

import { NodeTypeInfo } from '../../node-types.js';

export const respondToWebhookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.respondtowebhook',
  displayName: 'Respond to Webhook',
  description: 'Control the response to incoming webhooks',
  category: 'Core Nodes',
  subcategory: 'Flow Control',
  
  properties: [
    {
      name: 'respondWith',
      displayName: 'Respond With',
      type: 'options',
      required: true,
      default: 'firstIncomingItem',
      description: 'What data to send in the webhook response',
      options: [
        {
          name: 'All Incoming Items',
          value: 'allIncomingItems',
          description: 'Respond with all JSON items from input'
        },
        {
          name: 'Binary File',
          value: 'binaryFile',
          description: 'Respond with a binary file'
        },
        {
          name: 'First Incoming Item',
          value: 'firstIncomingItem',
          description: 'Respond with first incoming item JSON'
        },
        {
          name: 'JSON',
          value: 'json',
          description: 'Respond with custom JSON object'
        },
        {
          name: 'JWT Token',
          value: 'jwtToken',
          description: 'Respond with JSON Web Token'
        },
        {
          name: 'No Data',
          value: 'noData',
          description: 'No response payload'
        },
        {
          name: 'Redirect',
          value: 'redirect',
          description: 'Redirect to specified URL'
        },
        {
          name: 'Text',
          value: 'text',
          description: 'Respond with plain text'
        }
      ]
    },
    {
      name: 'responseBody',
      displayName: 'Response Body',
      type: 'string',
      required: false,
      default: '',
      description: 'The response body content',
      placeholder: '{"message": "Success"}',
      displayOptions: {
        show: {
          respondWith: ['json', 'text']
        }
      }
    },
    {
      name: 'binaryPropertyName',
      displayName: 'Response Data Source',
      type: 'string',
      required: true,
      default: 'data',
      description: 'The binary property name containing the file data',
      displayOptions: {
        show: {
          respondWith: ['binaryFile']
        }
      }
    },
    {
      name: 'redirectUrl',
      displayName: 'Redirect URL',
      type: 'string',
      required: true,
      default: '',
      description: 'URL to redirect to',
      placeholder: 'https://example.com/success',
      displayOptions: {
        show: {
          respondWith: ['redirect']
        }
      }
    },
    {
      name: 'jwtToken',
      displayName: 'JWT Token',
      type: 'string',
      required: true,
      default: '',
      description: 'The JWT token to return',
      displayOptions: {
        show: {
          respondWith: ['jwtToken']
        }
      }
    },
    {
      name: 'responseCode',
      displayName: 'Response Code',
      type: 'number',
      required: false,
      default: 200,
      description: 'HTTP response status code',
      typeOptions: {
        minValue: 100,
        maxValue: 599
      }
    },
    {
      name: 'responseHeaders',
      displayName: 'Response Headers',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Headers to include in the response',
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'header',
          displayName: 'Header',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              required: true,
              default: '',
              description: 'Header name',
              placeholder: 'Content-Type'
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              required: true,
              default: '',
              description: 'Header value',
              placeholder: 'application/json'
            }
          ]
        }
      ]
    },
    {
      name: 'putResponseInField',
      displayName: 'Put Response in Field',
      type: 'string',
      required: false,
      default: '',
      description: 'Field name for the response data',
      placeholder: 'response',
      displayOptions: {
        show: {
          respondWith: ['allIncomingItems', 'firstIncomingItem']
        }
      }
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
          name: 'enableResponseOutputBranch',
          displayName: 'Enable Response Output Branch',
          type: 'boolean',
          default: false,
          description: 'Enable second output branch with response data'
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
      displayName: 'Input Data',
      description: 'Original input data passed through'
    },
    {
      type: 'main',
      displayName: 'Response',
      description: 'Response object sent to webhook (if enabled)'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Respond to Webhook'
  },

  aliases: ['respond', 'webhook', 'api', 'endpoint'],
  
  examples: [
    {
      name: 'Simple JSON API Response',
      description: 'Return a JSON response with custom message',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'json',
              responseBody: '{"status": "success", "message": "Data processed successfully"}',
              responseCode: 200,
              responseHeaders: {
                header: [
                  {
                    name: 'Content-Type',
                    value: 'application/json'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Return Processed Data',
      description: 'Return the first incoming item after processing',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'firstIncomingItem',
              responseCode: 200,
              putResponseInField: 'result'
            }
          }
        ]
      }
    },
    {
      name: 'File Download Endpoint',
      description: 'Return a binary file for download',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'binaryFile',
              binaryPropertyName: 'data',
              responseHeaders: {
                header: [
                  {
                    name: 'Content-Disposition',
                    value: 'attachment; filename="export.csv"'
                  },
                  {
                    name: 'Content-Type',
                    value: 'text/csv'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Error Response',
      description: 'Return error response with custom status code',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'json',
              responseBody: '{"error": "Invalid request", "code": "VALIDATION_ERROR"}',
              responseCode: 400,
              responseHeaders: {
                header: [
                  {
                    name: 'Content-Type',
                    value: 'application/json'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Redirect Response',
      description: 'Redirect user to success page after processing',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'redirect',
              redirectUrl: 'https://example.com/success',
              responseCode: 302
            }
          }
        ]
      }
    },
    {
      name: 'JWT Authentication Response',
      description: 'Return JWT token after successful authentication',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondtowebhook',
            parameters: {
              respondWith: 'jwtToken',
              jwtToken: '{{ $json.token }}',
              responseCode: 200,
              responseHeaders: {
                header: [
                  {
                    name: 'Content-Type',
                    value: 'application/json'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
};

export default respondToWebhookNode;
