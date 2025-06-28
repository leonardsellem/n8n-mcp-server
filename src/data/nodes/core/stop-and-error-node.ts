/**
 * Stop And Error Node
 * 
 * Intentionally stops the workflow execution and throws an error. This node will cause the workflow to fail at that point (emitting a user-defined error message). Useful for guarding conditions – e.g., stop if data is invalid.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const stopanderrorNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stop-and-error',
  displayName: 'Stop And Error',
  description: 'Intentionally stops the workflow execution and throws an error. This node will cause the workflow to fail at that point (emitting a user-defined error message). Useful for guarding conditions – e.g., stop if data is invalid.',
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
      description: 'Processed data from Stop And Error'
    }
  ],

  credentials: [
    {
      name: 'stop-and-errorApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Stop And Error'
  },

  aliases: ['stop', 'and', 'error'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Stop And Error',
      workflow: {
        nodes: [
          {
            name: 'Stop And Error',
            type: 'n8n-nodes-base.stop-and-error',
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

export default stopanderrorNode;