/**
 * Automizy Node
 * 
 * Works with Automizy (email marketing automation). You can add new contacts, retrieve or update contact info, and list contacts or subscribers. Useful for syncing contacts between Automizy and other databases.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const automizyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.automizy',
  displayName: 'Automizy',
  description: 'Works with Automizy (email marketing automation). You can add new contacts, retrieve or update contact info, and list contacts or subscribers. Useful for syncing contacts between Automizy and other databases.',
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
      description: 'Processed data from Automizy'
    }
  ],

  credentials: [
    {
      name: 'automizyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Automizy'
  },

  aliases: ['automizy'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Automizy',
      workflow: {
        nodes: [
          {
            name: 'Automizy',
            type: 'n8n-nodes-base.automizy',
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

export default automizyNode;