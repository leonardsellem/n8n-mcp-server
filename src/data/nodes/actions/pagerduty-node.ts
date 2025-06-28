/**
 * PagerDuty Node
 * 
 * Connects to PagerDuty (incident response). Allows triggering a new incident (sending an alert to on-call personnel), resolving an incident, and listing incidents. Ideal for DevOps or IT workflows that create or update PagerDuty alerts based on system events.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const pagerdutyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pagerduty',
  displayName: 'PagerDuty',
  description: 'Connects to PagerDuty (incident response). Allows triggering a new incident (sending an alert to on-call personnel), resolving an incident, and listing incidents. Ideal for DevOps or IT workflows that create or update PagerDuty alerts based on system events.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Trigger Incident',
      description: 'The operation to perform',
      options: [
        { name: 'Trigger Incident', value: 'Trigger Incident' },
        { name: 'Resolve Incident', value: 'Resolve Incident' },
        { name: 'List Incidents', value: 'List Incidents' }
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
      description: 'Processed data from PagerDuty'
    }
  ],

  credentials: [
    {
      name: 'pagerdutyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'PagerDuty'
  },

  aliases: ['pagerduty'],
  
  examples: [
        {
      name: 'Trigger Incident Item',
      description: 'Trigger Incident an item from PagerDuty',
      workflow: {
        nodes: [
          {
            name: 'PagerDuty',
            type: 'n8n-nodes-base.pagerduty',
            parameters: {
              operation: 'Trigger Incident',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default pagerdutyNode;