/**
 * Venafi TLS Protect Cloud Trigger Node - Trigger
 * 
 * Fires on events from Venafi’s cloud service, such as when a managed certificate is nearing expiration. It could trigger the workflow some days before expiry with certificate details, allowing you to automate renewal requests or alert administrators to take action.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const venafitlsprotectcloudtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.venafi-tls-protect-cloud-trigger',
  displayName: 'Venafi TLS Protect Cloud Trigger',
  description: 'Fires on events from Venafi’s cloud service, such as when a managed certificate is nearing expiration. It could trigger the workflow some days before expiry with certificate details, allowing you to automate renewal requests or alert administrators to take action.',
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
      name: 'venafi-tls-protect-cloud-triggerApi',
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
    name: 'Venafi TLS Protect Cloud Trigger'
  },

  aliases: ['venafi', 'tls', 'protect', 'cloud', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Venafi TLS Protect Cloud Trigger',
      workflow: {
        nodes: [
          {
            name: 'Venafi TLS Protect Cloud Trigger Trigger',
            type: 'n8n-nodes-base.venafi-tls-protect-cloud-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default venafitlsprotectcloudtriggerNode;