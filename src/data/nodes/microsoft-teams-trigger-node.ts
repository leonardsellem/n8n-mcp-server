/**
 * Microsoft Teams Trigger Node - Trigger
 * 
 * Starts a workflow when a message is posted in a Microsoft Teams channel (via webhook connector or Graph subscription). When a specific channel gets a new message, the trigger can send that message text and metadata to n8n. This could automate tasks like logging chat requests or triggering an action when a command is posted in Teams.
 */

import { NodeTypeInfo } from '../node-types.js';

export const microsoftteamstriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-teams-trigger',
  displayName: 'Microsoft Teams Trigger',
  description: 'Starts a workflow when a message is posted in a Microsoft Teams channel (via webhook connector or Graph subscription). When a specific channel gets a new message, the trigger can send that message text and metadata to n8n. This could automate tasks like logging chat requests or triggering an action when a command is posted in Teams.',
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
      name: 'microsoft-teams-triggerApi',
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
    name: 'Microsoft Teams Trigger'
  },

  aliases: ['microsoft', 'teams', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Microsoft Teams Trigger',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Teams Trigger Trigger',
            type: 'n8n-nodes-base.microsoft-teams-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftteamstriggerNode;