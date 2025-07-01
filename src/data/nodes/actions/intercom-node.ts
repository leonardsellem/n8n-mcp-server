/**
 * # Intercom
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Customer Service & Support
 * 
 * ## Description
 * 
 * Use the Intercom node to automate work in Intercom and integrate Intercom with other applications. 
 * n8n has built-in support for a wide range of Intercom features, including creating, updating, 
 * deleting, and getting companies, leads, and users. Intercom specializes in customer messaging, 
 * live chat, and conversational customer support with AI-powered automation.
 * 
 * ## Key Features
 * 
 * - **Customer Messaging Platform**: Real-time chat and messaging automation
 * - **Lead Management**: Comprehensive lead tracking and nurturing workflows
 * - **User Management**: Customer profile and lifecycle management
 * - **Company Management**: B2B account and organization tracking
 * - **Conversational AI**: AI-powered chatbots and automated responses
 * - **Customer Journey Automation**: Behavioral triggers and personalized messaging
 * - **Multi-Channel Support**: Website, mobile app, and email integration
 * - **Live Chat Platform**: Real-time customer support and sales assistance
 * - **Knowledge Base Integration**: Self-service support and documentation
 * - **Team Collaboration**: Agent assignment and internal communication
 * - **Analytics and Reporting**: Customer engagement and conversation metrics
 * - **API Integration Hub**: Connect with CRM, marketing, and business tools
 * - **Customer Onboarding**: Automated welcome sequences and product tours
 * - **Feedback Collection**: Customer satisfaction surveys and feedback forms
 * - **Segmentation and Targeting**: Advanced customer segmentation for personalized messaging
 * 
 * ## Credentials
 * 
 * Refer to [Intercom credentials](../../credentials/intercom/) for guidance on setting up authentication.
 * Supports access token authentication for secure API access.
 * 
 * ## Operations
 * 
 * ### Company Operations
 * 
 * #### Create Company
 * - **Company Registration**: Create new company profiles with comprehensive data
 *   - Enterprise customer onboarding and account setup
 *   - B2B lead qualification and company profiling
 *   - Sales prospect tracking and opportunity management
 *   - Customer success account management and tracking
 *   - Partner and vendor company registration
 *   - Integration data synchronization and CRM import
 *   - Multi-tenant organization setup and configuration
 *   - Subsidiary and branch office account creation
 *   - Market segmentation and industry categorization
 *   - Revenue tracking and subscription management
 *   - Geographic expansion and location tracking
 *   - Compliance and regulatory entity registration
 * 
 * #### Get Company
 * - **Company Profile Retrieval**: Fetch detailed company information and metrics
 *   - Customer account management and relationship tracking
 *   - Sales opportunity assessment and pipeline management
 *   - Customer success health scoring and engagement metrics
 *   - Support ticket history and service level tracking
 *   - Revenue and subscription analytics and reporting
 *   - Usage patterns and product adoption metrics
 *   - Team collaboration and account sharing
 *   - Integration data enrichment and external API sync
 *   - Compliance and audit trail documentation
 *   - Performance benchmarking and comparison analysis
 *   - Risk assessment and churn prediction modeling
 *   - Strategic account planning and relationship mapping
 * 
 * #### Get All Companies
 * - **Company Database Management**: Retrieve and analyze complete company datasets
 *   - Market analysis and competitive intelligence gathering
 *   - Customer segmentation and targeted campaign planning
 *   - Revenue analysis and business intelligence reporting
 *   - Customer success program management and optimization
 *   - Sales territory planning and quota management
 *   - Performance dashboard creation and KPI tracking
 *   - Data migration and system integration projects
 *   - Compliance reporting and regulatory compliance
 *   - Business development and partnership identification
 *   - Customer lifecycle analysis and retention strategies
 *   - Market research and industry trend analysis
 *   - Strategic planning and growth opportunity assessment
 * 
 * #### Update Company
 * - **Company Profile Management**: Modify and maintain company information
 *   - Account expansion and upselling opportunity tracking
 *   - Organizational change management and restructuring
 *   - Contact information updates and data maintenance
 *   - Subscription changes and billing modifications
 *   - Custom attribute management and data enrichment
 *   - Integration synchronization and data consistency
 *   - Compliance updates and regulatory changes
 *   - Performance tracking and success metrics updates
 *   - Team assignment changes and territory realignment
 *   - Partnership status and relationship updates
 *   - Risk assessment and health score adjustments
 *   - Strategic planning and account strategy updates
 * 
 * #### List Company Users
 * - **User-Company Relationship Management**: Track company team members and contacts
 *   - Organizational hierarchy mapping and team structure
 *   - Decision maker identification and influence mapping
 *   - Communication preferences and contact routing
 *   - Access control and permission management
 *   - Training and onboarding program coordination
 *   - Support escalation and ticket routing optimization
 *   - Product adoption and user engagement tracking
 *   - Feedback collection and satisfaction monitoring
 *   - Business relationship development and networking
 *   - Succession planning and contact backup identification
 *   - Integration access and API usage management
 *   - Compliance and security access auditing
 * 
 * ### Lead Operations
 * 
 * #### Create Lead
 * - **Lead Generation and Capture**: Create new lead profiles for sales qualification
 *   - Website visitor conversion and chat engagement
 *   - Marketing campaign lead capture and form submissions
 *   - Sales prospecting and outbound lead generation
 *   - Event and webinar attendee lead creation
 *   - Referral program and word-of-mouth lead tracking
 *   - Content download and gated resource leads
 *   - Social media engagement and interaction leads
 *   - Partner and channel lead registration
 *   - Trade show and conference lead capture
 *   - Product trial and demo request leads
 *   - Newsletter and content subscription leads
 *   - Customer advocacy and testimonial leads
 * 
 * #### Get Lead
 * - **Lead Profile Analysis**: Retrieve detailed lead information and engagement history
 *   - Sales qualification and lead scoring assessment
 *   - Engagement timeline and interaction tracking
 *   - Marketing attribution and campaign effectiveness
 *   - Behavioral analysis and intent identification
 *   - Lead source analysis and channel performance
 *   - Custom attribute tracking and segmentation
 *   - Communication preferences and contact optimization
 *   - Sales pipeline position and stage tracking
 *   - Team assignment and ownership management
 *   - Integration data and external enrichment
 *   - Compliance and consent management
 *   - Performance metrics and conversion analytics
 * 
 * #### Get All Leads
 * - **Lead Database Management**: Comprehensive lead analysis and pipeline management
 *   - Sales pipeline analysis and forecasting
 *   - Lead scoring and qualification automation
 *   - Marketing campaign performance and ROI analysis
 *   - Sales team performance and productivity tracking
 *   - Lead distribution and territory management
 *   - Conversion funnel analysis and optimization
 *   - Channel performance and source attribution
 *   - Customer acquisition cost and lifetime value
 *   - Market analysis and competitive intelligence
 *   - Segmentation and targeting optimization
 *   - Compliance and data privacy management
 *   - Business development and growth planning
 * 
 * #### Update Lead
 * - **Lead Lifecycle Management**: Modify lead information and track progression
 *   - Sales stage advancement and pipeline movement
 *   - Lead scoring updates and qualification changes
 *   - Contact information maintenance and data hygiene
 *   - Engagement tracking and interaction logging
 *   - Team assignment and ownership transfers
 *   - Custom attribute updates and segmentation
 *   - Communication preferences and consent management
 *   - Integration synchronization and data consistency
 *   - Performance tracking and conversion optimization
 *   - Quality assurance and data validation
 *   - Compliance updates and privacy management
 *   - Strategic planning and account development
 * 
 * #### Delete Lead
 * - **Lead Database Cleanup**: Remove leads for data management and compliance
 *   - Data privacy compliance and GDPR requirements
 *   - Duplicate lead removal and data deduplication
 *   - Opt-out request processing and consent management
 *   - Quality control and spam lead removal
 *   - System cleanup and database optimization
 *   - Compliance auditing and regulatory requirements
 *   - Data retention policy enforcement
 *   - Migration and system consolidation
 *   - Performance optimization and efficiency
 *   - Security compliance and data protection
 *   - Business rule enforcement and validation
 *   - Legal requirement compliance and documentation
 * 
 * ### User Operations
 * 
 * #### Create User
 * - **Customer Registration and Onboarding**: Create new user accounts and profiles
 *   - Customer registration and account activation
 *   - Product trial and freemium user onboarding
 *   - Team member and organizational user setup
 *   - Partner and vendor user account creation
 *   - Integration user and API access provisioning
 *   - Support agent and internal team member setup
 *   - Customer success and account management users
 *   - Training and certification program participants
 *   - Community and forum member registration
 *   - Event and webinar participant accounts
 *   - Feedback and survey participant setup
 *   - Beta testing and early access program users
 * 
 * #### Get User
 * - **Customer Profile Management**: Retrieve comprehensive user information and activity
 *   - Customer support and service history tracking
 *   - Product usage and engagement analytics
 *   - Purchase history and transaction tracking
 *   - Communication preferences and channel optimization
 *   - Support ticket history and resolution tracking
 *   - Feature adoption and product utilization
 *   - Satisfaction scores and feedback collection
 *   - Team collaboration and internal communication
 *   - Integration activity and API usage monitoring
 *   - Compliance and security access auditing
 *   - Performance metrics and success tracking
 *   - Relationship mapping and network analysis
 * 
 * #### Get All Users
 * - **User Database Analytics**: Comprehensive user analysis and management
 *   - Customer segmentation and cohort analysis
 *   - Product adoption and usage pattern analysis
 *   - Customer lifetime value and revenue tracking
 *   - Churn prediction and retention optimization
 *   - Support performance and satisfaction metrics
 *   - User engagement and activity monitoring
 *   - Feature utilization and product analytics
 *   - Customer success program effectiveness
 *   - Marketing campaign performance and attribution
 *   - Business intelligence and strategic planning
 *   - Compliance and regulatory reporting
 *   - Performance benchmarking and comparison
 * 
 * #### Update User
 * - **User Profile Maintenance**: Modify user information and track changes
 *   - Account upgrades and subscription changes
 *   - Profile updates and personal information maintenance
 *   - Permission changes and access control management
 *   - Communication preferences and notification settings
 *   - Team assignments and organizational changes
 *   - Custom attribute updates and segmentation
 *   - Integration synchronization and data consistency
 *   - Performance tracking and success metrics
 *   - Compliance updates and privacy management
 *   - Quality assurance and data validation
 *   - Support escalation and priority adjustments
 *   - Relationship updates and account management
 * 
 * #### Delete User
 * - **User Account Management**: Remove user accounts for compliance and cleanup
 *   - Account cancellation and offboarding processes
 *   - Data privacy compliance and right to erasure
 *   - Security incident response and access revocation
 *   - Duplicate account cleanup and data deduplication
 *   - Compliance auditing and regulatory requirements
 *   - System cleanup and database optimization
 *   - Migration and consolidation projects
 *   - Performance optimization and efficiency
 *   - Quality control and spam account removal
 *   - Legal requirement compliance and documentation
 *   - Business rule enforcement and validation
 *   - Risk management and security compliance
 * 
 * ## Use Cases
 * 
 * - **Customer Support Automation**: AI-powered chat support and ticket management
 * - **Sales Engagement**: Lead qualification and sales pipeline automation
 * - **Customer Onboarding**: Automated welcome sequences and product tours
 * - **Live Chat Support**: Real-time customer assistance and problem resolution
 * - **Lead Nurturing**: Behavioral triggers and personalized messaging campaigns
 * - **Customer Success Management**: Proactive engagement and retention programs
 * - **Marketing Automation**: Targeted messaging and campaign management
 * - **Knowledge Base Integration**: Self-service support and documentation access
 * - **Team Collaboration**: Internal communication and customer handoffs
 * - **Customer Feedback Collection**: Surveys and satisfaction measurement
 * - **Product Adoption**: Feature introduction and usage optimization
 * - **Churn Prevention**: Risk identification and retention strategies
 * - **Cross-sell and Upsell**: Revenue expansion and account growth
 * - **Customer Analytics**: Engagement tracking and behavior analysis
 * - **Multi-Channel Communication**: Unified messaging across touchpoints
 * 
 * ## Integration Patterns
 * 
 * ### CRM Integration
 * - **Lead and Customer Sync**: Bidirectional data synchronization with CRM systems
 * - **Sales Pipeline**: Convert chat leads to sales opportunities
 * - **Customer Journey**: Track complete customer lifecycle and touchpoints
 * - **Account Management**: Unified customer records and relationship tracking
 * 
 * ### Marketing Automation Integration
 * - **Campaign Coordination**: Align chat messaging with marketing campaigns
 * - **Lead Qualification**: Automated lead scoring and nurturing workflows
 * - **Behavioral Tracking**: Customer action triggers and personalized responses
 * - **Attribution Analysis**: Track marketing source and conversion paths
 * 
 * ### Customer Success Integration
 * - **Health Scoring**: Customer engagement and satisfaction monitoring
 * - **Onboarding Automation**: New customer welcome and training sequences
 * - **Retention Programs**: Proactive outreach and churn prevention
 * - **Expansion Opportunities**: Upsell and cross-sell identification
 * 
 * ### Analytics and Business Intelligence
 * - **Conversation Analytics**: Chat performance and customer satisfaction metrics
 * - **User Behavior**: Product usage and engagement pattern analysis
 * - **Revenue Attribution**: Chat impact on sales and revenue generation
 * - **Performance Dashboards**: Real-time metrics and KPI visualization
 * 
 * ## Conversational AI Features
 * 
 * - **Automated Chat Responses**: AI-powered instant responses and FAQs
 * - **Intent Recognition**: Natural language understanding and routing
 * - **Conversation Flows**: Guided chat experiences and decision trees
 * - **Escalation Management**: Seamless handoff to human agents
 * - **Multilingual Support**: Global customer communication capabilities
 * - **Sentiment Analysis**: Customer emotion detection and response optimization
 * - **Smart Suggestions**: AI-powered response recommendations for agents
 */

