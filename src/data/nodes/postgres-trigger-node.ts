/**
 * Postgres Trigger Node - Trigger
 * 
 * Starts a workflow when a new database row is inserted or an existing row is updated in a PostgreSQL table. It can use Postgres triggers + LISTEN/NOTIFY or logical decoding to catch such events. This way, changes in your database can propagate to n8n flows, enabling near-real-time sync from the DB to other systems.
 */

import { NodeTypeInfo } from '../node-types.js';

export const postgrestriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postgres-trigger',
  displayName: 'Postgres Trigger',
  description: 'Starts a workflow when a new database row is inserted or an existing row is updated in a PostgreSQL table. It can use Postgres triggers + LISTEN/NOTIFY or logical decoding to catch such events. This way, changes in your database can propagate to n8n flows, enabling near-real-time sync from the DB to other systems.',
  category: 'Core',
  subcategory: 'Trigger',
  
  properties: [
        {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The event to listen for',
      options: [
        { name: 'Created', value: 'created' },
        { name: 'Updated', value: 'updated' },
        { name: 'Deleted', value: 'deleted' }
      ]
    }
  ],

  inputs: [
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when events occur'
    }
  ],

  credentials: [
    {
      name: 'postgres-triggerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  version: [1],
  defaults: {
    name: 'Postgres Trigger'
  },

  aliases: ['postgres', 'trigger'],
  
  examples: [
        {
      name: 'Monitor Events',
      description: 'Trigger workflow when events occur in Postgres Trigger',
      workflow: {
        nodes: [
          {
            name: 'Postgres Trigger Trigger',
            type: 'n8n-nodes-base.postgres-trigger',
            parameters: {
              event: 'created'
            }
          }
        ]
      }
    }
  ]
};

export default postgrestriggerNode;