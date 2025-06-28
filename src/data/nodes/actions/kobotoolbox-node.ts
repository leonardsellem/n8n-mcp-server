/**
 * KoboToolbox Node
 * 
 * Works with KoboToolbox (data collection tool). You can list forms/surveys and retrieve submitted data from a survey. Useful for automatically pulling survey results into workflows for analysis or reporting.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const kobotoolboxNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.kobotoolbox',
  displayName: 'KoboToolbox',
  description: 'Works with KoboToolbox (data collection tool). You can list forms/surveys and retrieve submitted data from a survey. Useful for automatically pulling survey results into workflows for analysis or reporting.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Surveys',
      description: 'The operation to perform',
      options: [
        { name: 'List Surveys', value: 'List Surveys' },
        { name: 'Get Survey Data', value: 'Get Survey Data' }
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
      description: 'Processed data from KoboToolbox'
    }
  ],

  credentials: [
    {
      name: 'kobotoolboxApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'KoboToolbox'
  },

  aliases: ['kobotoolbox'],
  
  examples: [
        {
      name: 'List Surveys Item',
      description: 'List Surveys an item from KoboToolbox',
      workflow: {
        nodes: [
          {
            name: 'KoboToolbox',
            type: 'n8n-nodes-base.kobotoolbox',
            parameters: {
              operation: 'List Surveys',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default kobotoolboxNode;