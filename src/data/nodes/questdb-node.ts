/**
 * QuestDB Node
 * 
 * Connects to QuestDB (high-performance time-series database). Allows running SQL queries (which QuestDB supports via Postgres protocol) to insert or select time-series data. Great for interacting with time-series data, like IoT or financial data, within automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const questdbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.questdb',
  displayName: 'QuestDB',
  description: 'Connects to QuestDB (high-performance time-series database). Allows running SQL queries (which QuestDB supports via Postgres protocol) to insert or select time-series data. Great for interacting with time-series data, like IoT or financial data, within automation.',
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
      description: 'Processed data from QuestDB'
    }
  ],

  credentials: [
    {
      name: 'questdbApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'QuestDB'
  },

  aliases: ['questdb'],
  
  examples: [
        {
      name: 'Execute Query Item',
      description: 'Execute Query an item from QuestDB',
      workflow: {
        nodes: [
          {
            name: 'QuestDB',
            type: 'n8n-nodes-base.questdb',
            parameters: {
              operation: 'Execute Query',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default questdbNode;