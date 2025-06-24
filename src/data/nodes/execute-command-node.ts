/**
 * Execute Command Node
 * 
 * Executes a shell/command-line command on the host running n8n:contentReference[oaicite:5]{index=5}. Use with caution, it can run any system command or script (useful for integrations that require calling local executables).
 */

import { NodeTypeInfo } from '../node-types.js';

export const executecommandNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.execute-command',
  displayName: 'Execute Command',
  description: 'Executes a shell/command-line command on the host running n8n:contentReference[oaicite:5]{index=5}. Use with caution, it can run any system command or script (useful for integrations that require calling local executables).',
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
      description: 'Processed data from Execute Command'
    }
  ],

  credentials: [
    {
      name: 'execute-commandApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Execute Command'
  },

  aliases: ['execute', 'command'],
  
  examples: [
        {
      name: 'Run Item',
      description: 'Run an item from Execute Command',
      workflow: {
        nodes: [
          {
            name: 'Execute Command',
            type: 'n8n-nodes-base.execute-command',
            parameters: {
              operation: 'run',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default executecommandNode;