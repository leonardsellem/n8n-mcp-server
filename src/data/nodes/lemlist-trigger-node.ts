/**
 * Lemlist Trigger Node - Trigger
 * 
 * Fires on Lemlist events such as when a lead replies to an email campaign or when a campaign sequence finishes without a reply. This allows you to act on cold email outcomes automatically, e.g., notify a sales rep to follow up personally when a reply comes in, or move unresponsive leads to a different flow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const lemlisttriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.lemlist-trigger',
  displayName: 'Lemlist Trigger',
  description: 'Fires on Lemlist events such as when a lead replies to an email campaign or when a campaign sequence finishes without a reply. This allows you to act on cold email outcomes automatically, e.g., notify a sales rep to follow up personally when a reply comes in, or move unresponsive leads to a different flow.',
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
      name: 'lemlist-triggerApi',
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
    name: 'Lemlist Trigger'
  },

  aliases: ['lemlist', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Lemlist Trigger',
      workflow: {
        nodes: [
          {
            name: 'Lemlist Trigger Trigger',
            type: 'n8n-nodes-base.lemlist-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default lemlisttriggerNode;