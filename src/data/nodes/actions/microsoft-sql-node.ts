/**
 * Microsoft SQL Node
 * 
 * Runs SQL queries against a Microsoft SQL Server database. You provide a T-SQL query (SELECT/INSERT/UPDATE/etc.), and this node executes it and returns results for SELECT. It’s used to integrate an MS SQL database with your workflows for reading or writing data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftsqlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-sql',
  displayName: 'Microsoft SQL',
  description: 'Runs SQL queries against a Microsoft SQL Server database. You provide a T-SQL query (SELECT/INSERT/UPDATE/etc.), and this node executes it and returns results for SELECT. It’s used to integrate an MS SQL database with your workflows for reading or writing data.',
  category: 'Productivity',
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
      description: 'Processed data from Microsoft SQL'
    }
  ],

  credentials: [
    {
      name: 'microsoft-sqlApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft SQL'
  },

  aliases: ['microsoft', 'sql'],
  
  examples: [
        {
      name: 'Execute Query Item',
      description: 'Execute Query an item from Microsoft SQL',
      workflow: {
        nodes: [
          {
            name: 'Microsoft SQL',
            type: 'n8n-nodes-base.microsoft-sql',
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

export default microsoftsqlNode;