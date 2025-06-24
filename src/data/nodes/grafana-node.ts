/**
 * Grafana Node
 * 
 * Integrates with Grafana (dashboard and monitoring platform). Allows creating annotations on Grafana graphs (useful for marking events on charts programmatically) and searching for dashboards. Facilitates linking workflow events or deployments to Grafana timelines via annotations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const grafanaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.grafana',
  displayName: 'Grafana',
  description: 'Integrates with Grafana (dashboard and monitoring platform). Allows creating annotations on Grafana graphs (useful for marking events on charts programmatically) and searching for dashboards. Facilitates linking workflow events or deployments to Grafana timelines via annotations.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Annotation',
      description: 'The operation to perform',
      options: [
        { name: 'Create Annotation', value: 'Create Annotation' },
        { name: 'Search Dashboards', value: 'Search Dashboards' }
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
      description: 'Processed data from Grafana'
    }
  ],

  credentials: [
    {
      name: 'grafanaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Grafana'
  },

  aliases: ['grafana'],
  
  examples: [
        {
      name: 'Create Annotation Item',
      description: 'Create Annotation an item from Grafana',
      workflow: {
        nodes: [
          {
            name: 'Grafana',
            type: 'n8n-nodes-base.grafana',
            parameters: {
              operation: 'Create Annotation',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default grafanaNode;