/**
 * Monica CRM Node
 * 
 * Integrates with Monica (personal CRM). You can create new contacts (people), retrieve contact details, add a note to a contact’s timeline, and list contacts. Useful for automating personal relationship management tasks with Monica.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const monicacrmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.monica-crm',
  displayName: 'Monica CRM',
  description: 'Integrates with Monica (personal CRM). You can create new contacts (people), retrieve contact details, add a note to a contact’s timeline, and list contacts. Useful for automating personal relationship management tasks with Monica.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Create Contact', value: 'Create Contact' },
        { name: 'Get Contact', value: 'Get Contact' },
        { name: 'Add Note', value: 'Add Note' },
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
      description: 'Processed data from Monica CRM'
    }
  ],

  credentials: [
    {
      name: 'monica-crmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Monica CRM'
  },

  aliases: ['monica', 'crm'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Monica CRM',
      workflow: {
        nodes: [
          {
            name: 'Monica CRM',
            type: 'n8n-nodes-base.monica-crm',
            parameters: {
              operation: 'Create Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default monicacrmNode;