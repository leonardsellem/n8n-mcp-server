/**
 * Vector Store Question Answer Tool Node
 * 
 * A single-step QA tool that likely encapsulates vector retrieval + answer generation. The agent provides a question; this tool will automatically query a configured vector store for relevant documents and then use an LLM to answer the question from those docs. It simplifies the agent’s job by bundling retrieval and reading into one tool use.
 */

import { NodeTypeInfo } from '../node-types.js';

export const vectorstorequestionanswertoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.vector-store-question-answer-tool',
  displayName: 'Vector Store Question Answer Tool',
  description: 'A single-step QA tool that likely encapsulates vector retrieval + answer generation. The agent provides a question; this tool will automatically query a configured vector store for relevant documents and then use an LLM to answer the question from those docs. It simplifies the agent’s job by bundling retrieval and reading into one tool use.',
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
      description: 'Processed data from Vector Store Question Answer Tool'
    }
  ],

  credentials: [
    {
      name: 'vector-store-question-answer-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Vector Store Question Answer Tool'
  },

  aliases: ['vector', 'store', 'question', 'answer', 'tool'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Vector Store Question Answer Tool',
      workflow: {
        nodes: [
          {
            name: 'Vector Store Question Answer Tool',
            type: 'n8n-nodes-base.vector-store-question-answer-tool',
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

export default vectorstorequestionanswertoolNode;