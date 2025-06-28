/**
 * Redis Trigger Node - Trigger
 * 
 * Starts workflows on Redis events. It can use Redis keyspace notifications to trigger when a specific key is set/expired, or subscribe to a Redis Pub/Sub channel to trigger on new messages. This allows events from a Redis cache or broker to directly initiate n8n flows (e.g., cache invalidation events or chat messages via Redis pubsub).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const redistriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.redis-trigger',
  displayName: 'Redis Trigger',
  description: 'Starts workflows on Redis events. It can use Redis keyspace notifications to trigger when a specific key is set/expired, or subscribe to a Redis Pub/Sub channel to trigger on new messages. This allows events from a Redis cache or broker to directly initiate n8n flows (e.g., cache invalidation events or chat messages via Redis pubsub).',
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
      name: 'redis-triggerApi',
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
    name: 'Redis Trigger'
  },

  aliases: ['redis', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Redis Trigger',
      workflow: {
        nodes: [
          {
            name: 'Redis Trigger Trigger',
            type: 'n8n-nodes-base.redis-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default redistriggerNode;