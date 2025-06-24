/**
 * Philips Hue Node
 * 
 * Integrates with Philips Hue smart lighting. You can control lights by turning them on/off, setting brightness levels, and changing colors. Great for IoT workflows – for example, flash a light when a certain event happens or adjust home lighting on a schedule.
 */

import { NodeTypeInfo } from '../node-types.js';

export const philipshueNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.philips-hue',
  displayName: 'Philips Hue',
  description: 'Integrates with Philips Hue smart lighting. You can control lights by turning them on/off, setting brightness levels, and changing colors. Great for IoT workflows – for example, flash a light when a certain event happens or adjust home lighting on a schedule.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Turn On Light',
      description: 'The operation to perform',
      options: [
        { name: 'Turn On Light', value: 'Turn On Light' },
        { name: 'Turn Off Light', value: 'Turn Off Light' },
        { name: 'Set Brightness', value: 'Set Brightness' },
        { name: 'Set Color', value: 'Set Color' }
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
      description: 'Processed data from Philips Hue'
    }
  ],

  credentials: [
    {
      name: 'philips-hueApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Philips Hue'
  },

  aliases: ['philips', 'hue'],
  
  examples: [
        {
      name: 'Turn On Light Item',
      description: 'Turn On Light an item from Philips Hue',
      workflow: {
        nodes: [
          {
            name: 'Philips Hue',
            type: 'n8n-nodes-base.philips-hue',
            parameters: {
              operation: 'Turn On Light',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default philipshueNode;