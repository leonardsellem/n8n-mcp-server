import { NodeTypeInfo } from '../node-types.js';

export const postbinNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postbin',
  displayName: 'PostBin',
  description: 'PostBin is a service that helps you test API clients and webhooks. Use the PostBin node to automate work in PostBin, and integrate PostBin with other applications. n8n has built-in support for a wide range of PostBin features, including creating and deleting bins, and getting and sending requests.',
  category: 'Development',
  subcategory: 'Testing Tools',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'bin',
      description: 'The resource to operate on',
      options: [
        { name: 'Bin', value: 'bin', description: 'Work with PostBin bins' },
        { name: 'Request', value: 'request', description: 'Handle requests to bins' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new bin' },
        { name: 'Get', value: 'get', description: 'Get information about a bin' },
        { name: 'Delete', value: 'delete', description: 'Delete a bin' },
        { name: 'Get Request', value: 'getRequest', description: 'Get requests from a bin' },
        { name: 'Remove First Request', value: 'removeFirst', description: 'Remove the first request from a bin' },
        { name: 'Send Request', value: 'send', description: 'Send a request to a bin' }
      ]
    },
    {
      name: 'binId',
      displayName: 'Bin ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The unique identifier of the PostBin bin'
    },
    {
      name: 'method',
      displayName: 'HTTP Method',
      type: 'options',
      required: false,
      default: 'POST',
      description: 'The HTTP method to use when sending requests',
      options: [
        { name: 'GET', value: 'GET', description: 'GET request' },
        { name: 'POST', value: 'POST', description: 'POST request' },
        { name: 'PUT', value: 'PUT', description: 'PUT request' },
        { name: 'DELETE', value: 'DELETE', description: 'DELETE request' },
        { name: 'PATCH', value: 'PATCH', description: 'PATCH request' }
      ]
    },
    {
      name: 'headers',
      displayName: 'Headers',
      type: 'collection',
      required: false,
      default: {},description: 'Headers to send with the request',
      options: [
        {
          name: 'headerItem',
          values: [
            {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
              description: 'Header name'
    },
            {
      name: 'value',
      displayName: 'Value',
      type: 'string',
      required: false,
      default: '',
              description: 'Header value'
    }
          ]
        }
      ]
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'The body content to send with the request'
    },
    {
      name: 'contentType',
      displayName: 'Content Type',
      type: 'options',
      required: false,
      default: 'application/json',
      description: 'The content type of the request body',
      options: [
        { name: 'application/json', value: 'application/json', description: 'JSON content' },
        { name: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded', description: 'Form data' },
        { name: 'text/plain', value: 'text/plain', description: 'Plain text' },
        { name: 'application/xml', value: 'application/xml', description: 'XML content' }
      ]
    },
    {
      name: 'queryParameters',
      displayName: 'Query Parameters',
      type: 'collection',
      required: false,
      default: {},description: 'Query parameters to add to the request URL',
      options: [
        {
          name: 'parameterItem',
          values: [
            {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
              description: 'Parameter name'
    },
            {
      name: 'value',
      displayName: 'Value',
      type: 'string',
      required: false,
      default: '',
              description: 'Parameter value'
    }
          ]
        }
      ]
    },
    {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 30,
      description: 'Request timeout in seconds'
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
      description: 'The processed PostBin data'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create PostBin',
      description: 'Create a new PostBin to collect HTTP requests',
      workflow: {
        nodes: [
          {
            name: 'PostBin',
            type: 'n8n-nodes-base.postbin',
            parameters: {
              resource: 'bin',
              operation: 'create'
            }
          }
        ]
      }
    },
    {
      name: 'Send Test Request',
      description: 'Send a test request to a PostBin',
      workflow: {
        nodes: [
          {
            name: 'PostBin',
            type: 'n8n-nodes-base.postbin',
            parameters: {
              resource: 'request',
              operation: 'send',
              binId: 'your-bin-id',
              method: 'POST',
              body: '{"test": "data"}',
              contentType: 'application/json'
            }
          }
        ]
      }
    },
    {
      name: 'Get Bin Requests',
      description: 'Retrieve all requests sent to a PostBin',
      workflow: {
        nodes: [
          {
            name: 'PostBin',
            type: 'n8n-nodes-base.postbin',
            parameters: {
              resource: 'request',
              operation: 'getRequest',
              binId: 'your-bin-id'
            }
          }
        ]
      }
    },
    {
      name: 'Delete PostBin',
      description: 'Delete a PostBin when testing is complete',
      workflow: {
        nodes: [
          {
            name: 'PostBin',
            type: 'n8n-nodes-base.postbin',
            parameters: {
              resource: 'bin',
              operation: 'delete',
              binId: 'your-bin-id'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const postbinNodes: NodeTypeInfo[] = [postbinNode];

// Export individual actions for the PostBin node
export const postbinActions = [
  'create_bin',
  'get_bin',
  'delete_bin',
  'get_request',
  'remove_first_request',
  'send_request'
];