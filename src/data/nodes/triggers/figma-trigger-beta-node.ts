/**
 * Figma Trigger (Beta) Node - Trigger
 * 
 * Fires on Figma events (in beta) such as when someone comments on a Figma file or when a file is updated. It allows design collaboration events to trigger workflows — for example, notifying a team in Slack when a design file gets a comment or change.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const figmatriggerbetaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.figma-trigger-beta',
  displayName: 'Figma Trigger (Beta)',
  description: 'Fires on Figma events (in beta) such as when someone comments on a Figma file or when a file is updated. It allows design collaboration events to trigger workflows — for example, notifying a team in Slack when a design file gets a comment or change.',
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
      name: 'figma-trigger-betaApi',
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
    name: 'Figma Trigger (Beta)'
  },

  aliases: ['figma', 'trigger', 'beta'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Figma Trigger (Beta)',
      workflow: {
        nodes: [
          {
            name: 'Figma Trigger (Beta) Trigger',
            type: 'n8n-nodes-base.figma-trigger-beta',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default figmatriggerbetaNode;