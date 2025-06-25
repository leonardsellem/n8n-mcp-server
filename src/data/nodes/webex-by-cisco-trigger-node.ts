/**
 * Webex by Cisco Trigger Node - Trigger
 * 
 * Starts a workflow when a new message is posted in a Webex Teams (Cisco Webex) space via webhook:contentReference[oaicite:83]{index=83}. The trigger provides the message content and sender, so you can automate responses or process commands from Webex chats, similar to Slack/Teams triggers.
 */

import { NodeTypeInfo } from '../node-types.js';

export const webexbyciscotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webex-by-cisco-trigger',
  displayName: 'Webex by Cisco Trigger',
  description: 'Starts a workflow when a new message is posted in a Webex Teams (Cisco Webex) space via webhook:contentReference[oaicite:83]{index=83}. The trigger provides the message content and sender, so you can automate responses or process commands from Webex chats, similar to Slack/Teams triggers.',
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
      name: 'webex-by-cisco-triggerApi',
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
    name: 'Webex by Cisco Trigger'
  },

  aliases: ['webex', 'cisco', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Webex by Cisco Trigger',
      workflow: {
        nodes: [
          {
            name: 'Webex by Cisco Trigger Trigger',
            type: 'n8n-nodes-base.webex-by-cisco-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default webexbyciscotriggerNode;