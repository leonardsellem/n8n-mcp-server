/**
 * Slack Trigger Node - Trigger
 * 
 * Starts a workflow when specified activity happens in Slack (via Events API):contentReference[oaicite:76]{index=76}. For instance, you can configure it to trigger when your bot is mentioned in any channel or when a message is posted in a particular channel. The workflow then receives the message text and metadata. Great for building Slack bots or monitoring channels for keywords to drive automations.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const slacktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.slack-trigger',
  displayName: 'Slack Trigger',
  description: 'Starts a workflow when specified activity happens in Slack (via Events API):contentReference[oaicite:76]{index=76}. For instance, you can configure it to trigger when your bot is mentioned in any channel or when a message is posted in a particular channel. The workflow then receives the message text and metadata. Great for building Slack bots or monitoring channels for keywords to drive automations.',
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
      name: 'slack-triggerApi',
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
    name: 'Slack Trigger'
  },

  aliases: ['slack', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Slack Trigger',
      workflow: {
        nodes: [
          {
            name: 'Slack Trigger Trigger',
            type: 'n8n-nodes-base.slack-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default slacktriggerNode;