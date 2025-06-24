/**
 * Question and Answer Chain Node
 * 
 * An LLM chain that specializes in Q&A over documents or data:contentReference[oaicite:90]{index=90}. It retrieves relevant context (via a retriever or vector store) for a given question and then lets the LLM generate an answer using that context. Ideal for answering questions from a knowledge base.
 */

import { NodeTypeInfo } from '../node-types.js';

export const questionandanswerchainNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.question-and-answer-chain',
  displayName: 'Question and Answer Chain',
  description: 'An LLM chain that specializes in Q&A over documents or data:contentReference[oaicite:90]{index=90}. It retrieves relevant context (via a retriever or vector store) for a given question and then lets the LLM generate an answer using that context. Ideal for answering questions from a knowledge base.',
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
      description: 'Processed data from Question and Answer Chain'
    }
  ],

  credentials: [
    {
      name: 'question-and-answer-chainApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Question and Answer Chain'
  },

  aliases: ['question', 'and', 'answer', 'chain'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Question and Answer Chain',
      workflow: {
        nodes: [
          {
            name: 'Question and Answer Chain',
            type: 'n8n-nodes-base.question-and-answer-chain',
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

export default questionandanswerchainNode;