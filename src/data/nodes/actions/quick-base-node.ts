/**
 * Quick Base Node
 * 
 * Integrates with Quick Base (a no-code database/app platform). Supports creating, retrieving, updating, and deleting records in a Quick Base table, as well as querying records. Useful for syncing data between Quick Base and other systems or automating Quick Base workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const quickbaseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.quick-base',
  displayName: 'Quick Base',
  description: 'Integrates with Quick Base (a no-code database/app platform). Supports creating, retrieving, updating, and deleting records in a Quick Base table, as well as querying records. Useful for syncing data between Quick Base and other systems or automating Quick Base workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Record',
      description: 'The operation to perform',
      options: [
        { name: 'Create Record', value: 'Create Record' },
        { name: 'Get Record', value: 'Get Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'Delete Record', value: 'Delete Record' },
        { name: 'Query Table', value: 'Query Table' }
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
      description: 'Processed data from Quick Base'
    }
  ],

  credentials: [
    {
      name: 'quick-baseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Quick Base'
  },

  aliases: ['quick', 'base'],
  
  examples: [
        {
      name: 'Create Record Item',
      description: 'Create Record an item from Quick Base',
      workflow: {
        nodes: [
          {
            name: 'Quick Base',
            type: 'n8n-nodes-base.quick-base',
            parameters: {
              operation: 'Create Record',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default quickbaseNode;