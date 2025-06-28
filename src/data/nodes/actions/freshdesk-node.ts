/**
 * Freshdesk Node
 * 
 * Works with Freshdesk (helpdesk software). Enables creating support tickets, retrieving or updating ticket details, and listing customer contacts. Useful for automating customer support workflows and syncing ticket data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const freshdeskNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.freshdesk',
  displayName: 'Freshdesk',
  description: 'Works with Freshdesk (helpdesk software). Enables creating support tickets, retrieving or updating ticket details, and listing customer contacts. Useful for automating customer support workflows and syncing ticket data.',
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
        { name: 'List Contacts', value: 'List Contacts' }
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
      description: 'Processed data from Freshdesk'
    }
  ],

  credentials: [
    {
      name: 'freshdeskApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Freshdesk'
  },

  aliases: ['freshdesk'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from Freshdesk',
      workflow: {
        nodes: [
          {
            name: 'Freshdesk',
            type: 'n8n-nodes-base.freshdesk',
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

export default freshdeskNode;