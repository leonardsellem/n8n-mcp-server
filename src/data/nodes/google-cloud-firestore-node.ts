/**
 * Google Cloud Firestore Node
 * 
 * Integrates with Google Cloud Firestore (NoSQL database). Allows reading a document by path, creating or updating a document, deleting a document, and running queries on a collection. Enables serverless app data management in workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googlecloudfirestoreNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-cloud-firestore',
  displayName: 'Google Cloud Firestore',
  description: 'Integrates with Google Cloud Firestore (NoSQL database). Allows reading a document by path, creating or updating a document, deleting a document, and running queries on a collection. Enables serverless app data management in workflows.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Document',
      description: 'The operation to perform',
      options: [
        { name: 'Get Document', value: 'Get Document' },
        { name: 'Create/Update Document', value: 'Create/Update Document' },
        { name: 'Delete Document', value: 'Delete Document' },
        { name: 'Query Documents', value: 'Query Documents' }
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
      description: 'Processed data from Google Cloud Firestore'
    }
  ],

  credentials: [
    {
      name: 'google-cloud-firestoreApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Cloud Firestore'
  },

  aliases: ['google', 'cloud', 'firestore'],
  
  examples: [
        {
      name: 'Get Document Item',
      description: 'Get Document an item from Google Cloud Firestore',
      workflow: {
        nodes: [
          {
            name: 'Google Cloud Firestore',
            type: 'n8n-nodes-base.google-cloud-firestore',
            parameters: {
              operation: 'Get Document',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlecloudfirestoreNode;