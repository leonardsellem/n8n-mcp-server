/**
 * Chargebee Node
 * 
 * Integrates with Chargebee (subscription billing platform). Supports operations like creating customers, starting new subscriptions, retrieving subscription details, and canceling subscriptions. Useful for automating billing and subscription management tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const chargebeeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.chargebee',
  displayName: 'Chargebee',
  description: 'Integrates with Chargebee (subscription billing platform). Supports operations like creating customers, starting new subscriptions, retrieving subscription details, and canceling subscriptions. Useful for automating billing and subscription management tasks.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Customer',
      description: 'The operation to perform',
      options: [
        { name: 'Create Customer', value: 'Create Customer' },
        { name: 'Create Subscription', value: 'Create Subscription' },
        { name: 'Get Subscription', value: 'Get Subscription' },
        { name: 'Cancel Subscription', value: 'Cancel Subscription' }
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
      description: 'Processed data from Chargebee'
    }
  ],

  credentials: [
    {
      name: 'chargebeeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Chargebee'
  },

  aliases: ['chargebee'],
  
  examples: [
        {
      name: 'Create Customer Item',
      description: 'Create Customer an item from Chargebee',
      workflow: {
        nodes: [
          {
            name: 'Chargebee',
            type: 'n8n-nodes-base.chargebee',
            parameters: {
              operation: 'Create Customer',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default chargebeeNode;