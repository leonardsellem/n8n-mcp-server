/**
 * Humantic AI Node
 * 
 * Uses Humantic AI to analyze personality traits from a person’s profile or writing. You can input data like LinkedIn profile or text and get personality insights (like DISC profile or Big 5 traits). Useful for sales personalization or HR insights into candidates.
 */

import { NodeTypeInfo } from '../node-types.js';

export const humanticaiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.humantic-ai',
  displayName: 'Humantic AI',
  description: 'Uses Humantic AI to analyze personality traits from a person’s profile or writing. You can input data like LinkedIn profile or text and get personality insights (like DISC profile or Big 5 traits). Useful for sales personalization or HR insights into candidates.',
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
      description: 'Processed data from Humantic AI'
    }
  ],

  credentials: [
    {
      name: 'humantic-aiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Humantic AI'
  },

  aliases: ['humantic'],
  
  examples: [
        {
      name: 'Get Personality Insights Item',
      description: 'Get Personality Insights an item from Humantic AI',
      workflow: {
        nodes: [
          {
            name: 'Humantic AI',
            type: 'n8n-nodes-base.humantic-ai',
            parameters: {
              operation: 'Get Personality Insights',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default humanticaiNode;