/**
 * SecurityScorecard Node
 * 
 * Integrates with SecurityScorecard (cybersecurity ratings). You can retrieve an organization’s security scorecard (overall score and issue breakdown) and list the factor scores (like network security, application security, etc.). Useful for risk management workflows or vendor security monitoring.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const securityscorecardNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.securityscorecard',
  displayName: 'SecurityScorecard',
  description: 'Integrates with SecurityScorecard (cybersecurity ratings). You can retrieve an organization’s security scorecard (overall score and issue breakdown) and list the factor scores (like network security, application security, etc.). Useful for risk management workflows or vendor security monitoring.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Scorecard',
      description: 'The operation to perform',
      options: [
        { name: 'Get Scorecard', value: 'Get Scorecard' },
        { name: 'List Factors', value: 'List Factors' }
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
      description: 'Processed data from SecurityScorecard'
    }
  ],

  credentials: [
    {
      name: 'securityscorecardApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SecurityScorecard'
  },

  aliases: ['securityscorecard'],
  
  examples: [
        {
      name: 'Get Scorecard Item',
      description: 'Get Scorecard an item from SecurityScorecard',
      workflow: {
        nodes: [
          {
            name: 'SecurityScorecard',
            type: 'n8n-nodes-base.securityscorecard',
            parameters: {
              operation: 'Get Scorecard',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default securityscorecardNode;