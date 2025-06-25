/**
 * Evaluation Trigger Node - Trigger
 * 
 * Starts a workflow when an evaluation event occurs (often related to AI evaluations or human-in-the-loop reviews). It triggers the flow upon completion of an AI evaluation task or when a certain review is needed (specific to n8n’s evaluation framework).
 */

import { NodeTypeInfo } from '../node-types.js';

export const evaluationtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.evaluation-trigger',
  displayName: 'Evaluation Trigger',
  description: 'Starts a workflow when an evaluation event occurs (often related to AI evaluations or human-in-the-loop reviews). It triggers the flow upon completion of an AI evaluation task or when a certain review is needed (specific to n8n’s evaluation framework).',
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
      name: 'evaluation-triggerApi',
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
    name: 'Evaluation Trigger'
  },

  aliases: ['evaluation', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Evaluation Trigger',
      workflow: {
        nodes: [
          {
            name: 'Evaluation Trigger Trigger',
            type: 'n8n-nodes-base.evaluation-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default evaluationtriggerNode;