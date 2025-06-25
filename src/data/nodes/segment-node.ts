/**
 * Segment Node
 * 
 * Uses Segment (customer data platform) to send data. You can track analytics events (with properties) and identify users (associate traits with a user ID). This lets you funnel events from n8n into Segment’s unified tracking, which then forwards to various analytics/marketing tools.
 */

import { NodeTypeInfo } from '../node-types.js';

export const segmentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.segment',
  displayName: 'Segment',
  description: 'Uses Segment (customer data platform) to send data. You can track analytics events (with properties) and identify users (associate traits with a user ID). This lets you funnel events from n8n into Segment’s unified tracking, which then forwards to various analytics/marketing tools.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Track Event',
      description: 'The operation to perform',
      options: [
        { name: 'Track Event', value: 'Track Event' },
        { name: 'Identify User', value: 'Identify User' }
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
      description: 'Processed data from Segment'
    }
  ],

  credentials: [
    {
      name: 'segmentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Segment'
  },

  aliases: ['segment'],
  
  examples: [
        {
      name: 'Track Event Item',
      description: 'Track Event an item from Segment',
      workflow: {
        nodes: [
          {
            name: 'Segment',
            type: 'n8n-nodes-base.segment',
            parameters: {
              operation: 'Track Event',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default segmentNode;