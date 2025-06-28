/**
 * Yourls Node
 * 
 * Works with YOURLS (self-hosted URL shortening service). You can create a short URL for a given long URL and expand a short URL back to the original. Useful if you run YOURLS and want to integrate link shortening into your automation (e.g., automatically shorten links in messages).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const yourlsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.yourls',
  displayName: 'Yourls',
  description: 'Works with YOURLS (self-hosted URL shortening service). You can create a short URL for a given long URL and expand a short URL back to the original. Useful if you run YOURLS and want to integrate link shortening into your automation (e.g., automatically shorten links in messages).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Shorten URL',
      description: 'The operation to perform',
      options: [
        { name: 'Shorten URL', value: 'Shorten URL' },
        { name: 'Expand URL', value: 'Expand URL' }
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
      description: 'Processed data from Yourls'
    }
  ],

  credentials: [
    {
      name: 'yourlsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Yourls'
  },

  aliases: ['yourls'],
  
  examples: [
        {
      name: 'Shorten URL Item',
      description: 'Shorten URL an item from Yourls',
      workflow: {
        nodes: [
          {
            name: 'Yourls',
            type: 'n8n-nodes-base.yourls',
            parameters: {
              operation: 'Shorten URL',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default yourlsNode;