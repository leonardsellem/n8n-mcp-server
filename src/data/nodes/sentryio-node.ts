/**
 * Sentry.io Node
 * 
 * Integrates with Sentry (error tracking platform). You can fetch a list of issues (error reports) for a project, retrieve details of a specific issue (stack trace, frequency, etc.), and create a custom event (push an error/exception to Sentry). Useful for error handling workflows or merging monitoring data into Sentry.
 */

import { NodeTypeInfo } from '../node-types.js';

export const sentryioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sentryio',
  displayName: 'Sentry.io',
  description: 'Integrates with Sentry (error tracking platform). You can fetch a list of issues (error reports) for a project, retrieve details of a specific issue (stack trace, frequency, etc.), and create a custom event (push an error/exception to Sentry). Useful for error handling workflows or merging monitoring data into Sentry.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Issues',
      description: 'The operation to perform',
      options: [
        { name: 'List Issues', value: 'List Issues' },
        { name: 'Get Issue Details', value: 'Get Issue Details' },
        { name: 'Create Event', value: 'Create Event' }
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
      description: 'Processed data from Sentry.io'
    }
  ],

  credentials: [
    {
      name: 'sentryioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Sentry.io'
  },

  aliases: ['sentry.io'],
  
  examples: [
        {
      name: 'List Issues Item',
      description: 'List Issues an item from Sentry.io',
      workflow: {
        nodes: [
          {
            name: 'Sentry.io',
            type: 'n8n-nodes-base.sentryio',
            parameters: {
              operation: 'List Issues',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sentryioNode;