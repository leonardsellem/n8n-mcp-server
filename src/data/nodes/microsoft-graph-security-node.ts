/**
 * Microsoft Graph Security Node
 * 
 * Uses Microsoft Graph Security API to manage security alerts across Microsoft 365. You can retrieve a list of security alerts (from various sources like Defender, Azure, etc.) and update an alert’s status/properties. Useful for security orchestration, automating incident tracking in Microsoft’s ecosystem.
 */

import { NodeTypeInfo } from '../node-types.js';

export const microsoftgraphsecurityNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft-graph-security',
  displayName: 'Microsoft Graph Security',
  description: 'Uses Microsoft Graph Security API to manage security alerts across Microsoft 365. You can retrieve a list of security alerts (from various sources like Defender, Azure, etc.) and update an alert’s status/properties. Useful for security orchestration, automating incident tracking in Microsoft’s ecosystem.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Alerts',
      description: 'The operation to perform',
      options: [
        { name: 'List Alerts', value: 'List Alerts' },
        { name: 'Update Alert', value: 'Update Alert' }
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
      description: 'Processed data from Microsoft Graph Security'
    }
  ],

  credentials: [
    {
      name: 'microsoft-graph-securityApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Microsoft Graph Security'
  },

  aliases: ['microsoft', 'graph', 'security'],
  
  examples: [
        {
      name: 'List Alerts Item',
      description: 'List Alerts an item from Microsoft Graph Security',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoft-graph-security',
            parameters: {
              operation: 'List Alerts',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftgraphsecurityNode;