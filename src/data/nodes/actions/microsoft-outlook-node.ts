/**
 * # Microsoft Outlook
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Email & Communication
 * 
 * ## Description
 * 
 * Use the Microsoft Outlook node to automate work in Microsoft Outlook, and integrate Microsoft Outlook 
 * with other applications. n8n has built-in support for a wide range of Microsoft Outlook features, 
 * including creating, updating, deleting, and getting folders, messages, drafts, calendars, contacts, and events.
 * 
 * ## Key Features
 * 
 * - **Email Management**: Complete email handling with advanced workflow features
 * - **Calendar Integration**: Full calendar and event management capabilities
 * - **Contact Management**: Comprehensive contact database operations
 * - **Draft Management**: Create, edit, and manage email drafts
 * - **Folder Organization**: Advanced folder structure and message organization
 * - **Attachment Handling**: Complete attachment upload, download, and management
 * - **Wait for Response**: Unique workflow pause feature waiting for user responses
 * - **Approval Workflows**: Built-in approval and disapproval workflow mechanisms
 * - **Custom Forms**: Interactive form creation for data collection
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Rich Formatting**: Support for HTML emails and rich text formatting
 * - **Enterprise Integration**: Seamless integration with Microsoft 365 ecosystem
 * 
 * ## Credentials
 * 
 * Refer to [Microsoft credentials](../../credentials/microsoft/) for guidance on setting up authentication.
 * Uses Microsoft OAuth2 for secure access to Outlook and Microsoft 365 services.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Calendar Operations
 * - **Create Calendar**: Create new calendars for organization
 *   - Set calendar name and description
 *   - Configure calendar permissions and sharing
 *   - Establish calendar color coding and categories
 *   - Define calendar time zones and working hours
 * - **Get Calendar**: Retrieve specific calendar information
 *   - Access calendar properties and settings
 *   - View calendar permissions and shared users
 *   - Check calendar subscription and sync status
 * - **Get Many Calendars**: List all available calendars
 *   - View personal and shared calendars
 *   - Filter calendars by type and permissions
 *   - Export calendar lists and properties
 * - **Update Calendar**: Modify calendar settings and properties
 *   - Change calendar names and descriptions
 *   - Update sharing permissions and access rights
 *   - Modify calendar display settings
 * - **Delete Calendar**: Remove calendars permanently
 *   - Clean up unused calendars
 *   - Handle calendar dependencies and events
 * 
 * ### Contact Operations
 * - **Create Contact**: Add new contacts to address book
 *   - Complete contact information including names and titles
 *   - Multiple contact methods (email, phone, address)
 *   - Company and organization details
 *   - Custom fields and notes
 *   - Contact photos and social profiles
 * - **Get Contact**: Retrieve specific contact details
 *   - Access complete contact information
 *   - View contact history and interactions
 *   - Check contact groups and categories
 * - **Get Many Contacts**: Search and list contacts
 *   - Advanced search with multiple criteria
 *   - Filter by groups, companies, or locations
 *   - Sort by name, company, or creation date
 *   - Export contact lists and data
 * - **Update Contact**: Modify existing contact information
 *   - Update contact details and information
 *   - Change contact categories and groups
 *   - Modify contact photos and profiles
 * - **Delete Contact**: Remove contacts from address book
 *   - Permanently delete contact records
 *   - Handle contact dependencies and references
 * 
 * ### Draft Operations
 * - **Create Draft**: Compose new email drafts
 *   - Compose emails with recipients and content
 *   - Add attachments and embedded media
 *   - Set email formatting and styling
 *   - Save drafts for later editing and sending
 * - **Get Draft**: Retrieve specific draft details
 *   - Access draft content and metadata
 *   - View recipients and attachment information
 *   - Check draft formatting and styling
 * - **Update Draft**: Modify existing drafts
 *   - Edit draft content and recipients
 *   - Add or remove attachments
 *   - Update formatting and styling options
 * - **Send Draft**: Send prepared drafts
 *   - Send completed drafts to recipients
 *   - Apply final formatting and delivery options
 *   - Track sending status and delivery
 * - **Delete Draft**: Remove drafts permanently
 *   - Clean up unwanted draft emails
 *   - Manage draft storage and organization
 * 
 * ### Event Operations
 * - **Create Event**: Schedule new calendar events
 *   - Set event title, description, and location
 *   - Configure date, time, and duration
 *   - Add attendees and send invitations
 *   - Set reminders and notifications
 *   - Define recurrence patterns for recurring events
 * - **Get Event**: Retrieve specific event details
 *   - Access complete event information
 *   - View attendee responses and status
 *   - Check event reminders and notifications
 * - **Get Many Events**: List and search calendar events
 *   - Filter events by date ranges and calendars
 *   - Search events by keywords and criteria
 *   - View upcoming events and schedules
 *   - Export event lists and calendars
 * - **Update Event**: Modify existing events
 *   - Change event details and schedules
 *   - Update attendee lists and invitations
 *   - Modify reminders and notifications
 * - **Delete Event**: Remove events from calendars
 *   - Cancel events and notify attendees
 *   - Handle recurring event modifications
 * 
 * ### Folder Operations
 * - **Create Folder**: Create new email folders
 *   - Organize emails with custom folder structure
 *   - Set folder names and descriptions
 *   - Configure folder permissions and access
 * - **Get Folder**: Retrieve specific folder information
 *   - Access folder properties and settings
 *   - View folder contents and message counts
 *   - Check folder hierarchy and structure
 * - **Get Many Folders**: List all email folders
 *   - View complete folder structure
 *   - Export folder organization
 *   - Analyze folder usage and contents
 * - **Update Folder**: Modify folder properties
 *   - Rename folders and update descriptions
 *   - Change folder organization and hierarchy
 * - **Delete Folder**: Remove folders permanently
 *   - Clean up folder structure
 *   - Handle folder contents and dependencies
 * 
 * ### Folder Message Operations
 * - **Get Many Messages**: Retrieve messages from specific folders
 *   - Access messages within designated folders
 *   - Filter messages by various criteria
 *   - Search folder contents efficiently
 * 
 * ### Message Operations
 * - **Send Message**: Send new emails to recipients
 *   - Compose and send emails with rich formatting
 *   - Support for multiple recipients (To, CC, BCC)
 *   - Add attachments and embedded content
 *   - Set message priority and delivery options
 * - **Send and Wait for Response**: Advanced workflow feature
 *   - Send emails and pause workflow execution
 *   - Wait for user responses and approvals
 *   - Support for approval workflows and forms
 *   - Configurable timeout and response handling
 * - **Get Message**: Retrieve specific message details
 *   - Access complete message content and metadata
 *   - View sender and recipient information
 *   - Download attachments and embedded content
 * - **Get Many Messages**: Search and list messages
 *   - Advanced search with Outlook query syntax
 *   - Filter by folders, dates, and criteria
 *   - Pagination for large mailboxes
 * - **Reply Message**: Respond to received emails
 *   - Reply to original sender or all recipients
 *   - Quote original message content
 *   - Maintain conversation threading
 * - **Move Message**: Organize messages between folders
 *   - Move messages to different folders
 *   - Bulk message organization operations
 * - **Update Message**: Modify message properties
 *   - Change message flags and categories
 *   - Update message importance and status
 * - **Delete Message**: Remove messages permanently
 *   - Move messages to deleted items
 *   - Permanent deletion and cleanup
 * 
 * ### Message Attachment Operations
 * - **Add Attachment**: Attach files to messages
 *   - Upload files and documents
 *   - Support for multiple file types and sizes
 *   - Embed inline images and media
 * - **Get Attachment**: Retrieve specific attachment details
 *   - Access attachment metadata and properties
 *   - Check attachment size and file type
 * - **Get Many Attachments**: List message attachments
 *   - View all attachments for a message
 *   - Export attachment lists and information
 * - **Download Attachment**: Download attachment files
 *   - Save attachments to local storage
 *   - Batch download multiple attachments
 * 
 * ## Advanced Workflow Features
 * 
 * ### Send and Wait for Response
 * This unique feature allows workflows to pause execution and wait for user responses:
 * 
 * #### Response Types
 * - **Approval**: Simple approve/disapprove buttons with customizable labels
 * - **Free Text**: Text input form for collecting user responses
 * - **Custom Form**: Advanced form builder with multiple field types
 * 
 * #### Configuration Options
 * - **Limit Wait Time**: Set timeout intervals or specific deadlines
 * - **n8n Attribution**: Control visibility of n8n branding in messages
 * - **Custom Styling**: Customize form appearance and button labels
 * - **Response Handling**: Configure actions based on user responses
 * 
 * ### Approval Workflows
 * - **Button Customization**: Custom approve/disapprove button labels
 * - **Single or Dual Actions**: Choose approval-only or approve/disapprove options
 * - **Response Tracking**: Monitor approval status and user responses
 * - **Escalation Handling**: Configure timeout actions and escalation paths
 * 
 * ### Form Integration
 * - **Dynamic Forms**: Build custom forms with various field types
 * - **Field Validation**: Implement input validation and requirements
 * - **Response Processing**: Handle form submissions in workflow logic
 * - **Multi-step Forms**: Create complex multi-page form experiences
 * 
 * ## Enterprise Integration
 * 
 * ### Microsoft 365 Ecosystem
 * - **Teams Integration**: Connect with Microsoft Teams for notifications
 * - **SharePoint Sync**: Integrate with SharePoint document libraries
 * - **Power Platform**: Connect with Power BI and Power Automate
 * - **Azure Services**: Leverage Azure cloud services and storage
 * 
 * ### Security and Compliance
 * - **Enterprise Security**: Support for enterprise security policies
 * - **Data Loss Prevention**: Integration with DLP policies
 * - **Compliance Features**: Support for regulatory compliance requirements
 * - **Audit Logging**: Comprehensive audit trails and logging
 * 
 * ## Related Resources
 * 
 * Refer to [Outlook's API documentation](https://learn.microsoft.com/en-us/outlook/rest/get-started) 
 * for more information about the service.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Microsoft Graph API directly with your Microsoft credentials.
 * 
 * ## Use Cases
 * 
 * - **Approval Workflows**: Create sophisticated approval processes with email integration
 * - **Meeting Scheduling**: Automate meeting creation and attendee management
 * - **Customer Support**: Handle support tickets with email and calendar integration
 * - **Project Management**: Coordinate project activities with calendar and email automation
 * - **Document Approval**: Implement document review and approval workflows
 * - **Event Management**: Automate event planning and attendee communication
 * - **Survey Collection**: Gather feedback through integrated forms and responses
 * - **Task Management**: Create and track tasks with email and calendar integration
 * - **Compliance Workflows**: Ensure regulatory compliance with approval processes
 * - **Marketing Campaigns**: Execute email marketing with response tracking
 * - **HR Processes**: Automate HR workflows with approval and form integration
 * - **Sales Pipeline**: Manage sales processes with email and calendar automation
 * - **Vendor Management**: Handle vendor communications and approvals
 * - **Training Programs**: Coordinate training schedules and communications
 * - **Quality Assurance**: Implement QA processes with approval workflows
 * - **Financial Approvals**: Automate financial approval processes
 * - **Contract Management**: Handle contract workflows with email integration
 * - **Incident Response**: Coordinate incident response with automated communications
 * - **Change Management**: Implement change approval processes
 * - **Resource Booking**: Automate resource reservation and scheduling
 * - **Performance Reviews**: Coordinate performance review processes
 * - **Budget Planning**: Facilitate budget approval and review workflows
 * - **Policy Management**: Distribute and track policy acknowledgments
 * - **Asset Management**: Coordinate asset requests and approvals
 * - **Security Workflows**: Implement security approval and review processes
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftOutlookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftOutlook',
  displayName: 'Microsoft Outlook',
  description: 'Comprehensive email, calendar, and productivity automation with advanced workflow features.',
  category: 'Action Nodes',
  subcategory: 'Email & Communication',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Calendar',
          value: 'calendar',
          description: 'Work with calendars'
        },
        {
          name: 'Contact',
          value: 'contact',
          description: 'Work with contacts'
        },
        {
          name: 'Draft',
          value: 'draft',
          description: 'Work with email drafts'
        },
        {
          name: 'Event',
          value: 'event',
          description: 'Work with calendar events'
        },
        {
          name: 'Folder',
          value: 'folder',
          description: 'Work with email folders'
        },
        {
          name: 'Folder Message',
          value: 'folderMessage',
          description: 'Work with messages in folders'
        },
        {
          name: 'Message',
          value: 'message',
          description: 'Work with email messages'
        },
        {
          name: 'Message Attachment',
          value: 'messageAttachment',
          description: 'Work with message attachments'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'Operation to perform',
      displayOptions: {
        show: {
          resource: ['message']
        }
      },
      options: [
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a message'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a message'
        },
        {
          name: 'Get Many',
          value: 'getMany',
          description: 'Get many messages'
        },
        {
          name: 'Move',
          value: 'move',
          description: 'Move a message'
        },
        {
          name: 'Reply',
          value: 'reply',
          description: 'Reply to a message'
        },
        {
          name: 'Send',
          value: 'send',
          description: 'Send a message'
        },
        {
          name: 'Send and Wait for Response',
          value: 'sendAndWait',
          description: 'Send a message and wait for response'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a message'
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
      name: 'microsoftOutlookOAuth2Api',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Microsoft Outlook'
  },

  aliases: ['outlook', 'microsoft', 'email', 'office365', 'calendar', 'contacts'],
  
  examples: [
    {
      name: 'Send Email with Approval',
      description: 'Send an email and wait for user approval',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'message',
              operation: 'sendAndWait',
              to: 'manager@company.com',
              subject: 'Approval Required',
              message: 'Please approve this request.',
              responseType: 'approval'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftOutlookNode;
