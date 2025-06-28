/**
 * MSG91 Node
 * 
 * Integrates with MSG91 (SMS service). Allows sending SMS text messages via the MSG91 API to given phone numbers. Good for workflows needing to send notifications or OTPs especially in regions where MSG91 is popular.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const msg91Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.msg91',
  displayName: 'MSG91',
  description: 'Integrates with MSG91 (SMS service). Allows sending SMS text messages via the MSG91 API to given phone numbers. Good for workflows needing to send notifications or OTPs especially in regions where MSG91 is popular.',
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
      description: 'Processed data from MSG91'
    }
  ],

  credentials: [
    {
      name: 'msg91Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MSG91'
  },

  aliases: ['msg91'],
  
  examples: [
        {
      name: 'Send SMS Item',
      description: 'Send SMS an item from MSG91',
      workflow: {
        nodes: [
          {
            name: 'MSG91',
            type: 'n8n-nodes-base.msg91',
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

export default msg91Node;