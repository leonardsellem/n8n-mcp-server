/**
 * # Workflow Trigger
 * 
 * **Status**: ⚠️ Deprecated
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * The Workflow Trigger node gets triggered when a workflow is updated or activated.
 * 
 * ## Deprecation Notice
 * 
 * **⚠️ DEPRECATED**: n8n has deprecated the Workflow Trigger node and moved its functionality 
 * to the [n8n Trigger node](../n8n-nodes-base.n8ntrigger/). This node is maintained for backward compatibility only.
 * 
 * ## Key Features
 * 
 * - **Self-monitoring**: Monitors the workflow it's placed in (not a separate workflow)
 * - **Multiple Events**: Can trigger on update or activation events
 * - **State Notifications**: Useful for workflow state change notifications
 * - **Legacy Support**: Maintained for existing workflows using this node
 * - **Direct Integration**: Add directly to the workflow you want to monitor
 * 
 * ## Node Parameters
 * 
 * ### Events
 * Select which events should trigger the node (can select one or both):
 * 
 * - **Active Workflow Updated**: If you select this event, the node triggers when this workflow is updated
 * - **Workflow Activated**: If you select this event, the node triggers when this workflow is activated
 * 
 * ## Important Usage Notes
 * 
 * - **Self-contained**: Add this node to the workflow you want to monitor (not a separate workflow)
 * - **Workflow-specific**: The node triggers for the workflow that contains it
 * - **State monitoring**: Use this node to trigger a workflow to notify the state of the workflow
 * - **Event selection**: You can select one or both events to monitor
 * 
 * ## Migration Guidance
 * 
 * For new workflows, consider using the **n8n Trigger node** instead, which provides:
 * - Enhanced functionality and better integration
 * - Modern n8n features and improved performance
 * - Active development and ongoing support
 * - Extended event types and monitoring capabilities
 * 
 * ## Use Cases
 * 
 * - Notify team members when a workflow is updated
 * - Send alerts when critical workflows are activated
 * - Log workflow state changes for audit purposes
 * - Trigger cleanup or setup actions on workflow changes
 * - Monitor workflow deployment status in CI/CD pipelines
 * - Track workflow lifecycle events for analytics
 * 
 * ## Legacy Support
 * 
 * This node remains available for existing workflows that depend on it, but new implementations
 * should migrate to the n8n Trigger node for better functionality and future support.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const workflowtriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.workflowTrigger',
  displayName: 'Workflow Trigger',
  description: 'Triggers when a workflow is updated or activated. Deprecated - use n8n Trigger node instead.',
  category: 'Core Nodes',
  subcategory: 'Triggers',
  
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: [],
      description: 'Events that should trigger this node',
      options: [
        {
          name: 'Active Workflow Updated',
          value: 'update',
          description: 'Triggers when this workflow is updated'
        },
        {
          name: 'Workflow Activated',
          value: 'activate',
          description: 'Triggers when this workflow is activated'
        }
      ]
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Workflow Event',
      description: 'Triggered when selected workflow events occur'
    }
  ],

  credentials: [],

  triggerNode: true,
  
  version: [1],
  defaults: {
    name: 'Workflow Trigger'
  },

  aliases: ['workflow', 'state', 'monitor'],
  
  examples: [
    {
      name: 'Monitor Workflow Updates',
      description: 'Trigger when workflow is updated',
      workflow: {
        nodes: [
          {
            name: 'Workflow Trigger',
            type: 'n8n-nodes-base.workflowTrigger',
            parameters: {
              events: ['update']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Workflow Activation',
      description: 'Trigger when workflow is activated',
      workflow: {
        nodes: [
          {
            name: 'Workflow Trigger',
            type: 'n8n-nodes-base.workflowTrigger',
            parameters: {
              events: ['activate']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor All Workflow Events',
      description: 'Trigger on both update and activation',
      workflow: {
        nodes: [
          {
            name: 'Workflow Trigger',
            type: 'n8n-nodes-base.workflowTrigger',
            parameters: {
              events: ['update', 'activate']
            }
          }
        ]
      }
    }
  ]
};

export default workflowtriggerNode;
