/**
 * Character Text Splitter Node
 * 
 * A utility to split text into chunks by character count, ensuring no overlap and aiming for a chunk size fit for LLM processing. It breaks large documents into smaller pieces (e.g., 1000 characters each) often on sentence boundaries nearest that size.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const charactertextsplitterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.character-text-splitter',
  displayName: 'Character Text Splitter',
  description: 'A utility to split text into chunks by character count, ensuring no overlap and aiming for a chunk size fit for LLM processing. It breaks large documents into smaller pieces (e.g., 1000 characters each) often on sentence boundaries nearest that size.',
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
      description: 'Processed data from Character Text Splitter'
    }
  ],

  credentials: [
    {
      name: 'character-text-splitterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Character Text Splitter'
  },

  aliases: ['character', 'text', 'splitter'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Character Text Splitter',
      workflow: {
        nodes: [
          {
            name: 'Character Text Splitter',
            type: 'n8n-nodes-base.character-text-splitter',
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

export default charactertextsplitterNode;