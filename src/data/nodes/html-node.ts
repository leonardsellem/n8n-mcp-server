/**
 * HTML Node
 * 
 * Processes HTML content. It can extract data from HTML (using selectors) or encode input into HTML. Often used for parsing web page content or preparing HTML for emails or webhooks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const htmlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.html',
  displayName: 'HTML',
  description: 'Processes HTML content. It can extract data from HTML (using selectors) or encode input into HTML. Often used for parsing web page content or preparing HTML for emails or webhooks.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Extract',
      description: 'The operation to perform',
      options: [
        { name: 'Extract', value: 'Extract' },
        { name: 'Encode', value: 'Encode' }
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
      description: 'Processed data from HTML'
    }
  ],

  credentials: [
    {
      name: 'htmlApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'HTML'
  },

  aliases: ['html'],
  
  examples: [
        {
      name: 'Extract Item',
      description: 'Extract an item from HTML',
      workflow: {
        nodes: [
          {
            name: 'HTML',
            type: 'n8n-nodes-base.html',
            parameters: {
              operation: 'Extract',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default htmlNode;