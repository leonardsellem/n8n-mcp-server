/**
 * Date & Time Node
 * 
 * Manipulates dates and times. Can format dates, add or subtract time intervals, or output the current date/time. Useful for timestamping or scheduling logic.
 */

import { NodeTypeInfo } from '../node-types.js';

export const datetimeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.date-time',
  displayName: 'Date & Time',
  description: 'Manipulates dates and times. Can format dates, add or subtract time intervals, or output the current date/time. Useful for timestamping or scheduling logic.',
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
      description: 'Processed data from Date & Time'
    }
  ],

  credentials: [
    {
      name: 'date-timeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Date & Time'
  },

  aliases: ['date', 'time'],
  
  examples: [
        {
      name: 'Format Item',
      description: 'Format an item from Date & Time',
      workflow: {
        nodes: [
          {
            name: 'Date & Time',
            type: 'n8n-nodes-base.date-time',
            parameters: {
              operation: 'format',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default datetimeNode;