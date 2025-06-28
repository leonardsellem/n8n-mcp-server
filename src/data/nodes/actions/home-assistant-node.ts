/**
 * Home Assistant Node
 * 
 * Connects to Home Assistant (home automation). You can call any Home Assistant service (e.g., turn on a light, set thermostat), get the state of an entity (like a sensor or switch), and set the state of certain entities. Enables integration of home automation events with n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const homeassistantNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.home-assistant',
  displayName: 'Home Assistant',
  description: 'Connects to Home Assistant (home automation). You can call any Home Assistant service (e.g., turn on a light, set thermostat), get the state of an entity (like a sensor or switch), and set the state of certain entities. Enables integration of home automation events with n8n workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Call Service',
      description: 'The operation to perform',
      options: [
        { name: 'Call Service', value: 'Call Service' },
        { name: 'Get State', value: 'Get State' },
        { name: 'Set State', value: 'Set State' }
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
      description: 'Processed data from Home Assistant'
    }
  ],

  credentials: [
    {
      name: 'home-assistantApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Home Assistant'
  },

  aliases: ['home', 'assistant'],
  
  examples: [
        {
      name: 'Call Service Item',
      description: 'Call Service an item from Home Assistant',
      workflow: {
        nodes: [
          {
            name: 'Home Assistant',
            type: 'n8n-nodes-base.home-assistant',
            parameters: {
              operation: 'Call Service',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default homeassistantNode;