/**
 * Notion Trigger Node - Trigger
 * 
 * Fires when a Notion page (in a database) is created or updated:contentReference[oaicite:72]{index=72}. Using Notion’s webhook (beta) support, this trigger will start the workflow with the content of the page whenever, say, a new item is added to a Notion database (e.g., new task in a table) or an existing item changes. Great for syncing Notion with other tools in real time.
 */

import { NodeTypeInfo } from '../node-types.js';

export const notiontriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.notion-trigger',
  displayName: 'Notion Trigger',
  description: 'Fires when a Notion page (in a database) is created or updated:contentReference[oaicite:72]{index=72}. Using Notion’s webhook (beta) support, this trigger will start the workflow with the content of the page whenever, say, a new item is added to a Notion database (e.g., new task in a table) or an existing item changes. Great for syncing Notion with other tools in real time.',
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
      name: 'notion-triggerApi',
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
    name: 'Notion Trigger'
  },

  aliases: ['notion', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Notion Trigger',
      workflow: {
        nodes: [
          {
            name: 'Notion Trigger Trigger',
            type: 'n8n-nodes-base.notion-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default notiontriggerNode;