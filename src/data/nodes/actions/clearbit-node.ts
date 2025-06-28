/**
 * Clearbit Node
 * 
 * Uses Clearbit’s API for data enrichment. You can supply an email or domain to enrich person or company information (returning details like name, role, company info), or use the Reveal function to get company info from an IP address. Great for augmenting leads or user data:contentReference[oaicite:20]{index=20}.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const clearbitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clearbit',
  displayName: 'Clearbit',
  description: 'Uses Clearbit’s API for data enrichment. You can supply an email or domain to enrich person or company information (returning details like name, role, company info), or use the Reveal function to get company info from an IP address. Great for augmenting leads or user data:contentReference[oaicite:20]{index=20}.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Enrich Person',
      description: 'The operation to perform',
      options: [
        { name: 'Enrich Person', value: 'Enrich Person' },
        { name: 'Enrich Company', value: 'Enrich Company' },
        { name: 'Reveal (IP lookup)', value: 'Reveal (IP lookup)' }
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
      description: 'Processed data from Clearbit'
    }
  ],

  credentials: [
    {
      name: 'clearbitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Clearbit'
  },

  aliases: ['clearbit'],
  
  examples: [
        {
      name: 'Enrich Person Item',
      description: 'Enrich Person an item from Clearbit',
      workflow: {
        nodes: [
          {
            name: 'Clearbit',
            type: 'n8n-nodes-base.clearbit',
            parameters: {
              operation: 'Enrich Person',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default clearbitNode;