/**
 * Cloudflare Node
 * 
 * Connects to Cloudflare’s API. You can manage DNS records for a zone (add, update, delete DNS entries), purge cached content from Cloudflare’s CDN, and retrieve analytics for a domain (like visitor stats). Enables automation of DNS and caching operations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const cloudflareNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cloudflare',
  displayName: 'Cloudflare',
  description: 'Connects to Cloudflare’s API. You can manage DNS records for a zone (add, update, delete DNS entries), purge cached content from Cloudflare’s CDN, and retrieve analytics for a domain (like visitor stats). Enables automation of DNS and caching operations.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'DNS Record: Create/Update/Delete',
      description: 'The operation to perform',
      options: [
        { name: 'DNS Record: Create/Update/Delete', value: 'DNS Record: Create/Update/Delete' },
        { name: 'Purge Cache', value: 'Purge Cache' },
        { name: 'Get Analytics', value: 'Get Analytics' }
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
      description: 'Processed data from Cloudflare'
    }
  ],

  credentials: [
    {
      name: 'cloudflareApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Cloudflare'
  },

  aliases: ['cloudflare'],
  
  examples: [
        {
      name: 'DNS Record: Create/Update/Delete Item',
      description: 'DNS Record: Create/Update/Delete an item from Cloudflare',
      workflow: {
        nodes: [
          {
            name: 'Cloudflare',
            type: 'n8n-nodes-base.cloudflare',
            parameters: {
              operation: 'DNS Record: Create/Update/Delete',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default cloudflareNode;