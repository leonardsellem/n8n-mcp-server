/**
 * AWS S3 Node
 * 
 * Integrates with Amazon S3 (Simple Storage Service). You can upload files (objects) to an S3 bucket, download (get) files, list files in a bucket, or delete files:contentReference[oaicite:19]{index=19}. This allows your workflow to manage files in cloud storage.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awss3Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-s3',
  displayName: 'AWS S3',
  description: 'Integrates with Amazon S3 (Simple Storage Service). You can upload files (objects) to an S3 bucket, download (get) files, list files in a bucket, or delete files:contentReference[oaicite:19]{index=19}. This allows your workflow to manage files in cloud storage.',
  category: 'Cloud',
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
        { name: 'Get File', value: 'Get File' },
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
      description: 'Processed data from AWS S3'
    }
  ],

  credentials: [
    {
      name: 'aws-s3Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS S3'
  },

  aliases: ['aws'],
  
  examples: [
        {
      name: 'Upload File Item',
      description: 'Upload File an item from AWS S3',
      workflow: {
        nodes: [
          {
            name: 'AWS S3',
            type: 'n8n-nodes-base.aws-s3',
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

export default awss3Node;