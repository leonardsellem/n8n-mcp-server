/**
 * Rundeck Node
 * 
 * Connects to Rundeck (automation/runbook platform). Allows triggering a job execution on a Rundeck server and retrieving the status or results of a job. Useful for orchestrating infrastructure tasks or batch jobs from n8n by delegating to Rundeck.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const rundeckNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.rundeck',
  displayName: 'Rundeck',
  description: 'Connects to Rundeck (automation/runbook platform). Allows triggering a job execution on a Rundeck server and retrieving the status or results of a job. Useful for orchestrating infrastructure tasks or batch jobs from n8n by delegating to Rundeck.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Run Job',
      description: 'The operation to perform',
      options: [
        { name: 'Run Job', value: 'Run Job' },
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
      description: 'Processed data from Rundeck'
    }
  ],

  credentials: [
    {
      name: 'rundeckApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Rundeck'
  },

  aliases: ['rundeck'],
  
  examples: [
        {
      name: 'Run Job Item',
      description: 'Run Job an item from Rundeck',
      workflow: {
        nodes: [
          {
            name: 'Rundeck',
            type: 'n8n-nodes-base.rundeck',
            parameters: {
              operation: 'Run Job',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default rundeckNode;