/**
 * Zammad Node
 * 
 * Integrates with Zammad (open-source helpdesk). You can create support tickets, retrieve and update ticket details, and list users (customers or agents). Useful for customer support automation, like logging issues from forms or updating tickets from external triggers.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const zammadNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zammad',
  displayName: 'Zammad',
  description: 'Integrates with Zammad (open-source helpdesk). You can create support tickets, retrieve and update ticket details, and list users (customers or agents). Useful for customer support automation, like logging issues from forms or updating tickets from external triggers.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Ticket',
      description: 'The operation to perform',
      options: [
        { name: 'Create Ticket', value: 'Create Ticket' },
        { name: 'Get Ticket', value: 'Get Ticket' },
        { name: 'Update Ticket', value: 'Update Ticket' },
        { name: 'List Users', value: 'List Users' }
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
      description: 'Processed data from Zammad'
    }
  ],

  credentials: [
    {
      name: 'zammadApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zammad'
  },

  aliases: ['zammad'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from Zammad',
      workflow: {
        nodes: [
          {
            name: 'Zammad',
            type: 'n8n-nodes-base.zammad',
            parameters: {
              operation: 'Create Ticket',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default zammadNode;