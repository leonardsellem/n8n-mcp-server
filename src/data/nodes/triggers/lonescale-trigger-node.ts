/**
 * LoneScale Trigger Node - Trigger
 * 
 * Fires when a new monitoring/metric event is recorded in LoneScale. If, for example, a metric threshold is crossed or a new data point enters that matches a rule, this trigger will pick it up. It’s useful for custom monitoring or alerting flows if using LoneScale as a source.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const lonescaletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.lonescale-trigger',
  displayName: 'LoneScale Trigger',
  description: 'Fires when a new monitoring/metric event is recorded in LoneScale. If, for example, a metric threshold is crossed or a new data point enters that matches a rule, this trigger will pick it up. It’s useful for custom monitoring or alerting flows if using LoneScale as a source.',
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
      name: 'lonescale-triggerApi',
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
    name: 'LoneScale Trigger'
  },

  aliases: ['lonescale', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in LoneScale Trigger',
      workflow: {
        nodes: [
          {
            name: 'LoneScale Trigger Trigger',
            type: 'n8n-nodes-base.lonescale-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default lonescaletriggerNode;