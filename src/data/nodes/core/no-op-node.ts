/**
 * # No Operation, do nothing
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Utility
 * 
 * ## Description
 * 
 * Use the No Operation, do nothing node when you don't want to perform any operations. 
 * The purpose of this node is to make the workflow easier to read and understand where 
 * the flow of data stops. This can help others visually get a better understanding of the workflow.
 * 
 * ## Key Features
 * 
 * - **Visual Clarity**: Makes workflows easier to read and understand
 * - **Data Flow Control**: Shows where the flow of data stops
 * - **Pass-through Operation**: Data flows through completely unchanged
 * - **Zero Configuration**: No parameters or setup required
 * - **Debugging Tool**: Perfect for testing workflow segments
 * - **Development Aid**: Use as placeholders while building workflows
 * - **Performance Testing**: Isolate performance bottlenecks by replacing complex nodes
 * - **Documentation Helper**: Visual indicators for workflow logic
 * 
 * ## Primary Purpose
 * 
 * The main purpose is workflow **visual clarity and documentation**. This node helps:
 * - Make complex workflows easier to understand for team members
 * - Visually indicate where data processing intentionally stops
 * - Provide clear endpoints for conditional workflow branches
 * - Document workflow logic without affecting data flow
 * 
 * ## Technical Behavior
 * 
 * - **Input**: Accepts any data format and structure
 * - **Processing**: Performs absolutely no operations on the data
 * - **Output**: Returns exactly the same data it receives
 * - **Performance**: Executes instantly with minimal overhead
 * - **Compatibility**: Works with all data types and workflow patterns
 * 
 * ## Use Cases
 * 
 * - **Workflow Documentation**: Visually indicate intentional endpoints
 * - **Team Collaboration**: Help others understand workflow logic
 * - **Debugging**: Test workflow segments by isolating them
 * - **Development Placeholders**: Reserve space for future functionality
 * - **Performance Testing**: Replace complex nodes to identify bottlenecks
 * - **Conditional Branches**: Provide clear endpoints for IF/Switch paths
 * - **Data Flow Visualization**: Show where processing intentionally stops
 * - **Workflow Prototyping**: Quick mockups without functionality
 * - **Educational Purposes**: Teaching workflow concepts and patterns
 * 
 * ## Integration Notes
 * 
 * This node requires no configuration and can be inserted anywhere in a workflow
 * where you need visual clarity or want to temporarily stop processing while
 * maintaining the workflow structure.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const noOpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.noOp',
  displayName: 'No Operation, do nothing',
  description: 'Does nothing - makes workflows easier to read and understand where data flow stops. Helps with visual workflow clarity.',
  category: 'Core Nodes',
  subcategory: 'Utility',
  
  properties: [],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output'
    }
  ],

  credentials: [],

  version: [1],
  defaults: {
    name: 'No Operation, do nothing'
  },

  aliases: ['noop', 'passthrough', 'debug', 'placeholder', 'dummy'],
  
  examples: [
    {
      name: 'Basic Pass-through',
      description: 'Simple data pass-through for debugging',
      workflow: {
        nodes: [
          {
            name: 'No Operation, do nothing',
            type: 'n8n-nodes-base.noOp',
            parameters: {}
          }
        ]
      }
    },
    {
      name: 'Debugging Workflow Segment',
      description: 'Use No Operation to isolate and test specific workflow segments',
      workflow: {
        nodes: [
          {
            name: 'Manual Trigger',
            type: 'n8n-nodes-base.manualTrigger',
            parameters: {}
          },
          {
            name: 'No Operation, do nothing',
            type: 'n8n-nodes-base.noOp',
            parameters: {}
          },
          {
            name: 'Set',
            type: 'n8n-nodes-base.set',
            parameters: {}
          }
        ]
      }
    },
    {
      name: 'Performance Testing',
      description: 'Replace complex nodes with No Operation to identify performance bottlenecks',
      workflow: {
        nodes: [
          {
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            parameters: {}
          },
          {
            name: 'No Operation, do nothing',
            type: 'n8n-nodes-base.noOp',
            parameters: {}
          }
        ]
      }
    }
  ]
};

export default noOpNode;
