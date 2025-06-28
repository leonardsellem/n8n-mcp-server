/**
 * Venafi TLS Protect Cloud Node
 * 
 * Integrates with Venafi TLS Protect Cloud (certificate management). Allows requesting a new TLS certificate via Venafi and listing existing certificates. Useful for DevOps automation around certificate provisioning and inventory (especially in cloud/Kubernetes contexts).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const venafitlsprotectcloudNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.venafi-tls-protect-cloud',
  displayName: 'Venafi TLS Protect Cloud',
  description: 'Integrates with Venafi TLS Protect Cloud (certificate management). Allows requesting a new TLS certificate via Venafi and listing existing certificates. Useful for DevOps automation around certificate provisioning and inventory (especially in cloud/Kubernetes contexts).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Request Certificate',
      description: 'The operation to perform',
      options: [
        { name: 'Request Certificate', value: 'Request Certificate' },
        { name: 'List Certificates', value: 'List Certificates' }
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
      description: 'Processed data from Venafi TLS Protect Cloud'
    }
  ],

  credentials: [
    {
      name: 'venafi-tls-protect-cloudApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Venafi TLS Protect Cloud'
  },

  aliases: ['venafi', 'tls', 'protect', 'cloud'],
  
  examples: [
        {
      name: 'Request Certificate Item',
      description: 'Request Certificate an item from Venafi TLS Protect Cloud',
      workflow: {
        nodes: [
          {
            name: 'Venafi TLS Protect Cloud',
            type: 'n8n-nodes-base.venafi-tls-protect-cloud',
            parameters: {
              operation: 'Request Certificate',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default venafitlsprotectcloudNode;