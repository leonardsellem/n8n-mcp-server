/**
 * # Gmail
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Email & Communication
 * 
 * ## Description
 * 
 * Use the Gmail node to automate work in Gmail, and integrate Gmail with other applications. 
 * n8n has built-in support for a wide range of Gmail features, including creating, updating, 
 * deleting, and getting drafts, messages, labels, and threads.
 * 
 * ## Key Features
 * 
 * - **Email Management**: Send, receive, and organize email messages
 * - **Draft Management**: Create and manage email drafts
 * - **Label Organization**: Create and manage custom labels and folders
 * - **Thread Handling**: Manage email conversations and threads
 * - **Advanced Search**: Powerful search and filtering capabilities
 * - **Attachment Support**: Handle email attachments and file uploads
 * - **Template System**: Create reusable email templates
 * - **Auto-reply**: Set up automated email responses
 * - **Email Tracking**: Monitor email delivery and read status
 * - **Bulk Operations**: Process multiple emails efficiently
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Rich HTML Emails**: Support for formatted HTML email content
 * 
 * ## Credentials
 * 
 * Refer to [Google credentials](../../credentials/google/) for guidance on setting up authentication.
 * Uses Google OAuth2 for secure access to Gmail accounts.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Draft Operations
 * - **Create Draft**: Create new email drafts
 *   - Compose emails with recipients, subject, and body
 *   - Add attachments and media files
 *   - Set formatting options and HTML content
 *   - Schedule drafts for later editing
 *   - Save partially composed emails
 * - **Get Draft**: Retrieve specific draft by ID
 *   - Access draft content and metadata
 *   - View recipient lists and subject lines
 *   - Check attachment details
 *   - Review formatting and styling
 * - **Get Many Drafts**: List and filter all drafts
 *   - Search drafts by keywords or criteria
 *   - Sort by creation date or modification time
 *   - Filter by labels or folders
 *   - Bulk export draft data
 * - **Delete Draft**: Remove drafts permanently
 *   - Clean up unwanted drafts
 *   - Manage draft storage space
 *   - Bulk delete operations
 * 
 * ### Message Operations
 * - **Send Message**: Send emails to recipients
 *   - Compose and send new emails
 *   - Support for multiple recipients (To, CC, BCC)
 *   - Rich HTML formatting and plain text
 *   - Attach files, images, and documents
 *   - Set priority and delivery options
 *   - Custom headers and metadata
 * - **Get Message**: Retrieve specific message details
 *   - Access complete message content
 *   - View sender and recipient information
 *   - Download attachments and media
 *   - Check message status and flags
 * - **Get Many Messages**: Search and list messages
 *   - Advanced search with Gmail query syntax
 *   - Filter by date ranges, senders, or labels
 *   - Search email content and attachments
 *   - Pagination for large mailboxes
 *   - Export message lists and metadata
 * - **Reply to Message**: Respond to received emails
 *   - Reply to original sender
 *   - Reply all to all recipients
 *   - Quote original message content
 *   - Add new recipients to reply
 *   - Maintain conversation threading
 * - **Mark as Read/Unread**: Change message status
 *   - Mark messages as read or unread
 *   - Bulk status updates
 *   - Manage inbox organization
 *   - Track message processing
 * - **Add/Remove Label**: Organize messages with labels
 *   - Apply custom labels to messages
 *   - Remove labels from messages
 *   - Bulk label operations
 *   - Create filing and organization systems
 * - **Delete Message**: Remove messages permanently
 *   - Move messages to trash
 *   - Permanent deletion from trash
 *   - Bulk delete operations
 *   - Manage storage space
 * 
 * ### Label Operations
 * - **Create Label**: Create new organizational labels
 *   - Create custom labels and folders
 *   - Set label colors and visibility
 *   - Organize label hierarchy
 *   - Define label behavior and rules
 * - **Get Label**: Retrieve specific label information
 *   - Access label properties and settings
 *   - View message counts and statistics
 *   - Check label hierarchy and nesting
 * - **Get Many Labels**: List all available labels
 *   - View complete label structure
 *   - Export label organization
 *   - Analyze label usage patterns
 * - **Delete Label**: Remove labels permanently
 *   - Clean up unused labels
 *   - Reorganize label structure
 *   - Handle label dependencies
 * 
 * ### Thread Operations
 * - **Get Thread**: Retrieve complete conversation threads
 *   - Access all messages in a conversation
 *   - View thread participants and timeline
 *   - Track conversation history
 *   - Analyze thread statistics
 * - **Get Many Threads**: Search and list conversation threads
 *   - Filter threads by participants or content
 *   - Search across conversation history
 *   - Sort by activity or creation date
 *   - Export thread summaries
 * - **Reply to Thread**: Continue conversations
 *   - Add messages to existing threads
 *   - Maintain conversation context
 *   - Notify all thread participants
 *   - Update thread status and labels
 * - **Add/Remove Label from Thread**: Organize conversations
 *   - Apply labels to entire conversations
 *   - Remove labels from threads
 *   - Bulk thread organization
 *   - Create conversation filing systems
 * - **Trash/Untrash Thread**: Manage thread lifecycle
 *   - Move entire conversations to trash
 *   - Restore conversations from trash
 *   - Bulk thread management
 *   - Archive conversation history
 * - **Delete Thread**: Permanently remove conversations
 *   - Delete entire conversation threads
 *   - Clean up storage space
 *   - Handle thread dependencies
 * 
 * ## Advanced Email Features
 * 
 * ### Email Composition
 * - **Rich Text Formatting**: HTML email with styling and formatting
 * - **Template Support**: Reusable email templates and signatures
 * - **Attachment Handling**: Support for multiple file types and sizes
 * - **Inline Images**: Embed images directly in email content
 * - **Priority Settings**: Set email importance and urgency levels
 * 
 * ### Search and Filtering
 * - **Gmail Query Syntax**: Advanced search with Gmail's powerful query language
 * - **Custom Filters**: Create automated rules for incoming emails
 * - **Date Range Filtering**: Search by specific time periods
 * - **Sender/Recipient Filtering**: Filter by email addresses and domains
 * - **Content Search**: Search within email body and attachments
 * 
 * ### Organization and Management
 * - **Label System**: Flexible labeling for email organization
 * - **Thread Management**: Handle email conversations efficiently
 * - **Archive System**: Archive emails for long-term storage
 * - **Spam Filtering**: Automatic spam detection and management
 * - **Quota Management**: Monitor and manage storage usage
 * 
 * ### Automation and Integration
 * - **Auto-reply**: Set up automated email responses
 * - **Email Forwarding**: Automatically forward emails to other addresses
 * - **Webhook Integration**: Real-time notifications for email events
 * - **Bulk Operations**: Process multiple emails simultaneously
 * - **API Rate Limiting**: Handle Gmail API quotas and limits
 * 
 * ## Related Resources
 * 
 * Refer to Google's [Gmail API documentation](https://developers.google.com/gmail/api) for detailed information about the API.
 * n8n provides a trigger node for Gmail to receive notifications about new emails and changes.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Gmail API directly with your Google credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include authentication, API quotas, and large attachment handling.
 * 
 * ## Use Cases
 * 
 * - **Customer Support Automation**: Automate support ticket responses and routing
 * - **Marketing Campaigns**: Send personalized marketing emails and newsletters
 * - **Order Confirmations**: Automatically send order and shipping confirmations
 * - **Lead Management**: Process and respond to sales inquiries
 * - **Event Notifications**: Send event reminders and updates
 * - **Newsletter Management**: Automate newsletter creation and distribution
 * - **Support Ticket Routing**: Automatically categorize and route support emails
 * - **Email Analytics**: Track email open rates and engagement metrics
 * - **Document Distribution**: Automatically send reports and documents
 * - **Appointment Scheduling**: Handle appointment confirmations and reminders
 * - **Survey Collection**: Send and collect survey responses via email
 * - **Account Notifications**: Send account updates and security alerts
 * - **Invoice Processing**: Automate invoice generation and delivery
 * - **Backup Communications**: Create email backups and archiving systems
 * - **Team Collaboration**: Facilitate team communication and updates
 * - **Project Updates**: Send project status reports and milestones
 * - **Training Materials**: Distribute training content and resources
 * - **Quality Assurance**: Monitor email quality and compliance
 * - **Multi-language Support**: Send emails in multiple languages
 * - **A/B Testing**: Test different email content and formats
 * - **Social Media Integration**: Cross-platform content distribution
 * - **CRM Integration**: Sync email communications with customer records
 * - **E-commerce Integration**: Handle order processing and customer service
 * - **Content Management**: Distribute content updates and announcements
 * - **Security Monitoring**: Send security alerts and notifications
 * - **Performance Reporting**: Generate and distribute performance reports
 * - **Compliance Management**: Ensure email compliance with regulations
 * - **Data Backup**: Backup important email communications
 * - **Workflow Automation**: Integrate email into larger business workflows
 * - **Real-time Alerts**: Send urgent notifications and emergency communications
 */

