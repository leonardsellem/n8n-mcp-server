/**
 * Read/Write Files from Disk Node
 * 
 * Reads from or writes data to the local filesystem. **Read** operation outputs file content as binary (for downstream use), and **Write** operation saves binary or text data from the workflow to a file on disk (requires proper file system access).
 */

import { NodeTypeInfo } from '../node-types.js';

export const readwritefilesfromdiskNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.readwrite-files-from-disk',
  displayName: 'Read/Write Files from Disk',
  description: 'Reads from or writes data to the local filesystem. **Read** operation outputs file content as binary (for downstream use), and **Write** operation saves binary or text data from the workflow to a file on disk (requires proper file system access).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Read File',
      description: 'The operation to perform',
      options: [
        { name: 'Read File', value: 'Read File' },
        { name: 'Write File', value: 'Write File' }
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
      description: 'Processed data from Read/Write Files from Disk'
    }
  ],

  credentials: [
    {
      name: 'readwrite-files-from-diskApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Read/Write Files from Disk'
  },

  aliases: ['read/write', 'files', 'from', 'disk'],
  
  examples: [
        {
      name: 'Read File Item',
      description: 'Read File an item from Read/Write Files from Disk',
      workflow: {
        nodes: [
          {
            name: 'Read/Write Files from Disk',
            type: 'n8n-nodes-base.readwrite-files-from-disk',
            parameters: {
              operation: 'Read File',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default readwritefilesfromdiskNode;