import { NodeTypeInfo } from '../../node-types.js';

export const intercomNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.intercom',
  displayName: 'Intercom',
  description: 'Integrate with Intercom customer messaging platform. Manage companies, leads, and users.',
  category: 'Action Nodes',
  subcategory: 'Customer Service & Support',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'user',
      description: 'The resource to operate on',
      options: [
        {
          name: 'Company',
          value: 'company',
          description: 'Operations on companies'
        },
        {
          name: 'Lead',
          value: 'lead',
          description: 'Operations on leads'
        },
        {
          name: 'User',
          value: 'user',
          description: 'Operations on users'
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
          resource: ['company']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new company'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get data of a company'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get data of all companies'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a company'
        },
        {
          name: 'Users',
          value: 'users',
          description: "List company's users"
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
          resource: ['lead']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new lead'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a lead'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get data of a lead'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get data of all leads'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a lead'
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
          resource: ['user']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new user'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a user'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get data of a user'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get data of all users'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update a user'
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
      name: 'intercomApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Intercom'
  },

  aliases: ['intercom', 'customer messaging', 'live chat', 'customer support', 'conversational ai'],
  
  examples: [
    {
      name: 'Create User Account',
      description: 'Create a new user in Intercom with profile information',
      workflow: {
        nodes: [
          {
            name: 'Intercom',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'user',
              operation: 'create',
              email: 'customer@example.com',
              name: 'John Doe',
              customAttributes: {
                plan: 'premium',
                signupDate: '2024-01-15'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Get All Leads',
      description: 'Retrieve all leads for sales pipeline analysis',
      workflow: {
        nodes: [
          {
            name: 'Intercom',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'lead',
              operation: 'getAll',
              returnAll: false,
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Update Company Information',
      description: 'Update company profile with new business details',
      workflow: {
        nodes: [
          {
            name: 'Intercom',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'company',
              operation: 'update',
              companyId: '{{$json.companyId}}',
              name: 'Updated Company Name',
              monthlySpend: 5000,
              customAttributes: {
                industry: 'Technology',
                employees: 150
              }
            }
          }
        ]
      }
    }
  ]
};

export default intercomNode;