import { NodeTypeInfo } from '../../node-types.js';

export const gmailNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gmail',
  displayName: 'Gmail',
  description: 'Send, receive, and manage emails through Gmail with comprehensive automation features.',
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
          name: 'Draft',
          value: 'draft',
          description: 'Work with email drafts'
        },
        {
          name: 'Label',
          value: 'label',
          description: 'Work with email labels'
        },
        {
          name: 'Message',
          value: 'message',
          description: 'Work with email messages'
        },
        {
          name: 'Thread',
          value: 'thread',
          description: 'Work with email threads'
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
          name: 'Add Label',
          value: 'addLabel',
          description: 'Add label to a message'
        },
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
          name: 'Mark as Read',
          value: 'markAsRead',
          description: 'Mark message as read'
        },
        {
          name: 'Mark as Unread',
          value: 'markAsUnread',
          description: 'Mark message as unread'
        },
        {
          name: 'Remove Label',
          value: 'removeLabel',
          description: 'Remove label from message'
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
      name: 'googleApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Gmail'
  },

  aliases: ['email', 'google', 'mail', 'messaging'],
  
  examples: [
    {
      name: 'Send Email',
      description: 'Send an email through Gmail',
      workflow: {
        nodes: [
          {
            name: 'Gmail',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'send',
              to: 'recipient@example.com',
              subject: 'Hello from n8n',
              message: 'This is a test email sent via n8n workflow.'
            }
          }
        ]
      }
    }
  ]
};

export default gmailNode;
