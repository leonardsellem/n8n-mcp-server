/**
 * Gong Node
 * 
 * Works with Gong (revenue intelligence platform). You can fetch a list of recorded calls/meetings and retrieve transcripts or call details. Useful for sales ops workflows that process or analyze call data from Gong.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const gongNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gong',
  displayName: 'Gong',
  description: 'Works with Gong (revenue intelligence platform). You can fetch a list of recorded calls/meetings and retrieve transcripts or call details. Useful for sales ops workflows that process or analyze call data from Gong.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Calls',
      description: 'The operation to perform',
      options: [
        { name: 'List Calls', value: 'List Calls' },
        { name: 'Get Call Transcript', value: 'Get Call Transcript' }
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
      description: 'Processed data from Gong'
    }
  ],

  credentials: [
    {
      name: 'gongApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Gong'
  },

  aliases: ['gong'],
  
  examples: [
        {
      name: 'List Calls Item',
      description: 'List Calls an item from Gong',
      workflow: {
        nodes: [
          {
            name: 'Gong',
            type: 'n8n-nodes-base.gong',
            parameters: {
              operation: 'List Calls',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default gongNode;