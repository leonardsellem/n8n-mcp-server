/**
 * Freshworks CRM Node
 * 
 * Connects to Freshworks CRM (Freshsales). You can create new leads, retrieve lead info, update lead details, and list leads. This helps in sales automation, ensuring leads in Freshworks CRM stay updated via other triggers or sources.
 */

import { NodeTypeInfo } from '../node-types.js';

export const freshworkscrmNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.freshworks-crm',
  displayName: 'Freshworks CRM',
  description: 'Connects to Freshworks CRM (Freshsales). You can create new leads, retrieve lead info, update lead details, and list leads. This helps in sales automation, ensuring leads in Freshworks CRM stay updated via other triggers or sources.',
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
        { name: 'List Leads', value: 'List Leads' }
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
      description: 'Processed data from Freshworks CRM'
    }
  ],

  credentials: [
    {
      name: 'freshworks-crmApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Freshworks CRM'
  },

  aliases: ['freshworks', 'crm'],
  
  examples: [
        {
      name: 'Create Lead Item',
      description: 'Create Lead an item from Freshworks CRM',
      workflow: {
        nodes: [
          {
            name: 'Freshworks CRM',
            type: 'n8n-nodes-base.freshworks-crm',
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

export default freshworkscrmNode;