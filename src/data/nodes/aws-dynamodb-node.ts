/**
 * AWS DynamoDB Node
 * 
 * Connects to Amazon DynamoDB (NoSQL database). Enables reading items by key, writing new items, querying items by indexes, scanning entire tables, updating items, or deleting items. This node automates DynamoDB CRUD operations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awsdynamodbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-dynamodb',
  displayName: 'AWS DynamoDB',
  description: 'Connects to Amazon DynamoDB (NoSQL database). Enables reading items by key, writing new items, querying items by indexes, scanning entire tables, updating items, or deleting items. This node automates DynamoDB CRUD operations.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Item',
      description: 'The operation to perform',
      options: [
        { name: 'Get Item', value: 'Get Item' },
        { name: 'Put Item', value: 'Put Item' },
        { name: 'Query', value: 'Query' },
        { name: 'Scan', value: 'Scan' },
        { name: 'Update Item', value: 'Update Item' },
        { name: 'Delete Item', value: 'Delete Item' }
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
      description: 'Processed data from AWS DynamoDB'
    }
  ],

  credentials: [
    {
      name: 'aws-dynamodbApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS DynamoDB'
  },

  aliases: ['aws', 'dynamodb'],
  
  examples: [
        {
      name: 'Get Item Item',
      description: 'Get Item an item from AWS DynamoDB',
      workflow: {
        nodes: [
          {
            name: 'AWS DynamoDB',
            type: 'n8n-nodes-base.aws-dynamodb',
            parameters: {
              operation: 'Get Item',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awsdynamodbNode;