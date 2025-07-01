/**
 * # Google Analytics
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Analytics & Tracking
 * 
 * ## Description
 * 
 * Use the Google Analytics node to automate work in Google Analytics and integrate Google Analytics 
 * with other applications. n8n has built-in support for a wide range of Google Analytics features, 
 * including returning reports and user activities. Google Analytics is Google's comprehensive web 
 * analytics platform that tracks and reports website traffic, user behavior, and conversion metrics.
 * 
 * ## Key Features
 * 
 * - **Real-time Analytics**: Monitor website traffic and user activity in real-time
 * - **Audience Insights**: Detailed demographics, interests, and behavior patterns
 * - **Acquisition Tracking**: Traffic source analysis and campaign performance
 * - **Behavior Analytics**: Page views, session duration, and user flow analysis
 * - **Conversion Tracking**: Goal completions and e-commerce transaction monitoring
 * - **Custom Dimensions**: Track custom business metrics and user attributes
 * - **Event Tracking**: Monitor specific user interactions and engagements
 * - **Cohort Analysis**: User retention and lifecycle behavior insights
 * - **Attribution Modeling**: Multi-channel conversion path analysis
 * - **Audience Segmentation**: Create custom audience segments for analysis
 * - **Dashboard Creation**: Build custom reports and data visualizations
 * - **Data Export**: Extract analytics data for external analysis and reporting
 * - **Integration Hub**: Connect with Google Ads, Search Console, and other platforms
 * - **Mobile App Analytics**: Track iOS and Android app usage and performance
 * - **E-commerce Analytics**: Revenue tracking and product performance analysis
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Credentials
 * 
 * Refer to [Google Analytics credentials](../../credentials/google/) for guidance on setting up authentication.
 * Supports Google OAuth2 authentication for secure access to Analytics accounts.
 * 
 * ## Operations
 * 
 * ### Report Operations
 * - **Get Report**: Retrieve analytics reports with custom dimensions, metrics, and filters
 * 
 * ### User Activity Operations
 * - **Search User Activity**: Query specific user interactions and behavior patterns
 * 
 * ## Common Integration Patterns
 * 
 * ### Marketing Analytics Automation
 * - Automated daily, weekly, and monthly reporting for stakeholders
 * - Campaign performance tracking across multiple channels and platforms
 * - ROI calculation and attribution analysis for marketing investments
 * - Lead quality assessment and conversion funnel optimization
 * - A/B testing results analysis and statistical significance validation
 * - Customer acquisition cost (CAC) and lifetime value (LTV) calculations
 * - Seasonal trend analysis and forecasting for business planning
 * - Competitive analysis and market share tracking
 * - Social media integration for comprehensive digital marketing analytics
 * - Cross-platform user journey mapping and attribution modeling
 * - Budget allocation optimization based on performance data
 * - Alert systems for significant metric changes and anomalies
 * 
 * ### Business Intelligence Integration
 * - Data warehouse integration for comprehensive business analytics
 * - Executive dashboard creation with key performance indicators
 * - Financial reporting integration with revenue and cost analysis
 * - Customer segmentation analysis for personalization and targeting
 * - Product performance tracking and inventory optimization insights
 * - Geographic analysis for market expansion and localization strategies
 * - User experience optimization through behavior flow analysis
 * - Content performance evaluation and content strategy optimization
 * - Sales funnel analysis and conversion rate optimization
 * - Customer support integration for user experience correlation
 * - Operational efficiency measurement and process optimization
 * - Strategic planning support with historical trend analysis
 * 
 * ### Automated Reporting Systems
 * - Scheduled report generation and distribution to stakeholders
 * - Real-time alert systems for critical metric thresholds
 * - Custom KPI tracking and goal progress monitoring
 * - Automated insights generation using AI and machine learning
 * - Cross-platform data consolidation for unified reporting
 * - Performance benchmarking against industry standards
 * - Data quality monitoring and anomaly detection systems
 * - Regulatory compliance reporting for data governance
 * - Client reporting automation for agencies and consultants
 * - Board-level executive summary generation and distribution
 * - Team performance tracking and productivity measurement
 * - Budget vs. actual performance analysis and variance reporting
 * 
 * ## Example Use Cases
 * 
 * ### E-commerce Business
 * ```typescript
 * // Daily sales performance report
 * const salesReport = await googleAnalytics.getReport({
 *   viewId: 'ecommerce-view',
 *   dateRange: 'yesterday',
 *   metrics: ['sessions', 'transactions', 'revenue', 'conversion-rate'],
 *   dimensions: ['source', 'medium', 'campaign'],
 *   segments: ['converters', 'non-converters']
 * });
 * 
 * // Customer behavior analysis
 * await googleAnalytics.analyzeCustomerJourney({
 *   cohort: 'new-customers',
 *   timeframe: 'last-30-days',
 *   touchpoints: ['landing-page', 'product-page', 'checkout']
 * });
 * ```
 * 
 * ### SaaS Platform
 * ```typescript
 * // User engagement tracking
 * const engagementReport = await googleAnalytics.getEngagementMetrics({
 *   viewId: 'saas-app',
 *   metrics: ['active-users', 'session-duration', 'feature-usage'],
 *   dimensions: ['user-type', 'plan-tier', 'device-category'],
 *   dateRange: 'last-7-days'
 * });
 * 
 * // Churn prediction analysis
 * await googleAnalytics.analyzeChurnIndicators({
 *   userSegments: ['trial-users', 'paid-users'],
 *   behaviors: ['login-frequency', 'feature-adoption', 'support-tickets']
 * });
 * ```
 * 
 * ### Content Marketing
 * ```typescript
 * // Content performance analysis
 * const contentReport = await googleAnalytics.getContentMetrics({
 *   viewId: 'blog-site',
 *   metrics: ['page-views', 'unique-page-views', 'time-on-page', 'bounce-rate'],
 *   dimensions: ['page-title', 'content-category', 'author'],
 *   filters: ['content-type==blog-post']
 * });
 * 
 * // SEO performance tracking
 * await googleAnalytics.trackSEOMetrics({
 *   organicTraffic: true,
 *   keywords: true,
 *   landingPages: true,
 *   searchConsoleIntegration: true
 * });
 * ```
 * 
 * ## Templates and Examples
 * 
 * - **AI Marketing Report (Google Analytics & Ads, Meta Ads)**: Comprehensive automated reporting
 * - **Automate Google Analytics Reporting**: Scheduled analytics report generation
 * - **Google Analytics Data Report with AI**: AI-enhanced analytics insights and recommendations
 * - **Basic Traffic Analysis**: Simple website traffic monitoring and reporting
 * - **E-commerce Performance Dashboard**: Revenue and conversion tracking automation
 * - **Campaign Attribution Analysis**: Multi-channel marketing performance evaluation
 * - **User Behavior Funnel Analysis**: Conversion funnel optimization and analysis
 * - **Content Performance Tracking**: Editorial and content marketing analytics
 * - **Mobile App Analytics**: iOS and Android app usage and engagement tracking
 * - **Real-time Alert System**: Automated notifications for significant metric changes
 * - **Customer Segment Analysis**: Audience segmentation and targeting insights
 * - **Competitive Benchmarking**: Market position and performance comparison
 * 
 * ## Best Practices
 * 
 * ### Data Collection Setup
 * - Implement proper goal and event tracking for business objectives
 * - Set up enhanced e-commerce tracking for detailed transaction analysis
 * - Configure custom dimensions for business-specific data requirements
 * - Use UTM parameters consistently for accurate campaign attribution
 * - Implement cross-domain tracking for comprehensive user journey analysis
 * - Set up audience segments for targeted analysis and remarketing
 * - Configure data filters to exclude internal traffic and spam
 * - Establish proper view structure with raw, master, and test views
 * - Implement Google Tag Manager for flexible tracking management
 * - Set up conversion tracking for all important business actions
 * - Use annotations to mark significant events and changes
 * - Regularly audit tracking implementation for data quality assurance
 * 
 * ### Reporting Strategy
 * - Create custom reports focused on specific business questions and KPIs
 * - Set up automated alerts for critical metric thresholds and anomalies
 * - Use cohort analysis for understanding user retention and lifecycle value
 * - Implement attribution modeling for accurate marketing channel evaluation
 * - Create dashboard views for different stakeholder groups and needs
 * - Schedule regular data exports for backup and external analysis
 * - Use sampling and data freshness settings appropriate for analysis needs
 * - Implement data validation processes to ensure reporting accuracy
 * - Create documentation for report definitions and calculation methodologies
 * - Establish baseline metrics and benchmarks for performance comparison
 * - Use advanced segments for deeper insights into user behavior patterns
 * - Implement A/B testing frameworks for continuous optimization
 * 
 * ### Integration Architecture
 * - Connect with Google Ads for comprehensive paid advertising analysis
 * - Integrate with Search Console for complete organic search performance
 * - Link with CRM systems for sales attribution and customer lifecycle tracking
 * - Connect with email marketing platforms for campaign performance correlation
 * - Integrate with customer support systems for user experience analysis
 * - Link with business intelligence tools for advanced analytics and modeling
 * - Connect with data warehouses for long-term data storage and analysis
 * - Integrate with marketing automation platforms for lead scoring and nurturing
 * - Link with social media management tools for comprehensive digital marketing insights
 * - Connect with e-commerce platforms for detailed product and sales analysis
 * - Integrate with content management systems for editorial performance tracking
 * - Link with financial systems for revenue attribution and ROI calculation
 */

export const googleAnalyticsNode = {
  displayName: 'Google Analytics',
  name: 'googleAnalytics',
  group: ['transform'],
  version: 1,
  icon: 'file:googleanalytics.svg',
  description: 'Comprehensive web analytics platform for tracking website traffic, user behavior, and conversion metrics',
  defaults: {
    name: 'Google Analytics',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'googleAnalyticsOAuth2',
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
          name: 'Report',
          value: 'report',
          description: 'Analytics reports with custom dimensions and metrics',
        },
        {
          name: 'User Activity',
          value: 'userActivity',
          description: 'Specific user interactions and behavior patterns',
        },
      ],
      default: 'report',
    },
  ],
};
