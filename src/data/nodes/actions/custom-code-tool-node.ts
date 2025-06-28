/**
 * Custom Code Tool Node
 * 
 * A sub-node that allows executing custom code (JavaScript or Python) as a tool within an AI agent’s workflow. The agent can decide to run a code snippet for specialized logic and get back the output. It essentially gives the agent coding ability to extend beyond built-in tools.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const customcodetoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.custom-code-tool',
  displayName: 'Custom Code Tool',
  description: 'A sub-node that allows executing custom code (JavaScript or Python) as a tool within an AI agent’s workflow. The agent can decide to run a code snippet for specialized logic and get back the output. It essentially gives the agent coding ability to extend beyond built-in tools.',
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
      description: 'Processed data from Custom Code Tool'
    }
  ],

  credentials: [
    {
      name: 'custom-code-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Custom Code Tool'
  },

  aliases: ['custom', 'code', 'tool'],
  
  examples: [
        {
      name: 'Decide Item',
      description: 'Decide an item from Custom Code Tool',
      workflow: {
        nodes: [
          {
            name: 'Custom Code Tool',
            type: 'n8n-nodes-base.custom-code-tool',
            parameters: {
              operation: 'decide',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default customcodetoolNode;