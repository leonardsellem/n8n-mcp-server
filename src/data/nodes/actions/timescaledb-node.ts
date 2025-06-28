/**
 * TimescaleDB Node
 * 
 * Runs SQL queries on a TimescaleDB (Postgres-based time-series database). You can execute queries to insert or select time-series data. This allows integration of time-series data processing (like IoT or metrics data) within n8n flows using TimescaleDB.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const timescaledbNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.timescaledb',
  displayName: 'TimescaleDB',
  description: 'Runs SQL queries on a TimescaleDB (Postgres-based time-series database). You can execute queries to insert or select time-series data. This allows integration of time-series data processing (like IoT or metrics data) within n8n flows using TimescaleDB.',
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
      description: 'Processed data from TimescaleDB'
    }
  ],

  credentials: [
    {
      name: 'timescaledbApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'TimescaleDB'
  },

  aliases: ['timescaledb'],
  
  examples: [
        {
      name: 'Execute Query Item',
      description: 'Execute Query an item from TimescaleDB',
      workflow: {
        nodes: [
          {
            name: 'TimescaleDB',
            type: 'n8n-nodes-base.timescaledb',
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

export default timescaledbNode;