/**
 * crowd.dev Node
 * 
 * Works with crowd.dev (community data platform). You can retrieve users, create a new user profile, and fetch community activity data. This helps in automating community management tasks or syncing community data with other tools.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const crowddevNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.crowddev',
  displayName: 'crowd.dev',
  description: 'Works with crowd.dev (community data platform). You can retrieve users, create a new user profile, and fetch community activity data. This helps in automating community management tasks or syncing community data with other tools.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Users',
      description: 'The operation to perform',
      options: [
        { name: 'List Users', value: 'List Users' },
        { name: 'Create User', value: 'Create User' },
        { name: 'Get Activities', value: 'Get Activities' }
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
      description: 'Processed data from crowd.dev'
    }
  ],

  credentials: [
    {
      name: 'crowddevApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'crowd.dev'
  },

  aliases: ['crowd.dev'],
  
  examples: [
        {
      name: 'List Users Item',
      description: 'List Users an item from crowd.dev',
      workflow: {
        nodes: [
          {
            name: 'crowd.dev',
            type: 'n8n-nodes-base.crowddev',
            parameters: {
              operation: 'List Users',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default crowddevNode;