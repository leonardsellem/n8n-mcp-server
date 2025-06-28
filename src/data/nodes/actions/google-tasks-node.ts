/**
 * Google Tasks Node
 * 
 * Connects to Google Tasks (task lists tied to Google accounts). Allows listing task lists, creating new tasks in a list, updating tasks (e.g., changing title or due date), and marking tasks as completed. Useful for personal task management integration.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googletasksNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-tasks',
  displayName: 'Google Tasks',
  description: 'Connects to Google Tasks (task lists tied to Google accounts). Allows listing task lists, creating new tasks in a list, updating tasks (e.g., changing title or due date), and marking tasks as completed. Useful for personal task management integration.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Tasklists',
      description: 'The operation to perform',
      options: [
        { name: 'List Tasklists', value: 'List Tasklists' },
        { name: 'Create Task', value: 'Create Task' },
        { name: 'Update Task', value: 'Update Task' },
        { name: 'Complete Task', value: 'Complete Task' }
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
      description: 'Processed data from Google Tasks'
    }
  ],

  credentials: [
    {
      name: 'google-tasksApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Tasks'
  },

  aliases: ['google', 'tasks'],
  
  examples: [
        {
      name: 'List Tasklists Item',
      description: 'List Tasklists an item from Google Tasks',
      workflow: {
        nodes: [
          {
            name: 'Google Tasks',
            type: 'n8n-nodes-base.google-tasks',
            parameters: {
              operation: 'List Tasklists',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googletasksNode;