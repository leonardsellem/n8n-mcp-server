/**
 * Calendly Trigger Node - Trigger
 * 
 * Starts a workflow when a Calendly event is scheduled or canceled. When someone books an appointment (invitee created) or cancels/reschedules (invitee canceled), Calendly’s webhook sends details to this trigger. Perfect for automating follow-ups, logging events, or updating CRM when meetings are scheduled:contentReference[oaicite:56]{index=56}.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const calendlytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.calendly-trigger',
  displayName: 'Calendly Trigger',
  description: 'Starts a workflow when a Calendly event is scheduled or canceled. When someone books an appointment (invitee created) or cancels/reschedules (invitee canceled), Calendly’s webhook sends details to this trigger. Perfect for automating follow-ups, logging events, or updating CRM when meetings are scheduled:contentReference[oaicite:56]{index=56}.',
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
      name: 'calendly-triggerApi',
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
    name: 'Calendly Trigger'
  },

  aliases: ['calendly', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Calendly Trigger',
      workflow: {
        nodes: [
          {
            name: 'Calendly Trigger Trigger',
            type: 'n8n-nodes-base.calendly-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default calendlytriggerNode;