/**
 * Emelia Node
 * 
 * Works with Emelia (cold email campaign platform). You can trigger sending of an email campaign and retrieve campaign statistics (opens, clicks, etc.). Useful for automating outbound email campaigns and monitoring results.
 */

import { NodeTypeInfo } from '../node-types.js';

export const emeliaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.emelia',
  displayName: 'Emelia',
  description: 'Works with Emelia (cold email campaign platform). You can trigger sending of an email campaign and retrieve campaign statistics (opens, clicks, etc.). Useful for automating outbound email campaigns and monitoring results.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Email Campaign',
      description: 'The operation to perform',
      options: [
        { name: 'Send Email Campaign', value: 'Send Email Campaign' },
        { name: 'Get Campaign Stats', value: 'Get Campaign Stats' }
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
      description: 'Processed data from Emelia'
    }
  ],

  credentials: [
    {
      name: 'emeliaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Emelia'
  },

  aliases: ['emelia'],
  
  examples: [
        {
      name: 'Send Email Campaign Item',
      description: 'Send Email Campaign an item from Emelia',
      workflow: {
        nodes: [
          {
            name: 'Emelia',
            type: 'n8n-nodes-base.emelia',
            parameters: {
              operation: 'Send Email Campaign',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default emeliaNode;