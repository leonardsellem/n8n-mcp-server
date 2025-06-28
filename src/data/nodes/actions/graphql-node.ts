/**
 * GraphQL Node
 * 
 * Makes GraphQL requests to an API endpoint. You can execute GraphQL queries or mutations by providing the request payload and variables. Essentially a specialized HTTP request node for GraphQL APIs.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const graphqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.graphql',
  displayName: 'GraphQL',
  description: 'Makes GraphQL requests to an API endpoint. You can execute GraphQL queries or mutations by providing the request payload and variables. Essentially a specialized HTTP request node for GraphQL APIs.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Query',
      description: 'The operation to perform',
      options: [
        { name: 'Query', value: 'Query' },
        { name: 'Mutation', value: 'Mutation' }
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
      description: 'Processed data from GraphQL'
    }
  ],

  credentials: [
    {
      name: 'graphqlApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'GraphQL'
  },

  aliases: ['graphql'],
  
  examples: [
        {
      name: 'Query Item',
      description: 'Query an item from GraphQL',
      workflow: {
        nodes: [
          {
            name: 'GraphQL',
            type: 'n8n-nodes-base.graphql',
            parameters: {
              operation: 'Query',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default graphqlNode;