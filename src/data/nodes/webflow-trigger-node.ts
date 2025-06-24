/**
 * Webflow Trigger Node - Trigger
 * 
 * Fires on Webflow site events through webhooks. For example, triggers when a visitor submits a form on your Webflow site or when a new e-commerce order is placed on a Webflow shop. This lets you integrate Webflow with other services (like sending form data to a CRM or fulfilling orders in an ERP) in real time.
 */

import { NodeTypeInfo } from '../node-types.js';

export const webflowtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webflow-trigger',
  displayName: 'Webflow Trigger',
  description: 'Fires on Webflow site events through webhooks. For example, triggers when a visitor submits a form on your Webflow site or when a new e-commerce order is placed on a Webflow shop. This lets you integrate Webflow with other services (like sending form data to a CRM or fulfilling orders in an ERP) in real time.',
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
      name: 'webflow-triggerApi',
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
    name: 'Webflow Trigger'
  },

  aliases: ['webflow', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Webflow Trigger',
      workflow: {
        nodes: [
          {
            name: 'Webflow Trigger Trigger',
            type: 'n8n-nodes-base.webflow-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default webflowtriggerNode;