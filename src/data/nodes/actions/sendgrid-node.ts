/**
 * SendGrid Node
 * 
 * Integrates with SendGrid (email delivery service). You can send emails by specifying recipients, subject, and content (plain or HTML), and send templated emails using a SendGrid template ID and dynamic data:contentReference[oaicite:39]{index=39}. Useful for transactional email sending through SendGrid.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sendgridNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sendgrid',
  displayName: 'SendGrid',
  description: 'Integrates with SendGrid (email delivery service). You can send emails by specifying recipients, subject, and content (plain or HTML), and send templated emails using a SendGrid template ID and dynamic data:contentReference[oaicite:39]{index=39}. Useful for transactional email sending through SendGrid.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Send Email',
      description: 'The operation to perform',
      options: [
        { name: 'Send Email', value: 'Send Email' },
        { name: 'Send Template Email', value: 'Send Template Email' }
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
      description: 'Processed data from SendGrid'
    }
  ],

  credentials: [
    {
      name: 'sendgridApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SendGrid'
  },

  aliases: ['sendgrid'],
  
  examples: [
        {
      name: 'Send Email Item',
      description: 'Send Email an item from SendGrid',
      workflow: {
        nodes: [
          {
            name: 'SendGrid',
            type: 'n8n-nodes-base.sendgrid',
            parameters: {
              operation: 'Send Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sendgridNode;