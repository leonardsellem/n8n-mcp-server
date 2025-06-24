/**
 * Facebook Lead Ads Trigger Node - Trigger
 * 
 * Fires when a new lead is captured via a Facebook Lead Ad form:contentReference[oaicite:58]{index=58}. When someone submits their info on a FB lead form, this trigger receives the lead data (contact info, answers) so you can instantly follow up — for example, add to CRM or send a welcome email without delay.
 */

import { NodeTypeInfo } from '../node-types.js';

export const facebookleadadstriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.facebook-lead-ads-trigger',
  displayName: 'Facebook Lead Ads Trigger',
  description: 'Fires when a new lead is captured via a Facebook Lead Ad form:contentReference[oaicite:58]{index=58}. When someone submits their info on a FB lead form, this trigger receives the lead data (contact info, answers) so you can instantly follow up — for example, add to CRM or send a welcome email without delay.',
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
      name: 'facebook-lead-ads-triggerApi',
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
    name: 'Facebook Lead Ads Trigger'
  },

  aliases: ['facebook', 'lead', 'ads', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Facebook Lead Ads Trigger',
      workflow: {
        nodes: [
          {
            name: 'Facebook Lead Ads Trigger Trigger',
            type: 'n8n-nodes-base.facebook-lead-ads-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default facebookleadadstriggerNode;