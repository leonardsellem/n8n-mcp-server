/**
 * RabbitMQ Trigger Node - Trigger
 * 
 * Fires when a new message is available in a RabbitMQ queue (similar to AMQP Trigger but specifically for RabbitMQ):contentReference[oaicite:73]{index=73}. It subscribes to a queue and for each message posted, it triggers the workflow with the message contents. Good for integrating with RabbitMQ-based systems in real time.
 */

import { NodeTypeInfo } from '../node-types.js';

export const rabbitmqtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rabbitmq-trigger',
  displayName: 'RabbitMQ Trigger',
  description: 'Fires when a new message is available in a RabbitMQ queue (similar to AMQP Trigger but specifically for RabbitMQ):contentReference[oaicite:73]{index=73}. It subscribes to a queue and for each message posted, it triggers the workflow with the message contents. Good for integrating with RabbitMQ-based systems in real time.',
  category: 'Core',
  subcategory: 'Trigger',
  
  properties: [
        {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }
  ],

  inputs: [
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when events occur'
    }
  ],

  credentials: [
    {
      name: 'rabbitmq-triggerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  version: [1],
  defaults: {
    name: 'RabbitMQ Trigger'
  },

  aliases: ['rabbitmq', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in RabbitMQ Trigger',
      workflow: {
        nodes: [
          {
            name: 'RabbitMQ Trigger Trigger',
            type: 'n8n-nodes-base.rabbitmq-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default rabbitmqtriggerNode;