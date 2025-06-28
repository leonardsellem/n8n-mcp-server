/**
 * Google Cloud Storage Node
 * 
 * Connects to Google Cloud Storage (GCS). You can upload files (blobs) to a bucket, download files from a bucket, list files in a bucket, and delete files. Similar to AWS S3 operations, enabling cloud file storage automation on GCP.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlecloudstorageNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-cloud-storage',
  displayName: 'Google Cloud Storage',
  description: 'Connects to Google Cloud Storage (GCS). You can upload files (blobs) to a bucket, download files from a bucket, list files in a bucket, and delete files. Similar to AWS S3 operations, enabling cloud file storage automation on GCP.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Upload File',
      description: 'The operation to perform',
      options: [
        { name: 'Upload File', value: 'Upload File' },
        { name: 'Download File', value: 'Download File' },
        { name: 'List Files', value: 'List Files' },
        { name: 'Delete File', value: 'Delete File' }
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
      description: 'Processed data from Google Cloud Storage'
    }
  ],

  credentials: [
    {
      name: 'google-cloud-storageApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Cloud Storage'
  },

  aliases: ['google', 'cloud', 'storage'],
  
  examples: [
        {
      name: 'Upload File Item',
      description: 'Upload File an item from Google Cloud Storage',
      workflow: {
        nodes: [
          {
            name: 'Google Cloud Storage',
            type: 'n8n-nodes-base.google-cloud-storage',
            parameters: {
              operation: 'Upload File',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlecloudstorageNode;