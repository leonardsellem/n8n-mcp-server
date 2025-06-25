/**
 * Stackby Node
 * 
 * Works with Stackby (flexible spreadsheet-database similar to Airtable). Allows creating, retrieving, updating, and listing rows in a Stackby table. Useful for treating Stackby as a data source or destination in workflows, similar to other spreadsheet-like databases.
 */

import { NodeTypeInfo } from '../node-types.js';

export const stackbyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stackby',
  displayName: 'Stackby',
  description: 'Works with Stackby (flexible spreadsheet-database similar to Airtable). Allows creating, retrieving, updating, and listing rows in a Stackby table. Useful for treating Stackby as a data source or destination in workflows, similar to other spreadsheet-like databases.',
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
        { name: 'List Rows', value: 'List Rows' }
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
      description: 'Processed data from Stackby'
    }
  ],

  credentials: [
    {
      name: 'stackbyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Stackby'
  },

  aliases: ['stackby'],
  
  examples: [
        {
      name: 'Create Row Item',
      description: 'Create Row an item from Stackby',
      workflow: {
        nodes: [
          {
            name: 'Stackby',
            type: 'n8n-nodes-base.stackby',
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

export default stackbyNode;