/**
 * ERPNext Node
 * 
 * Connects to ERPNext (open-source ERP system). Allows generic operations on ERPNext DocTypes: create a new record (e.g., Customer, Invoice), retrieve record data, update a record, or list records. This integrates ERP processes with other apps.
 */

import { NodeTypeInfo } from '../node-types.js';

export const erpnextNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.erpnext',
  displayName: 'ERPNext',
  description: 'Connects to ERPNext (open-source ERP system). Allows generic operations on ERPNext DocTypes: create a new record (e.g., Customer, Invoice), retrieve record data, update a record, or list records. This integrates ERP processes with other apps.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Resource',
      description: 'The operation to perform',
      options: [
        { name: 'Create Resource', value: 'Create Resource' },
        { name: 'Get Resource', value: 'Get Resource' },
        { name: 'Update Resource', value: 'Update Resource' },
        { name: 'List Resource', value: 'List Resource' }
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
      description: 'Processed data from ERPNext'
    }
  ],

  credentials: [
    {
      name: 'erpnextApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'ERPNext'
  },

  aliases: ['erpnext'],
  
  examples: [
        {
      name: 'Create Resource Item',
      description: 'Create Resource an item from ERPNext',
      workflow: {
        nodes: [
          {
            name: 'ERPNext',
            type: 'n8n-nodes-base.erpnext',
            parameters: {
              operation: 'Create Resource',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default erpnextNode;