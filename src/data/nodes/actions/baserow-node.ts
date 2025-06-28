/**
 * Baserow Node
 * 
 * Connects to Baserow (open-source online database/spreadsheet). Enables creating a new row in a table, retrieving a row by ID, updating a row, listing all rows in a table, or deleting a row. Useful for managing Baserow data from n8n.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const baserowNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.baserow',
  displayName: 'Baserow',
  description: 'Connects to Baserow (open-source online database/spreadsheet). Enables creating a new row in a table, retrieving a row by ID, updating a row, listing all rows in a table, or deleting a row. Useful for managing Baserow data from n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Row',
      description: 'The operation to perform',
      options: [
        { name: 'Create Row', value: 'Create Row' },
        { name: 'Get Row', value: 'Get Row' },
        { name: 'Update Row', value: 'Update Row' },
        { name: 'List Rows', value: 'List Rows' },
        { name: 'Delete Row', value: 'Delete Row' }
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
      description: 'Processed data from Baserow'
    }
  ],

  credentials: [
    {
      name: 'baserowApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Baserow'
  },

  aliases: ['baserow'],
  
  examples: [
        {
      name: 'Create Row Item',
      description: 'Create Row an item from Baserow',
      workflow: {
        nodes: [
          {
            name: 'Baserow',
            type: 'n8n-nodes-base.baserow',
            parameters: {
              operation: 'Create Row',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default baserowNode;