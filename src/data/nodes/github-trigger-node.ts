/**
 * GitHub Trigger Node - Trigger
 * 
 * Fires on GitHub repository events via webhook (such as code pushes, new issues, pull requests):contentReference[oaicite:61]{index=61}. You configure which events you want (e.g., a push to any branch, or a new issue opened), and when those occur, the trigger provides the event payload (commit info, issue details, etc.). Great for DevOps automation like CI triggers or notifications.
 */

import { NodeTypeInfo } from '../node-types.js';

export const githubtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.github-trigger',
  displayName: 'GitHub Trigger',
  description: 'Fires on GitHub repository events via webhook (such as code pushes, new issues, pull requests):contentReference[oaicite:61]{index=61}. You configure which events you want (e.g., a push to any branch, or a new issue opened), and when those occur, the trigger provides the event payload (commit info, issue details, etc.). Great for DevOps automation like CI triggers or notifications.',
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
      name: 'github-triggerApi',
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
    name: 'GitHub Trigger'
  },

  aliases: ['github', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in GitHub Trigger',
      workflow: {
        nodes: [
          {
            name: 'GitHub Trigger Trigger',
            type: 'n8n-nodes-base.github-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default githubtriggerNode;