/**
 * ConvertKit Trigger Node - Trigger
 * 
 * Triggers on ConvertKit events, such as when a new subscriber joins a form or when a tag is added to a subscriber. This lets you automate follow-ups or sync new email subscribers to other databases as soon as they sign up.
 */

import { NodeTypeInfo } from '../node-types.js';

export const convertkittriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.convertkit-trigger',
  displayName: 'ConvertKit Trigger',
  description: 'Triggers on ConvertKit events, such as when a new subscriber joins a form or when a tag is added to a subscriber. This lets you automate follow-ups or sync new email subscribers to other databases as soon as they sign up.',
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
      name: 'convertkit-triggerApi',
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
    name: 'ConvertKit Trigger'
  },

  aliases: ['convertkit', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in ConvertKit Trigger',
      workflow: {
        nodes: [
          {
            name: 'ConvertKit Trigger Trigger',
            type: 'n8n-nodes-base.convertkit-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default convertkittriggerNode;