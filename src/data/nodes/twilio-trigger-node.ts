/**
 * Twilio Trigger Node - Trigger
 * 
 * Fires when Twilio receives an inbound SMS message or phone call for your number:contentReference[oaicite:82]{index=82}. Twilio’s webhook will send the details (SMS text, sender number or call info) to this trigger. This allows you to create SMS bots or call-handling logic, e.g., an SMS to your number could trigger an info lookup or a phone call could initiate an IVR flow handled by n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const twiliotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twilio-trigger',
  displayName: 'Twilio Trigger',
  description: 'Fires when Twilio receives an inbound SMS message or phone call for your number:contentReference[oaicite:82]{index=82}. Twilio’s webhook will send the details (SMS text, sender number or call info) to this trigger. This allows you to create SMS bots or call-handling logic, e.g., an SMS to your number could trigger an info lookup or a phone call could initiate an IVR flow handled by n8n.',
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
      name: 'twilio-triggerApi',
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
    name: 'Twilio Trigger'
  },

  aliases: ['twilio', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Twilio Trigger',
      workflow: {
        nodes: [
          {
            name: 'Twilio Trigger Trigger',
            type: 'n8n-nodes-base.twilio-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default twiliotriggerNode;