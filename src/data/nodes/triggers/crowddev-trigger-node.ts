/**
 * crowd.dev Trigger Node - Trigger
 * 
 * Fires on new community events via crowd.dev. For example, if a new message or thread is posted in your connected community (Discord, forums, etc.), this can trigger the workflow with that content. It allows you to automate responses or analysis when your community has activity.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const crowddevtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.crowddev-trigger',
  displayName: 'crowd.dev Trigger',
  description: 'Fires on new community events via crowd.dev. For example, if a new message or thread is posted in your connected community (Discord, forums, etc.), this can trigger the workflow with that content. It allows you to automate responses or analysis when your community has activity.',
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
      name: 'crowddev-triggerApi',
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
    name: 'crowd.dev Trigger'
  },

  aliases: ['crowd.dev', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in crowd.dev Trigger',
      workflow: {
        nodes: [
          {
            name: 'crowd.dev Trigger Trigger',
            type: 'n8n-nodes-base.crowddev-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default crowddevtriggerNode;