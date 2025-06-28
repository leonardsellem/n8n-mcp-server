/**
 * Typeform Trigger Node - Trigger
 * 
 * Starts a workflow whenever a Typeform form is submitted. It catches the responses via Typeform’s webhook and provides all answers. Useful for seamlessly handling form submissions — for example, automatically creating leads in a CRM or sending follow-up emails when someone fills out your Typeform.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const typeformtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.typeform-trigger',
  displayName: 'Typeform Trigger',
  description: 'Starts a workflow whenever a Typeform form is submitted. It catches the responses via Typeform’s webhook and provides all answers. Useful for seamlessly handling form submissions — for example, automatically creating leads in a CRM or sending follow-up emails when someone fills out your Typeform.',
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
      name: 'typeform-triggerApi',
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
    name: 'Typeform Trigger'
  },

  aliases: ['typeform', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Typeform Trigger',
      workflow: {
        nodes: [
          {
            name: 'Typeform Trigger Trigger',
            type: 'n8n-nodes-base.typeform-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default typeformtriggerNode;