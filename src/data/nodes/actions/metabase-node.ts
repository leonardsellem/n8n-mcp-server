/**
 * Metabase Node
 * 
 * Integrates with Metabase (open-source BI/dashboard). You can trigger a Metabase Pulse (scheduled report) to run on demand, and fetch data from a Metabase card (saved question). Useful for pulling analytics or sending reports as part of a workflow.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const metabaseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.metabase',
  displayName: 'Metabase',
  description: 'Integrates with Metabase (open-source BI/dashboard). You can trigger a Metabase Pulse (scheduled report) to run on demand, and fetch data from a Metabase card (saved question). Useful for pulling analytics or sending reports as part of a workflow.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Pulse',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Pulse', value: 'Trigger Pulse' },
        { name: 'Get Card Data', value: 'Get Card Data' }
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
      description: 'Processed data from Metabase'
    }
  ],

  credentials: [
    {
      name: 'metabaseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Metabase'
  },

  aliases: ['metabase'],
  
  examples: [
        {
      name: 'Trigger Pulse Item',
      description: 'Trigger Pulse an item from Metabase',
      workflow: {
        nodes: [
          {
            name: 'Metabase',
            type: 'n8n-nodes-base.metabase',
            parameters: {
              operation: 'Trigger Pulse',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default metabaseNode;