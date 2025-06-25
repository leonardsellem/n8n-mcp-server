/**
 * Agile CRM Node
 * 
 * Connects to Agile CRM. Allows you to manage contacts – create new contacts, retrieve contact info, update details, or delete contacts. Also supports similar operations for companies and deals via Agile CRM’s API.
 */

import { NodeTypeInfo } from '../node-types.js';

export const agilecrmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.agile-crm',
  displayName: 'Agile CRM',
  description: 'Connects to Agile CRM. Allows you to manage contacts – create new contacts, retrieve contact info, update details, or delete contacts. Also supports similar operations for companies and deals via Agile CRM’s API.',
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
        { name: 'Update Contact', value: 'Update Contact' },
        { name: 'Delete Contact', value: 'Delete Contact' }
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
      description: 'Processed data from Agile CRM'
    }
  ],

  credentials: [
    {
      name: 'agile-crmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Agile CRM'
  },

  aliases: ['agile', 'crm'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Agile CRM',
      workflow: {
        nodes: [
          {
            name: 'Agile CRM',
            type: 'n8n-nodes-base.agile-crm',
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

export default agilecrmNode;