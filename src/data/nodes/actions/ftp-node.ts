/**
 * FTP Node
 * 
 * Connects to an FTP server to perform file operations. Supports uploading files, downloading files, listing directory contents, and deleting files on the FTP server (requires FTP credentials).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const ftpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ftp',
  displayName: 'FTP',
  description: 'Connects to an FTP server to perform file operations. Supports uploading files, downloading files, listing directory contents, and deleting files on the FTP server (requires FTP credentials).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Download',
      description: 'The operation to perform',
      options: [
        { name: 'Download', value: 'Download' },
        { name: 'Upload', value: 'Upload' },
        { name: 'List', value: 'List' },
        { name: 'Delete', value: 'Delete' }
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
      description: 'Processed data from FTP'
    }
  ],

  credentials: [
    {
      name: 'ftpApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'FTP'
  },

  aliases: ['ftp'],
  
  examples: [
        {
      name: 'Download Item',
      description: 'Download an item from FTP',
      workflow: {
        nodes: [
          {
            name: 'FTP',
            type: 'n8n-nodes-base.ftp',
            parameters: {
              operation: 'Download',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default ftpNode;