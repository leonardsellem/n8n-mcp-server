/**
 * Affinity Node
 * 
 * Integrates with Affinity (relationship intelligence platform). Supports retrieving lists of entities (like contacts or organizations), creating new entities, or updating existing ones in Affinity’s CRM-like system.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const affinityNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.affinity',
  displayName: 'Affinity',
  description: 'Integrates with Affinity (relationship intelligence platform). Supports retrieving lists of entities (like contacts or organizations), creating new entities, or updating existing ones in Affinity’s CRM-like system.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Entities',
      description: 'The operation to perform',
      options: [
        { name: 'List Entities', value: 'List Entities' },
        { name: 'Create Entity', value: 'Create Entity' },
        { name: 'Update Entity', value: 'Update Entity' }
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
      description: 'Processed data from Affinity'
    }
  ],

  credentials: [
    {
      name: 'affinityApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Affinity'
  },

  aliases: ['affinity'],
  
  examples: [
        {
      name: 'List Entities Item',
      description: 'List Entities an item from Affinity',
      workflow: {
        nodes: [
          {
            name: 'Affinity',
            type: 'n8n-nodes-base.affinity',
            parameters: {
              operation: 'List Entities',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default affinityNode;