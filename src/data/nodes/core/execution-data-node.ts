/**
 * Execution Data Node
 * 
 * Stores or retrieves metadata about the current workflow execution. For example, it can save static data between executions or fetch the execution ID, which can then be used for logging or linking workflow runs:contentReference[oaicite:7]{index=7}:contentReference[oaicite:8]{index=8}.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const executiondataNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.execution-data',
  displayName: 'Execution Data',
  description: 'Stores or retrieves metadata about the current workflow execution. For example, it can save static data between executions or fetch the execution ID, which can then be used for logging or linking workflow runs:contentReference[oaicite:7]{index=7}:contentReference[oaicite:8]{index=8}.',
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
      description: 'Processed data from Execution Data'
    }
  ],

  credentials: [
    {
      name: 'execution-dataApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Execution Data'
  },

  aliases: ['execution', 'data'],
  
  examples: [
        {
      name: 'Save Item',
      description: 'Save an item from Execution Data',
      workflow: {
        nodes: [
          {
            name: 'Execution Data',
            type: 'n8n-nodes-base.execution-data',
            parameters: {
              operation: 'save',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default executiondataNode;