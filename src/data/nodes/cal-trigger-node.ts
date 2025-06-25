/**
 * Cal Trigger Node - Trigger
 * 
 * Triggers when a new event/meeting is scheduled via Cal.com (an open-source Calendly alternative). Whenever someone books a meeting slot, this trigger will fire with the event details, enabling workflows like sending confirmation messages or creating related tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const caltriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cal-trigger',
  displayName: 'Cal Trigger',
  description: 'Triggers when a new event/meeting is scheduled via Cal.com (an open-source Calendly alternative). Whenever someone books a meeting slot, this trigger will fire with the event details, enabling workflows like sending confirmation messages or creating related tasks.',
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
      name: 'cal-triggerApi',
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
    name: 'Cal Trigger'
  },

  aliases: ['cal', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Cal Trigger',
      workflow: {
        nodes: [
          {
            name: 'Cal Trigger Trigger',
            type: 'n8n-nodes-base.cal-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default caltriggerNode;