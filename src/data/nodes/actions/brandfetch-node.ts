/**
 * Brandfetch Node
 * 
 * Uses Brandfetch API to retrieve brand assets (like logos, colors, fonts) for a given company or domain. Provide a domain or company name, and the node returns official branding details. Useful for auto-fetching logos or brand info by domain.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const brandfetchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.brandfetch',
  displayName: 'Brandfetch',
  description: 'Uses Brandfetch API to retrieve brand assets (like logos, colors, fonts) for a given company or domain. Provide a domain or company name, and the node returns official branding details. Useful for auto-fetching logos or brand info by domain.',
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
      description: 'Processed data from Brandfetch'
    }
  ],

  credentials: [
    {
      name: 'brandfetchApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Brandfetch'
  },

  aliases: ['brandfetch'],
  
  examples: [
        {
      name: 'Get Brand Assets Item',
      description: 'Get Brand Assets an item from Brandfetch',
      workflow: {
        nodes: [
          {
            name: 'Brandfetch',
            type: 'n8n-nodes-base.brandfetch',
            parameters: {
              operation: 'Get Brand Assets',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default brandfetchNode;