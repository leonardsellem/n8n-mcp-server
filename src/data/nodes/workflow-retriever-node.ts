/**
 * Workflow Retriever Node
 * 
 * A retriever that specifically pulls context from n8n workflows (perhaps stored or indexed as text). It might allow an AI agent to search across descriptions or content of existing workflows for relevant info (like how a task was solved in another workflow). This could enable an AI assistant to reuse logic or refer to other workflow’s details if indexed.
 */

import { NodeTypeInfo } from '../node-types.js';

export const workflowretrieverNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.workflow-retriever',
  displayName: 'Workflow Retriever',
  description: 'A retriever that specifically pulls context from n8n workflows (perhaps stored or indexed as text). It might allow an AI agent to search across descriptions or content of existing workflows for relevant info (like how a task was solved in another workflow). This could enable an AI assistant to reuse logic or refer to other workflow’s details if indexed.',
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
      description: 'Processed data from Workflow Retriever'
    }
  ],

  credentials: [
    {
      name: 'workflow-retrieverApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Workflow Retriever'
  },

  aliases: ['workflow', 'retriever'],
  
  examples: [
        {
      name: 'An Item',
      description: 'An an item from Workflow Retriever',
      workflow: {
        nodes: [
          {
            name: 'Workflow Retriever',
            type: 'n8n-nodes-base.workflow-retriever',
            parameters: {
              operation: 'an',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default workflowretrieverNode;