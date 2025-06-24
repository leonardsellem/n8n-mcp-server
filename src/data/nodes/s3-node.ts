/**
 * S3 Node
 * 
 * Alias of AWS S3 node:contentReference[oaicite:37]{index=37} – manages files in an Amazon S3 bucket. You can upload files, download files, list bucket contents, and delete objects. (Same operations as described in AWS S3 node above; often provided as a shorthand for S3-specific usage.)
 */

import { NodeTypeInfo } from '../node-types.js';

export const s3Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.s3',
  displayName: 'S3',
  description: 'Alias of AWS S3 node:contentReference[oaicite:37]{index=37} – manages files in an Amazon S3 bucket. You can upload files, download files, list bucket contents, and delete objects. (Same operations as described in AWS S3 node above; often provided as a shorthand for S3-specific usage.)',
  category: 'Utility',
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
        { name: 'List Objects', value: 'List Objects' },
        { name: 'Delete Object', value: 'Delete Object' }
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
      description: 'Processed data from S3'
    }
  ],

  credentials: [
    {
      name: 's3Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'S3'
  },

  aliases: [],
  
  examples: [
        {
      name: 'Upload File Item',
      description: 'Upload File an item from S3',
      workflow: {
        nodes: [
          {
            name: 'S3',
            type: 'n8n-nodes-base.s3',
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

export default s3Node;