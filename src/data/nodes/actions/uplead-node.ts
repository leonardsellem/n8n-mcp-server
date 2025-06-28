/**
 * UpLead Node
 * 
 * Uses UpLead (B2B contact database) to find leads. You can search for contacts by criteria (like industry, title, etc.) and retrieve detailed info of a contact (email, phone, etc.). Helpful for sales lead generation and enrichment tasks.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const upleadNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.uplead',
  displayName: 'UpLead',
  description: 'Uses UpLead (B2B contact database) to find leads. You can search for contacts by criteria (like industry, title, etc.) and retrieve detailed info of a contact (email, phone, etc.). Helpful for sales lead generation and enrichment tasks.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Contacts',
      description: 'The operation to perform',
      options: [
        { name: 'Search Contacts', value: 'Search Contacts' },
        { name: 'Get Contact Details', value: 'Get Contact Details' }
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
      description: 'Processed data from UpLead'
    }
  ],

  credentials: [
    {
      name: 'upleadApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'UpLead'
  },

  aliases: ['uplead'],
  
  examples: [
        {
      name: 'Search Contacts Item',
      description: 'Search Contacts an item from UpLead',
      workflow: {
        nodes: [
          {
            name: 'UpLead',
            type: 'n8n-nodes-base.uplead',
            parameters: {
              operation: 'Search Contacts',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default upleadNode;