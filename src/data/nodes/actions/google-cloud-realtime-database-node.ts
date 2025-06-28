/**
 * Google Cloud Realtime Database Node
 * 
 * Works with Firebase Realtime Database (JSON DB). You can write data to a specified path (set or push for new child nodes), and read data from a path. This allows integration with mobile/web app data in real-time via Firebase’s live database.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlecloudrealtimedatabaseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-cloud-realtime-database',
  displayName: 'Google Cloud Realtime Database',
  description: 'Works with Firebase Realtime Database (JSON DB). You can write data to a specified path (set or push for new child nodes), and read data from a path. This allows integration with mobile/web app data in real-time via Firebase’s live database.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Set Data',
      description: 'The operation to perform',
      options: [
        { name: 'Set Data', value: 'Set Data' },
        { name: 'Get Data', value: 'Get Data' },
        { name: 'Push Data', value: 'Push Data' }
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
      description: 'Processed data from Google Cloud Realtime Database'
    }
  ],

  credentials: [
    {
      name: 'google-cloud-realtime-databaseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Cloud Realtime Database'
  },

  aliases: ['google', 'cloud', 'realtime', 'database'],
  
  examples: [
        {
      name: 'Set Data Item',
      description: 'Set Data an item from Google Cloud Realtime Database',
      workflow: {
        nodes: [
          {
            name: 'Google Cloud Realtime Database',
            type: 'n8n-nodes-base.google-cloud-realtime-database',
            parameters: {
              operation: 'Set Data',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlecloudrealtimedatabaseNode;