/**
 * No Operation, do nothing Node
 * 
 * A placeholder node that does nothing. It simply passes the input data through unchanged. Useful for temporarily disabling a branch or ending a branch of execution without altering data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const nooperationdonothingNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.no-operation-do-nothing',
  displayName: 'No Operation, do nothing',
  description: 'A placeholder node that does nothing. It simply passes the input data through unchanged. Useful for temporarily disabling a branch or ending a branch of execution without altering data.',
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
      description: 'Processed data from No Operation, do nothing'
    }
  ],

  credentials: [
    {
      name: 'no-operation-do-nothingApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'No Operation, do nothing'
  },

  aliases: ['operation,', 'nothing'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from No Operation, do nothing',
      workflow: {
        nodes: [
          {
            name: 'No Operation, do nothing',
            type: 'n8n-nodes-base.no-operation-do-nothing',
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

export default nooperationdonothingNode;