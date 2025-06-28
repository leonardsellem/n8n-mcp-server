/**
 * Google BigQuery Node
 * 
 * Works with Google BigQuery (data warehouse). You can execute an SQL query on BigQuery and get the results, or insert a new row of data into a BigQuery table. Enables data pipeline automation involving BigQuery (e.g., query processing, data injection).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlebigqueryNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-bigquery',
  displayName: 'Google BigQuery',
  description: 'Works with Google BigQuery (data warehouse). You can execute an SQL query on BigQuery and get the results, or insert a new row of data into a BigQuery table. Enables data pipeline automation involving BigQuery (e.g., query processing, data injection).',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Run Query',
      description: 'The operation to perform',
      options: [
        { name: 'Run Query', value: 'Run Query' },
        { name: 'Insert Row', value: 'Insert Row' }
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
      description: 'Processed data from Google BigQuery'
    }
  ],

  credentials: [
    {
      name: 'google-bigqueryApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google BigQuery'
  },

  aliases: ['google', 'bigquery'],
  
  examples: [
        {
      name: 'Run Query Item',
      description: 'Run Query an item from Google BigQuery',
      workflow: {
        nodes: [
          {
            name: 'Google BigQuery',
            type: 'n8n-nodes-base.google-bigquery',
            parameters: {
              operation: 'Run Query',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlebigqueryNode;