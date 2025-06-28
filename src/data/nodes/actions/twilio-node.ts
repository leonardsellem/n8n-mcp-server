/**
 * Twilio Node
 * 
 * Integrates with Twilio (cloud communications). Allows sending SMS text messages, initiating voice calls (you can set up calls with TwiML instructions), and performing phone number lookup (to get carrier/type info). This is widely used for sending alerts, OTP codes, or making robocalls from workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const twilioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twilio',
  displayName: 'Twilio',
  description: 'Integrates with Twilio (cloud communications). Allows sending SMS text messages, initiating voice calls (you can set up calls with TwiML instructions), and performing phone number lookup (to get carrier/type info). This is widely used for sending alerts, OTP codes, or making robocalls from workflows.',
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
        { name: 'Make Call', value: 'Make Call' },
        { name: 'Lookup Phone', value: 'Lookup Phone' }
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
      description: 'Processed data from Twilio'
    }
  ],

  credentials: [
    {
      name: 'twilioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Twilio'
  },

  aliases: ['twilio'],
  
  examples: [
        {
      name: 'Send SMS Item',
      description: 'Send SMS an item from Twilio',
      workflow: {
        nodes: [
          {
            name: 'Twilio',
            type: 'n8n-nodes-base.twilio',
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

export default twilioNode;