/**
 * Azure Storage Node
 * 
 * Works with Microsoft Azure Blob Storage. Supports uploading files (blobs) to a container, downloading blobs, listing blobs in a container, and deleting blobs. Enables file storage/retrieval in Azure within workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const azurestorageNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.azure-storage',
  displayName: 'Azure Storage',
  description: 'Works with Microsoft Azure Blob Storage. Supports uploading files (blobs) to a container, downloading blobs, listing blobs in a container, and deleting blobs. Enables file storage/retrieval in Azure within workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Upload Blob',
      description: 'The operation to perform',
      options: [
        { name: 'Upload Blob', value: 'Upload Blob' },
        { name: 'Download Blob', value: 'Download Blob' },
        { name: 'List Blobs', value: 'List Blobs' },
        { name: 'Delete Blob', value: 'Delete Blob' }
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
      description: 'Processed data from Azure Storage'
    }
  ],

  credentials: [
    {
      name: 'azure-storageApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Azure Storage'
  },

  aliases: ['azure', 'storage'],
  
  examples: [
        {
      name: 'Upload Blob Item',
      description: 'Upload Blob an item from Azure Storage',
      workflow: {
        nodes: [
          {
            name: 'Azure Storage',
            type: 'n8n-nodes-base.azure-storage',
            parameters: {
              operation: 'Upload Blob',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default azurestorageNode;