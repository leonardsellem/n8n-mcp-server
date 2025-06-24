/**
 * uProc Node
 * 
 * Integrates with uProc (data enrichment and verification). You can verify if an email address is valid and enrich company data (fetch company information from a domain or name). Useful for data validation and enrichment in lead management workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const uprocNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.uproc',
  displayName: 'uProc',
  description: 'Integrates with uProc (data enrichment and verification). You can verify if an email address is valid and enrich company data (fetch company information from a domain or name). Useful for data validation and enrichment in lead management workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Verify Email',
      description: 'The operation to perform',
      options: [
        { name: 'Verify Email', value: 'Verify Email' },
        { name: 'Enrich Company', value: 'Enrich Company' }
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
      description: 'Processed data from uProc'
    }
  ],

  credentials: [
    {
      name: 'uprocApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'uProc'
  },

  aliases: ['uproc'],
  
  examples: [
        {
      name: 'Verify Email Item',
      description: 'Verify Email an item from uProc',
      workflow: {
        nodes: [
          {
            name: 'uProc',
            type: 'n8n-nodes-base.uproc',
            parameters: {
              operation: 'Verify Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default uprocNode;