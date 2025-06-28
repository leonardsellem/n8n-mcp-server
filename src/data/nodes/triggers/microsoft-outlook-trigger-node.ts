/**
 * Microsoft Outlook Trigger Node - Trigger
 * 
 * Fires on Outlook/Office 365 mailbox events. For instance, when a new email arrives in the inbox or when an email is moved to a certain folder. It leverages Microsoft Graph webhook subscriptions. This can be used to automate handling of emails in a corporate environment, similar to the Gmail trigger but for Outlook.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftoutlooktriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-outlook-trigger',
  displayName: 'Microsoft Outlook Trigger',
  description: 'Fires on Outlook/Office 365 mailbox events. For instance, when a new email arrives in the inbox or when an email is moved to a certain folder. It leverages Microsoft Graph webhook subscriptions. This can be used to automate handling of emails in a corporate environment, similar to the Gmail trigger but for Outlook.',
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
      name: 'microsoft-outlook-triggerApi',
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
    name: 'Microsoft Outlook Trigger'
  },

  aliases: ['microsoft', 'outlook', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Microsoft Outlook Trigger',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook Trigger Trigger',
            type: 'n8n-nodes-base.microsoft-outlook-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftoutlooktriggerNode;