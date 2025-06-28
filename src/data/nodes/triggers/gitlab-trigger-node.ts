/**
 * GitLab Trigger Node - Trigger
 * 
 * Similar to GitHub trigger, but for GitLab. It starts workflows on repository events like pushes, merge request opens/updates, or issues. When an event (push, MR, etc.) happens on a GitLab project, the trigger receives the JSON payload so you can automate tasks around code deployments or project management.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const gitlabtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gitlab-trigger',
  displayName: 'GitLab Trigger',
  description: 'Similar to GitHub trigger, but for GitLab. It starts workflows on repository events like pushes, merge request opens/updates, or issues. When an event (push, MR, etc.) happens on a GitLab project, the trigger receives the JSON payload so you can automate tasks around code deployments or project management.',
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
      name: 'gitlab-triggerApi',
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
    name: 'GitLab Trigger'
  },

  aliases: ['gitlab', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in GitLab Trigger',
      workflow: {
        nodes: [
          {
            name: 'GitLab Trigger Trigger',
            type: 'n8n-nodes-base.gitlab-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default gitlabtriggerNode;