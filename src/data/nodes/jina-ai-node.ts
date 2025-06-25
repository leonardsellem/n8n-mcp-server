/**
 * Jina AI Node
 * 
 * Works with Jina AI (neural search framework). You can index data (add documents/vectors to a Jina index) and perform search queries against the index. Enables building AI-powered search workflows or integrating with Jina-based services.
 */

import { NodeTypeInfo } from '../node-types.js';

export const jinaaiNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jina-ai',
  displayName: 'Jina AI',
  description: 'Works with Jina AI (neural search framework). You can index data (add documents/vectors to a Jina index) and perform search queries against the index. Enables building AI-powered search workflows or integrating with Jina-based services.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Index',
      description: 'The operation to perform',
      options: [
        { name: 'Search Index', value: 'Search Index' },
        { name: 'Index Data', value: 'Index Data' }
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
      description: 'Processed data from Jina AI'
    }
  ],

  credentials: [
    {
      name: 'jina-aiApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Jina AI'
  },

  aliases: ['jina'],
  
  examples: [
        {
      name: 'Search Index Item',
      description: 'Search Index an item from Jina AI',
      workflow: {
        nodes: [
          {
            name: 'Jina AI',
            type: 'n8n-nodes-base.jina-ai',
            parameters: {
              operation: 'Search Index',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default jinaaiNode;