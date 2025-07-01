/**
 * # AWS SES (Simple Email Service)
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the AWS SES node to automate work in AWS SES and integrate AWS SES with other applications. 
 * n8n has built-in support for a wide range of AWS SES features, including creating, getting, 
 * deleting, sending, updating, and adding templates and emails. AWS Simple Email Service (SES) 
 * is a cloud-based email sending service designed to help digital marketers and application 
 * developers send marketing, notification, and transactional emails.
 * 
 * ## Key Features
 * 
 * - **High Deliverability**: Advanced email infrastructure with built-in reputation management
 * - **Scalable**: Send millions of emails per day with automatic scaling capabilities
 * - **Cost-Effective**: Pay-as-you-go pricing with no upfront costs or minimum commitments
 * - **Email Templates**: Create and manage reusable email templates with dynamic content
 * - **Bounce and Complaint Handling**: Automatic processing of bounces and complaints
 * - **Send Statistics**: Detailed metrics on delivery, bounces, complaints, and opens
 * - **Configuration Sets**: Group sending activities for tracking and reputation management
 * - **Dedicated IP Addresses**: Option to use dedicated IPs for improved deliverability
 * - **SMTP Interface**: Send emails via SMTP or API depending on your needs
 * - **Email Authentication**: SPF, DKIM, and DMARC support for enhanced security
 * - **Suppression List Management**: Automatic and manual suppression list handling
 * - **Virtual Deliverability Manager**: AI-powered insights for email performance
 * - **Email Receiving**: Receive emails and process them with Lambda functions
 * - **Custom Mail Headers**: Add custom headers for tracking and processing
 * - **Sandbox Environment**: Test environment for development and verification
 * 
 * ## Credentials
 * 
 * Refer to [AWS SES credentials](../../credentials/aws/) for guidance on setting up authentication.
 * Requires AWS Access Key ID and Secret Access Key with appropriate SES permissions.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI - find out more in the 
 * [AI tool parameters documentation](../../../../advanced-ai/examples/using-the-fromai-function/).
 * 
 * ## Operations
 * 
 * ### Custom Verification Email
 * - **Create**: Create a new custom verification email template
 * - **Delete**: Delete an existing custom verification email template  
 * - **Get**: Get the custom email verification template
 * - **Get All**: Get all existing custom verification email templates for your account
 * - **Add Identity**: Add an email address to the list of identities
 * - **Update**: Update an existing custom verification email template
 * 
 * ### Email Operations
 * - **Send**: Send individual emails with full customization options
 * - **Send Template**: Send emails using predefined templates with dynamic data
 * 
 * ### Template Management
 * - **Create Template**: Create a new email template with HTML and text versions
 * - **Delete Template**: Remove an existing template from your account
 * - **Get Template**: Retrieve a specific template and its content
 * - **Get All Templates**: List all available templates in your account
 * - **Update Template**: Modify existing template content and settings
 * 
 * ## Common Integration Patterns
 * 
 * ### Transactional Email Systems
 * - Order confirmation and receipt emails for e-commerce platforms
 * - Password reset and account verification emails for user management
 * - Welcome emails and onboarding sequences for new user registration
 * - Shipping notifications and delivery updates for logistics tracking
 * - Payment confirmations and invoice delivery for financial transactions
 * - Appointment reminders and booking confirmations for scheduling systems
 * - Account activity alerts and security notifications for monitoring systems
 * - Newsletter subscriptions and unsubscription confirmations for marketing
 * - Support ticket updates and customer service communications
 * - Product update notifications and feature announcement emails
 * - Subscription renewal reminders and billing notifications
 * - Two-factor authentication codes and security verification emails
 * 
 * ### Marketing and Communication Workflows
 * - Automated email marketing campaigns with personalized content delivery
 * - Lead nurturing sequences and sales funnel email automation
 * - Event-triggered emails based on user behavior and engagement metrics
 * - A/B testing campaigns for email content and design optimization
 * - Segmented email lists for targeted marketing and demographic targeting
 * - Drip campaigns and educational email series for customer engagement
 * - Re-engagement campaigns for inactive users and dormant subscribers
 * - Cross-sell and upsell email campaigns for revenue optimization
 * - Customer satisfaction surveys and feedback collection emails
 * - Loyalty program communications and reward notifications
 * - Seasonal promotions and holiday marketing campaign automation
 * - Webinar invitations and event marketing email sequences
 * 
 * ### System Integration and Automation
 * - CRM integration for automated follow-up and lead management emails
 * - E-commerce platform integration for order and customer lifecycle emails
 * - Help desk integration for automated support and resolution emails
 * - Monitoring system integration for alert and notification delivery
 * - Content management system integration for publication and update notifications
 * - Social media integration for cross-platform engagement and notifications
 * - Analytics integration for performance reporting and metric delivery
 * - Backup system integration for status and completion notifications
 * - API webhook integration for real-time event-driven email delivery
 * - Database trigger integration for data-driven email automation
 * - Calendar integration for meeting and appointment reminder emails
 * - Task management integration for project and deadline notification emails
 * 
 * ## Example Use Cases
 * 
 * ### E-commerce Order Processing
 * ```typescript
 * // Order confirmation email
 * const orderConfirmation = await awsSes.sendTemplate({
 *   templateName: 'order-confirmation',
 *   destination: {
 *     toAddresses: ['customer@example.com']
 *   },
 *   templateData: JSON.stringify({
 *     customerName: 'John Doe',
 *     orderNumber: 'ORD-12345',
 *     orderTotal: '$99.99',
 *     items: [
 *       { name: 'Product A', quantity: 2, price: '$49.99' }
 *     ],
 *     estimatedDelivery: '2024-01-15'
 *   }),
 *   source: 'orders@yourstore.com'
 * });
 * 
 * // Shipping notification
 * await awsSes.send({
 *   destination: {
 *     toAddresses: ['customer@example.com']
 *   },
 *   message: {
 *     subject: {
 *       data: 'Your order has shipped - Tracking #{{trackingNumber}}'
 *     },
 *     body: {
 *       html: {
 *         data: shipmentEmailHtml,
 *         charset: 'UTF-8'
 *       }
 *     }
 *   },
 *   source: 'shipping@yourstore.com'
 * });
 * ```
 * 
 * ### User Authentication System
 * ```typescript
 * // Password reset email
 * const passwordReset = await awsSes.send({
 *   destination: {
 *     toAddresses: [userEmail]
 *   },
 *   message: {
 *     subject: {
 *       data: 'Password Reset Request'
 *     },
 *     body: {
 *       html: {
 *         data: `
 *           <h2>Password Reset Request</h2>
 *           <p>Click the link below to reset your password:</p>
 *           <a href="${resetUrl}">Reset Password</a>
 *           <p>This link expires in 30 minutes.</p>
 *         `,
 *         charset: 'UTF-8'
 *       },
 *       text: {
 *         data: `Password reset link: ${resetUrl}`
 *       }
 *     }
 *   },
 *   source: 'noreply@yourapp.com'
 * });
 * 
 * // Account verification
 * await awsSes.sendTemplate({
 *   templateName: 'account-verification',
 *   destination: {
 *     toAddresses: [newUserEmail]
 *   },
 *   templateData: JSON.stringify({
 *     userName: userData.name,
 *     verificationUrl: verificationLink,
 *     supportEmail: 'support@yourapp.com'
 *   }),
 *   source: 'welcome@yourapp.com'
 * });
 * ```
 * 
 * ### Marketing Campaign Management
 * ```typescript
 * // Newsletter campaign
 * const newsletter = await awsSes.sendTemplate({
 *   templateName: 'monthly-newsletter',
 *   destination: {
 *     toAddresses: subscriberList
 *   },
 *   templateData: JSON.stringify({
 *     month: 'January 2024',
 *     headlines: ['New Product Launch', 'Customer Success Story'],
 *     unsubscribeUrl: 'https://yoursite.com/unsubscribe',
 *     preferenceUrl: 'https://yoursite.com/preferences'
 *   }),
 *   source: 'newsletter@yourcompany.com',
 *   configurationSetName: 'marketing-campaigns'
 * });
 * 
 * // Promotional offer
 * await awsSes.send({
 *   destination: {
 *     toAddresses: targetedCustomers
 *   },
 *   message: {
 *     subject: {
 *       data: '🎉 Exclusive 20% Off - Limited Time!'
 *     },
 *     body: {
 *       html: {
 *         data: promotionalEmailHtml
 *       }
 *     }
 *   },
 *   source: 'promotions@yourstore.com',
 *   tags: [
 *     { name: 'Campaign', value: 'Winter2024' },
 *     { name: 'Segment', value: 'Premium' }
 *   ]
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Create Screenshots with uProc, Save to Dropbox and Send by Email**: Screen capture automation
 * - **Send an Email Using AWS SES**: Basic email sending workflow
 * - **Auto-Notify on New Major n8n Releases**: RSS monitoring with email notifications
 * - **Order Confirmation System**: E-commerce transaction emails
 * - **User Onboarding Sequence**: Welcome and setup email series
 * - **Password Reset Workflow**: Secure authentication email handling
 * - **Newsletter Automation**: Scheduled content distribution system
 * - **Event Registration Confirmation**: RSVP and attendee management emails
 * - **Invoice and Billing Notifications**: Financial transaction communications
 * - **Customer Support Ticketing**: Automated support email responses
 * - **Product Launch Announcements**: Marketing campaign email delivery
 * - **System Monitoring Alerts**: Infrastructure notification emails
 * 
 * ## Best Practices
 * 
 * ### Email Deliverability
 * - Set up proper SPF, DKIM, and DMARC records for domain authentication
 * - Use verified email addresses and domains for sending
 * - Maintain good sender reputation through engagement monitoring
 * - Implement proper bounce and complaint handling procedures
 * - Use suppression lists to avoid sending to invalid addresses
 * - Monitor delivery metrics and adjust sending patterns accordingly
 * - Warm up new IP addresses gradually to establish reputation
 * - Use dedicated IP pools for different types of email campaigns
 * - Implement feedback loops to track recipient engagement
 * - Follow email marketing best practices and anti-spam guidelines
 * - Use double opt-in for subscription confirmations when appropriate
 * - Segment email lists based on engagement and demographics
 * 
 * ### Template and Content Management
 * - Create responsive email templates that work across all devices
 * - Use semantic HTML structure with proper fallbacks for older clients
 * - Implement proper alt text for images and accessibility features
 * - Test templates across multiple email clients and platforms
 * - Use consistent branding and visual design elements
 * - Optimize email size and loading times for better user experience
 * - Include both HTML and text versions for maximum compatibility
 * - Use dynamic content and personalization to improve engagement
 * - Implement proper unsubscribe mechanisms and preference centers
 * - Version control templates and maintain backup copies
 * - Use A/B testing to optimize subject lines and content
 * - Follow CAN-SPAM and GDPR compliance requirements
 * 
 * ### Security and Compliance
 * - Use IAM roles with least privilege access for SES operations
 * - Encrypt sensitive data in email content and templates
 * - Implement proper error handling and retry mechanisms
 * - Use secure HTTPS URLs for all links and tracking pixels
 * - Monitor for suspicious sending patterns and unauthorized access
 * - Implement rate limiting to prevent abuse and quota exhaustion
 * - Use configuration sets for detailed tracking and analytics
 * - Set up CloudWatch alarms for monitoring delivery metrics
 * - Implement proper logging and audit trails for compliance
 * - Use sandbox mode for testing and development environments
 * - Validate email addresses before attempting to send
 * - Implement proper data retention and deletion policies
 */

