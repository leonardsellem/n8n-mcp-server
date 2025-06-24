/**
 * Emelia Trigger Node - Trigger
 * 
 * Fires when certain events happen in an Emelia cold email campaign. For instance, when a contact replies to an email (replied) or when a campaign sequence completes for a contact, the trigger can fire. This helps in reacting to engagement (like pausing outreach or notifying sales when a reply comes in).
 */

import { NodeTypeInfo } from '../node-types.js';

export const emeliatriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.emelia-trigger',
  displayName: 'Emelia Trigger',
  description: 'Fires when certain events happen in an Emelia cold email campaign. For instance, when a contact replies to an email (replied) or when a campaign sequence completes for a contact, the trigger can fire. This helps in reacting to engagement (like pausing outreach or notifying sales when a reply comes in).',
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
      name: 'emelia-triggerApi',
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
    name: 'Emelia Trigger'
  },

  aliases: ['emelia', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Emelia Trigger',
      workflow: {
        nodes: [
          {
            name: 'Emelia Trigger Trigger',
            type: 'n8n-nodes-base.emelia-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default emeliatriggerNode;