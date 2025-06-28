/**
 * Iterable Node
 * 
 * Integrates with Iterable (marketing automation). You can add or update user profiles in Iterable and track custom events for a user (such as a purchase or email open). This helps keep marketing data in sync and trigger campaigns in Iterable.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const iterableNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.iterable',
  displayName: 'Iterable',
  description: 'Integrates with Iterable (marketing automation). You can add or update user profiles in Iterable and track custom events for a user (such as a purchase or email open). This helps keep marketing data in sync and trigger campaigns in Iterable.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Create Contact', value: 'Create Contact' },
        { name: 'Update Contact', value: 'Update Contact' },
        { name: 'Track Event', value: 'Track Event' }
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
      description: 'Processed data from Iterable'
    }
  ],

  credentials: [
    {
      name: 'iterableApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Iterable'
  },

  aliases: ['iterable'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Iterable',
      workflow: {
        nodes: [
          {
            name: 'Iterable',
            type: 'n8n-nodes-base.iterable',
            parameters: {
              operation: 'Create Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default iterableNode;