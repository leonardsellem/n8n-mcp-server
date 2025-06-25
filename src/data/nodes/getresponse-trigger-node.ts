/**
 * GetResponse Trigger Node - Trigger
 * 
 * Starts a workflow for GetResponse list events, e.g., when a new contact subscribes to a list or when a contact is removed/unsubscribed. This allows real-time syncing of email subscribers to other systems or sending immediate welcome sequences through n8n on a new subscriber.
 */

import { NodeTypeInfo } from '../node-types.js';

export const getresponsetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.getresponse-trigger',
  displayName: 'GetResponse Trigger',
  description: 'Starts a workflow for GetResponse list events, e.g., when a new contact subscribes to a list or when a contact is removed/unsubscribed. This allows real-time syncing of email subscribers to other systems or sending immediate welcome sequences through n8n on a new subscriber.',
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
      name: 'getresponse-triggerApi',
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
    name: 'GetResponse Trigger'
  },

  aliases: ['getresponse', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in GetResponse Trigger',
      workflow: {
        nodes: [
          {
            name: 'GetResponse Trigger Trigger',
            type: 'n8n-nodes-base.getresponse-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default getresponsetriggerNode;