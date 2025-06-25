/**
 * TheHive Trigger Node - Trigger
 * 
 * Fires on events in TheHive (earlier version). For example, triggers when a new alert or a new case is created in TheHive 4:contentReference[oaicite:80]{index=80}. Similar to the above but adapted for the older version’s API. It ensures your workflow can react to incoming security incidents (alerts) or cases as they happen.
 */

import { NodeTypeInfo } from '../node-types.js';

export const thehivetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.thehive-trigger',
  displayName: 'TheHive Trigger',
  description: 'Fires on events in TheHive (earlier version). For example, triggers when a new alert or a new case is created in TheHive 4:contentReference[oaicite:80]{index=80}. Similar to the above but adapted for the older version’s API. It ensures your workflow can react to incoming security incidents (alerts) or cases as they happen.',
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
      name: 'thehive-triggerApi',
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
    name: 'TheHive Trigger'
  },

  aliases: ['thehive', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in TheHive Trigger',
      workflow: {
        nodes: [
          {
            name: 'TheHive Trigger Trigger',
            type: 'n8n-nodes-base.thehive-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default thehivetriggerNode;