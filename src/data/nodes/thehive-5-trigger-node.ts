/**
 * TheHive 5 Trigger Node - Trigger
 * 
 * Starts a workflow when a new alert is created in TheHive 5 (cybersecurity incident platform). Alerts typically come from integrations (like SIEM) and appear in TheHive. With this trigger, as soon as an alert is in TheHive, you could automatically create a case, enrich the alert, or notify a channel.
 */

import { NodeTypeInfo } from '../node-types.js';

export const thehive5triggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.thehive-5-trigger',
  displayName: 'TheHive 5 Trigger',
  description: 'Starts a workflow when a new alert is created in TheHive 5 (cybersecurity incident platform). Alerts typically come from integrations (like SIEM) and appear in TheHive. With this trigger, as soon as an alert is in TheHive, you could automatically create a case, enrich the alert, or notify a channel.',
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
      name: 'thehive-5-triggerApi',
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
    name: 'TheHive 5 Trigger'
  },

  aliases: ['thehive', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in TheHive 5 Trigger',
      workflow: {
        nodes: [
          {
            name: 'TheHive 5 Trigger Trigger',
            type: 'n8n-nodes-base.thehive-5-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default thehive5triggerNode;