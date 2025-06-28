/**
 * Linear Trigger Node - Trigger
 * 
 * Starts a workflow on Linear (issue tracker) events. For instance, when a new issue is created in Linear, or an issue’s status/column changes, this trigger will output that event’s data. Useful for keeping other tools updated on development progress or integrating Linear with project communication channels.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const lineartriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.linear-trigger',
  displayName: 'Linear Trigger',
  description: 'Starts a workflow on Linear (issue tracker) events. For instance, when a new issue is created in Linear, or an issue’s status/column changes, this trigger will output that event’s data. Useful for keeping other tools updated on development progress or integrating Linear with project communication channels.',
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
      name: 'linear-triggerApi',
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
    name: 'Linear Trigger'
  },

  aliases: ['linear', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Linear Trigger',
      workflow: {
        nodes: [
          {
            name: 'Linear Trigger Trigger',
            type: 'n8n-nodes-base.linear-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default lineartriggerNode;