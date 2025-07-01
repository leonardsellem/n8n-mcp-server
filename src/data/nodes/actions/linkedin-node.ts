/**
 * # LinkedIn
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Social Media & Marketing
 * 
 * ## Description
 * 
 * Use the LinkedIn node to automate work in LinkedIn, and integrate LinkedIn with other applications. 
 * n8n supports creating posts for both personal profiles and company pages, enabling powerful 
 * social media automation workflows.
 * 
 * ## Key Features
 * 
 * - **Professional Network Integration**: Connect with the world's largest professional network
 * - **Multi-Account Support**: Post as individual person or organization/company page
 * - **Rich Media Posts**: Support for text, images, and article links
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Content Automation**: Automate content publishing and social media workflows
 * - **Business Marketing**: Leverage LinkedIn for B2B marketing and brand awareness
 * - **Professional Branding**: Maintain consistent professional presence
 * - **Cross-Platform Publishing**: Integrate with other social media platforms
 * - **Content Scheduling**: Combine with scheduling tools for optimal posting times
 * - **Analytics Integration**: Track performance with external analytics tools
 * - **Lead Generation**: Use for business development and networking
 * - **Recruitment Marketing**: Employer branding and talent acquisition
 * - **Thought Leadership**: Share industry insights and expertise
 * 
 * ## Credentials
 * 
 * Refer to [LinkedIn credentials](../../credentials/linkedin/) for guidance on setting up authentication.
 * Requires LinkedIn API access and proper OAuth configuration.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations
 * 
 * ### Post Operations
 * 
 * #### Create Post
 * - **Content Publishing**: Create and publish posts to LinkedIn
 *   - Professional content sharing and thought leadership
 *   - Business updates and company announcements
 *   - Industry insights and expert commentary
 *   - Product launches and service announcements
 *   - Event promotions and networking opportunities
 *   - Educational content and tutorials
 *   - Case studies and success stories
 *   - Team updates and company culture content
 *   - Partnership announcements and collaborations
 *   - Awards and recognition sharing
 *   - Behind-the-scenes content and company values
 *   - Industry trends and market analysis
 * 
 * ## Parameters
 * 
 * ### Post As
 * - **Account Type Selection**: Choose posting entity
 *   - **Person**: Post from individual profile for personal branding
 *   - **Organization**: Post from company page for corporate communications
 * 
 * ### Person Name or ID
 * - **Individual Identification**: Specify person for posting
 *   - LinkedIn profile identifier or name
 *   - Personal account authentication required
 * 
 * ### Organization URN
 * - **Company Identification**: Specify organization for posting
 *   - Organization number in URN format (e.g., `03262013` not `urn:li:company:03262013`)
 *   - Company page management permissions required
 * 
 * ### Text Content
 * - **Post Content**: Main text content of the post
 *   - Professional tone and business communication
 *   - Engaging storytelling and narrative structure
 *   - Call-to-action and engagement optimization
 *   - Hashtag strategy and discoverability
 * 
 * ### Media Category
 * - **Rich Content Support**: Include media with posts
 *   - **Images**: Visual content and infographics
 *   - **Articles**: Link sharing and external content
 *   - **Videos**: Video content and multimedia posts
 * 
 * ## Use Cases
 * 
 * - **Professional Branding**: Build personal thought leadership and expertise
 * - **Corporate Communications**: Manage company LinkedIn presence and brand awareness
 * - **Content Marketing**: Automated content publishing and social media campaigns
 * - **Lead Generation**: Business development and networking automation
 * - **Recruitment Marketing**: Employer branding and talent acquisition content
 * - **Industry Insights**: Share market trends and expert commentary
 * - **Product Marketing**: Launch announcements and feature highlights
 * - **Event Promotion**: Conference, webinar, and networking event marketing
 * - **Partnership Announcements**: Business collaborations and strategic alliances
 * - **Customer Success**: Case studies and testimonial sharing
 * - **Thought Leadership**: Industry expertise and professional insights
 * - **Company Culture**: Team updates and behind-the-scenes content
 * - **Awards and Recognition**: Achievement and milestone sharing
 * - **Educational Content**: Training materials and how-to guides
 * - **Crisis Communication**: Professional crisis management and transparency
 * 
 * ## Integration Patterns
 * 
 * ### Automated Content Publishing
 * - **RSS Feed Integration**: Auto-publish blog posts and articles
 * - **Content Calendar**: Scheduled publishing workflows
 * - **Cross-Platform Sharing**: Sync content across multiple social networks
 * - **AI Content Generation**: Automated content creation and optimization
 * 
 * ### Social Media Management
 * - **Multi-Account Management**: Manage multiple LinkedIn profiles and pages
 * - **Content Curation**: Aggregate and share relevant industry content
 * - **Engagement Tracking**: Monitor and respond to social interactions
 * - **Performance Analytics**: Track content performance and engagement metrics
 * 
 * ### Business Development
 * - **Lead Qualification**: Identify and engage potential customers
 * - **Relationship Building**: Automated networking and follow-up workflows
 * - **Sales Enablement**: Share sales content and product information
 * - **Customer Onboarding**: Welcome new customers and partners
 * 
 * ### Recruitment and HR
 * - **Job Posting Automation**: Auto-publish job openings and career content
 * - **Employer Branding**: Showcase company culture and values
 * - **Candidate Engagement**: Reach out to potential candidates
 * - **Employee Advocacy**: Amplify employee-generated content
 */

