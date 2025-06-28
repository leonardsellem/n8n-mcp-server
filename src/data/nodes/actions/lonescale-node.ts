/**
 * LoneScale Node
 * 
 * Works with LoneScale (which appears to be a monitoring/metric service). Allows sending a metric or event (triggering data into LoneScale) and retrieving metrics. Useful for custom monitoring or health-check workflows that feed data to LoneScale.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const lonescaleNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.lonescale',
  displayName: 'LoneScale',
  description: 'Works with LoneScale (which appears to be a monitoring/metric service). Allows sending a metric or event (triggering data into LoneScale) and retrieving metrics. Useful for custom monitoring or health-check workflows that feed data to LoneScale.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Metric',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Metric', value: 'Trigger Metric' },
        { name: 'Get Metrics', value: 'Get Metrics' }
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
      description: 'Processed data from LoneScale'
    }
  ],

  credentials: [
    {
      name: 'lonescaleApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'LoneScale'
  },

  aliases: ['lonescale'],
  
  examples: [
        {
      name: 'Trigger Metric Item',
      description: 'Trigger Metric an item from LoneScale',
      workflow: {
        nodes: [
          {
            name: 'LoneScale',
            type: 'n8n-nodes-base.lonescale',
            parameters: {
              operation: 'Trigger Metric',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default lonescaleNode;