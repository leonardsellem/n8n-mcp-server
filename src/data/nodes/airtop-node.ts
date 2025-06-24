/**
 * Airtop Node
 * 
 * Integrates with Airtop (communication/collaboration platform). It can send messages to Airtop channels or retrieve messages. Useful for automating notifications or pulling conversation data from Airtop.
 */

import { NodeTypeInfo } from '../node-types.js';

export const airtopNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.airtop',
  displayName: 'Airtop',
  description: 'Integrates with Airtop (communication/collaboration platform). It can send messages to Airtop channels or retrieve messages. Useful for automating notifications or pulling conversation data from Airtop.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Message',
      description: 'The operation to perform',
      options: [
        { name: 'Send Message', value: 'Send Message' },
        { name: 'Get Messages', value: 'Get Messages' }
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
      description: 'Processed data from Airtop'
    }
  ],

  credentials: [
    {
      name: 'airtopApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Airtop'
  },

  aliases: ['airtop'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Airtop',
      workflow: {
        nodes: [
          {
            name: 'Airtop',
            type: 'n8n-nodes-base.airtop',
            parameters: {
              operation: 'Send Message',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default airtopNode;