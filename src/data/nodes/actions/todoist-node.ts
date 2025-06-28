/**
 * Todoist Node
 * 
 * Integrates with Todoist (task management app). You can create new tasks, retrieve task details (including checking if completed), close/complete a task, and list projects. Useful for personal productivity automation, like adding tasks from emails or updating tasks based on events.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const todoistNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.todoist',
  displayName: 'Todoist',
  description: 'Integrates with Todoist (task management app). You can create new tasks, retrieve task details (including checking if completed), close/complete a task, and list projects. Useful for personal productivity automation, like adding tasks from emails or updating tasks based on events.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Task',
      description: 'The operation to perform',
      options: [
        { name: 'Create Task', value: 'Create Task' },
        { name: 'Get Task', value: 'Get Task' },
        { name: 'Close Task', value: 'Close Task' },
        { name: 'List Projects', value: 'List Projects' }
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
      description: 'Processed data from Todoist'
    }
  ],

  credentials: [
    {
      name: 'todoistApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Todoist'
  },

  aliases: ['todoist'],
  
  examples: [
        {
      name: 'Create Task Item',
      description: 'Create Task an item from Todoist',
      workflow: {
        nodes: [
          {
            name: 'Todoist',
            type: 'n8n-nodes-base.todoist',
            parameters: {
              operation: 'Create Task',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default todoistNode;