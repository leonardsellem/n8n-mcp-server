/**
 * Strapi Node
 * 
 * Works with Strapi (open-source headless CMS). Allows CRUD operations on content entries in Strapi collections: create new entries, retrieve an entry, update, or delete. This enables integration of Strapi-managed content with other systems, like syncing product info or articles.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const strapiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.strapi',
  displayName: 'Strapi',
  description: 'Works with Strapi (open-source headless CMS). Allows CRUD operations on content entries in Strapi collections: create new entries, retrieve an entry, update, or delete. This enables integration of Strapi-managed content with other systems, like syncing product info or articles.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Entry',
      description: 'The operation to perform',
      options: [
        { name: 'Create Entry', value: 'Create Entry' },
        { name: 'Get Entry', value: 'Get Entry' },
        { name: 'Update Entry', value: 'Update Entry' },
        { name: 'Delete Entry', value: 'Delete Entry' }
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
      description: 'Processed data from Strapi'
    }
  ],

  credentials: [
    {
      name: 'strapiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Strapi'
  },

  aliases: ['strapi'],
  
  examples: [
        {
      name: 'Create Entry Item',
      description: 'Create Entry an item from Strapi',
      workflow: {
        nodes: [
          {
            name: 'Strapi',
            type: 'n8n-nodes-base.strapi',
            parameters: {
              operation: 'Create Entry',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default strapiNode;