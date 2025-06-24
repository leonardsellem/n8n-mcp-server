/**
 * AMQP Trigger Node - Trigger
 * 
 * Starts the workflow upon receiving a message from an AMQP queue:contentReference[oaicite:53]{index=53}. It subscribes to a given queue on an AMQP broker (like RabbitMQ) and triggers whenever a new message arrives, passing the message content into the workflow. Use it to integrate message-queue events.
 */

import { NodeTypeInfo } from '../node-types.js';

export const amqptriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.amqp-trigger',
  displayName: 'AMQP Trigger',
  description: 'Starts the workflow upon receiving a message from an AMQP queue:contentReference[oaicite:53]{index=53}. It subscribes to a given queue on an AMQP broker (like RabbitMQ) and triggers whenever a new message arrives, passing the message content into the workflow. Use it to integrate message-queue events.',
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
      name: 'amqp-triggerApi',
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
    name: 'AMQP Trigger'
  },

  aliases: ['amqp', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in AMQP Trigger',
      workflow: {
        nodes: [
          {
            name: 'AMQP Trigger Trigger',
            type: 'n8n-nodes-base.amqp-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default amqptriggerNode;