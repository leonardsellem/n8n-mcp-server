/**
 * Wekan Node
 * 
 * Integrates with Wekan (open-source Trello-like kanban). You can create a new card on a Wekan board, retrieve details of a board, and list all boards. Helps in task automation in self-hosted kanban workflows, similar to Trello integration but for Wekan.
 */

import { NodeTypeInfo } from '../node-types.js';

export const wekanNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wekan',
  displayName: 'Wekan',
  description: 'Integrates with Wekan (open-source Trello-like kanban). You can create a new card on a Wekan board, retrieve details of a board, and list all boards. Helps in task automation in self-hosted kanban workflows, similar to Trello integration but for Wekan.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Card',
      description: 'The operation to perform',
      options: [
        { name: 'Create Card', value: 'Create Card' },
        { name: 'Get Board', value: 'Get Board' },
        { name: 'List Boards', value: 'List Boards' }
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
      description: 'Processed data from Wekan'
    }
  ],

  credentials: [
    {
      name: 'wekanApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Wekan'
  },

  aliases: ['wekan'],
  
  examples: [
        {
      name: 'Create Card Item',
      description: 'Create Card an item from Wekan',
      workflow: {
        nodes: [
          {
            name: 'Wekan',
            type: 'n8n-nodes-base.wekan',
            parameters: {
              operation: 'Create Card',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default wekanNode;