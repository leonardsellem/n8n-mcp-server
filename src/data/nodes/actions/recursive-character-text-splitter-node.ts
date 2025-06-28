/**
 * Recursive Character Text Splitter Node
 * 
 * An advanced splitter that tries larger chunk sizes and recursively splits chunks further if they exceed size, ideally at semantic boundaries (like paragraphs, then sentences) to preserve coherence. It ensures chunks are below a certain token limit while minimizing splits mid-sentence/phrase.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const recursivecharactertextsplitterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.recursive-character-text-splitter',
  displayName: 'Recursive Character Text Splitter',
  description: 'An advanced splitter that tries larger chunk sizes and recursively splits chunks further if they exceed size, ideally at semantic boundaries (like paragraphs, then sentences) to preserve coherence. It ensures chunks are below a certain token limit while minimizing splits mid-sentence/phrase.',
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
      description: 'Processed data from Recursive Character Text Splitter'
    }
  ],

  credentials: [
    {
      name: 'recursive-character-text-splitterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Recursive Character Text Splitter'
  },

  aliases: ['recursive', 'character', 'text', 'splitter'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Recursive Character Text Splitter',
      workflow: {
        nodes: [
          {
            name: 'Recursive Character Text Splitter',
            type: 'n8n-nodes-base.recursive-character-text-splitter',
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

export default recursivecharactertextsplitterNode;