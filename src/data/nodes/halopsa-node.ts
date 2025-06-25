/**
 * HaloPSA Node
 * 
 * Integrates with HaloPSA (IT service management). Allows creating support tickets, retrieving ticket information, and updating ticket fields/status. Useful for automating ITSM tasks and syncing HaloPSA with other tools (e.g., alerting systems).
 */

import { NodeTypeInfo } from '../node-types.js';

export const halopsaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.halopsa',
  displayName: 'HaloPSA',
  description: 'Integrates with HaloPSA (IT service management). Allows creating support tickets, retrieving ticket information, and updating ticket fields/status. Useful for automating ITSM tasks and syncing HaloPSA with other tools (e.g., alerting systems).',
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
        { name: 'Update Ticket', value: 'Update Ticket' }
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
      description: 'Processed data from HaloPSA'
    }
  ],

  credentials: [
    {
      name: 'halopsaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'HaloPSA'
  },

  aliases: ['halopsa'],
  
  examples: [
        {
      name: 'Create Ticket Item',
      description: 'Create Ticket an item from HaloPSA',
      workflow: {
        nodes: [
          {
            name: 'HaloPSA',
            type: 'n8n-nodes-base.halopsa',
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

export default halopsaNode;