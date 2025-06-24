/**
 * Item List Output Parser Node
 * 
 * A parser that takes an LLM’s output and extracts it into a list of items according to some specification:contentReference[oaicite:99]{index=99}. If you expect multiple instances of a structure in the output, this parser will separate them into an array of objects or values, simplifying post-processing in n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const itemlistoutputparserNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.item-list-output-parser',
  displayName: 'Item List Output Parser',
  description: 'A parser that takes an LLM’s output and extracts it into a list of items according to some specification:contentReference[oaicite:99]{index=99}. If you expect multiple instances of a structure in the output, this parser will separate them into an array of objects or values, simplifying post-processing in n8n.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Item List Output Parser'
    }
  ],

  credentials: [
    {
      name: 'item-list-output-parserApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Item List Output Parser'
  },

  aliases: ['item', 'list', 'output', 'parser'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Item List Output Parser',
      workflow: {
        nodes: [
          {
            name: 'Item List Output Parser',
            type: 'n8n-nodes-base.item-list-output-parser',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default itemlistoutputparserNode;