/**
 * Mailcheck Node
 * 
 * Uses Mailcheck (email verification service) to validate an email address. It returns whether an email is deliverable, risky, or invalid. Helpful for cleaning email lists or verifying user input emails before using them.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mailcheckNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailcheck',
  displayName: 'Mailcheck',
  description: 'Uses Mailcheck (email verification service) to validate an email address. It returns whether an email is deliverable, risky, or invalid. Helpful for cleaning email lists or verifying user input emails before using them.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from Mailcheck'
    }
  ],

  credentials: [
    {
      name: 'mailcheckApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Mailcheck'
  },

  aliases: ['mailcheck'],
  
  examples: [
        {
      name: 'Verify Email Item',
      description: 'Verify Email an item from Mailcheck',
      workflow: {
        nodes: [
          {
            name: 'Mailcheck',
            type: 'n8n-nodes-base.mailcheck',
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

export default mailcheckNode;