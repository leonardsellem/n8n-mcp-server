/**
 * # Function
 * 
 * **Status**: ⚠️ Deprecated (Replaced by Code node from v0.198.0)
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Deprecation Notice
 * 
 * ⚠️ **DEPRECATED**: The Function node has been replaced by the **Code node** from version 0.198.0 onwards.
 * For new workflows, please use the Code node instead. Existing Function nodes will continue to work,
 * but it's recommended to migrate to the Code node for better features and ongoing support.
 * 
 * ## Migration Path
 * 
 * **Use Code node instead** - The Code node provides:
 * - Better JavaScript and Python support
 * - Improved error handling and debugging
 * - AI assistance for code generation (Cloud users)
 * - Modern code editor with syntax highlighting
 * - Better performance and stability
 * 
 * ## Description
 * 
 * The Function node allowed you to write custom JavaScript functions to process data.
 * This legacy node has been superseded by the more powerful and feature-rich Code node.
 * 
 * ## Key Features (Legacy)
 * 
 * - **Custom JavaScript**: Write custom functions to process data
 * - **Multiple Items**: Process multiple items in a single execution
 * - **Error Handling**: Basic error handling and debugging
 * - **Return Control**: Control what gets returned from the function
 * - **Helper Functions**: Access to n8n helper functions
 * - **Async Support**: Support for asynchronous operations
 * - **Context Access**: Access to workflow context and previous nodes
 * 
 * ## Legacy Use Cases
 * 
 * - Complex data transformations (now use Code node)
 * - Custom business logic implementation (now use Code node)
 * - API response processing (now use Code node)
 * - Data validation and sanitization (now use Code node)
 * - Mathematical calculations (now use Code node)
 * - String manipulation and formatting (now use Code node)
 * - Conditional data processing (now use Code node)
 * - Custom algorithms and workflows (now use Code node)
 * 
 * ## Available Variables (Legacy)
 * 
 * - `$input`: Input data from previous node
 * - `$json`: JSON data of current item
 * - `$node`: Information about current node
 * - `$workflow`: Workflow information
 * - `$prevNode`: Previous node information
 * - `$items()`: Function to get items from specific nodes
 * 
 * ## Replacement Information
 * 
 * **For n8n v0.198.0+**: Use the **Code node** which provides enhanced functionality:
 * - Better code editor with syntax highlighting
 * - Support for both JavaScript and Python
 * - AI-assisted code generation (Cloud users)
 * - Improved debugging capabilities
 * - Better error messages and handling
 * - Modern development experience
 */

import { NodeTypeInfo } from '../../node-types.js';

export const functionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.function',
  displayName: 'Function',
  description: '⚠️ DEPRECATED: Replaced by Code node from v0.198.0. Run custom JavaScript code to process data.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'functionCode',
      displayName: 'Function',
      type: 'string',
      typeOptions: {
        rows: 10
      },
      required: true,
      default: '// Add your custom JavaScript here\n// The last expression will be returned\n\n// Access input data\nconst inputData = $input.all();\n\n// Process data\nconst processedData = inputData.map(item => {\n  return {\n    json: {\n      ...item.json,\n      processed: true,\n      timestamp: new Date().toISOString()\n    }\n  };\n});\n\nreturn processedData;',
      description: 'JavaScript function to process the data'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for the function',
      options: [
        {
          name: 'onError',
          displayName: 'On Error',
          type: 'options',
          required: false,
          default: 'stopWorkflow',
          description: 'What to do when function execution fails',
          options: [
            {
              name: 'Stop Workflow',
              value: 'stopWorkflow',
              description: 'Stop the workflow execution'
            },
            {
              name: 'Continue',
              value: 'continueRegularOutput',
              description: 'Continue with empty output'
            },
            {
              name: 'Continue Error Output',
              value: 'continueErrorOutput',
              description: 'Continue and output error information'
            }
          ]
        }
      ]
    }
  ],

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

  version: [1, 2],
  defaults: {
    name: 'Function'
  },

  aliases: ['javascript', 'js', 'custom', 'script'],
  
  examples: [
    {
      name: 'Data Transformation',
      description: 'Transform input data using custom JavaScript',
      workflow: {
        nodes: [
          {
            name: 'Function',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: '// Transform data structure\nconst items = $input.all();\n\nreturn items.map(item => ({\n  json: {\n    id: item.json.id,\n    name: item.json.firstName + " " + item.json.lastName,\n    email: item.json.email.toLowerCase(),\n    processed: true\n  }\n}));'
            }
          }
        ]
      }
    },
    {
      name: 'Data Filtering',
      description: 'Filter data based on custom conditions',
      workflow: {
        nodes: [
          {
            name: 'Function',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: '// Filter items based on conditions\nconst items = $input.all();\n\nconst filtered = items.filter(item => {\n  return item.json.status === "active" && item.json.score > 75;\n});\n\nreturn filtered;'
            }
          }
        ]
      }
    },
    {
      name: 'API Response Processing',
      description: 'Process complex API responses',
      workflow: {
        nodes: [
          {
            name: 'Function',
            type: 'n8n-nodes-base.function',
            parameters: {
              functionCode: '// Process API response\nconst items = $input.all();\n\nreturn items.map(item => {\n  const response = item.json;\n  \n  return {\n    json: {\n      id: response.data.id,\n      title: response.data.attributes.title,\n      status: response.data.attributes.status,\n      tags: response.data.attributes.tags || []\n    }\n  };\n});'
            }
          }
        ]
      }
    }
  ]
};

export default functionNode;
