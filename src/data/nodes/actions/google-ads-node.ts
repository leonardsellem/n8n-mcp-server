/**
 * Google Ads Node
 * 
 * Connects to Google Ads. Allows retrieving a list of ad campaigns, adjusting campaign or keyword bids, and pulling campaign analytics or performance metrics. This enables automating some aspects of campaign management or reporting.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googleadsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-ads',
  displayName: 'Google Ads',
  description: 'Connects to Google Ads. Allows retrieving a list of ad campaigns, adjusting campaign or keyword bids, and pulling campaign analytics or performance metrics. This enables automating some aspects of campaign management or reporting.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Campaigns',
      description: 'The operation to perform',
      options: [
        { name: 'Get Campaigns', value: 'Get Campaigns' },
        { name: 'Update Bids', value: 'Update Bids' },
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
      description: 'Processed data from Google Ads'
    }
  ],

  credentials: [
    {
      name: 'google-adsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Ads'
  },

  aliases: ['google', 'ads'],
  
  examples: [
        {
      name: 'Get Campaigns Item',
      description: 'Get Campaigns an item from Google Ads',
      workflow: {
        nodes: [
          {
            name: 'Google Ads',
            type: 'n8n-nodes-base.google-ads',
            parameters: {
              operation: 'Get Campaigns',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googleadsNode;