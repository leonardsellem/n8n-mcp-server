/**
 * Google Business Profile Trigger Node - Trigger
 * 
 * Starts a workflow when there’s new user activity on your Google Business Profile. For example, when a new customer review is posted on your Google listing or a new question is asked in the Q&A section, this trigger can capture that. It allows you to automate review responses or log the feedback in a database as soon as it happens.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlebusinessprofiletriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-business-profile-trigger',
  displayName: 'Google Business Profile Trigger',
  description: 'Starts a workflow when there’s new user activity on your Google Business Profile. For example, when a new customer review is posted on your Google listing or a new question is asked in the Q&A section, this trigger can capture that. It allows you to automate review responses or log the feedback in a database as soon as it happens.',
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
      name: 'google-business-profile-triggerApi',
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
    name: 'Google Business Profile Trigger'
  },

  aliases: ['google', 'business', 'profile', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Google Business Profile Trigger',
      workflow: {
        nodes: [
          {
            name: 'Google Business Profile Trigger Trigger',
            type: 'n8n-nodes-base.google-business-profile-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default googlebusinessprofiletriggerNode;