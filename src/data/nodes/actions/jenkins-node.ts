/**
 * Jenkins Node
 * 
 * Connects to Jenkins (CI/CD server). Allows triggering a Jenkins job (with parameters if needed) and retrieving the status or result of a job execution. Useful for integrating continuous integration pipelines, e.g., starting builds from n8n.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const jenkinsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jenkins',
  displayName: 'Jenkins',
  description: 'Connects to Jenkins (CI/CD server). Allows triggering a Jenkins job (with parameters if needed) and retrieving the status or result of a job execution. Useful for integrating continuous integration pipelines, e.g., starting builds from n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Job',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Job', value: 'Trigger Job' },
        { name: 'Get Job Status', value: 'Get Job Status' }
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
      description: 'Processed data from Jenkins'
    }
  ],

  credentials: [
    {
      name: 'jenkinsApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Jenkins'
  },

  aliases: ['jenkins'],
  
  examples: [
        {
      name: 'Trigger Job Item',
      description: 'Trigger Job an item from Jenkins',
      workflow: {
        nodes: [
          {
            name: 'Jenkins',
            type: 'n8n-nodes-base.jenkins',
            parameters: {
              operation: 'Trigger Job',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default jenkinsNode;