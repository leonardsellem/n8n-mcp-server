/**
 * Hunter Node
 * 
 * Integrates with Hunter.io (email finder). It can find email addresses for a person given a domain and name, and verify the deliverability of an email address. Useful for lead generation workflows to get contact emails and validate them.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const hunterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hunter',
  displayName: 'Hunter',
  description: 'Integrates with Hunter.io (email finder). It can find email addresses for a person given a domain and name, and verify the deliverability of an email address. Useful for lead generation workflows to get contact emails and validate them.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Find Email',
      description: 'The operation to perform',
      options: [
        { name: 'Find Email', value: 'Find Email' },
        { name: 'Email Verification', value: 'Email Verification' }
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
      description: 'Processed data from Hunter'
    }
  ],

  credentials: [
    {
      name: 'hunterApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Hunter'
  },

  aliases: ['hunter'],
  
  examples: [
        {
      name: 'Find Email Item',
      description: 'Find Email an item from Hunter',
      workflow: {
        nodes: [
          {
            name: 'Hunter',
            type: 'n8n-nodes-base.hunter',
            parameters: {
              operation: 'Find Email',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default hunterNode;