/**
 * Git Node
 * 
 * Performs Git repository operations. It can clone repositories, commit and push changes, or pull updates. Useful for integrating workflows with version control (e.g., updating files in a repo as part of automation).
 */

import { NodeTypeInfo } from '../node-types.js';

export const gitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.git',
  displayName: 'Git',
  description: 'Performs Git repository operations. It can clone repositories, commit and push changes, or pull updates. Useful for integrating workflows with version control (e.g., updating files in a repo as part of automation).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Clone',
      description: 'The operation to perform',
      options: [
        { name: 'Clone', value: 'Clone' },
        { name: 'Commit', value: 'Commit' },
        { name: 'Push', value: 'Push' },
        { name: 'Pull', value: 'Pull' }
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
      description: 'Processed data from Git'
    }
  ],

  credentials: [
    {
      name: 'gitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Git'
  },

  aliases: ['git'],
  
  examples: [
        {
      name: 'Clone Item',
      description: 'Clone an item from Git',
      workflow: {
        nodes: [
          {
            name: 'Git',
            type: 'n8n-nodes-base.git',
            parameters: {
              operation: 'Clone',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default gitNode;