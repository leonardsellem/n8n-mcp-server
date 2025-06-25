/**
 * GoToWebinar Node
 * 
 * Connects to GoToWebinar (online webinar platform). You can list scheduled webinars for an organizer, register someone to a webinar, and retrieve attendee reports or details. Useful for automating webinar enrollment and follow-up tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const gotowebinarNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gotowebinar',
  displayName: 'GoToWebinar',
  description: 'Connects to GoToWebinar (online webinar platform). You can list scheduled webinars for an organizer, register someone to a webinar, and retrieve attendee reports or details. Useful for automating webinar enrollment and follow-up tasks.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Webinars',
      description: 'The operation to perform',
      options: [
        { name: 'List Webinars', value: 'List Webinars' },
        { name: 'Register Attendee', value: 'Register Attendee' },
        { name: 'Get Attendees', value: 'Get Attendees' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from GoToWebinar'
    }
  ],

  credentials: [
    {
      name: 'gotowebinarApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'GoToWebinar'
  },

  aliases: ['gotowebinar'],
  
  examples: [
        {
      name: 'List Webinars Item',
      description: 'List Webinars an item from GoToWebinar',
      workflow: {
        nodes: [
          {
            name: 'GoToWebinar',
            type: 'n8n-nodes-base.gotowebinar',
            parameters: {
              operation: 'List Webinars',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default gotowebinarNode;