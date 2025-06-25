/**
 * Snowflake Node
 * 
 * Runs SQL queries on a Snowflake data warehouse. You can execute any valid SQL statement (usually used for SELECT queries to retrieve data, but can also modify data). Enables integration of Snowflake’s analytics data into workflows or automation of data tasks in Snowflake.
 */

import { NodeTypeInfo } from '../node-types.js';

export const snowflakeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.snowflake',
  displayName: 'Snowflake',
  description: 'Runs SQL queries on a Snowflake data warehouse. You can execute any valid SQL statement (usually used for SELECT queries to retrieve data, but can also modify data). Enables integration of Snowflake’s analytics data into workflows or automation of data tasks in Snowflake.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from Snowflake'
    }
  ],

  credentials: [
    {
      name: 'snowflakeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Snowflake'
  },

  aliases: ['snowflake'],
  
  examples: [
        {
      name: 'Execute Query Item',
      description: 'Execute Query an item from Snowflake',
      workflow: {
        nodes: [
          {
            name: 'Snowflake',
            type: 'n8n-nodes-base.snowflake',
            parameters: {
              operation: 'Execute Query',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default snowflakeNode;