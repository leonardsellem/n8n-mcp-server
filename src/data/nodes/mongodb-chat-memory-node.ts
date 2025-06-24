/**
 * MongoDB Chat Memory Node
 * 
 * Stores conversation history in MongoDB (as a memory backend). It can append each message to a Mongo collection, and retrieve recent messages when needed. Useful for persistent or multi-session chat memory using a MongoDB database.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mongodbchatmemoryNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mongodb-chat-memory',
  displayName: 'MongoDB Chat Memory',
  description: 'Stores conversation history in MongoDB (as a memory backend). It can append each message to a Mongo collection, and retrieve recent messages when needed. Useful for persistent or multi-session chat memory using a MongoDB database.',
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
      description: 'Processed data from MongoDB Chat Memory'
    }
  ],

  credentials: [
    {
      name: 'mongodb-chat-memoryApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MongoDB Chat Memory'
  },

  aliases: ['mongodb', 'chat', 'memory'],
  
  examples: [
        {
      name: 'Append Item',
      description: 'Append an item from MongoDB Chat Memory',
      workflow: {
        nodes: [
          {
            name: 'MongoDB Chat Memory',
            type: 'n8n-nodes-base.mongodb-chat-memory',
            parameters: {
              operation: 'append',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mongodbchatmemoryNode;