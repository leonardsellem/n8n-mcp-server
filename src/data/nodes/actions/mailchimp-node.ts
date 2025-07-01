/**
 * # Mailchimp
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Marketing & Communications
 * 
 * ## Description
 * 
 * Use the Mailchimp node to automate work in Mailchimp and integrate Mailchimp with other applications. 
 * n8n has built-in support for a wide range of Mailchimp features, including creating, updating, and 
 * deleting campaigns, as well as managing list groups and members. Mailchimp is a comprehensive 
 * email marketing platform that enables businesses to design, send, and analyze email campaigns 
 * with advanced automation and segmentation capabilities.
 * 
 * ## Key Features
 * 
 * - **Campaign Management**: Create, send, and track email marketing campaigns
 * - **List Management**: Organize and segment subscriber lists with advanced criteria
 * - **Member Management**: Add, update, and manage individual subscribers
 * - **Tag System**: Categorize and segment subscribers with flexible tagging
 * - **Group Organization**: Create list groups for better subscriber organization
 * - **Campaign Analytics**: Track open rates, click rates, and campaign performance
 * - **Automation Tools**: Set up drip campaigns and triggered email sequences
 * - **Template Library**: Pre-designed email templates for various industries
 * - **A/B Testing**: Test different campaign versions for optimization
 * - **Landing Pages**: Create dedicated landing pages for lead capture
 * - **Social Media Integration**: Connect campaigns with social media platforms
 * - **E-commerce Integration**: Track sales and revenue from email campaigns
 * - **Advanced Segmentation**: Target specific subscriber groups with precision
 * - **Compliance Tools**: GDPR, CAN-SPAM, and other regulatory compliance features
 * - **Reporting Dashboard**: Comprehensive analytics and performance insights
 * 
 * ## Credentials
 * 
 * Refer to [Mailchimp credentials](../../credentials/mailchimp/) for guidance on setting up authentication.
 * Supports API key authentication for secure access to Mailchimp accounts.
 * 
 * ## Operations
 * 
 * ### Campaign Operations
 * - **Delete Campaign**: Remove campaigns from account with confirmation
 * - **Get Campaign**: Retrieve specific campaign details and statistics
 * - **Get All Campaigns**: List all campaigns with filtering options
 * - **Replicate Campaign**: Create copies of existing campaigns for reuse
 * - **Create Resend Campaign**: Generate resend versions for non-openers
 * - **Send Campaign**: Launch campaigns to targeted subscriber lists
 * 
 * ### List Group Operations
 * - **Get All Groups**: Retrieve all list groups for organization and segmentation
 * 
 * ### Member Operations
 * - **Create Member**: Add new subscribers to email lists with profile data
 * - **Delete Member**: Remove subscribers from lists with opt-out handling
 * - **Get Member**: Retrieve individual subscriber details and activity
 * - **Get All Members**: List all subscribers with filtering and segmentation
 * - **Update Member**: Modify subscriber information and preferences
 * 
 * ### Member Tag Operations
 * - **Add Tags**: Apply tags to subscribers for segmentation and targeting
 * - **Remove Tags**: Remove tags from subscribers for list management
 * 
 * ## Common Integration Patterns
 * 
 * ### Email Marketing Automation
 * - Automated campaign creation from content management systems
 * - Lead capture integration from websites and landing pages
 * - E-commerce customer journey automation and lifecycle marketing
 * - Event-triggered email sequences and behavioral targeting
 * - Cross-platform subscriber synchronization and data management
 * - Performance tracking and ROI measurement across campaigns
 * - A/B testing automation and optimization workflows
 * - Compliance monitoring and opt-out management
 * - Personalization engine integration for dynamic content
 * - Social media integration for multi-channel marketing
 * - Customer feedback collection and survey automation
 * - Revenue tracking and attribution analysis
 * 
 * ### Customer Relationship Management
 * - CRM integration for unified customer profiles and communication history
 * - Sales pipeline integration with targeted email nurturing campaigns
 * - Customer support integration for proactive communication
 * - Onboarding sequence automation for new customers and users
 * - Retention campaign automation based on engagement metrics
 * - Win-back campaigns for inactive subscribers and customers
 * - Loyalty program integration and reward communication
 * - Product update and announcement distribution
 * - Survey and feedback collection for customer satisfaction
 * - Event promotion and registration management
 * - Content marketing distribution and engagement tracking
 * - Partnership and affiliate communication management
 * 
 * ### Business Process Integration
 * - Lead qualification and scoring based on email engagement
 * - Marketing qualified lead (MQL) identification and handoff
 * - Customer lifecycle stage progression and automated communication
 * - Product launch coordination and announcement campaigns
 * - Seasonal campaign planning and automated execution
 * - Content calendar integration for consistent communication
 * - Brand awareness campaigns and thought leadership content
 * - Competitive analysis and market intelligence distribution
 * - Investor relations and stakeholder communication
 * - Employee communication and internal marketing campaigns
 * - Partner and vendor relationship management
 * - Crisis communication and emergency notification systems
 * 
 * ## Example Use Cases
 * 
 * ### E-commerce Business
 * ```typescript
 * // Automated welcome series for new customers
 * const welcomeCampaign = await mailchimp.createCampaign({
 *   type: 'regular',
 *   subject: 'Welcome to Our Store!',
 *   listId: 'customer-list',
 *   templateId: 'welcome-template',
 *   segmentId: 'new-customers'
 * });
 * 
 * // Cart abandonment follow-up sequence
 * await mailchimp.createAutomationSequence({
 *   trigger: 'cart-abandonment',
 *   delay: '24 hours',
 *   campaigns: ['reminder', 'discount-offer', 'final-notice']
 * });
 * ```
 * 
 * ### SaaS Platform
 * ```typescript
 * // User onboarding email series
 * const onboardingCampaign = await mailchimp.createOnboardingSequence({
 *   listId: 'trial-users',
 *   sequence: [
 *     { day: 1, template: 'getting-started' },
 *     { day: 3, template: 'feature-highlights' },
 *     { day: 7, template: 'success-stories' },
 *     { day: 14, template: 'upgrade-prompt' }
 *   ]
 * });
 * 
 * // Feature announcement to segmented users
 * await mailchimp.sendFeatureAnnouncement({
 *   feature: 'new-dashboard',
 *   segments: ['power-users', 'enterprise-customers'],
 *   template: 'feature-announcement'
 * });
 * ```
 * 
 * ### Content Marketing
 * ```typescript
 * // Newsletter automation with content curation
 * const newsletter = await mailchimp.createNewsletterCampaign({
 *   frequency: 'weekly',
 *   contentSources: ['blog', 'social-media', 'industry-news'],
 *   segments: ['subscribers', 'customers', 'prospects'],
 *   template: 'newsletter-template'
 * });
 * 
 * // Event promotion campaign
 * await mailchimp.createEventCampaign({
 *   eventId: 'webinar-2024',
 *   phases: ['announcement', 'reminder', 'follow-up'],
 *   segments: ['interested-prospects', 'existing-customers']
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **Process Shopify new orders with Zoho CRM and Harvest**: E-commerce order processing
 * - **Add new HubSpot contacts to Mailchimp**: CRM integration and lead nurturing
 * - **Send or update new Mailchimp subscribers in HubSpot**: Bi-directional CRM sync
 * - **Basic Newsletter Setup**: Simple newsletter creation and distribution
 * - **Welcome Email Series**: New subscriber onboarding automation
 * - **Cart Abandonment Sequence**: E-commerce recovery campaigns
 * - **Event Promotion**: Webinar and event marketing workflows
 * - **Product Launch Campaign**: Multi-phase product announcement
 * - **Customer Feedback Collection**: Survey and review request automation
 * - **Seasonal Marketing**: Holiday and seasonal campaign automation
 * - **Win-back Campaign**: Re-engagement for inactive subscribers
 * - **Birthday and Anniversary**: Personalized celebration campaigns
 * 
 * ## Best Practices
 * 
 * ### Campaign Management
 * - Use descriptive campaign names with dates and target segments
 * - Implement consistent branding across all email templates and campaigns
 * - Test campaigns with small segments before full deployment
 * - Schedule campaigns for optimal send times based on audience behavior
 * - Use merge tags for personalization and dynamic content insertion
 * - Implement A/B testing for subject lines, content, and send times
 * - Set up automation rules for triggered campaigns and sequences
 * - Monitor campaign performance and adjust strategies based on metrics
 * - Maintain clean and up-to-date subscriber lists with regular cleaning
 * - Implement proper unsubscribe handling and preference management
 * - Use segmentation for targeted and relevant campaign delivery
 * - Create template libraries for consistent campaign creation
 * 
 * ### List Management
 * - Implement double opt-in for new subscriber verification and compliance
 * - Use tags and segments for sophisticated audience targeting
 * - Regularly clean lists to remove inactive and bouncing subscribers
 * - Set up preference centers for subscriber self-management
 * - Implement GDPR compliance with proper consent tracking
 * - Use lead magnets and incentives for list growth strategies
 * - Monitor list health metrics including growth and churn rates
 * - Implement re-engagement campaigns for inactive subscribers
 * - Use progressive profiling to gather additional subscriber information
 * - Set up automated list management workflows for efficiency
 * - Create backup and recovery procedures for subscriber data
 * - Implement cross-platform synchronization for unified customer profiles
 * 
 * ### Integration Strategy
 * - Connect CRM systems for unified customer relationship management
 * - Integrate e-commerce platforms for purchase behavior tracking
 * - Link analytics tools for comprehensive campaign performance measurement
 * - Connect social media platforms for multi-channel marketing coordination
 * - Integrate customer support systems for proactive communication
 * - Link content management systems for automated content distribution
 * - Connect lead generation tools for seamless lead nurturing workflows
 * - Integrate marketing automation platforms for advanced workflow capabilities
 * - Link survey and feedback tools for customer satisfaction measurement
 * - Connect event management systems for comprehensive event marketing
 * - Integrate payment systems for donation and transaction tracking
 * - Link business intelligence tools for strategic marketing insights
 */

export const mailchimpNode = {
  displayName: 'Mailchimp',
  name: 'mailchimp',
  group: ['transform'],
  version: 1,
  icon: 'file:mailchimp.svg',
  description: 'Comprehensive email marketing platform with campaign management, list segmentation, and automation tools',
  defaults: {
    name: 'Mailchimp',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'mailchimpApi',
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
          name: 'Campaign',
          value: 'campaign',
          description: 'Email marketing campaigns with tracking and analytics',
        },
        {
          name: 'List Group',
          value: 'listGroup',
          description: 'Subscriber list organization and segmentation',
        },
        {
          name: 'Member',
          value: 'member',
          description: 'Individual subscribers with profile management',
        },
        {
          name: 'Member Tag',
          value: 'memberTag',
          description: 'Subscriber categorization and targeting tags',
        },
      ],
      default: 'member',
    },
  ],
};
