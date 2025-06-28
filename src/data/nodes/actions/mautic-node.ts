/**
 * Mautic Node
 * 
 * Works with Mautic (open-source marketing automation). You can create or update contacts (leads), add contacts to segments (mailing groups), and list contacts. Helps integrate lead generation or user activity from other sources with Mautic’s marketing campaigns.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mauticNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mautic',
  displayName: 'Mautic',
  description: 'Works with Mautic (open-source marketing automation). You can create or update contacts (leads), add contacts to segments (mailing groups), and list contacts. Helps integrate lead generation or user activity from other sources with Mautic’s marketing campaigns.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Add Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Add Contact', value: 'Add Contact' },
        { name: 'Update Contact', value: 'Update Contact' },
        { name: 'Add Contact to Segment', value: 'Add Contact to Segment' },
        { name: 'List Contacts', value: 'List Contacts' }
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
      description: 'Processed data from Mautic'
    }
  ],

  credentials: [
    {
      name: 'mauticApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Mautic'
  },

  aliases: ['mautic'],
  
  examples: [
        {
      name: 'Add Contact Item',
      description: 'Add Contact an item from Mautic',
      workflow: {
        nodes: [
          {
            name: 'Mautic',
            type: 'n8n-nodes-base.mautic',
            parameters: {
              operation: 'Add Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mauticNode;