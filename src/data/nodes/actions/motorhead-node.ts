/**
 * Motorhead Node
 * 
 * A specialized memory component (Motorhead might refer to a memory mechanism that can handle updating knowledge). Possibly it enables retrieval-augmented memory where the bot’s persona or knowledge can update over the conversation. Not certain, but likely an advanced memory driver.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const motorheadNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.motorhead',
  displayName: 'Motorhead',
  description: 'A specialized memory component (Motorhead might refer to a memory mechanism that can handle updating knowledge). Possibly it enables retrieval-augmented memory where the bot’s persona or knowledge can update over the conversation. Not certain, but likely an advanced memory driver.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from Motorhead'
    }
  ],

  credentials: [
    {
      name: 'motorheadApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Motorhead'
  },

  aliases: ['motorhead'],
  
  examples: [
        {
      name: 'Handle Item',
      description: 'Handle an item from Motorhead',
      workflow: {
        nodes: [
          {
            name: 'Motorhead',
            type: 'n8n-nodes-base.motorhead',
            parameters: {
              operation: 'handle',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default motorheadNode;