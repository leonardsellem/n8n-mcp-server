/**
 * Hacker News Node
 * 
 * Fetches data from Hacker News. You can retrieve the current top story IDs (or other story lists) and fetch details of a specific item (story, comment) by ID. Useful for monitoring Hacker News or integrating its content into apps.
 */

import { NodeTypeInfo } from '../node-types.js';

export const hackernewsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hacker-news',
  displayName: 'Hacker News',
  description: 'Fetches data from Hacker News. You can retrieve the current top story IDs (or other story lists) and fetch details of a specific item (story, comment) by ID. Useful for monitoring Hacker News or integrating its content into apps.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Top Stories',
      description: 'The operation to perform',
      options: [
        { name: 'Get Top Stories', value: 'Get Top Stories' },
        { name: 'Get Item', value: 'Get Item' }
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
      description: 'Processed data from Hacker News'
    }
  ],

  credentials: [
    {
      name: 'hacker-newsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Hacker News'
  },

  aliases: ['hacker', 'news'],
  
  examples: [
        {
      name: 'Get Top Stories Item',
      description: 'Get Top Stories an item from Hacker News',
      workflow: {
        nodes: [
          {
            name: 'Hacker News',
            type: 'n8n-nodes-base.hacker-news',
            parameters: {
              operation: 'Get Top Stories',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default hackernewsNode;