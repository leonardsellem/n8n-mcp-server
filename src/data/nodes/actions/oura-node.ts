/**
 * Oura Node
 * 
 * Connects to the Oura Ring API (health tracker). It allows retrieving a user’s readiness score, sleep data, and activity data. This is useful for health or wellness workflows where you might log or react to daily sleep/activity metrics from Oura.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ouraNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.oura',
  displayName: 'Oura',
  description: 'Connects to the Oura Ring API (health tracker). It allows retrieving a user’s readiness score, sleep data, and activity data. This is useful for health or wellness workflows where you might log or react to daily sleep/activity metrics from Oura.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get User Readiness',
      description: 'The operation to perform',
      options: [
        { name: 'Get User Readiness', value: 'Get User Readiness' },
        { name: 'Get User Sleep', value: 'Get User Sleep' },
        { name: 'Get User Activity', value: 'Get User Activity' }
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
      description: 'Processed data from Oura'
    }
  ],

  credentials: [
    {
      name: 'ouraApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Oura'
  },

  aliases: ['oura'],
  
  examples: [
        {
      name: 'Get User Readiness Item',
      description: 'Get User Readiness an item from Oura',
      workflow: {
        nodes: [
          {
            name: 'Oura',
            type: 'n8n-nodes-base.oura',
            parameters: {
              operation: 'Get User Readiness',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default ouraNode;