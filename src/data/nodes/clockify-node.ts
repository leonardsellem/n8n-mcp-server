/**
 * Clockify Node
 * 
 * Works with Clockify (time tracking). You can start or stop a running timer for a user, list time entries, or log a new time entry. Useful for automating time tracking, e.g., start a timer when a task begins via n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const clockifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.clockify',
  displayName: 'Clockify',
  description: 'Works with Clockify (time tracking). You can start or stop a running timer for a user, list time entries, or log a new time entry. Useful for automating time tracking, e.g., start a timer when a task begins via n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Start Timer',
      description: 'The operation to perform',
      options: [
        { name: 'Start Timer', value: 'Start Timer' },
        { name: 'Stop Timer', value: 'Stop Timer' },
        { name: 'List Entries', value: 'List Entries' },
        { name: 'Add Time Entry', value: 'Add Time Entry' }
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
      description: 'Processed data from Clockify'
    }
  ],

  credentials: [
    {
      name: 'clockifyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Clockify'
  },

  aliases: ['clockify'],
  
  examples: [
        {
      name: 'Start Timer Item',
      description: 'Start Timer an item from Clockify',
      workflow: {
        nodes: [
          {
            name: 'Clockify',
            type: 'n8n-nodes-base.clockify',
            parameters: {
              operation: 'Start Timer',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default clockifyNode;