/**
 * ActiveCampaign Node
 * 
 * Connects to ActiveCampaign (marketing automation platform). You can create or update contacts, add or remove contact tags, retrieve campaign or contact details, and otherwise interact with ActiveCampaign data via its API.
 */

import { NodeTypeInfo } from '../node-types.js';

export const activecampaignNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.activecampaign',
  displayName: 'ActiveCampaign',
  description: 'Connects to ActiveCampaign (marketing automation platform). You can create or update contacts, add or remove contact tags, retrieve campaign or contact details, and otherwise interact with ActiveCampaign data via its API.',
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
        { name: 'Get/Update Contact', value: 'Get/Update Contact' },
        { name: 'Manage Contact Tags', value: 'Manage Contact Tags' },
        { name: 'List Campaigns', value: 'List Campaigns' }
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
      description: 'Processed data from ActiveCampaign'
    }
  ],

  credentials: [
    {
      name: 'activecampaignApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'ActiveCampaign'
  },

  aliases: ['activecampaign'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from ActiveCampaign',
      workflow: {
        nodes: [
          {
            name: 'ActiveCampaign',
            type: 'n8n-nodes-base.activecampaign',
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

export default activecampaignNode;