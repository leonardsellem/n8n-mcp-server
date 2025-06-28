/**
 * RSS Feed Trigger Node - Trigger
 * 
 * Triggers the workflow when a new item is published in an RSS feed. It periodically polls a given RSS feed URL and if new entries appear, it starts the workflow with those new feed items.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const rssfeedtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rss-feed-trigger',
  displayName: 'RSS Feed Trigger',
  description: 'Triggers the workflow when a new item is published in an RSS feed. It periodically polls a given RSS feed URL and if new entries appear, it starts the workflow with those new feed items.',
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
      name: 'rss-feed-triggerApi',
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
    name: 'RSS Feed Trigger'
  },

  aliases: ['rss', 'feed', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in RSS Feed Trigger',
      workflow: {
        nodes: [
          {
            name: 'RSS Feed Trigger Trigger',
            type: 'n8n-nodes-base.rss-feed-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default rssfeedtriggerNode;