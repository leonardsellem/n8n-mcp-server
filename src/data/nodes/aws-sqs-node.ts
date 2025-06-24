/**
 * AWS SQS Node
 * 
 * Interacts with Amazon SQS (Simple Queue Service). Allows sending messages to a queue, polling a queue for messages, and deleting messages from the queue. Useful for integrating asynchronous queue processing in workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awssqsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-sqs',
  displayName: 'AWS SQS',
  description: 'Interacts with Amazon SQS (Simple Queue Service). Allows sending messages to a queue, polling a queue for messages, and deleting messages from the queue. Useful for integrating asynchronous queue processing in workflows.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Message',
      description: 'The operation to perform',
      options: [
        { name: 'Send Message', value: 'Send Message' },
        { name: 'Receive Message', value: 'Receive Message' },
        { name: 'Delete Message', value: 'Delete Message' }
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
      description: 'Processed data from AWS SQS'
    }
  ],

  credentials: [
    {
      name: 'aws-sqsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS SQS'
  },

  aliases: ['aws', 'sqs'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from AWS SQS',
      workflow: {
        nodes: [
          {
            name: 'AWS SQS',
            type: 'n8n-nodes-base.aws-sqs',
            parameters: {
              operation: 'Send Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awssqsNode;