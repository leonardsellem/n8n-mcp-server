/**
 * SyncroMSP Node
 * 
 * Integrates with SyncroMSP (IT helpdesk/PSA software). Allows creating a new support ticket, retrieving ticket details, and adding a comment or reply to a ticket. Useful for MSPs to automate ticket generation from alerts or update tickets from external inputs.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const syncromspNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.syncromsp',
  displayName: 'SyncroMSP',
  description: 'Integrates with SyncroMSP (IT helpdesk/PSA software). Allows creating a new support ticket, retrieving ticket details, and adding a comment or reply to a ticket. Useful for MSPs to automate ticket generation from alerts or update tickets from external inputs.',
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
        { name: 'Add Ticket Comment', value: 'Add Ticket Comment' }
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
      description: 'Processed data from SyncroMSP'
    }
  ],

  credentials: [
    {
      name: 'syncromspApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SyncroMSP'
  },

  aliases: ['syncromsp'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from SyncroMSP',
      workflow: {
        nodes: [
          {
            name: 'SyncroMSP',
            type: 'n8n-nodes-base.syncromsp',
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

export default syncromspNode;