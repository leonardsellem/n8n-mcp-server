/**
 * Drift Node
 * 
 * Connects to Drift (live chat and marketing). Allows listing contacts/leads captured by Drift and sending a chat message (or bot message) to a user on your site. Useful for sales/marketing workflows involving Drift’s conversational marketing.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const driftNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.drift',
  displayName: 'Drift',
  description: 'Connects to Drift (live chat and marketing). Allows listing contacts/leads captured by Drift and sending a chat message (or bot message) to a user on your site. Useful for sales/marketing workflows involving Drift’s conversational marketing.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Contacts',
      description: 'The operation to perform',
      options: [
        { name: 'List Contacts', value: 'List Contacts' },
        { name: 'Send Chat Message', value: 'Send Chat Message' }
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
      description: 'Processed data from Drift'
    }
  ],

  credentials: [
    {
      name: 'driftApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Drift'
  },

  aliases: ['drift'],
  
  examples: [
        {
      name: 'List Contacts Item',
      description: 'List Contacts an item from Drift',
      workflow: {
        nodes: [
          {
            name: 'Drift',
            type: 'n8n-nodes-base.drift',
            parameters: {
              operation: 'List Contacts',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default driftNode;