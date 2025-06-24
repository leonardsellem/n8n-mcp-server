/**
 * Harvest Node
 * 
 * Connects to Harvest (time tracking and invoicing). You can retrieve a list of time entries (e.g., for a user or project), create a new time entry (log hours to a project/task), and get project details. Helps automate time tracking and reporting workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const harvestNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.harvest',
  displayName: 'Harvest',
  description: 'Connects to Harvest (time tracking and invoicing). You can retrieve a list of time entries (e.g., for a user or project), create a new time entry (log hours to a project/task), and get project details. Helps automate time tracking and reporting workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Time Entries',
      description: 'The operation to perform',
      options: [
        { name: 'List Time Entries', value: 'List Time Entries' },
        { name: 'Create Time Entry', value: 'Create Time Entry' },
        { name: 'Get Projects', value: 'Get Projects' }
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
      description: 'Processed data from Harvest'
    }
  ],

  credentials: [
    {
      name: 'harvestApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Harvest'
  },

  aliases: ['harvest'],
  
  examples: [
        {
      name: 'List Time Entries Item',
      description: 'List Time Entries an item from Harvest',
      workflow: {
        nodes: [
          {
            name: 'Harvest',
            type: 'n8n-nodes-base.harvest',
            parameters: {
              operation: 'List Time Entries',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default harvestNode;