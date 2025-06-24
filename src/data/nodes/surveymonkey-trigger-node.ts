/**
 * SurveyMonkey Trigger Node - Trigger
 * 
 * Fires when a SurveyMonkey survey receives a new response. Once someone completes your survey, SurveyMonkey can send the responses to this trigger. You can then automate actions like transferring the data to a database, sending a custom thank-you, or analyzing the result instantly.
 */

import { NodeTypeInfo } from '../node-types.js';

export const surveymonkeytriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.surveymonkey-trigger',
  displayName: 'SurveyMonkey Trigger',
  description: 'Fires when a SurveyMonkey survey receives a new response. Once someone completes your survey, SurveyMonkey can send the responses to this trigger. You can then automate actions like transferring the data to a database, sending a custom thank-you, or analyzing the result instantly.',
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
      name: 'surveymonkey-triggerApi',
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
    name: 'SurveyMonkey Trigger'
  },

  aliases: ['surveymonkey', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in SurveyMonkey Trigger',
      workflow: {
        nodes: [
          {
            name: 'SurveyMonkey Trigger Trigger',
            type: 'n8n-nodes-base.surveymonkey-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default surveymonkeytriggerNode;