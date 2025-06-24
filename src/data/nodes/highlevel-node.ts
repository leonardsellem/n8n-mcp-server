/**
 * HighLevel Node
 * 
 * Integrates with GoHighLevel (marketing CRM). Allows adding or updating contacts in HighLevel, retrieving contact info, and creating a new opportunity in the sales pipeline. Useful for lead management and marketing automation involving HighLevel.
 */

import { NodeTypeInfo } from '../node-types.js';

export const highlevelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.highlevel',
  displayName: 'HighLevel',
  description: 'Integrates with GoHighLevel (marketing CRM). Allows adding or updating contacts in HighLevel, retrieving contact info, and creating a new opportunity in the sales pipeline. Useful for lead management and marketing automation involving HighLevel.',
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
        { name: 'Add Opportunity', value: 'Add Opportunity' }
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
      description: 'Processed data from HighLevel'
    }
  ],

  credentials: [
    {
      name: 'highlevelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'HighLevel'
  },

  aliases: ['highlevel'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from HighLevel',
      workflow: {
        nodes: [
          {
            name: 'HighLevel',
            type: 'n8n-nodes-base.highlevel',
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

export default highlevelNode;