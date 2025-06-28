/**
 * Wait Node
 * 
 * Pauses the workflow for a specified duration or until a certain time. You can delay for seconds/minutes/hours or until a specific timestamp. After waiting, the workflow resumes. Useful for scheduling follow-up actions within a workflow.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const waitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wait',
  displayName: 'Wait',
  description: 'Pauses the workflow for a specified duration or until a certain time. You can delay for seconds/minutes/hours or until a specific timestamp. After waiting, the workflow resumes. Useful for scheduling follow-up actions within a workflow.',
  category: 'Utility',
  subcategory: 'Action',
  
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
      description: 'Processed data from Wait'
    }
  ],

  credentials: [
    {
      name: 'waitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Wait'
  },

  aliases: ['wait'],
  
  examples: [
        {
      name: 'Delay Item',
      description: 'Delay an item from Wait',
      workflow: {
        nodes: [
          {
            name: 'Wait',
            type: 'n8n-nodes-base.wait',
            parameters: {
              operation: 'delay',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default waitNode;