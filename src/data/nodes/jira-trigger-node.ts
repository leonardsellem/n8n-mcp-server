/**
 * Jira Trigger Node - Trigger
 * 
 * Starts workflows based on Jira issue events. For example, when a new issue is created in a Jira project or an existing issue is updated (status changed, comment added, etc.), this trigger can receive the payload:contentReference[oaicite:68]{index=68}. Useful for bridging engineering activities to other teams—like alerting Sales when a bug for a client is filed, or syncing Jira issues with a time-tracking tool.
 */

import { NodeTypeInfo } from '../node-types.js';

export const jiratriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jira-trigger',
  displayName: 'Jira Trigger',
  description: 'Starts workflows based on Jira issue events. For example, when a new issue is created in a Jira project or an existing issue is updated (status changed, comment added, etc.), this trigger can receive the payload:contentReference[oaicite:68]{index=68}. Useful for bridging engineering activities to other teams—like alerting Sales when a bug for a client is filed, or syncing Jira issues with a time-tracking tool.',
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
      name: 'jira-triggerApi',
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
    name: 'Jira Trigger'
  },

  aliases: ['jira', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Jira Trigger',
      workflow: {
        nodes: [
          {
            name: 'Jira Trigger Trigger',
            type: 'n8n-nodes-base.jira-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default jiratriggerNode;