/**
 * Brevo Node
 * 
 * Integrates with Brevo (formerly Sendinblue) email marketing service. You can send transactional emails via Brevo, retrieve or list contacts, and add contacts to Brevo lists. Useful for marketing automation and transactional email through Brevo’s API.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const brevoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.brevo',
  displayName: 'Brevo',
  description: 'Integrates with Brevo (formerly Sendinblue) email marketing service. You can send transactional emails via Brevo, retrieve or list contacts, and add contacts to Brevo lists. Useful for marketing automation and transactional email through Brevo’s API.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Email',
      description: 'The operation to perform',
      options: [
        { name: 'Send Email', value: 'Send Email' },
        { name: 'List Contacts', value: 'List Contacts' },
        { name: 'Add Contact to List', value: 'Add Contact to List' }
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
      description: 'Processed data from Brevo'
    }
  ],

  credentials: [
    {
      name: 'brevoApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Brevo'
  },

  aliases: ['brevo'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from Brevo',
      workflow: {
        nodes: [
          {
            name: 'Brevo',
            type: 'n8n-nodes-base.brevo',
            parameters: {
              operation: 'Send Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default brevoNode;