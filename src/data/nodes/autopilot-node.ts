/**
 * Autopilot Node
 * 
 * Integrates with Autopilot (marketing automation). Allows adding or updating contacts in Autopilot, listing contacts, and triggering Autopilot journeys (automated marketing flows) for specific contacts.
 */

import { NodeTypeInfo } from '../node-types.js';

export const autopilotNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.autopilot',
  displayName: 'Autopilot',
  description: 'Integrates with Autopilot (marketing automation). Allows adding or updating contacts in Autopilot, listing contacts, and triggering Autopilot journeys (automated marketing flows) for specific contacts.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Add Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Add Contact', value: 'Add Contact' },
        { name: 'Update Contact', value: 'Update Contact' },
        { name: 'List Contacts', value: 'List Contacts' },
        { name: 'Trigger Journey', value: 'Trigger Journey' }
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
      description: 'Processed data from Autopilot'
    }
  ],

  credentials: [
    {
      name: 'autopilotApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Autopilot'
  },

  aliases: ['autopilot'],
  
  examples: [
        {
      name: 'Add Contact Item',
      description: 'Add Contact an item from Autopilot',
      workflow: {
        nodes: [
          {
            name: 'Autopilot',
            type: 'n8n-nodes-base.autopilot',
            parameters: {
              operation: 'Add Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default autopilotNode;