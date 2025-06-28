/**
 * SeaTable Node
 * 
 * Works with SeaTable (collaborative spreadsheet database). You can retrieve rows from a SeaTable base, add new rows, modify existing rows, and delete rows. Similar to Airtable integration but for SeaTable, facilitating data flows between SeaTable and other apps.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const seatableNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.seatable',
  displayName: 'SeaTable',
  description: 'Works with SeaTable (collaborative spreadsheet database). You can retrieve rows from a SeaTable base, add new rows, modify existing rows, and delete rows. Similar to Airtable integration but for SeaTable, facilitating data flows between SeaTable and other apps.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Rows',
      description: 'The operation to perform',
      options: [
        { name: 'List Rows', value: 'List Rows' },
        { name: 'Create Row', value: 'Create Row' },
        { name: 'Update Row', value: 'Update Row' },
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
      description: 'Processed data from SeaTable'
    }
  ],

  credentials: [
    {
      name: 'seatableApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SeaTable'
  },

  aliases: ['seatable'],
  
  examples: [
        {
      name: 'List Rows Item',
      description: 'List Rows an item from SeaTable',
      workflow: {
        nodes: [
          {
            name: 'SeaTable',
            type: 'n8n-nodes-base.seatable',
            parameters: {
              operation: 'List Rows',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default seatableNode;