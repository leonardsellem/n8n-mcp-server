/**
 * PostHog Node
 * 
 * Integrates with PostHog (open-source product analytics). You can send/ingest events (user actions) into PostHog and query trends or analytics data. Useful for tracking custom events from your workflow into PostHog or pulling simple analytics for use in automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const posthogNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.posthog',
  displayName: 'PostHog',
  description: 'Integrates with PostHog (open-source product analytics). You can send/ingest events (user actions) into PostHog and query trends or analytics data. Useful for tracking custom events from your workflow into PostHog or pulling simple analytics for use in automation.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Ingest Event',
      description: 'The operation to perform',
      options: [
        { name: 'Ingest Event', value: 'Ingest Event' },
        { name: 'Get Trends', value: 'Get Trends' }
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
      description: 'Processed data from PostHog'
    }
  ],

  credentials: [
    {
      name: 'posthogApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'PostHog'
  },

  aliases: ['posthog'],
  
  examples: [
        {
      name: 'Ingest Event Item',
      description: 'Ingest Event an item from PostHog',
      workflow: {
        nodes: [
          {
            name: 'PostHog',
            type: 'n8n-nodes-base.posthog',
            parameters: {
              operation: 'Ingest Event',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default posthogNode;