/**
 * Facebook Graph API Node
 * 
 * Uses Facebook’s Graph API for various Facebook/Instagram operations. For example, retrieving page insight metrics, publishing a post to a Facebook Page, or managing ad campaigns. Requires appropriate Facebook API credentials and permissions.
 */

import { NodeTypeInfo } from '../node-types.js';

export const facebookgraphapiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.facebook-graph-api',
  displayName: 'Facebook Graph API',
  description: 'Uses Facebook’s Graph API for various Facebook/Instagram operations. For example, retrieving page insight metrics, publishing a post to a Facebook Page, or managing ad campaigns. Requires appropriate Facebook API credentials and permissions.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Page Insights',
      description: 'The operation to perform',
      options: [
        { name: 'Get Page Insights', value: 'Get Page Insights' },
        { name: 'Publish Post', value: 'Publish Post' },
        { name: 'Manage Ads', value: 'Manage Ads' }
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
      description: 'Processed data from Facebook Graph API'
    }
  ],

  credentials: [
    {
      name: 'facebook-graph-apiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Facebook Graph API'
  },

  aliases: ['facebook', 'graph', 'api'],
  
  examples: [
        {
      name: 'Get Page Insights Item',
      description: 'Get Page Insights an item from Facebook Graph API',
      workflow: {
        nodes: [
          {
            name: 'Facebook Graph API',
            type: 'n8n-nodes-base.facebook-graph-api',
            parameters: {
              operation: 'Get Page Insights',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default facebookgraphapiNode;