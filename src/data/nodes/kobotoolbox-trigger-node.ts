/**
 * KoboToolbox Trigger Node - Trigger
 * 
 * Starts a workflow when a new survey form submission is received on KoboToolbox. Once someone fills out your KoboToolbox form, this trigger grabs the submission and you can process or route that data (for example, compile results or send a confirmation to the respondent).
 */

import { NodeTypeInfo } from '../node-types.js';

export const kobotoolboxtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.kobotoolbox-trigger',
  displayName: 'KoboToolbox Trigger',
  description: 'Starts a workflow when a new survey form submission is received on KoboToolbox. Once someone fills out your KoboToolbox form, this trigger grabs the submission and you can process or route that data (for example, compile results or send a confirmation to the respondent).',
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
      name: 'kobotoolbox-triggerApi',
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
    name: 'KoboToolbox Trigger'
  },

  aliases: ['kobotoolbox', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in KoboToolbox Trigger',
      workflow: {
        nodes: [
          {
            name: 'KoboToolbox Trigger Trigger',
            type: 'n8n-nodes-base.kobotoolbox-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default kobotoolboxtriggerNode;