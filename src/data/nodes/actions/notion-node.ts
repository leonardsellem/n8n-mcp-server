/**
 * # Notion
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Notion node to automate work in Notion, and integrate Notion with other applications. 
 * n8n has built-in support for a wide range of Notion features, including getting and searching databases, 
 * creating pages, and getting users.
 * 
 * ## Key Features
 * 
 * - **Database Management**: Get, search, and manage Notion databases with advanced filtering
 * - **Page Operations**: Create, archive, search, and manage pages with rich content
 * - **Block Manipulation**: Append content blocks and get child blocks for structured content
 * - **Database Page CRUD**: Create, read, update, and manage database entries with properties
 * - **User Management**: Get user information and manage workspace members
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Rich Content Support**: Handle text, images, tables, and complex Notion content types
 * - **Search Capabilities**: Powerful search across pages, databases, and content
 * - **Property Management**: Handle all Notion property types (text, select, date, formula, etc.)
 * - **Workspace Integration**: Full integration with Notion workspace features
 * - **Real-time Sync**: Support for Notion's real-time collaboration features
 * - **Structured Data**: Handle complex data structures and relationships
 * 
 * ## Credentials
 * 
 * Refer to [Notion credentials](../../credentials/notion/) for guidance on setting up authentication.
 * Uses Notion API integration tokens for secure access to your workspace.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Block Operations
 * - **Append After**: Append content blocks after an existing block
 * - **Get Child Blocks**: Get all child blocks of a parent block
 * 
 * ### Database Operations
 * - **Get**: Get a specific database by ID
 * - **Get Many**: Get multiple databases from the workspace
 * - **Search**: Search for databases using filters and criteria
 * 
 * ### Database Page Operations
 * - **Create**: Create a new page within a database
 * - **Get**: Get a specific database page by ID
 * - **Get Many**: Get multiple pages from a database with filtering
 * - **Update**: Update properties and content of a database page
 * 
 * ### Page Operations
 * - **Archive**: Archive a page (soft delete)
 * - **Create**: Create a new page in the workspace
 * - **Search**: Search for pages across the workspace
 * 
 * ### User Operations
 * - **Get**: Get information about a specific user
 * - **Get Many**: Get a list of all users in the workspace
 * 
 * ## Related Resources
 * 
 * Refer to [Notion's API documentation](https://developers.notion.com/) for details about their API.
 * n8n provides a trigger node for Notion to receive webhook notifications.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Notion API directly with your Notion credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include API permissions, rate limiting, and property type handling.
 * 
 * ## Use Cases
 * 
 * - **Knowledge Management**: Automated documentation, wiki updates, and content organization
 * - **Project Management**: Task creation, status updates, and project tracking automation
 * - **Content Creation**: Blog post management, editorial workflows, and publishing automation
 * - **CRM & Customer Management**: Lead tracking, customer data synchronization, and pipeline management
 * - **Research & Data Collection**: Survey responses, research compilation, and data analysis
 * - **Team Collaboration**: Meeting notes automation, action item tracking, and team updates
 * - **Personal Productivity**: Habit tracking, goal management, and personal dashboard automation
 * - **Business Intelligence**: Report generation, metric tracking, and dashboard automation
 * - **Educational Platforms**: Course content management, student tracking, and assignment organization
 * - **Event Management**: Event planning, attendee tracking, and logistics coordination
 * - **Inventory & Asset Management**: Resource tracking, asset databases, and maintenance schedules
 * - **AI-Powered Workflows**: Automated content generation, smart categorization, and intelligent data processing
 */

import { NodeTypeInfo } from '../../node-types.js';

export const notionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.notion',
  displayName: 'Notion',
  description: 'Create, read, update, and manage content in Notion workspaces and databases.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'databasePage',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Database Page',
          value: 'databasePage',
          description: 'Work with database pages'
        },
        {
          name: 'Page',
          value: 'page',
          description: 'Work with standalone pages'
        },
        {
          name: 'Database',
          value: 'database',
          description: 'Work with databases'
        },
        {
          name: 'Block',
          value: 'block',
          description: 'Work with content blocks'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Work with users'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Operation to perform',
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new item'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get an item by ID'
        },
        {
          name: 'Get Many',
          value: 'getMany',
          description: 'Get multiple items'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an existing item'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search for items'
        }
      ]
    },
    {
      name: 'databaseId',
      displayName: 'Database ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Notion database',
      displayOptions: {
        show: {
          resource: ['databasePage']
        }
      }
    },
    {
      name: 'pageId',
      displayName: 'Page ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Notion page',
      displayOptions: {
        show: {
          resource: ['page', 'block']
        }
      }
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
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'notionApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Notion'
  },

  aliases: ['notes', 'workspace', 'database'],
  
  examples: [
    {
      name: 'Create Database Page',
      description: 'Create a new page in a Notion database',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'databasePage',
              operation: 'create',
              databaseId: 'database-id-here',
              properties: {
                title: 'New Task',
                status: 'To Do'
              }
            }
          }
        ]
      }
    }
  ]
};

export default notionNode;
