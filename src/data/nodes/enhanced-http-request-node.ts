import { NodeTypeInfo } from '../node-types.js';

// This matches the ACTUAL HTTP Request node structure in n8n
export const httpRequestNodeComplete: NodeTypeInfo = {
  name: 'n8n-nodes-base.httpRequest',
  displayName: 'HTTP Request',
  description: 'Makes an HTTP request and returns the response data',
  category: 'Core',
  subcategory: 'Helpers',

  // Real n8n HTTP Request node properties - complete implementation
  properties: [
    {
      name: 'nodeVersion',
      displayName: 'Node Version',
      type: 'hidden',
      default: 4.2,
      required: false,
      description: 'Version of the HTTP Request node'
    },
    {
      name: 'method',
      displayName: 'Method',
      type: 'options',
      required: true,
      default: 'GET',
      description: 'Request method',
      options: [
        {
          name: 'DELETE',
          value: 'DELETE',
          description: 'DELETE request'
        },
        {
          name: 'GET',
          value: 'GET', 
          description: 'GET request'
        },
        {
          name: 'HEAD',
          value: 'HEAD',
          description: 'HEAD request'
        },
        {
          name: 'OPTIONS',
          value: 'OPTIONS',
          description: 'OPTIONS request'
        },
        {
          name: 'PATCH',
          value: 'PATCH',
          description: 'PATCH request'
        },
        {
          name: 'POST',
          value: 'POST',
          description: 'POST request'
        },
        {
          name: 'PUT',
          value: 'PUT',
          description: 'PUT request'
        }
      ]
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: true,
      default: '',
      description: 'The URL to make the request to',
      placeholder: 'https://httpbin.org/get'
    },
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Authentication method',
      options: [
        {
          name: 'Basic Auth',
          value: 'basicAuth',
          description: 'Basic authentication'
        },
        {
          name: 'Custom Auth',
          value: 'customAuth',
          description: 'Custom authentication headers'
        },
        {
          name: 'Digest Auth',
          value: 'digestAuth', 
          description: 'Digest authentication'
        },
        {
          name: 'None',
          value: 'none',
          description: 'No authentication'
        },
        {
          name: 'OAuth1',
          value: 'oAuth1',
          description: 'OAuth 1.0 authentication'
        },
        {
          name: 'OAuth2',
          value: 'oAuth2',
          description: 'OAuth 2.0 authentication'
        }
      ]
    },
    {
      name: 'sendQuery',
      displayName: 'Query Parameters',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add query parameters to the URL'
    },
    {
      name: 'queryParameters',
      displayName: 'Query Parameters',
      type: 'fixedCollection',
      required: false,
      placeholder: 'Add Parameter',
      default: { parameters: [] },
      description: 'Query parameters to send',
      displayOptions: {
        show: {
          sendQuery: [true]
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'parameters',
          displayName: 'Parameter',
          values: [
            {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
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
      name: 'sendHeaders',
      displayName: 'Headers',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add headers to the request'
    },
    {
      name: 'headerParameters',
      displayName: 'Header Parameters',
      type: 'fixedCollection',
      required: false,
      placeholder: 'Add Header',
      default: { parameters: [] },
      description: 'Headers to send',
      displayOptions: {
        show: {
          sendHeaders: [true]
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'parameters',
          displayName: 'Header',
          values: [
            {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
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
      name: 'sendBody',
      displayName: 'Body',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Send body with request',
      displayOptions: {
        show: {
          method: ['PATCH', 'POST', 'PUT', 'DELETE']
        }
      }
    },
    {
      name: 'bodyContentType',
      displayName: 'Body Content Type',
      type: 'options',
      required: false,
      default: 'json',
      description: 'How to send the body data',
      displayOptions: {
        show: {
          sendBody: [true]
        }
      },
      options: [
        {
          name: 'Form-Data Multipart',
          value: 'multipart-form-data',
          description: 'Send as multipart/form-data'
        },
        {
          name: 'Form Encoded',
          value: 'form-urlencoded',
          description: 'Send as application/x-www-form-urlencoded'
        },
        {
          name: 'JSON',
          value: 'json',
          description: 'Send as JSON'
        },
        {
          name: 'Raw',
          value: 'raw',
          description: 'Send raw data'
        }
      ]
    },
    {
      name: 'jsonBody',
      displayName: 'JSON',
      type: 'json',
      required: false,
      default: '{}',
      description: 'JSON data to send',
      displayOptions: {
        show: {
          sendBody: [true],
          bodyContentType: ['json']
        }
      }
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'Body data to send',
      typeOptions: {
        rows: 5
      },
      displayOptions: {
        show: {
          sendBody: [true],
          bodyContentType: ['raw']
        }
      }
    },
    {
      name: 'bodyParameters',
      displayName: 'Body Parameters',
      type: 'fixedCollection',
      required: false,
      placeholder: 'Add Parameter',
      default: { parameters: [] },
      description: 'Parameters to send in body',
      displayOptions: {
        show: {
          sendBody: [true],
          bodyContentType: ['form-urlencoded', 'multipart-form-data']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'parameters',
          displayName: 'Parameter',
          values: [
            {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
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
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      placeholder: 'Add Option',
      default: {},description: 'Additional options',
      options: [
        {
      name: 'redirect',
      displayName: 'Redirect',
      type: 'options',
      required: false,
          description: 'How to handle redirects',
          options: [
            {
              name: 'Follow Redirect',
              value: 'follow',
              description: 'Follow redirects automatically'
    },
            {
              name: 'Reject',
              value: 'error',
              description: 'Reject redirects'
            },
            {
              name: 'Return Response',
              value: 'manual',
              description: 'Return redirect response'
            }
          ]
        },
        {
      name: 'response',
      displayName: 'Response',
      type: 'options',
      required: false,
      default: 'autodetect',
          description: 'How to handle the response',
          options: [
            {
              name: 'Autodetect',
              value: 'autodetect',
              description: 'Autodetect response format'
    },
            {
              name: 'File',
              value: 'file',
              description: 'Return response as file'
            },
            {
              name: 'JSON',
              value: 'json',
              description: 'Parse response as JSON'
            },
            {
              name: 'String',
              value: 'string',
              description: 'Return response as string'
            }
          ]
        },
        {
      name: 'responseFormat',
      displayName: 'Response Format',
      type: 'options',
      required: false,
      default: 'autodetect',
          description: 'Format for the response data',
          options: [
            {
              name: 'Autodetect',
              value: 'autodetect',
              description: 'Autodetect response format'
    },
            {
              name: 'JSON',
              value: 'json',
              description: 'JSON response'
            },
            {
              name: 'String',
              value: 'string',
              description: 'String response'
            }
          ]
        },
        {
      name: 'timeout',
      displayName: 'Timeout',
      type: 'number',
      required: false,
      default: 10000,
          description: 'Time in ms to wait for the request before timing out',
          typeOptions: {
            minValue: 1
    }
        },
        {
      name: 'allowUnauthorizedCerts',
      displayName: 'Allow Unauthorized Certificates',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Allow requests to servers with invalid or unauthorized certificates'
    },
        {
      name: 'queryParameterArrays',
      displayName: 'Query Parameter Arrays',
      type: 'options',
      required: false,
      default: 'indices',
          description: 'How to send arrays in query parameters',
          options: [
            {
              name: 'As Separate Values',
              value: 'repeat',
              description: 'Send arrays as separate values (key=value1&key=value2)'
    },
            {
              name: 'With Brackets',
              value: 'brackets',
              description: 'Send arrays with brackets (key[]=value1&key[]=value2)'
            },
            {
              name: 'With Indices',
              value: 'indices',
              description: 'Send arrays with indices (key[0]=value1&key[1]=value2)'
            }
          ]
        },
        {
      name: 'fullResponse',
      displayName: 'Full Response',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Include response status code, headers, etc.'
    },
        {
      name: 'neverError',
      displayName: 'Never Error',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Never return an error, even if the response status indicates an error'
    },
        {
      name: 'splitIntoItems',
      displayName: 'Split Into Items',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Split response array into separate items'
    },
        {
      name: 'binaryPropertyName',
      displayName: 'Binary Property Name',
      type: 'string',
      required: false,
      default: 'data',
          description: 'Name of the binary property to store the file in'
    },
        {
      name: 'useQuerystring',
      displayName: 'Use Querystring',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Use the legacy querystring module instead of URLSearchParams'
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
      required: true,
      displayOptions: {
        show: {
          authentication: ['basicAuth']
        }
      }
    },
    {
      name: 'httpDigestAuth',
      required: true,
      displayOptions: {
        show: {
          authentication: ['digestAuth']
        }
      }
    },
    {
      name: 'oAuth1Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth1']
        }
      }
    },
    {
      name: 'oAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    },
    {
      name: 'httpHeaderAuth',
      required: true,
      displayOptions: {
        show: {
          authentication: ['customAuth']
        }
      }
    }
  ],

  regularNode: true,
  codeable: false,

  // Dynamic subtitle showing method and URL
  subtitle: '={{$parameter["method"] + ": " + $parameter["url"]}}',

  // Node version
  version: [3, 4, 4.1, 4.2],

  // Default settings
  defaults: {
    name: 'HTTP Request',
    color: '#2196F3'
  },

  // Search aliases
  aliases: ['API', 'REST', 'Request', 'Fetch', 'HTTP', 'HTTPS', 'GET', 'POST'],

  // Usage examples
  examples: [
    {
      name: 'Simple GET Request',
      description: 'Make a basic GET request to an API',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/users'
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
              bodyContentType: 'json',
              jsonBody: {
                title: 'Test Post',
                body: 'This is a test post from n8n',
                userId: 1
              }
            }
          }
        ]
      }
    },
    {
      name: 'API with Headers and Auth',
      description: 'Make authenticated request with custom headers',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'GET',
              url: 'https://api.github.com/user',
              authentication: 'customAuth',
              sendHeaders: true,
              headerParameters: {
                parameters: [
                  {
                    name: 'Authorization',
                    value: 'Bearer {{$credentials.token}}'
                  },
                  {
                    name: 'User-Agent',
                    value: 'n8n-workflow'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Form Data Upload',
      description: 'Upload a file using form data',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              sendBody: true,
              bodyContentType: 'multipart-form-data',
              bodyParameters: {
                parameters: [
                  {
                    name: 'file',
                    value: '={{$json["binaryData"]}}'
                  },
                  {
                    name: 'description',
                    value: 'File uploaded from n8n'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'URL with Query Parameters',
      description: 'Add query parameters to the request URL',
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
                parameters: [
                  {
                    name: 'userId',
                    value: '1'
                  },
                  {
                    name: '_limit',
                    value: '5'
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

// Codex metadata for the HTTP Request node
export const httpRequestCodex = {
  node: 'n8n-nodes-base.httpRequest',
  nodeVersion: '4.2',
  codexVersion: '1.0',
  categories: ['Core'],
  resources: {
    primaryDocumentation: [
      {
        url: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/'
      }
    ],
    generic: [
      {
        label: 'HTTP protocol documentation',
        icon: '🌐',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP'
      },
      {
        label: 'REST API best practices',
        icon: '📚',
        url: 'https://restfulapi.net/'
      }
    ]
  },
  alias: ['API', 'REST', 'Request', 'Fetch', 'HTTP', 'HTTPS', 'GET', 'POST', 'PUT', 'DELETE'],
  subcategories: {
    Core: ['Helpers']
  }
};

export default httpRequestNodeComplete;