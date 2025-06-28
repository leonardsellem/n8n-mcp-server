/**
 * MessageBird Node
 * 
 * Uses MessageBird (communication API) to send messages. You can send SMS texts to phones, send a text-to-speech voice call, and perform HLR lookup (to check if a phone number is reachable and get info). Great for SMS notifications or phone call alerts via MessageBird.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const messagebirdNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.messagebird',
  displayName: 'MessageBird',
  description: 'Uses MessageBird (communication API) to send messages. You can send SMS texts to phones, send a text-to-speech voice call, and perform HLR lookup (to check if a phone number is reachable and get info). Great for SMS notifications or phone call alerts via MessageBird.',
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
        { name: 'Send Voice Message', value: 'Send Voice Message' },
        { name: 'Lookup HLR', value: 'Lookup HLR' }
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
      description: 'Processed data from MessageBird'
    }
  ],

  credentials: [
    {
      name: 'messagebirdApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MessageBird'
  },

  aliases: ['messagebird'],
  
  examples: [
        {
      name: 'Send SMS Item',
      description: 'Send SMS an item from MessageBird',
      workflow: {
        nodes: [
          {
            name: 'MessageBird',
            type: 'n8n-nodes-base.messagebird',
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

export default messagebirdNode;