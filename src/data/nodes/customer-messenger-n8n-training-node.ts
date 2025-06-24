/**
 * Customer Messenger (n8n Training) Node
 * 
 * A demo/training node representing a customer messaging service. It allows sending a message to a customer (used in n8n training use-cases). Not a real-world service, but simulates sending communications to customers as part of the training workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const customermessengern8ntrainingNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.customer-messenger-n8n-training',
  displayName: 'Customer Messenger (n8n Training)',
  description: 'A demo/training node representing a customer messaging service. It allows sending a message to a customer (used in n8n training use-cases). Not a real-world service, but simulates sending communications to customers as part of the training workflows.',
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
      description: 'Processed data from Customer Messenger (n8n Training)'
    }
  ],

  credentials: [
    {
      name: 'customer-messenger-n8n-trainingApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Customer Messenger (n8n Training)'
  },

  aliases: ['customer', 'messenger', 'n8n', 'training'],
  
  examples: [
        {
      name: 'Send Message Item',
      description: 'Send Message an item from Customer Messenger (n8n Training)',
      workflow: {
        nodes: [
          {
            name: 'Customer Messenger (n8n Training)',
            type: 'n8n-nodes-base.customer-messenger-n8n-training',
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

export default customermessengern8ntrainingNode;