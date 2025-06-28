/**
 * Freshservice Node
 * 
 * Integrates with Freshservice (IT service management). Similar to Freshdesk: you can open new tickets, retrieve or modify existing tickets, and list tickets. Useful for IT support automation, like creating incidents from monitoring alerts.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const freshserviceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.freshservice',
  displayName: 'Freshservice',
  description: 'Integrates with Freshservice (IT service management). Similar to Freshdesk: you can open new tickets, retrieve or modify existing tickets, and list tickets. Useful for IT support automation, like creating incidents from monitoring alerts.',
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
        { name: 'List Tickets', value: 'List Tickets' }
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
      description: 'Processed data from Freshservice'
    }
  ],

  credentials: [
    {
      name: 'freshserviceApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Freshservice'
  },

  aliases: ['freshservice'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from Freshservice',
      workflow: {
        nodes: [
          {
            name: 'Freshservice',
            type: 'n8n-nodes-base.freshservice',
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

export default freshserviceNode;