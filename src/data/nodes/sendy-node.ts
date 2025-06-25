/**
 * Sendy Node
 * 
 * Connects to Sendy (self-hosted newsletter application). Allows adding a subscriber to a mailing list and listing subscribers. Useful for maintaining email lists on a Sendy server via automation (like adding sign-ups or syncing contacts).
 */

import { NodeTypeInfo } from '../node-types.js';

export const sendyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sendy',
  displayName: 'Sendy',
  description: 'Connects to Sendy (self-hosted newsletter application). Allows adding a subscriber to a mailing list and listing subscribers. Useful for maintaining email lists on a Sendy server via automation (like adding sign-ups or syncing contacts).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Add Subscriber',
      description: 'The operation to perform',
      options: [
        { name: 'Add Subscriber', value: 'Add Subscriber' },
        { name: 'List Subscribers', value: 'List Subscribers' }
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
      description: 'Processed data from Sendy'
    }
  ],

  credentials: [
    {
      name: 'sendyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Sendy'
  },

  aliases: ['sendy'],
  
  examples: [
        {
      name: 'Add Subscriber Item',
      description: 'Add Subscriber an item from Sendy',
      workflow: {
        nodes: [
          {
            name: 'Sendy',
            type: 'n8n-nodes-base.sendy',
            parameters: {
              operation: 'Add Subscriber',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sendyNode;