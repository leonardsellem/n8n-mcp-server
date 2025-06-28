/**
 * Default Data Loader Node
 * 
 * A sub-node that loads data for use by an AI chain/agent. The default loader might load data from a given source (like documents from a provided text or file) into memory for processing. It’s a basic mechanism to supply initial data to LLM workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const defaultdataloaderNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.default-data-loader',
  displayName: 'Default Data Loader',
  description: 'A sub-node that loads data for use by an AI chain/agent. The default loader might load data from a given source (like documents from a provided text or file) into memory for processing. It’s a basic mechanism to supply initial data to LLM workflows.',
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
      description: 'Processed data from Default Data Loader'
    }
  ],

  credentials: [
    {
      name: 'default-data-loaderApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Default Data Loader'
  },

  aliases: ['default', 'data', 'loader'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Default Data Loader',
      workflow: {
        nodes: [
          {
            name: 'Default Data Loader',
            type: 'n8n-nodes-base.default-data-loader',
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

export default defaultdataloaderNode;