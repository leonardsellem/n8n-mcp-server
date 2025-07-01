/**
 * # Airtable
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Airtable node to automate work in Airtable, and integrate Airtable with other applications. 
 * n8n has built-in support for a wide range of Airtable features, including creating, reading, listing, 
 * updating and deleting tables.
 * 
 * ## Key Features
 * 
 * - **Complete CRUD Operations**: Create, read, update, and delete records in Airtable bases
 * - **Advanced Filtering**: Use Airtable's formula system for complex record filtering
 * - **Bulk Operations**: Handle multiple records efficiently with list and batch operations
 * - **Field Type Support**: Work with all Airtable field types (text, number, date, attachment, etc.)
 * - **Record ID Management**: Get and use Record IDs for precise record targeting
 * - **Formula Integration**: Leverage Airtable's powerful formula system for data manipulation
 * - **Base and Table Management**: Work across multiple bases and tables in your workspace
 * - **Real-time Sync**: Integration with Airtable's real-time collaboration features
 * - **Attachment Handling**: Upload and manage file attachments in records
 * - **View Integration**: Work with specific views and their filtered data
 * - **API Rate Limiting**: Built-in handling of Airtable's API rate limits
 * - **Data Validation**: Ensure data integrity with Airtable's field validation rules
 * 
 * ## Credentials
 * 
 * Refer to [Airtable credentials](../../credentials/airtable/) for guidance on setting up authentication.
 * Uses Airtable Personal Access Tokens or API keys for secure access to your bases.
 * 
 * ## Operations
 * 
 * - **Append**: Append new data to a table (create new records)
 * - **Delete**: Delete records from a table
 * - **List**: List and filter records from a table
 * - **Read**: Read specific records from a table
 * - **Update**: Update existing records in a table
 * 
 * ## Working with Record IDs
 * 
 * ### Getting Record IDs
 * 
 * To fetch data for a particular record, you need the Record ID. There are two main approaches:
 * 
 * #### Method 1: Create a Record ID Column
 * Create a `Record ID` column in your Airtable table to display Record IDs directly. 
 * This makes it easy to reference specific records in your workflows.
 * 
 * #### Method 2: Use the List Operation
 * Use the **List** operation to retrieve Record IDs along with other field data. 
 * This operation returns the Record ID for each record, which you can then use 
 * in subsequent operations.
 * 
 * ## Advanced Filtering
 * 
 * ### Filter By Formula
 * 
 * Use Airtable's powerful formula system to filter records when using the List operation:
 * 
 * #### Examples:
 * - **Filter by organization**: `{Organization}='n8n'`
 * - **Exclude organization**: `NOT({Organization}='n8n')`
 * - **Filter by date range**: `AND({Date} >= '2024-01-01', {Date} <= '2024-12-31')`
 * - **Filter by status**: `OR({Status}='Active', {Status}='Pending')`
 * - **Complex conditions**: `AND({Priority}='High', NOT({Assigned}=''))`
 * 
 * Refer to Airtable's formula documentation for complete syntax and available functions.
 * 
 * ## Related Resources
 * 
 * Refer to [Airtable's API documentation](https://airtable.com/developers/web/api/introduction) for more information about the service.
 * n8n provides a trigger node for Airtable to receive webhook notifications about record changes.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Airtable API directly with your Airtable credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include Record ID management, formula syntax, and field type compatibility.
 * 
 * ## Use Cases
 * 
 * - **Project Management**: Task tracking, milestone management, and team collaboration
 * - **Customer Relationship Management**: Lead tracking, customer data management, and sales pipelines
 * - **Content Management**: Editorial calendars, content planning, and publication workflows
 * - **Inventory Management**: Product catalogs, stock tracking, and order management
 * - **Event Management**: Attendee tracking, event planning, and logistics coordination
 * - **HR & Recruitment**: Candidate tracking, employee databases, and hiring workflows
 * - **Marketing Automation**: Campaign tracking, lead nurturing, and conversion analytics
 * - **Research & Data Collection**: Survey responses, research databases, and data analysis
 * - **Financial Tracking**: Expense management, budget tracking, and financial reporting
 * - **Educational Administration**: Student records, course management, and grade tracking
 * - **Real Estate Management**: Property listings, client tracking, and transaction management
 * - **Nonprofit Operations**: Donor management, volunteer coordination, and program tracking
 */

import { NodeTypeInfo } from '../../node-types.js';

export const airtableNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.airtable',
  displayName: 'Airtable',
  description: 'Create, read, update, and delete records in Airtable databases.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'list',
      description: 'Operation to perform on Airtable',
      options: [
        {
          name: 'Append',
          value: 'append',
          description: 'Append new records to a table'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete records from a table'
        },
        {
          name: 'List',
          value: 'list',
          description: 'List records from a table'
        },
        {
          name: 'Read',
          value: 'read',
          description: 'Read specific records'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update existing records'
        }
      ]
    },
    {
      name: 'baseId',
      displayName: 'Base ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the Airtable base'
    },
    {
      name: 'table',
      displayName: 'Table',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the table to work with'
    },
    {
      name: 'recordId',
      displayName: 'Record ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the record to read/update/delete',
      displayOptions: {
        show: {
          operation: ['read', 'update', 'delete']
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
      name: 'airtableApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Airtable'
  },

  aliases: ['database', 'spreadsheet', 'table'],
  
  examples: [
    {
      name: 'List Records',
      description: 'List all records from an Airtable table',
      workflow: {
        nodes: [
          {
            name: 'Airtable',
            type: 'n8n-nodes-base.airtable',
            parameters: {
              operation: 'list',
              baseId: 'appXXXXXXXXXXXXXX',
              table: 'Table 1'
            }
          }
        ]
      }
    }
  ]
};

export default airtableNode;
