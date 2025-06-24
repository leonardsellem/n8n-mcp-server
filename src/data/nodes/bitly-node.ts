/**
 * Bitly Node
 * 
 * Uses Bitly to shorten URLs or expand shortened links, and retrieve click statistics. You can input a long URL and get a Bitly shortened link, expand a Bitly link back to the long URL, or fetch the click count on a Bitly link.
 */

import { NodeTypeInfo } from '../node-types.js';

export const bitlyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bitly',
  displayName: 'Bitly',
  description: 'Uses Bitly to shorten URLs or expand shortened links, and retrieve click statistics. You can input a long URL and get a Bitly shortened link, expand a Bitly link back to the long URL, or fetch the click count on a Bitly link.',
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
        { name: 'Expand URL', value: 'Expand URL' },
        { name: 'Get Clicks', value: 'Get Clicks' }
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
      description: 'Processed data from Bitly'
    }
  ],

  credentials: [
    {
      name: 'bitlyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Bitly'
  },

  aliases: ['bitly'],
  
  examples: [
        {
      name: 'Shorten URL Item',
      description: 'Shorten URL an item from Bitly',
      workflow: {
        nodes: [
          {
            name: 'Bitly',
            type: 'n8n-nodes-base.bitly',
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

export default bitlyNode;