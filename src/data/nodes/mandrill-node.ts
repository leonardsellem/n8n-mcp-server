import { NodeTypeInfo } from '../node-types.js';

export const mandrillNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mandrill',
  displayName: 'Mandrill',
  description: 'Use the Mandrill node to automate work in Mandrill, and integrate Mandrill with other applications. Supports sending messages based on templates or HTML.',
  category: 'Communication',
  subcategory: 'Email',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Message', value: 'message', description: 'Send transactional email messages' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'sendTemplate',
      description: 'The operation to perform',
      options: [
        { name: 'Send Template', value: 'sendTemplate', description: 'Send message based on template' },
        { name: 'Send HTML', value: 'sendHtml', description: 'Send message based on HTML' }
      ]
    },
    {
      name: 'template',
      displayName: 'Template',
      type: 'string',
      required: false,
      default: '',
      description: 'The template name to use for sending the message'
    },
    {
      name: 'templateContent',
      displayName: 'Template Content',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Template content variables to merge into the template'
    },
    {
      name: 'to',
      displayName: 'To',
      type: 'fixedCollection',
      required: true,
      default: {},
      description: 'An array of recipient information'
    },
    {
      name: 'fromEmail',
      displayName: 'From Email',
      type: 'string',
      required: false,
      default: '',
      description: 'The sender email address'
    },
    {
      name: 'fromName',
      displayName: 'From Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The sender name'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'The message subject line'
    },
    {
      name: 'html',
      displayName: 'HTML',
      type: 'string',
      required: false,
      default: '',
      description: 'The full HTML content to be sent'
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional full text content to be sent'
    },
    {
      name: 'headers',
      displayName: 'Headers',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Optional extra headers to add to the message'
    },
    {
      name: 'important',
      displayName: 'Important',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not this message is important'
    },
    {
      name: 'trackOpens',
      displayName: 'Track Opens',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to turn on open tracking for the message'
    },
    {
      name: 'trackClicks',
      displayName: 'Track Clicks',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to turn on click tracking for the message'
    },
    {
      name: 'autoText',
      displayName: 'Auto Text',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to automatically generate a text part for messages that are not given text'
    },
    {
      name: 'autoHtml',
      displayName: 'Auto HTML',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to automatically generate an HTML part for messages that are not given HTML'
    },
    {
      name: 'inlineCss',
      displayName: 'Inline CSS',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to inline CSS'
    },
    {
      name: 'urlStripQs',
      displayName: 'URL Strip QS',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to strip the query string from URLs when aggregating tracked URL data'
    },
    {
      name: 'preserveRecipients',
      displayName: 'Preserve Recipients',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether or not to expose all recipients in to "To" header for each email'
    },
    {
      name: 'viewContentLink',
      displayName: 'View Content Link',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to remove content logging for sensitive emails'
    },
    {
      name: 'bccAddress',
      displayName: 'BCC Address',
      type: 'string',
      required: false,
      default: '',
      description: 'An optional address to receive an exact copy of each recipient\'s email'
    },
    {
      name: 'trackingDomain',
      displayName: 'Tracking Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'A custom domain to use for tracking opens and clicks'
    },
    {
      name: 'signingDomain',
      displayName: 'Signing Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'A custom domain to use for SPF/DKIM signing'
    },
    {
      name: 'returnPathDomain',
      displayName: 'Return Path Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'A custom domain to use for the messages\'s return-path'
    },
    {
      name: 'merge',
      displayName: 'Merge',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to evaluate merge tags in the message'
    },
    {
      name: 'mergeLanguage',
      displayName: 'Merge Language',
      type: 'options',
      required: false,
      default: 'mailchimp',
      description: 'The merge tag language to use when evaluating merge tags',
      options: [
        { name: 'Mailchimp', value: 'mailchimp', description: 'Use Mailchimp merge tag format' },
        { name: 'Handlebars', value: 'handlebars', description: 'Use Handlebars merge tag format' }
      ]
    },
    {
      name: 'globalMergeVars',
      displayName: 'Global Merge Variables',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Global merge variables to use for all recipients'
    },
    {
      name: 'mergeVars',
      displayName: 'Merge Variables',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Per-recipient merge variables'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'An array of string to tag the message with. Stats are accumulated using tags'
    },
    {
      name: 'subaccount',
      displayName: 'Subaccount',
      type: 'string',
      required: false,
      default: '',
      description: 'The unique id of a subaccount for this message'
    },
    {
      name: 'googleAnalyticsDomains',
      displayName: 'Google Analytics Domains',
      type: 'string',
      required: false,
      default: '',
      description: 'An array of strings indicating for which any matching URLs will automatically have Google Analytics parameters appended'
    },
    {
      name: 'googleAnalyticsCampaign',
      displayName: 'Google Analytics Campaign',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional string indicating the value to set for the utm_campaign tracking parameter'
    },
    {
      name: 'metadata',
      displayName: 'Metadata',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Metadata an associative array of user metadata'
    },
    {
      name: 'recipientMetadata',
      displayName: 'Recipient Metadata',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Per-recipient metadata'
    },
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'An array of supported attachments to add to the message'
    },
    {
      name: 'images',
      displayName: 'Images',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'An array of embedded images to add to the message'
    },
    {
      name: 'async',
      displayName: 'Async',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable a background sending mode that is optimized for bulk sending'
    },
    {
      name: 'ipPool',
      displayName: 'IP Pool',  
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the dedicated ip pool that should be used to send the message'
    },
    {
      name: 'sendAt',
      displayName: 'Send At',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'When this message should be sent as a UTC timestamp'
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
      displayName: 'Output',
      description: 'The processed Mandrill response data'
    }
  ],
  credentials: ['mandrillApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Template Email',
      description: 'Send an email using a Mandrill template',
      workflow: {
        nodes: [
          {
            name: 'Mandrill',
            type: 'n8n-nodes-base.mandrill',
            parameters: {
              resource: 'message',
              operation: 'sendTemplate',
              template: 'welcome-email',
              to: [
                {
                  email: 'recipient@example.com',
                  name: 'John Doe',
                  type: 'to'
                }
              ],
              fromEmail: 'sender@example.com',
              fromName: 'Your Company',
              subject: 'Welcome to our service!',
              templateContent: [
                {
                  name: 'username',
                  content: 'john_doe'
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: 'Send HTML Email',
      description: 'Send an email with custom HTML content',
      workflow: {
        nodes: [
          {
            name: 'Mandrill',
            type: 'n8n-nodes-base.mandrill',
            parameters: {
              resource: 'message',
              operation: 'sendHtml',
              to: [
                {
                  email: 'recipient@example.com',
                  name: 'Jane Smith',
                  type: 'to'
                }
              ],
              fromEmail: 'notifications@example.com',
              fromName: 'Notification System',
              subject: 'Important Update',
              html: '<h1>Hello Jane!</h1><p>This is an important update from our system.</p>',
              text: 'Hello Jane! This is an important update from our system.',
              trackOpens: true,
              trackClicks: true
            }
          }
        ]
      }
    },
    {
      name: 'Send Email with Merge Variables',
      description: 'Send personalized emails using merge variables',
      workflow: {
        nodes: [
          {
            name: 'Mandrill',
            type: 'n8n-nodes-base.mandrill',
            parameters: {
              resource: 'message',
              operation: 'sendTemplate',
              template: 'personalized-offer',
              to: [
                {
                  email: 'customer@example.com',
                  name: 'Customer Name',
                  type: 'to'
                }
              ],
              fromEmail: 'offers@example.com',
              fromName: 'Special Offers',
              globalMergeVars: [
                {
                  name: 'COMPANY_NAME',
                  content: 'Your Company'
                }
              ],
              mergeVars: [
                {
                  rcpt: 'customer@example.com',
                  vars: [
                    {
                      name: 'FIRST_NAME',
                      content: 'John'
                    },
                    {
                      name: 'OFFER_AMOUNT',
                      content: '20%'
                    }
                  ]
                }
              ],
              tags: ['offer', 'promotion'],
              trackOpens: true,
              trackClicks: true
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const mandrillNodes: NodeTypeInfo[] = [mandrillNode];

// Export individual actions for the Mandrill node
export const mandrillActions = [
  'send_template_message',
  'send_html_message'
];

// No trigger node exists for Mandrill (based on 404 response)
export const mandrillTriggers: string[] = [];