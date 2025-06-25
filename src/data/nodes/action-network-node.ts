/**
 * Action Network Node
 * 
 * Integrates with Action Network (online advocacy platform). Allows creating actions (petitions, events, etc.), retrieving action details, listing actions, or updating them via the Action Network API.
 */

import { NodeTypeInfo } from '../node-types.js';

export const actionnetworkNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.action-network',
  displayName: 'Action Network',
  description: 'Integrates with Action Network (online advocacy platform). Allows creating actions (petitions, events, etc.), retrieving action details, listing actions, or updating them via the Action Network API.',
  category: 'Core',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Action',
      description: 'The operation to perform',
      options: [
        { name: 'Create Action', value: 'Create Action' },
        { name: 'Get Action', value: 'Get Action' },
        { name: 'List Actions', value: 'List Actions' },
        { name: 'Update Action', value: 'Update Action' }
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
      description: 'Processed data from Action Network'
    }
  ],

  credentials: [
    {
      name: 'action-networkApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Action Network'
  },

  aliases: ['action', 'network'],
  
  examples: [
        {
      name: 'Create Action Item',
      description: 'Create Action an item from Action Network',
      workflow: {
        nodes: [
          {
            name: 'Action Network',
            type: 'n8n-nodes-base.action-network',
            parameters: {
              operation: 'Create Action',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default actionnetworkNode;