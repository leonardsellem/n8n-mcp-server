/**
 * UptimeRobot Node
 * 
 * Connects to UptimeRobot (website monitoring). Allows listing all monitors (websites being monitored), getting the current status and uptime of a specific monitor, and resetting a monitor’s stats. Useful for integrating uptime alerts or maintenance workflows with UptimeRobot data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const uptimerobotNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.uptimerobot',
  displayName: 'UptimeRobot',
  description: 'Connects to UptimeRobot (website monitoring). Allows listing all monitors (websites being monitored), getting the current status and uptime of a specific monitor, and resetting a monitor’s stats. Useful for integrating uptime alerts or maintenance workflows with UptimeRobot data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Monitors',
      description: 'The operation to perform',
      options: [
        { name: 'List Monitors', value: 'List Monitors' },
        { name: 'Get Monitor Status', value: 'Get Monitor Status' },
        { name: 'Reset Monitor', value: 'Reset Monitor' }
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
      description: 'Processed data from UptimeRobot'
    }
  ],

  credentials: [
    {
      name: 'uptimerobotApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'UptimeRobot'
  },

  aliases: ['uptimerobot'],
  
  examples: [
        {
      name: 'List Monitors Item',
      description: 'List Monitors an item from UptimeRobot',
      workflow: {
        nodes: [
          {
            name: 'UptimeRobot',
            type: 'n8n-nodes-base.uptimerobot',
            parameters: {
              operation: 'List Monitors',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default uptimerobotNode;