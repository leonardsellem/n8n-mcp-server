/**
 * Vero Node
 * 
 * Integrates with Vero (customer messaging platform). You can track custom events (for user behavior tracking), create a new user profile, and update user attributes in Vero. This supports personalized messaging campaigns by keeping user data and events up-to-date.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const veroNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.vero',
  displayName: 'Vero',
  description: 'Integrates with Vero (customer messaging platform). You can track custom events (for user behavior tracking), create a new user profile, and update user attributes in Vero. This supports personalized messaging campaigns by keeping user data and events up-to-date.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Track Event',
      description: 'The operation to perform',
      options: [
        { name: 'Track Event', value: 'Track Event' },
        { name: 'Create User', value: 'Create User' },
        { name: 'Update User', value: 'Update User' }
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
      description: 'Processed data from Vero'
    }
  ],

  credentials: [
    {
      name: 'veroApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Vero'
  },

  aliases: ['vero'],
  
  examples: [
        {
      name: 'Track Event Item',
      description: 'Track Event an item from Vero',
      workflow: {
        nodes: [
          {
            name: 'Vero',
            type: 'n8n-nodes-base.vero',
            parameters: {
              operation: 'Track Event',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default veroNode;