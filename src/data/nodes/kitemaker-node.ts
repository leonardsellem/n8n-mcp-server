/**
 * Kitemaker Node
 * 
 * Connects to Kitemaker (collaborative product development platform). Allows creating new tickets (work items), updating ticket status or fields, and listing tickets. Helps integrate Kitemaker with other project management or development tools.
 */

import { NodeTypeInfo } from '../node-types.js';

export const kitemakerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.kitemaker',
  displayName: 'Kitemaker',
  description: 'Connects to Kitemaker (collaborative product development platform). Allows creating new tickets (work items), updating ticket status or fields, and listing tickets. Helps integrate Kitemaker with other project management or development tools.',
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
      description: 'Processed data from Kitemaker'
    }
  ],

  credentials: [
    {
      name: 'kitemakerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Kitemaker'
  },

  aliases: ['kitemaker'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from Kitemaker',
      workflow: {
        nodes: [
          {
            name: 'Kitemaker',
            type: 'n8n-nodes-base.kitemaker',
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

export default kitemakerNode;