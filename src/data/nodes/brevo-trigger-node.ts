/**
 * Brevo Trigger Node - Trigger
 * 
 * Triggers on Brevo (Sendinblue) events, such as when an email is opened, clicked, or bounced. This uses Brevo’s webhook for email events, starting the workflow with the event data. It enables real-time reactions to email engagement or delivery issues (e.g., notify on bounce or update CRM on open).
 */

import { NodeTypeInfo } from '../node-types.js';

export const brevotriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.brevo-trigger',
  displayName: 'Brevo Trigger',
  description: 'Triggers on Brevo (Sendinblue) events, such as when an email is opened, clicked, or bounced. This uses Brevo’s webhook for email events, starting the workflow with the event data. It enables real-time reactions to email engagement or delivery issues (e.g., notify on bounce or update CRM on open).',
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
      name: 'brevo-triggerApi',
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
    name: 'Brevo Trigger'
  },

  aliases: ['brevo', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Brevo Trigger',
      workflow: {
        nodes: [
          {
            name: 'Brevo Trigger Trigger',
            type: 'n8n-nodes-base.brevo-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default brevotriggerNode;