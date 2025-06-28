/**
 * Microsoft To Do Node
 * 
 * Connects to Microsoft To Do (task list app). Allows listing tasks in your default or specified task list, creating a new task, and marking a task as completed. Good for personal task automation in the Microsoft ecosystem (like adding reminders or syncing tasks from other sources).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsofttodoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-to-do',
  displayName: 'Microsoft To Do',
  description: 'Connects to Microsoft To Do (task list app). Allows listing tasks in your default or specified task list, creating a new task, and marking a task as completed. Good for personal task automation in the Microsoft ecosystem (like adding reminders or syncing tasks from other sources).',
  category: 'Productivity',
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
        { name: 'Mark Completed', value: 'Mark Completed' }
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
      description: 'Processed data from Microsoft To Do'
    }
  ],

  credentials: [
    {
      name: 'microsoft-to-doApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft To Do'
  },

  aliases: ['microsoft'],
  
  examples: [
        {
      name: 'List Tasks Item',
      description: 'List Tasks an item from Microsoft To Do',
      workflow: {
        nodes: [
          {
            name: 'Microsoft To Do',
            type: 'n8n-nodes-base.microsoft-to-do',
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

export default microsofttodoNode;