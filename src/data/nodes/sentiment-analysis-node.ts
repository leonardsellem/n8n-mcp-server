/**
 * Sentiment Analysis Node
 * 
 * A specialized chain (or tool) to assess the sentiment of input text (positive, negative, neutral). It likely uses an LLM prompt or a smaller model to output sentiment classification. Useful for quickly gauging opinions in text.
 */

import { NodeTypeInfo } from '../node-types.js';

export const sentimentanalysisNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sentiment-analysis',
  displayName: 'Sentiment Analysis',
  description: 'A specialized chain (or tool) to assess the sentiment of input text (positive, negative, neutral). It likely uses an LLM prompt or a smaller model to output sentiment classification. Useful for quickly gauging opinions in text.',
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
      description: 'Processed data from Sentiment Analysis'
    }
  ],

  credentials: [
    {
      name: 'sentiment-analysisApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Sentiment Analysis'
  },

  aliases: ['sentiment', 'analysis'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Sentiment Analysis',
      workflow: {
        nodes: [
          {
            name: 'Sentiment Analysis',
            type: 'n8n-nodes-base.sentiment-analysis',
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

export default sentimentanalysisNode;