/**
 * ServiceNow Node
 * 
 * Works with ServiceNow (IT service management). Allows creating new records (incidents, problems, change requests, etc.), retrieving a record, updating, and querying records from any ServiceNow table. Critical for ITSM automation, such as creating incidents from alerts or syncing data with ServiceNow.
 */

import { NodeTypeInfo } from '../node-types.js';

export const servicenowNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.servicenow',
  displayName: 'ServiceNow',
  description: 'Works with ServiceNow (IT service management). Allows creating new records (incidents, problems, change requests, etc.), retrieving a record, updating, and querying records from any ServiceNow table. Critical for ITSM automation, such as creating incidents from alerts or syncing data with ServiceNow.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Record',
      description: 'The operation to perform',
      options: [
        { name: 'Create Record', value: 'Create Record' },
        { name: 'Get Record', value: 'Get Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'Query Table', value: 'Query Table' }
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
      description: 'Processed data from ServiceNow'
    }
  ],

  credentials: [
    {
      name: 'servicenowApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'ServiceNow'
  },

  aliases: ['servicenow'],
  
  examples: [
        {
      name: 'Create Record Item',
      description: 'Create Record an item from ServiceNow',
      workflow: {
        nodes: [
          {
            name: 'ServiceNow',
            type: 'n8n-nodes-base.servicenow',
            parameters: {
              operation: 'Create Record',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default servicenowNode;