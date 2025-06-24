/**
 * Lemlist Node
 * 
 * Integrates with Lemlist (cold email outreach). You can add a new lead, retrieve lead info (including status of emails), and add leads to email campaigns. Great for automating cold outreach sequences and syncing leads with other CRMs.
 */

import { NodeTypeInfo } from '../node-types.js';

export const lemlistNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.lemlist',
  displayName: 'Lemlist',
  description: 'Integrates with Lemlist (cold email outreach). You can add a new lead, retrieve lead info (including status of emails), and add leads to email campaigns. Great for automating cold outreach sequences and syncing leads with other CRMs.',
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
        { name: 'Add to Campaign', value: 'Add to Campaign' }
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
      description: 'Processed data from Lemlist'
    }
  ],

  credentials: [
    {
      name: 'lemlistApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Lemlist'
  },

  aliases: ['lemlist'],
  
  examples: [
        {
      name: 'Create Lead Item',
      description: 'Create Lead an item from Lemlist',
      workflow: {
        nodes: [
          {
            name: 'Lemlist',
            type: 'n8n-nodes-base.lemlist',
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

export default lemlistNode;