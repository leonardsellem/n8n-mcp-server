/**
 * HTTP Request Node
 * 
 * Sends HTTP requests to any web service or API. Supports all common methods (GET, POST, PUT, PATCH, DELETE, etc.):contentReference[oaicite:9]{index=9} and can be configured with authentication. This node is very versatile and allows n8n to communicate with any RESTful API:contentReference[oaicite:10]{index=10}.
 */

import { NodeTypeInfo } from '../node-types.js';

export const httprequestNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.http-request',
  displayName: 'HTTP Request',
  description: 'Sends HTTP requests to any web service or API. Supports all common methods (GET, POST, PUT, PATCH, DELETE, etc.):contentReference[oaicite:9]{index=9} and can be configured with authentication. This node is very versatile and allows n8n to communicate with any RESTful API:contentReference[oaicite:10]{index=10}.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'GET',
      description: 'The operation to perform',
      options: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' },
        { name: 'PATCH', value: 'PATCH' },
        { name: 'DELETE', value: 'DELETE' },
        { name: 'HEAD', value: 'HEAD' },
        { name: 'OPTIONS', value: 'OPTIONS' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
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
      description: 'Processed data from HTTP Request'
    }
  ],

  credentials: [
    {
      name: 'http-requestApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'HTTP Request'
  },

  aliases: ['http', 'request'],
  
  examples: [
        {
      name: 'GET Item',
      description: 'GET an item from HTTP Request',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.http-request',
            parameters: {
              operation: 'GET',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default httprequestNode;