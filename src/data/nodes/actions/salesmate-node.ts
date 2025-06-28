/**
 * Salesmate Node
 * 
 * Connects to Salesmate (CRM). Allows adding new contacts, retrieving contact info, listing deals in the pipeline, and updating deal details. Useful for sales pipeline automation and keeping Salesmate data updated via external triggers.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const salesmateNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.salesmate',
  displayName: 'Salesmate',
  description: 'Connects to Salesmate (CRM). Allows adding new contacts, retrieving contact info, listing deals in the pipeline, and updating deal details. Useful for sales pipeline automation and keeping Salesmate data updated via external triggers.',
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
        { name: 'List Deals', value: 'List Deals' },
        { name: 'Update Deal', value: 'Update Deal' }
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
      description: 'Processed data from Salesmate'
    }
  ],

  credentials: [
    {
      name: 'salesmateApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Salesmate'
  },

  aliases: ['salesmate'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from Salesmate',
      workflow: {
        nodes: [
          {
            name: 'Salesmate',
            type: 'n8n-nodes-base.salesmate',
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

export default salesmateNode;