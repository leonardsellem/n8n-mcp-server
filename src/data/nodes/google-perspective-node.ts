/**
 * Google Perspective Node
 * 
 * Uses Google Perspective API (for content moderation). It analyzes text and returns scores for attributes like toxicity, insult, profanity, etc. Useful if you need to automatically moderate or flag user-generated content based on toxicity levels.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googleperspectiveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-perspective',
  displayName: 'Google Perspective',
  description: 'Uses Google Perspective API (for content moderation). It analyzes text and returns scores for attributes like toxicity, insult, profanity, etc. Useful if you need to automatically moderate or flag user-generated content based on toxicity levels.',
  category: 'Productivity',
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
      description: 'Processed data from Google Perspective'
    }
  ],

  credentials: [
    {
      name: 'google-perspectiveApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Perspective'
  },

  aliases: ['google', 'perspective'],
  
  examples: [
        {
      name: 'Analyze Text Item',
      description: 'Analyze Text an item from Google Perspective',
      workflow: {
        nodes: [
          {
            name: 'Google Perspective',
            type: 'n8n-nodes-base.google-perspective',
            parameters: {
              operation: 'Analyze Text',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googleperspectiveNode;