/**
 * Venafi TLS Protect Datacenter Node
 * 
 * Works with Venafi TLS Protect on-premises (formerly Venafi Trust Protection Platform). Similar to the cloud version: it lets you request new certificates and initiate renewals for certificates managed in a datacenter environment. Useful for on-prem certificate lifecycle automation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const venafitlsprotectdatacenterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.venafi-tls-protect-datacenter',
  displayName: 'Venafi TLS Protect Datacenter',
  description: 'Works with Venafi TLS Protect on-premises (formerly Venafi Trust Protection Platform). Similar to the cloud version: it lets you request new certificates and initiate renewals for certificates managed in a datacenter environment. Useful for on-prem certificate lifecycle automation.',
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
        { name: 'Renew Certificate', value: 'Renew Certificate' }
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
      description: 'Processed data from Venafi TLS Protect Datacenter'
    }
  ],

  credentials: [
    {
      name: 'venafi-tls-protect-datacenterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Venafi TLS Protect Datacenter'
  },

  aliases: ['venafi', 'tls', 'protect', 'datacenter'],
  
  examples: [
        {
      name: 'Request Certificate Item',
      description: 'Request Certificate an item from Venafi TLS Protect Datacenter',
      workflow: {
        nodes: [
          {
            name: 'Venafi TLS Protect Datacenter',
            type: 'n8n-nodes-base.venafi-tls-protect-datacenter',
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

export default venafitlsprotectdatacenterNode;