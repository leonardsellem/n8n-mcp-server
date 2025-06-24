/**
 * Think Tool Node
 * 
 * A pseudo-tool that the agent uses to explicitly output a 'thought' without taking an external action. Possibly logs or conveys the agent’s internal reasoning (for debugging or chain-of-thought display) but doesn’t advance the state. It might literally do nothing except allow the agent to reflect or 'think' in the sequence.
 */

import { NodeTypeInfo } from '../node-types.js';

export const thinktoolNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.think-tool',
  displayName: 'Think Tool',
  description: 'A pseudo-tool that the agent uses to explicitly output a \'thought\' without taking an external action. Possibly logs or conveys the agent’s internal reasoning (for debugging or chain-of-thought display) but doesn’t advance the state. It might literally do nothing except allow the agent to reflect or \'think\' in the sequence.',
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
      description: 'Processed data from Think Tool'
    }
  ],

  credentials: [
    {
      name: 'think-toolApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Think Tool'
  },

  aliases: ['think', 'tool'],
  
  examples: [
        {
      name: 'The Item',
      description: 'The an item from Think Tool',
      workflow: {
        nodes: [
          {
            name: 'Think Tool',
            type: 'n8n-nodes-base.think-tool',
            parameters: {
              operation: 'the',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default thinktoolNode;