/**
 * Facebook Trigger Node - Trigger
 * 
 * A general Facebook integration trigger with multiple sub-triggers:contentReference[oaicite:59]{index=59}:contentReference[oaicite:60]{index=60}. It can listen for various Facebook account events: e.g., alerts in an Ad Account (like spending limits), new posts on a Facebook Page, new leads from Lead Ads (similar to above, but via Graph API webhook), or even mentions on connected Instagram accounts. Each is a specific hook that, when configured, will start the workflow with details of that event, enabling comprehensive Facebook/Instagram real-time integration.
 */

import { NodeTypeInfo } from '../node-types.js';

export const facebooktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.facebook-trigger',
  displayName: 'Facebook Trigger',
  description: 'A general Facebook integration trigger with multiple sub-triggers:contentReference[oaicite:59]{index=59}:contentReference[oaicite:60]{index=60}. It can listen for various Facebook account events: e.g., alerts in an Ad Account (like spending limits), new posts on a Facebook Page, new leads from Lead Ads (similar to above, but via Graph API webhook), or even mentions on connected Instagram accounts. Each is a specific hook that, when configured, will start the workflow with details of that event, enabling comprehensive Facebook/Instagram real-time integration.',
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
      name: 'facebook-triggerApi',
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
    name: 'Facebook Trigger'
  },

  aliases: ['facebook', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Facebook Trigger',
      workflow: {
        nodes: [
          {
            name: 'Facebook Trigger Trigger',
            type: 'n8n-nodes-base.facebook-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default facebooktriggerNode;