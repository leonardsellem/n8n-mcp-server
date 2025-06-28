/**
 * Travis CI Node
 * 
 * Connects to Travis CI (continuous integration service). Allows triggering a new build on Travis for a specified repository/branch and retrieving the status of a build. Useful for CI/CD pipelines, particularly if you want to start a build from n8n or monitor its result to decide next steps.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const travisciNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.travis-ci',
  displayName: 'Travis CI',
  description: 'Connects to Travis CI (continuous integration service). Allows triggering a new build on Travis for a specified repository/branch and retrieving the status of a build. Useful for CI/CD pipelines, particularly if you want to start a build from n8n or monitor its result to decide next steps.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Build',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Build', value: 'Trigger Build' },
        { name: 'Get Build Status', value: 'Get Build Status' }
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
      description: 'Processed data from Travis CI'
    }
  ],

  credentials: [
    {
      name: 'travis-ciApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Travis CI'
  },

  aliases: ['travis'],
  
  examples: [
        {
      name: 'Trigger Build Item',
      description: 'Trigger Build an item from Travis CI',
      workflow: {
        nodes: [
          {
            name: 'Travis CI',
            type: 'n8n-nodes-base.travis-ci',
            parameters: {
              operation: 'Trigger Build',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default travisciNode;