/**
 * Google Contacts Node
 * 
 * Integrates with Google Contacts. You can create new contacts in Google Contacts, retrieve contact info, update contacts, delete contacts, and list all contacts. Useful for syncing contact data or managing address books through automation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlecontactsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-contacts',
  displayName: 'Google Contacts',
  description: 'Integrates with Google Contacts. You can create new contacts in Google Contacts, retrieve contact info, update contacts, delete contacts, and list all contacts. Useful for syncing contact data or managing address books through automation.',
  category: 'Productivity',
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
        { name: 'Delete Contact', value: 'Delete Contact' },
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
      description: 'Processed data from Google Contacts'
    }
  ],

  credentials: [
    {
      name: 'google-contactsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Contacts'
  },

  aliases: ['google', 'contacts'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Google Contacts',
      workflow: {
        nodes: [
          {
            name: 'Google Contacts',
            type: 'n8n-nodes-base.google-contacts',
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

export default googlecontactsNode;