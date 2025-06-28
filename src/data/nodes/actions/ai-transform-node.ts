/**
 * AI Transform Node
 * 
 * Uses AI (Large Language Models) to transform or enrich data within the workflow. (Transforms input text or data by calling an AI model; for example, to summarize text or generate content. **Note:** Uses configured AI provider credentials.)
 */

import { NodeTypeInfo } from '../../node-types.js';

export const aitransformNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ai-transform',
  displayName: 'AI Transform',
  description: 'Uses AI (Large Language Models) to transform or enrich data within the workflow. (Transforms input text or data by calling an AI model; for example, to summarize text or generate content. **Note:** Uses configured AI provider credentials.)',
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
      description: 'Processed data from AI Transform'
    }
  ],

  credentials: [
    {
      name: 'ai-transformApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AI Transform'
  },

  aliases: ['transform'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from AI Transform',
      workflow: {
        nodes: [
          {
            name: 'AI Transform',
            type: 'n8n-nodes-base.ai-transform',
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

export default aitransformNode;