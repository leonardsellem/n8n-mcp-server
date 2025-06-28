/**
 * Splunk Node
 * 
 * Integrates with Splunk (log analysis platform). Allows executing a search query on Splunk to retrieve log/event data and submitting a new event into Splunk’s index. Useful for pulling log data for analysis in a workflow, or logging an event from n8n into Splunk for monitoring.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const splunkNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.splunk',
  displayName: 'Splunk',
  description: 'Integrates with Splunk (log analysis platform). Allows executing a search query on Splunk to retrieve log/event data and submitting a new event into Splunk’s index. Useful for pulling log data for analysis in a workflow, or logging an event from n8n into Splunk for monitoring.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Logs',
      description: 'The operation to perform',
      options: [
        { name: 'Search Logs', value: 'Search Logs' },
        { name: 'Submit Event', value: 'Submit Event' }
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
      description: 'Processed data from Splunk'
    }
  ],

  credentials: [
    {
      name: 'splunkApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Splunk'
  },

  aliases: ['splunk'],
  
  examples: [
        {
      name: 'Search Logs Item',
      description: 'Search Logs an item from Splunk',
      workflow: {
        nodes: [
          {
            name: 'Splunk',
            type: 'n8n-nodes-base.splunk',
            parameters: {
              operation: 'Search Logs',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default splunkNode;