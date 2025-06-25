/**
 * WhatsApp Business Cloud Node
 * 
 * Uses the WhatsApp Business Cloud API (by Facebook/Meta):contentReference[oaicite:49]{index=49}. You can send text messages or template messages to WhatsApp users, send media (images, documents), and retrieve message history via the cloud API. Enables integrating WhatsApp messaging (for notifications, customer support, etc.) into your workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const whatsappbusinesscloudNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.whatsapp-business-cloud',
  displayName: 'WhatsApp Business Cloud',
  description: 'Uses the WhatsApp Business Cloud API (by Facebook/Meta):contentReference[oaicite:49]{index=49}. You can send text messages or template messages to WhatsApp users, send media (images, documents), and retrieve message history via the cloud API. Enables integrating WhatsApp messaging (for notifications, customer support, etc.) into your workflows.',
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
        { name: 'Send Media', value: 'Send Media' },
        { name: 'List Messages', value: 'List Messages' }
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
      description: 'Processed data from WhatsApp Business Cloud'
    }
  ],

  credentials: [
    {
      name: 'whatsapp-business-cloudApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'WhatsApp Business Cloud'
  },

  aliases: ['whatsapp', 'business', 'cloud'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from WhatsApp Business Cloud',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Business Cloud',
            type: 'n8n-nodes-base.whatsapp-business-cloud',
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

export default whatsappbusinesscloudNode;