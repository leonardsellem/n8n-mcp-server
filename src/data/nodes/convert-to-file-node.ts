/**
 * Convert to File Node
 * 
 * Converts data (such as text or JSON) into a file and outputs it as binary data. Often used to prepare data (like a text string or HTML) as a file for later nodes (e.g. to email as attachment).
 */

import { NodeTypeInfo } from '../node-types.js';

export const converttofileNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.convert-to-file',
  displayName: 'Convert to File',
  description: 'Converts data (such as text or JSON) into a file and outputs it as binary data. Often used to prepare data (like a text string or HTML) as a file for later nodes (e.g. to email as attachment).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Convert to File'
    }
  ],

  credentials: [
    {
      name: 'convert-to-fileApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Convert to File'
  },

  aliases: ['convert', 'file'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Convert to File',
      workflow: {
        nodes: [
          {
            name: 'Convert to File',
            type: 'n8n-nodes-base.convert-to-file',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default converttofileNode;