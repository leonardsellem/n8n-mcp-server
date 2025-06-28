/**
 * Help Scout Trigger Node - Trigger
 * 
 * Fires when certain events occur in Help Scout (helpdesk). For instance, when a new support conversation (ticket) is created, or when a conversation is assigned to a user or team, this trigger receives the info. You can automate follow-up tasks like setting up related project tasks, or notifying the assignee via another channel.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const helpscouttriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.help-scout-trigger',
  displayName: 'Help Scout Trigger',
  description: 'Fires when certain events occur in Help Scout (helpdesk). For instance, when a new support conversation (ticket) is created, or when a conversation is assigned to a user or team, this trigger receives the info. You can automate follow-up tasks like setting up related project tasks, or notifying the assignee via another channel.',
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
      name: 'help-scout-triggerApi',
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
    name: 'Help Scout Trigger'
  },

  aliases: ['help', 'scout', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Help Scout Trigger',
      workflow: {
        nodes: [
          {
            name: 'Help Scout Trigger Trigger',
            type: 'n8n-nodes-base.help-scout-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default helpscouttriggerNode;