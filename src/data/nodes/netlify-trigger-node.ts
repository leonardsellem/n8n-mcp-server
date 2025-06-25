/**
 * Netlify Trigger Node - Trigger
 * 
 * Starts a workflow on Netlify build/deploy events. For example, if you set it up to listen for when a site deploy finishes (successful) or fails, Netlify will send a webhook that this trigger catches. You can then notify developers of the status, or post a message to Slack when a new version of the site is live.
 */

import { NodeTypeInfo } from '../node-types.js';

export const netlifytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.netlify-trigger',
  displayName: 'Netlify Trigger',
  description: 'Starts a workflow on Netlify build/deploy events. For example, if you set it up to listen for when a site deploy finishes (successful) or fails, Netlify will send a webhook that this trigger catches. You can then notify developers of the status, or post a message to Slack when a new version of the site is live.',
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
      name: 'netlify-triggerApi',
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
    name: 'Netlify Trigger'
  },

  aliases: ['netlify', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Netlify Trigger',
      workflow: {
        nodes: [
          {
            name: 'Netlify Trigger Trigger',
            type: 'n8n-nodes-base.netlify-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default netlifytriggerNode;