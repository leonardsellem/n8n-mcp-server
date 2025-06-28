/**
 * Beeminder Node
 * 
 * Integrates with Beeminder (goal-tracking platform). You can add a datapoint to a goal (for progress tracking), retrieve goal details, or list all your goals. This allows automation around self-tracking goals and data logging.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const beeminderNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.beeminder',
  displayName: 'Beeminder',
  description: 'Integrates with Beeminder (goal-tracking platform). You can add a datapoint to a goal (for progress tracking), retrieve goal details, or list all your goals. This allows automation around self-tracking goals and data logging.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Datapoint',
      description: 'The operation to perform',
      options: [
        { name: 'Create Datapoint', value: 'Create Datapoint' },
        { name: 'Get Goal', value: 'Get Goal' },
        { name: 'List Goals', value: 'List Goals' }
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
      description: 'Processed data from Beeminder'
    }
  ],

  credentials: [
    {
      name: 'beeminderApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Beeminder'
  },

  aliases: ['beeminder'],
  
  examples: [
        {
      name: 'Create Datapoint Item',
      description: 'Create Datapoint an item from Beeminder',
      workflow: {
        nodes: [
          {
            name: 'Beeminder',
            type: 'n8n-nodes-base.beeminder',
            parameters: {
              operation: 'Create Datapoint',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default beeminderNode;