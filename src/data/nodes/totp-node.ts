/**
 * TOTP Node
 * 
 * Generates or validates Time-based One-Time Passwords (TOTP), commonly used for 2FA codes. It can produce the current OTP code for a given secret, or verify a provided code against a secret and time window.
 */

import { NodeTypeInfo } from '../node-types.js';

export const totpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.totp',
  displayName: 'TOTP',
  description: 'Generates or validates Time-based One-Time Passwords (TOTP), commonly used for 2FA codes. It can produce the current OTP code for a given secret, or verify a provided code against a secret and time window.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Generate',
      description: 'The operation to perform',
      options: [
        { name: 'Generate', value: 'Generate' },
        { name: 'Validate', value: 'Validate' }
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
      description: 'Processed data from TOTP'
    }
  ],

  credentials: [
    {
      name: 'totpApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'TOTP'
  },

  aliases: ['totp'],
  
  examples: [
        {
      name: 'Generate Item',
      description: 'Generate an item from TOTP',
      workflow: {
        nodes: [
          {
            name: 'TOTP',
            type: 'n8n-nodes-base.totp',
            parameters: {
              operation: 'Generate',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default totpNode;