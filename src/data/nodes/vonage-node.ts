/**
 * Vonage Node
 * 
 * Uses Vonage (formerly Nexmo) communications API. You can send SMS messages and initiate voice calls with TTS via Vonage’s API. Similar to Twilio/MessageBird, allowing SMS and call notifications integrated into workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const vonageNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.vonage',
  displayName: 'Vonage',
  description: 'Uses Vonage (formerly Nexmo) communications API. You can send SMS messages and initiate voice calls with TTS via Vonage’s API. Similar to Twilio/MessageBird, allowing SMS and call notifications integrated into workflows.',
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
        { name: 'Text-to-Speech Call', value: 'Text-to-Speech Call' }
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
      description: 'Processed data from Vonage'
    }
  ],

  credentials: [
    {
      name: 'vonageApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Vonage'
  },

  aliases: ['vonage'],
  
  examples: [
        {
      name: 'Send SMS Item',
      description: 'Send SMS an item from Vonage',
      workflow: {
        nodes: [
          {
            name: 'Vonage',
            type: 'n8n-nodes-base.vonage',
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

export default vonageNode;