/**
 * Coda Node
 * 
 * Works with Coda (documents/spreadsheets platform). You can list documents, read rows from a table in a doc, add new rows, update existing rows, or delete rows. This helps integrate Coda docs with other services by automating data in/out of Coda tables.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const codaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.coda',
  displayName: 'Coda',
  description: 'Works with Coda (documents/spreadsheets platform). You can list documents, read rows from a table in a doc, add new rows, update existing rows, or delete rows. This helps integrate Coda docs with other services by automating data in/out of Coda tables.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Docs',
      description: 'The operation to perform',
      options: [
        { name: 'List Docs', value: 'List Docs' },
        { name: 'Read Table', value: 'Read Table' },
        { name: 'Add Row', value: 'Add Row' },
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
      description: 'Processed data from Coda'
    }
  ],

  credentials: [
    {
      name: 'codaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Coda'
  },

  aliases: ['coda'],
  
  examples: [
        {
      name: 'List Docs Item',
      description: 'List Docs an item from Coda',
      workflow: {
        nodes: [
          {
            name: 'Coda',
            type: 'n8n-nodes-base.coda',
            parameters: {
              operation: 'List Docs',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default codaNode;