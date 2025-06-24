/**
 * E-goi Node
 * 
 * Integrates with E-goi (omni-channel marketing automation). You can add contacts to E-goi, send SMS messages, or send emails via E-goi’s platform. Useful for multi-channel marketing automation through n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const egoiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.egoi',
  displayName: 'E-goi',
  description: 'Integrates with E-goi (omni-channel marketing automation). You can add contacts to E-goi, send SMS messages, or send emails via E-goi’s platform. Useful for multi-channel marketing automation through n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Create Contact', value: 'Create Contact' },
        { name: 'Send SMS', value: 'Send SMS' },
        { name: 'Send Email', value: 'Send Email' }
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
      description: 'Processed data from E-goi'
    }
  ],

  credentials: [
    {
      name: 'egoiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'E-goi'
  },

  aliases: ['goi'],
  
  examples: [
        {
      name: 'Create Contact Item',
      description: 'Create Contact an item from E-goi',
      workflow: {
        nodes: [
          {
            name: 'E-goi',
            type: 'n8n-nodes-base.egoi',
            parameters: {
              operation: 'Create Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default egoiNode;