import { NodeTypeInfo } from '../../node-types.js';

export const linkedinNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.linkedin',
  displayName: 'LinkedIn',
  description: 'Integrate with LinkedIn\'s API. Allows posting to personal profiles and company pages.',
  category: 'Action Nodes',
  subcategory: 'Social Media & Marketing',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'post',
      description: 'The resource to operate on',
      options: [
        {
          name: 'Post',
          value: 'post',
          description: 'Operations on LinkedIn posts'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['post']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a post'
        }
      ]
    },
    {
      name: 'postAs',
      displayName: 'Post As',
      type: 'options',
      required: true,
      default: 'person',
      description: 'Whether to post as a person or organization',
      options: [
        {
          name: 'Person',
          value: 'person',
          description: 'Post as an individual person'
        },
        {
          name: 'Organization',
          value: 'organization',
          description: 'Post as an organization/company'
        }
      ]
    },
    {
      name: 'personId',
      displayName: 'Person ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The LinkedIn person ID',
      displayOptions: {
        show: {
          postAs: ['person']
        }
      }
    },
    {
      name: 'organizationUrn',
      displayName: 'Organization URN',
      type: 'string',
      required: true,
      default: '',
      description: 'The organization URN (just the number, not the full URN)',
      displayOptions: {
        show: {
          postAs: ['organization']
        }
      }
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: true,
      default: '',
      description: 'The text content of the post'
    },
    {
      name: 'mediaCategory',
      displayName: 'Media Category',
      type: 'options',
      required: false,
      default: '',
      description: 'The type of media to include with the post',
      options: [
        {
          name: 'None',
          value: '',
          description: 'No media'
        },
        {
          name: 'Image',
          value: 'image',
          description: 'Include an image'
        },
        {
          name: 'Article',
          value: 'article',
          description: 'Include an article link'
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
      name: 'linkedInOAuth2Api',
      required: true
    }
  ],

  version: [1],
  defaults: {
    name: 'LinkedIn'
  },

  aliases: ['linkedin', 'professional network', 'social media'],
  
  examples: [
    {
      name: 'Create Personal Post',
      description: 'Create a post on personal LinkedIn profile',
      workflow: {
        nodes: [
          {
            name: 'LinkedIn',
            type: 'n8n-nodes-base.linkedin',
            parameters: {
              resource: 'post',
              operation: 'create',
              postAs: 'person',
              personId: 'your-person-id',
              text: 'Excited to share my latest insights on workflow automation!'
            }
          }
        ]
      }
    },
    {
      name: 'Create Company Post',
      description: 'Create a post on company LinkedIn page',
      workflow: {
        nodes: [
          {
            name: 'LinkedIn',
            type: 'n8n-nodes-base.linkedin',
            parameters: {
              resource: 'post',
              operation: 'create',
              postAs: 'organization',
              organizationUrn: '12345678',
              text: 'We\'re thrilled to announce our latest product update!'
            }
          }
        ]
      }
    }
  ]
};

export default linkedinNode;
