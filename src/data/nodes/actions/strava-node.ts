/**
 * Strava Node
 * 
 * Connects to Strava (fitness tracking platform). You can retrieve a list of athletic activities (runs, rides, etc.) for the authenticated user, get details of a specific activity (route, distance, time), and even create an activity (for manual activity logging). Good for fitness or IoT workflows involving exercise data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const stravaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.strava',
  displayName: 'Strava',
  description: 'Connects to Strava (fitness tracking platform). You can retrieve a list of athletic activities (runs, rides, etc.) for the authenticated user, get details of a specific activity (route, distance, time), and even create an activity (for manual activity logging). Good for fitness or IoT workflows involving exercise data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Activities',
      description: 'The operation to perform',
      options: [
        { name: 'List Activities', value: 'List Activities' },
        { name: 'Get Activity', value: 'Get Activity' },
        { name: 'Create Activity', value: 'Create Activity' }
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
      description: 'Processed data from Strava'
    }
  ],

  credentials: [
    {
      name: 'stravaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Strava'
  },

  aliases: ['strava'],
  
  examples: [
        {
      name: 'List Activities Item',
      description: 'List Activities an item from Strava',
      workflow: {
        nodes: [
          {
            name: 'Strava',
            type: 'n8n-nodes-base.strava',
            parameters: {
              operation: 'List Activities',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default stravaNode;