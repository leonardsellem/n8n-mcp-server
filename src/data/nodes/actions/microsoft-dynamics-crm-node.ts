/**
 * Microsoft Dynamics CRM Node
 * 
 * Connects to Microsoft Dynamics 365 CRM. Allows creating, retrieving, updating, and listing entity records (such as Contacts, Accounts, Leads) in the CRM. Useful for enterprise CRM data synchronization and automation of sales/customer data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftdynamicscrmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-dynamics-crm',
  displayName: 'Microsoft Dynamics CRM',
  description: 'Connects to Microsoft Dynamics 365 CRM. Allows creating, retrieving, updating, and listing entity records (such as Contacts, Accounts, Leads) in the CRM. Useful for enterprise CRM data synchronization and automation of sales/customer data.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Record',
      description: 'The operation to perform',
      options: [
        { name: 'Create Record', value: 'Create Record' },
        { name: 'Get Record', value: 'Get Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'List Records', value: 'List Records' }
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
      description: 'Processed data from Microsoft Dynamics CRM'
    }
  ],

  credentials: [
    {
      name: 'microsoft-dynamics-crmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft Dynamics CRM'
  },

  aliases: ['microsoft', 'dynamics', 'crm'],
  
  examples: [
        {
      name: 'Create Record Item',
      description: 'Create Record an item from Microsoft Dynamics CRM',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Dynamics CRM',
            type: 'n8n-nodes-base.microsoft-dynamics-crm',
            parameters: {
              operation: 'Create Record',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftdynamicscrmNode;