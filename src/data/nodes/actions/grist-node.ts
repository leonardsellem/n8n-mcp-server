/**
 * Grist Node
 * 
 * Works with Grist (collaborative spreadsheet/database). You can read data from a Grist table, add new records, update existing records, or delete records. This helps integrate Grist’s flexible spreadsheets with other systems for data syncing.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const gristNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.grist',
  displayName: 'Grist',
  description: 'Works with Grist (collaborative spreadsheet/database). You can read data from a Grist table, add new records, update existing records, or delete records. This helps integrate Grist’s flexible spreadsheets with other systems for data syncing.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Read Table',
      description: 'The operation to perform',
      options: [
        { name: 'Read Table', value: 'Read Table' },
        { name: 'Add Record', value: 'Add Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'Delete Record', value: 'Delete Record' }
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
      description: 'Processed data from Grist'
    }
  ],

  credentials: [
    {
      name: 'gristApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Grist'
  },

  aliases: ['grist'],
  
  examples: [
        {
      name: 'Read Table Item',
      description: 'Read Table an item from Grist',
      workflow: {
        nodes: [
          {
            name: 'Grist',
            type: 'n8n-nodes-base.grist',
            parameters: {
              operation: 'Read Table',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default gristNode;