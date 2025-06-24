/**
 * Zendesk Trigger Node - Trigger
 * 
 * Fires on Zendesk Support events via webhook:contentReference[oaicite:86]{index=86}. For example, when a new support ticket is created or when an existing ticket is updated (status changed, agent assigned, etc.), this trigger will run with the ticket info. This makes it possible to escalate urgent tickets via other channels, sync ticket data to project tools, or kick off SLAs and reporting workflows instantly.
 */

import { NodeTypeInfo } from '../node-types.js';

export const zendesktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zendesk-trigger',
  displayName: 'Zendesk Trigger',
  description: 'Fires on Zendesk Support events via webhook:contentReference[oaicite:86]{index=86}. For example, when a new support ticket is created or when an existing ticket is updated (status changed, agent assigned, etc.), this trigger will run with the ticket info. This makes it possible to escalate urgent tickets via other channels, sync ticket data to project tools, or kick off SLAs and reporting workflows instantly.',
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
      name: 'zendesk-triggerApi',
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
    name: 'Zendesk Trigger'
  },

  aliases: ['zendesk', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Zendesk Trigger',
      workflow: {
        nodes: [
          {
            name: 'Zendesk Trigger Trigger',
            type: 'n8n-nodes-base.zendesk-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default zendesktriggerNode;