/**
 * Text Classifier Node
 * 
 * An LLM chain for classifying text into categories. Given some text (and possibly a set of labels or examples), it uses the LLM to determine which category the text belongs to. Good for sentiment analysis, topic tagging, etc., using few-shot prompts.
 */

import { NodeTypeInfo } from '../node-types.js';

export const textclassifierNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.text-classifier',
  displayName: 'Text Classifier',
  description: 'An LLM chain for classifying text into categories. Given some text (and possibly a set of labels or examples), it uses the LLM to determine which category the text belongs to. Good for sentiment analysis, topic tagging, etc., using few-shot prompts.',
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
      description: 'Processed data from Text Classifier'
    }
  ],

  credentials: [
    {
      name: 'text-classifierApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Text Classifier'
  },

  aliases: ['text', 'classifier'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Text Classifier',
      workflow: {
        nodes: [
          {
            name: 'Text Classifier',
            type: 'n8n-nodes-base.text-classifier',
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

export default textclassifierNode;