export const awsSesNode = {
  displayName: 'AWS SES',
  name: 'awsSes',
  group: ['transform'],
  version: 1,
  icon: 'file:awsses.svg',
  description: 'Cloud-based email sending service for transactional and marketing emails',
  defaults: {
    name: 'AWS SES',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'aws',
      required: true,
    },
  ],
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      noDataExpression: true,
      options: [
        {
          name: 'Custom Verification Email',
          value: 'customVerificationEmail',
          description: 'Manage custom verification email templates',
        },
        {
          name: 'Email',
          value: 'email',
          description: 'Send emails',
        },
        {
          name: 'Template',
          value: 'template',
          description: 'Manage email templates',
        },
      ],
      default: 'email',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['email'],
        },
      },
      options: [
        {
          name: 'Send',
          value: 'send',
          description: 'Send an email',
          action: 'Send an email',
        },
        {
          name: 'Send Template',
          value: 'sendTemplate',
          description: 'Send an email using a template',
          action: 'Send a template email',
        },
      ],
      default: 'send',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ['template'],
        },
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a template',
          action: 'Create a template',
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a template',
          action: 'Delete a template',
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a template',
          action: 'Get a template',
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all templates',
          action: 'Get all templates',
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a template',
          action: 'Update a template',
        },
      ],
      default: 'create',
    },
  ],
};
