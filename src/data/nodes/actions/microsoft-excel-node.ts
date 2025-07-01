/**
 * # Microsoft Excel 365
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Productivity & Collaboration
 * 
 * ## Description
 * 
 * Use the Microsoft Excel node to automate work in Microsoft Excel, and integrate Microsoft Excel with other applications. 
 * n8n has built-in support for a wide range of Microsoft Excel features, including adding and retrieving lists of 
 * table data, and workbooks, as well as getting worksheets.
 * 
 * ## Key Features
 * 
 * - **Table Management**: Complete table operations including data manipulation and analysis
 * - **Workbook Operations**: Create, manage, and retrieve workbooks
 * - **Worksheet Control**: Access and manage worksheets within workbooks
 * - **Data Integration**: Seamless integration with other workflow data sources
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Real-time Collaboration**: Work with live Excel documents in the cloud
 * - **Automated Reporting**: Generate and update reports automatically
 * - **Data Analysis**: Perform data analysis and calculations
 * - **Template Support**: Work with Excel templates and structured data
 * - **Cross-platform Access**: Access Excel files from any platform
 * - **Version Control**: Track changes and manage document versions
 * - **Secure Access**: Microsoft authentication and security features
 * 
 * ## Credentials
 * 
 * Refer to [Microsoft credentials](../../credentials/microsoft/) for guidance on setting up authentication.
 * Uses Microsoft OAuth2 for secure access to Excel Online services.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Table Operations
 * - **Add Rows**: Insert data into Excel tables
 * - **Get Table Columns**: Retrieve table structure information
 * - **Get Table Rows**: Retrieve data from Excel tables
 * - **Lookup Row**: Search and retrieve specific data
 * 
 * ### Workbook Operations
 * - **Add Worksheet**: Create new worksheets in workbooks
 * - **Get All Workbooks**: Retrieve workbook inventory
 * 
 * ### Worksheet Operations
 * - **Get All Worksheets**: List worksheets in workbooks
 * - **Get Worksheet Content**: Retrieve worksheet data
 * 
 * ## Advanced Features
 * 
 * ### Data Management and Processing
 * - **Real-time Synchronization**: Keep data synchronized across platforms
 * - **Batch Processing**: Handle large datasets efficiently
 * - **Data Validation**: Ensure data quality and consistency
 * - **Automated Calculations**: Perform calculations and data analysis
 * 
 * ### Integration and Automation
 * - **Workflow Integration**: Connect with other n8n nodes seamlessly
 * - **Event-Driven Updates**: Trigger workflows based on Excel changes
 * - **Custom Processing**: Integrate with data transformation pipelines
 * - **API Integration**: Connect Excel with external systems
 * 
 * ### Collaboration and Sharing
 * - **Multi-user Access**: Support concurrent user operations
 * - **Version Control**: Track changes and manage document versions
 * - **Sharing Management**: Control access and permissions
 * - **Comment Integration**: Handle comments and collaboration features
 * 
 * ### Security and Compliance
 * - **Secure Access**: Microsoft authentication and authorization
 * - **Audit Trails**: Track all Excel operations and changes
 * - **Data Governance**: Implement data management policies
 * - **Compliance Reporting**: Generate compliance and audit reports
 * 
 * ## Integration Patterns
 * 
 * ### Automated Reporting
 * - **Report Generation**: Create automated reports from various data sources
 * - **Data Aggregation**: Combine data from multiple sources into Excel
 * - **Dashboard Updates**: Keep Excel dashboards updated with real-time data
 * - **Scheduled Reports**: Generate and distribute reports on schedule
 * 
 * ### Data Processing
 * - **ETL Workflows**: Extract, transform, and load data into Excel
 * - **Data Cleansing**: Clean and validate data before Excel storage
 * - **Analytics Integration**: Connect Excel with analytics platforms
 * - **Business Intelligence**: Create BI reports and dashboards
 * 
 * ### Business Process Automation
 * - **Form Processing**: Process form submissions into Excel
 * - **Invoice Management**: Automate invoice processing and tracking
 * - **Inventory Management**: Track and manage inventory data
 * - **Financial Reporting**: Automate financial report generation
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Microsoft Graph API directly with your Microsoft credentials.
 * 
 * ## Use Cases
 * 
 * - **Financial Reporting**: Automated financial report generation and updates
 * - **Data Analysis**: Perform complex data analysis and calculations
 * - **Inventory Management**: Track and manage inventory across systems
 * - **Sales Reporting**: Generate sales reports and dashboards
 * - **Project Tracking**: Monitor project progress and milestones
 * - **Budget Management**: Track and analyze budget data
 * - **Performance Metrics**: Create performance dashboards and KPIs
 * - **Compliance Reporting**: Generate compliance and audit reports
 * - **Data Migration**: Transfer data between systems via Excel
 * - **Template Management**: Create and distribute Excel templates
 * - **Form Processing**: Process form data into structured Excel format
 * - **Survey Analysis**: Analyze survey and feedback data
 * - **Resource Planning**: Plan and allocate resources efficiently
 * - **Quality Control**: Track quality metrics and improvements
 * - **Customer Analytics**: Analyze customer data and behavior
 * - **Marketing Analytics**: Track marketing campaign performance
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftExcelNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftExcel',
  displayName: 'Microsoft Excel 365',
  description: 'Automate work in Microsoft Excel with table, workbook, and worksheet operations.',
  category: 'Action Nodes',
  subcategory: 'Productivity & Collaboration',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'table',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Table',
          value: 'table',
          description: 'Work with Excel tables'
        },
        {
          name: 'Workbook',
          value: 'workbook',
          description: 'Work with Excel workbooks'
        },
        {
          name: 'Worksheet',
          value: 'worksheet',
          description: 'Work with Excel worksheets'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'addRow',
      description: 'Operation to perform',
      displayOptions: {
        show: {
          resource: ['table']
        }
      },
      options: [
        {
          name: 'Add Row',
          value: 'addRow',
          description: 'Add rows to the end of the table'
        },
        {
          name: 'Get Columns',
          value: 'getColumns',
          description: 'Retrieve a list of table columns'
        },
        {
          name: 'Get Rows',
          value: 'getRows',
          description: 'Retrieve a list of table rows'
        },
        {
          name: 'Lookup',
          value: 'lookup',
          description: 'Look for a specific column value and return the matching row'
        }
      ]
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
      name: 'microsoftExcelOAuth2Api',
      required: true
    }
  ],

  version: [1],
  defaults: {
    name: 'Microsoft Excel'
  },

  aliases: ['excel', 'spreadsheet', 'office', 'microsoft office'],
  
  examples: [
    {
      name: 'Add Data to Excel Table',
      description: 'Add rows of data to an Excel table',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Excel',
            type: 'n8n-nodes-base.microsoftExcel',
            parameters: {
              resource: 'table',
              operation: 'addRow'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftExcelNode;
