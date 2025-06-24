/**
 * AWS Bedrock Chat Model Node
 * 
 * Interfaces with a chat-capable model on AWS Bedrock (Amazon’s managed foundation model service). It sends a conversation to an AWS Bedrock-provided chatbot model (like Anthropic Claude or Amazon’s Titan chatbot) and returns the response. Allows you to use Bedrock’s models for chat completions.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awsbedrockchatmodelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-bedrock-chat-model',
  displayName: 'AWS Bedrock Chat Model',
  description: 'Interfaces with a chat-capable model on AWS Bedrock (Amazon’s managed foundation model service). It sends a conversation to an AWS Bedrock-provided chatbot model (like Anthropic Claude or Amazon’s Titan chatbot) and returns the response. Allows you to use Bedrock’s models for chat completions.',
  category: 'Cloud',
  subcategory: 'Integration',
  
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
      description: 'Processed data from AWS Bedrock Chat Model'
    }
  ],

  credentials: [
    {
      name: 'aws-bedrock-chat-modelApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Bedrock Chat Model'
  },

  aliases: ['aws', 'bedrock', 'chat', 'model'],
  
  examples: [
        {
      name: 'You Item',
      description: 'You an item from AWS Bedrock Chat Model',
      workflow: {
        nodes: [
          {
            name: 'AWS Bedrock Chat Model',
            type: 'n8n-nodes-base.aws-bedrock-chat-model',
            parameters: {
              operation: 'you',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awsbedrockchatmodelNode;