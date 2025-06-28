/**
 * Kafka Trigger Node - Trigger
 * 
 * Starts the workflow when a message is published to a Kafka topic. The trigger subscribes to a Kafka topic and, when a new message arrives, it provides the message content to n8n. Ideal for event-driven architectures where Kafka is the message bus; you can tie those events into other processes through n8n.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const kafkatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.kafka-trigger',
  displayName: 'Kafka Trigger',
  description: 'Starts the workflow when a message is published to a Kafka topic. The trigger subscribes to a Kafka topic and, when a new message arrives, it provides the message content to n8n. Ideal for event-driven architectures where Kafka is the message bus; you can tie those events into other processes through n8n.',
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
      name: 'kafka-triggerApi',
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
    name: 'Kafka Trigger'
  },

  aliases: ['kafka', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Kafka Trigger',
      workflow: {
        nodes: [
          {
            name: 'Kafka Trigger Trigger',
            type: 'n8n-nodes-base.kafka-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default kafkatriggerNode;