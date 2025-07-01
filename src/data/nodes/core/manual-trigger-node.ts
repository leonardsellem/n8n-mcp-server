/**
 * # Manual Trigger
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * The Manual Trigger node starts the workflow execution manually when you click the "Execute Workflow" button.
 * This is the most basic trigger node and is automatically added to every new workflow.
 * 
 * ## Key Features
 * 
 * - **Manual Execution**: Start workflow manually via UI button click
 * - **Default Trigger**: Automatically added to every new workflow
 * - **Development Ready**: Perfect for testing and development workflows
 * - **Minimal Configuration**: Simple setup with optional custom output data
 * - **Universal Compatibility**: Works in all n8n environments and setups
 * - **Immediate Response**: Executes instantly when triggered
 * - **Custom Output**: Can output default data or custom JSON payload
 * - **Testing Foundation**: Essential for workflow development and debugging
 * 
 * ## Node Parameters
 * 
 * ### Add Default Output Data
 * Whether to add default output data when the trigger executes:
 * - **True** (default): Outputs a standard empty item to start the workflow
 * - **False**: Allows you to specify custom output data
 * 
 * ### Output Data
 * When "Add Default Output Data" is disabled, you can specify custom JSON data
 * that will be output when the trigger executes. This is useful for testing
 * workflows with specific data structures.
 * 
 * ## Execution Behavior
 * 
 * - **Immediate Execution**: Runs instantly when you click "Execute Workflow"
 * - **Single Output**: Produces one data item to start the workflow
 * - **No External Dependencies**: Doesn't require any external connections or services
 * - **Always Available**: Can be triggered at any time through the n8n interface
 * - **Development Mode**: Ideal for testing and iterating on workflow logic
 * 
 * ## Use Cases
 * 
 * - Testing workflows during development and debugging
 * - One-time data processing tasks and migrations
 * - Manual data transformations and analysis
 * - Ad-hoc workflow execution for specific scenarios
 * - Prototype and proof-of-concept workflow development
 * - Training and learning n8n workflow concepts
 * - Debugging complex workflows step by step
 * - Data validation and quality assurance processes
 * - Manual backups and maintenance tasks
 * - Quick data format conversions and exports
 * 
 * ## Integration Notes
 * 
 * The Manual Trigger is the foundation of most n8n workflows and serves as the
 * starting point for manual execution. It's automatically included in new workflows
 * and provides the simplest way to test and execute workflow logic.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const manualTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.manualTrigger',
  displayName: 'Manual Trigger',
  description: 'Starts workflow execution manually via UI button click. Default trigger for new workflows and essential for testing.',
  category: 'Core Nodes',
  subcategory: 'Triggers',
  
  properties: [
    {
      name: 'shouldAddDefaultOutputData',
      displayName: 'Add Default Output Data',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to add default output data when the trigger executes'
    },
    {
      name: 'outputData',
      displayName: 'Output Data',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Custom data to output when the trigger executes',
      displayOptions: {
        show: {
          shouldAddDefaultOutputData: [false]
        }
      }
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Output'
    }
  ],

  credentials: [],

  version: [1, 2],
  defaults: {
    name: 'Manual Trigger'
  },

  aliases: ['start', 'begin', 'manual'],
  
  examples: [
    {
      name: 'Basic Manual Trigger',
      description: 'Simple manual trigger with default settings',
      workflow: {
        nodes: [
          {
            name: 'Manual Trigger',
            type: 'n8n-nodes-base.manualTrigger',
            parameters: {}
          }
        ]
      }
    },
    {
      name: 'Manual Trigger with Custom Data',
      description: 'Manual trigger that outputs custom data',
      workflow: {
        nodes: [
          {
            name: 'Manual Trigger',
            type: 'n8n-nodes-base.manualTrigger',
            parameters: {
              shouldAddDefaultOutputData: false,
              outputData: {
                message: 'Hello World',
                timestamp: '{{ $now }}',
                environment: 'production'
              }
            }
          }
        ]
      }
    }
  ]
};

export default manualTriggerNode;
