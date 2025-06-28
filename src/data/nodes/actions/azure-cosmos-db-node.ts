/**
 * Azure Cosmos DB Node
 * 
 * Connects to Azure Cosmos DB (NoSQL database). Allows querying documents with SQL-like syntax, creating or replacing a document in a collection, retrieving a document by ID, or deleting a document. Facilitates interacting with Azure’s globally distributed database.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const azurecosmosdbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.azure-cosmos-db',
  displayName: 'Azure Cosmos DB',
  description: 'Connects to Azure Cosmos DB (NoSQL database). Allows querying documents with SQL-like syntax, creating or replacing a document in a collection, retrieving a document by ID, or deleting a document. Facilitates interacting with Azure’s globally distributed database.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Query Documents',
      description: 'The operation to perform',
      options: [
        { name: 'Query Documents', value: 'Query Documents' },
        { name: 'Create/Replace Document', value: 'Create/Replace Document' },
        { name: 'Get Document', value: 'Get Document' },
        { name: 'Delete Document', value: 'Delete Document' }
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
      description: 'Processed data from Azure Cosmos DB'
    }
  ],

  credentials: [
    {
      name: 'azure-cosmos-dbApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Azure Cosmos DB'
  },

  aliases: ['azure', 'cosmos'],
  
  examples: [
        {
      name: 'Query Documents Item',
      description: 'Query Documents an item from Azure Cosmos DB',
      workflow: {
        nodes: [
          {
            name: 'Azure Cosmos DB',
            type: 'n8n-nodes-base.azure-cosmos-db',
            parameters: {
              operation: 'Query Documents',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default azurecosmosdbNode;