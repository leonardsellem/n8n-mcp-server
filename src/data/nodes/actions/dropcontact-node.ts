/**
 * Dropcontact Node
 * 
 * Uses Dropcontact (contact enrichment service) to enrich contact data. You provide details like name or email, and Dropcontact returns verified email, phone, company info, etc. Great for sales lead enrichment and data cleaning.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const dropcontactNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.dropcontact',
  displayName: 'Dropcontact',
  description: 'Uses Dropcontact (contact enrichment service) to enrich contact data. You provide details like name or email, and Dropcontact returns verified email, phone, company info, etc. Great for sales lead enrichment and data cleaning.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from Dropcontact'
    }
  ],

  credentials: [
    {
      name: 'dropcontactApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Dropcontact'
  },

  aliases: ['dropcontact'],
  
  examples: [
        {
      name: 'Enrich Contact Item',
      description: 'Enrich Contact an item from Dropcontact',
      workflow: {
        nodes: [
          {
            name: 'Dropcontact',
            type: 'n8n-nodes-base.dropcontact',
            parameters: {
              operation: 'Enrich Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default dropcontactNode;