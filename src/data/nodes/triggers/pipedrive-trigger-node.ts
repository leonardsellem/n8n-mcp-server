/**
 * Pipedrive Trigger Node - Trigger
 * 
 * Fires on Pipedrive CRM events. E.g., when a new deal is created in Pipedrive or when a deal’s stage changes (say from Prospect to Negotiation), this trigger provides the deal info. It’s useful for notifying other teams of new sales opportunities or kicking off fulfillment workflows when a deal closes in Pipedrive.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const pipedrivetriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pipedrive-trigger',
  displayName: 'Pipedrive Trigger',
  description: 'Fires on Pipedrive CRM events. E.g., when a new deal is created in Pipedrive or when a deal’s stage changes (say from Prospect to Negotiation), this trigger provides the deal info. It’s useful for notifying other teams of new sales opportunities or kicking off fulfillment workflows when a deal closes in Pipedrive.',
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
      name: 'pipedrive-triggerApi',
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
    name: 'Pipedrive Trigger'
  },

  aliases: ['pipedrive', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Pipedrive Trigger',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger Trigger',
            type: 'n8n-nodes-base.pipedrive-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default pipedrivetriggerNode;