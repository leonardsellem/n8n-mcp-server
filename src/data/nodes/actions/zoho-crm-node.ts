/**
 * Zoho CRM Node
 * 
 * Integrates with Zoho CRM. You can create leads or contacts, retrieve lead details, update records, convert leads to contacts/deals, and search for records in modules. Enables sales and marketing automation involving Zoho’s CRM data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const zohocrmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zoho-crm',
  displayName: 'Zoho CRM',
  description: 'Integrates with Zoho CRM. You can create leads or contacts, retrieve lead details, update records, convert leads to contacts/deals, and search for records in modules. Enables sales and marketing automation involving Zoho’s CRM data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Lead',
      description: 'The operation to perform',
      options: [
        { name: 'Create Lead', value: 'Create Lead' },
        { name: 'Get Lead', value: 'Get Lead' },
        { name: 'Update Lead', value: 'Update Lead' },
        { name: 'Convert Lead', value: 'Convert Lead' },
        { name: 'Search Records', value: 'Search Records' }
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
      description: 'Processed data from Zoho CRM'
    }
  ],

  credentials: [
    {
      name: 'zoho-crmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zoho CRM'
  },

  aliases: ['zoho', 'crm'],
  
  examples: [
        {
      name: 'Create Lead Item',
      description: 'Create Lead an item from Zoho CRM',
      workflow: {
        nodes: [
          {
            name: 'Zoho CRM',
            type: 'n8n-nodes-base.zoho-crm',
            parameters: {
              operation: 'Create Lead',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default zohocrmNode;