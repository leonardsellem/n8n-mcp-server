/**
 * CrateDB Node
 * 
 * Runs SQL queries against a CrateDB database (a distributed SQL DBMS). You can execute SELECT/INSERT/UPDATE statements and get the results. Useful for reading or writing data in a CrateDB as part of a workflow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const cratedbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cratedb',
  displayName: 'CrateDB',
  description: 'Runs SQL queries against a CrateDB database (a distributed SQL DBMS). You can execute SELECT/INSERT/UPDATE statements and get the results. Useful for reading or writing data in a CrateDB as part of a workflow.',
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
      description: 'Processed data from CrateDB'
    }
  ],

  credentials: [
    {
      name: 'cratedbApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'CrateDB'
  },

  aliases: ['cratedb'],
  
  examples: [
        {
      name: 'Execute SQL Item',
      description: 'Execute SQL an item from CrateDB',
      workflow: {
        nodes: [
          {
            name: 'CrateDB',
            type: 'n8n-nodes-base.cratedb',
            parameters: {
              operation: 'Execute SQL',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default cratedbNode;