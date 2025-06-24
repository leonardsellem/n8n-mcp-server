/**
 * seven Node
 * 
 * Uses the seven.io API (SMS provider) to send SMS messages and check account balance. Similar to other SMS nodes, just specific to seven (formerly sms77) service, for sending text messages via workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const sevenNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.seven',
  displayName: 'seven',
  description: 'Uses the seven.io API (SMS provider) to send SMS messages and check account balance. Similar to other SMS nodes, just specific to seven (formerly sms77) service, for sending text messages via workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send SMS',
      description: 'The operation to perform',
      options: [
        { name: 'Send SMS', value: 'Send SMS' },
        { name: 'Get Balance', value: 'Get Balance' }
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
      description: 'Processed data from seven'
    }
  ],

  credentials: [
    {
      name: 'sevenApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'seven'
  },

  aliases: ['seven'],
  
  examples: [
        {
      name: 'Send SMS Item',
      description: 'Send SMS an item from seven',
      workflow: {
        nodes: [
          {
            name: 'seven',
            type: 'n8n-nodes-base.seven',
            parameters: {
              operation: 'Send SMS',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sevenNode;