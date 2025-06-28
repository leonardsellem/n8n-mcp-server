/**
 * Flow Node
 * 
 * Connects to Flow (task/project management by Microsoft). Allows listing tasks, creating a new task, or updating an existing task in Microsoft Flow (Planner). Helps integrate tasks from Flow/Planner with other workflow data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const flowNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.flow',
  displayName: 'Flow',
  description: 'Connects to Flow (task/project management by Microsoft). Allows listing tasks, creating a new task, or updating an existing task in Microsoft Flow (Planner). Helps integrate tasks from Flow/Planner with other workflow data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Tasks',
      description: 'The operation to perform',
      options: [
        { name: 'List Tasks', value: 'List Tasks' },
        { name: 'Create Task', value: 'Create Task' },
        { name: 'Update Task', value: 'Update Task' }
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
      description: 'Processed data from Flow'
    }
  ],

  credentials: [
    {
      name: 'flowApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Flow'
  },

  aliases: ['flow'],
  
  examples: [
        {
      name: 'List Tasks Item',
      description: 'List Tasks an item from Flow',
      workflow: {
        nodes: [
          {
            name: 'Flow',
            type: 'n8n-nodes-base.flow',
            parameters: {
              operation: 'List Tasks',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default flowNode;