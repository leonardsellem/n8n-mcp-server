/**
 * Bitbucket Trigger Node - Trigger
 * 
 * Fires on Bitbucket repository events via webhook. For instance, when code is pushed to a repository or a pull request is opened, this trigger receives the event payload (commits, PR info) and initiates the workflow. Great for DevOps automation responding to Bitbucket activity.
 */

import { NodeTypeInfo } from '../node-types.js';

export const bitbuckettriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bitbucket-trigger',
  displayName: 'Bitbucket Trigger',
  description: 'Fires on Bitbucket repository events via webhook. For instance, when code is pushed to a repository or a pull request is opened, this trigger receives the event payload (commits, PR info) and initiates the workflow. Great for DevOps automation responding to Bitbucket activity.',
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
      name: 'bitbucket-triggerApi',
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
    name: 'Bitbucket Trigger'
  },

  aliases: ['bitbucket', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Bitbucket Trigger',
      workflow: {
        nodes: [
          {
            name: 'Bitbucket Trigger Trigger',
            type: 'n8n-nodes-base.bitbucket-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default bitbuckettriggerNode;