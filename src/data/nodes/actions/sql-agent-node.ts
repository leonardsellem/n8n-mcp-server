/**
 * SQL Agent Node
 * 
 * An AI Agent specialized for SQL databases. It takes natural language queries and can plan and execute SQL queries on connected database Tools. The agent parses a user’s question about data and generates SQL queries to retrieve the answer, using reasoning about table schemas via Tools provided.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sqlagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sql-agent',
  displayName: 'SQL Agent',
  description: 'An AI Agent specialized for SQL databases. It takes natural language queries and can plan and execute SQL queries on connected database Tools. The agent parses a user’s question about data and generates SQL queries to retrieve the answer, using reasoning about table schemas via Tools provided.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from SQL Agent'
    }
  ],

  credentials: [
    {
      name: 'sql-agentApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SQL Agent'
  },

  aliases: ['sql', 'agent'],
  
  examples: [
        {
      name: 'Plan Item',
      description: 'Plan an item from SQL Agent',
      workflow: {
        nodes: [
          {
            name: 'SQL Agent',
            type: 'n8n-nodes-base.sql-agent',
            parameters: {
              operation: 'plan',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sqlagentNode;