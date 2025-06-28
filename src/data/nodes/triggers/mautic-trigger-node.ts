/**
 * Mautic Trigger Node - Trigger
 * 
 * Fires on Mautic marketing automation events. For example, when a contact gains a point (from scoring rules) or performs a campaign action, this trigger will run with that contact’s info. It’s helpful for reacting to highly engaged contacts (point threshold reached) or specific campaign milestones to further personalize outreach.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mautictriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mautic-trigger',
  displayName: 'Mautic Trigger',
  description: 'Fires on Mautic marketing automation events. For example, when a contact gains a point (from scoring rules) or performs a campaign action, this trigger will run with that contact’s info. It’s helpful for reacting to highly engaged contacts (point threshold reached) or specific campaign milestones to further personalize outreach.',
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
      name: 'mautic-triggerApi',
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
    name: 'Mautic Trigger'
  },

  aliases: ['mautic', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Mautic Trigger',
      workflow: {
        nodes: [
          {
            name: 'Mautic Trigger Trigger',
            type: 'n8n-nodes-base.mautic-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default mautictriggerNode;