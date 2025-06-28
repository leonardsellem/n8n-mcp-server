/**
 * Call n8n Workflow Tool Node
 * 
 * A tool that allows an AI agent to trigger or call another n8n workflow as a sub-process. The agent could decide that a certain task is best handled by invoking a specific workflow (like a predefined routine) and then get the result back. This effectively lets an agent leverage any existing n8n workflow as a capability.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const calln8nworkflowtoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.call-n8n-workflow-tool',
  displayName: 'Call n8n Workflow Tool',
  description: 'A tool that allows an AI agent to trigger or call another n8n workflow as a sub-process. The agent could decide that a certain task is best handled by invoking a specific workflow (like a predefined routine) and then get the result back. This effectively lets an agent leverage any existing n8n workflow as a capability.',
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
      description: 'Processed data from Call n8n Workflow Tool'
    }
  ],

  credentials: [
    {
      name: 'call-n8n-workflow-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Call n8n Workflow Tool'
  },

  aliases: ['call', 'n8n', 'workflow', 'tool'],
  
  examples: [
        {
      name: 'An Item',
      description: 'An an item from Call n8n Workflow Tool',
      workflow: {
        nodes: [
          {
            name: 'Call n8n Workflow Tool',
            type: 'n8n-nodes-base.call-n8n-workflow-tool',
            parameters: {
              operation: 'an',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default calln8nworkflowtoolNode;