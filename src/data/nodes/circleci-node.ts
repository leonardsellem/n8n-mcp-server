/**
 * CircleCI Node
 * 
 * Connects to CircleCI (continuous integration service). You can trigger a new pipeline (build) for a project, check the status of a pipeline, or list your CircleCI projects. This allows CI/CD automation, such as kicking off builds from n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const circleciNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.circleci',
  displayName: 'CircleCI',
  description: 'Connects to CircleCI (continuous integration service). You can trigger a new pipeline (build) for a project, check the status of a pipeline, or list your CircleCI projects. This allows CI/CD automation, such as kicking off builds from n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Pipeline',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Pipeline', value: 'Trigger Pipeline' },
        { name: 'Get Pipeline Status', value: 'Get Pipeline Status' },
        { name: 'List Projects', value: 'List Projects' }
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
      description: 'Processed data from CircleCI'
    }
  ],

  credentials: [
    {
      name: 'circleciApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'CircleCI'
  },

  aliases: ['circleci'],
  
  examples: [
        {
      name: 'Trigger Pipeline Item',
      description: 'Trigger Pipeline an item from CircleCI',
      workflow: {
        nodes: [
          {
            name: 'CircleCI',
            type: 'n8n-nodes-base.circleci',
            parameters: {
              operation: 'Trigger Pipeline',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default circleciNode;