/**
 * AMQP Sender Node
 * 
 * Sends messages to an AMQP message queue (Advanced Message Queuing Protocol). This node lets you push a message onto a queue (e.g., for RabbitMQ or other AMQP brokers), enabling integration with messaging systems.
 */

import { NodeTypeInfo } from '../node-types.js';

export const amqpsenderNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.amqp-sender',
  displayName: 'AMQP Sender',
  description: 'Sends messages to an AMQP message queue (Advanced Message Queuing Protocol). This node lets you push a message onto a queue (e.g., for RabbitMQ or other AMQP brokers), enabling integration with messaging systems.',
  category: 'Utility',
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
      description: 'Processed data from AMQP Sender'
    }
  ],

  credentials: [
    {
      name: 'amqp-senderApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AMQP Sender'
  },

  aliases: ['amqp', 'sender'],
  
  examples: [
        {
      name: 'Send to Queue Item',
      description: 'Send to Queue an item from AMQP Sender',
      workflow: {
        nodes: [
          {
            name: 'AMQP Sender',
            type: 'n8n-nodes-base.amqp-sender',
            parameters: {
              operation: 'Send to Queue',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default amqpsenderNode;