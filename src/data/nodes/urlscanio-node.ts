/**
 * urlscan.io Node
 * 
 * Uses urlscan.io API to scan websites for threats or screenshot them. You can submit a URL for scanning (which checks for malicious content, etc., and generates a report with a screenshot) and retrieve the results of a scan. Useful in security workflows or for automated link previews/safety checks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const urlscanioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.urlscanio',
  displayName: 'urlscan.io',
  description: 'Uses urlscan.io API to scan websites for threats or screenshot them. You can submit a URL for scanning (which checks for malicious content, etc., and generates a report with a screenshot) and retrieve the results of a scan. Useful in security workflows or for automated link previews/safety checks.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Scan URL',
      description: 'The operation to perform',
      options: [
        { name: 'Scan URL', value: 'Scan URL' },
        { name: 'Get Scan Result', value: 'Get Scan Result' }
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
      description: 'Processed data from urlscan.io'
    }
  ],

  credentials: [
    {
      name: 'urlscanioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'urlscan.io'
  },

  aliases: ['urlscan.io'],
  
  examples: [
        {
      name: 'Scan URL Item',
      description: 'Scan URL an item from urlscan.io',
      workflow: {
        nodes: [
          {
            name: 'urlscan.io',
            type: 'n8n-nodes-base.urlscanio',
            parameters: {
              operation: 'Scan URL',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default urlscanioNode;