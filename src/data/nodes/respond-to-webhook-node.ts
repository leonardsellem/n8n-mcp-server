/**
 * Respond to Webhook Node
 * 
 * Sends a response back to the caller of a Webhook. Use this in workflows triggered by a Webhook node to send HTTP response data (like a confirmation or result) back to the HTTP client that made the request.
 */

import { NodeTypeInfo } from '../node-types.js';

export const respondtowebhookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.respond-to-webhook',
  displayName: 'Respond to Webhook',
  description: 'Sends a response back to the caller of a Webhook. Use this in workflows triggered by a Webhook node to send HTTP response data (like a confirmation or result) back to the HTTP client that made the request.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Respond to Webhook'
    }
  ],

  credentials: [
    {
      name: 'respond-to-webhookApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Respond to Webhook'
  },

  aliases: ['respond', 'webhook'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Respond to Webhook',
      workflow: {
        nodes: [
          {
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respond-to-webhook',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default respondtowebhookNode;