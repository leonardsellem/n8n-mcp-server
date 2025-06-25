/**
 * Taiga Node
 * 
 * Connects to Taiga (project management). You can create a new issue/task in a Taiga project, retrieve details of an issue, and list issues in a project (with filters). Useful for issue tracking automation in software projects using Taiga.
 */

import { NodeTypeInfo } from '../node-types.js';

export const taigaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.taiga',
  displayName: 'Taiga',
  description: 'Connects to Taiga (project management). You can create a new issue/task in a Taiga project, retrieve details of an issue, and list issues in a project (with filters). Useful for issue tracking automation in software projects using Taiga.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Issue',
      description: 'The operation to perform',
      options: [
        { name: 'Create Issue', value: 'Create Issue' },
        { name: 'Get Issue', value: 'Get Issue' },
        { name: 'List Issues', value: 'List Issues' }
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
      description: 'Processed data from Taiga'
    }
  ],

  credentials: [
    {
      name: 'taigaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Taiga'
  },

  aliases: ['taiga'],
  
  examples: [
        {
      name: 'Create Issue Item',
      description: 'Create Issue an item from Taiga',
      workflow: {
        nodes: [
          {
            name: 'Taiga',
            type: 'n8n-nodes-base.taiga',
            parameters: {
              operation: 'Create Issue',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default taigaNode;