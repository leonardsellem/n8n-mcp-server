/**
 * monday.com Node
 * 
 * Connects to monday.com (work management tool). You can create a new item (task) in a board, get or update an item’s values, and run custom GraphQL queries to retrieve board or item data. This allows integration of monday.com tasks and boards with other systems, like creating tasks from external triggers.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mondaycomNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mondaycom',
  displayName: 'monday.com',
  description: 'Connects to monday.com (work management tool). You can create a new item (task) in a board, get or update an item’s values, and run custom GraphQL queries to retrieve board or item data. This allows integration of monday.com tasks and boards with other systems, like creating tasks from external triggers.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Item',
      description: 'The operation to perform',
      options: [
        { name: 'Create Item', value: 'Create Item' },
        { name: 'Get Item', value: 'Get Item' },
        { name: 'Update Item', value: 'Update Item' },
        { name: 'Query Boards', value: 'Query Boards' }
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
      description: 'Processed data from monday.com'
    }
  ],

  credentials: [
    {
      name: 'mondaycomApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'monday.com'
  },

  aliases: ['monday.com'],
  
  examples: [
        {
      name: 'Create Item Item',
      description: 'Create Item an item from monday.com',
      workflow: {
        nodes: [
          {
            name: 'monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              operation: 'Create Item',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mondaycomNode;