/**
 * Google Analytics Node - Essential Web Analytics Platform
 * 
 * Comprehensive Google Analytics 4 (GA4) API integration for web analytics,
 * reporting, and data analysis.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googleAnalyticsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.googleAnalytics',
  displayName: 'Google Analytics',
  description: 'Integrate with Google Analytics 4 for web analytics, custom reports, and data analysis',
  category: 'Analytics',
  subcategory: 'Web Analytics',
  
  properties: [
    // Property ID (GA4)
    {
      name: 'propertyId',
      displayName: 'Property ID',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Google Analytics 4 Property ID (format: properties/123456789)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'report',
      options: [
        { name: 'Report', value: 'report' },
        { name: 'Real-time Report', value: 'realtimeReport' },
        { name: 'Property', value: 'property' },
        { name: 'Dimension', value: 'dimension' },
        { name: 'Metric', value: 'metric' },
        { name: 'Audience', value: 'audience' },
        { name: 'Custom Event', value: 'customEvent' }
      ],
      description: 'Choose the Google Analytics resource to work with'
    },

    // Report operations
    {
      name: 'reportOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'run',
      displayOptions: {
        show: { resource: ['report'] }
      },
      description: 'Select the type of report operation to perform',
      options: [
        { name: 'Run Report', value: 'run' },
        { name: 'Run Pivot Report', value: 'runPivot' },
        { name: 'Batch Run Reports', value: 'batchRun' }
      ]
    },

    // Real-time report operations
    {
      name: 'realtimeOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'run',
      displayOptions: {
        show: { resource: ['realtimeReport'] }
      },
      description: 'Select the real-time report operation to perform',
      options: [
        { name: 'Run Real-time Report', value: 'run' }
      ]
    },

    // Date ranges
    {
      name: 'dateRanges',
      displayName: 'Date Ranges',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['report'],
          reportOperation: ['run', 'runPivot', 'batchRun']
        }
      },
      description: 'Define one or more date ranges for the report analysis',
      options: [
        {
          name: 'dateRange',
          displayName: 'Date Range',
          values: [
            {
              name: 'startDate',
              displayName: 'Start Date',
              type: 'string',
              required: true,
              default: '7daysAgo',
              description: 'Start date (YYYY-MM-DD or relative like "7daysAgo")'
            },
            {
              name: 'endDate',
              displayName: 'End Date',
              type: 'string',
              required: true,
              default: 'today',
              description: 'End date (YYYY-MM-DD or relative like "today")'
            },
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              required: false,
              default: '',
              description: 'Optional name for this date range'
            }
          ]
        }
      ]
    },

    // Dimensions
    {
      name: 'dimensions',
      displayName: 'Dimensions',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['report', 'realtimeReport'],
          operation: ['run', 'runPivot', 'batchRun']
        }
      },
      description: 'Define dimensions to segment and analyze your data',
      options: [
        {
          name: 'dimension',
          displayName: 'Dimension',
          values: [
            {
              name: 'name',
              displayName: 'Dimension Name',
              type: 'options',
              required: true,
              default: 'country',
              options: [
                { name: 'Country', value: 'country' },
                { name: 'City', value: 'city' },
                { name: 'Page Title', value: 'pageTitle' },
                { name: 'Page Path', value: 'pagePath' },
                { name: 'Source', value: 'source' },
                { name: 'Medium', value: 'medium' },
                { name: 'Campaign', value: 'campaignName' },
                { name: 'Device Category', value: 'deviceCategory' },
                { name: 'Browser', value: 'browser' },
                { name: 'Operating System', value: 'operatingSystem' },
                { name: 'Date', value: 'date' },
                { name: 'Hour', value: 'hour' },
                { name: 'Event Name', value: 'eventName' },
                { name: 'User Type', value: 'newVsReturning' },
                { name: 'Age', value: 'userAgeBracket' },
                { name: 'Gender', value: 'userGender' },
                { name: 'Language', value: 'language' },
                { name: 'Screen Resolution', value: 'screenResolution' }
              ],
              description: 'The dimension to include in the report'
            }
          ]
        }
      ]
    },

    // Metrics
    {
      name: 'metrics',
      displayName: 'Metrics',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['report', 'realtimeReport'],
          operation: ['run', 'runPivot', 'batchRun']
        }
      },
      description: 'Define metrics to measure and analyze performance data',
      options: [
        {
          name: 'metric',
          displayName: 'Metric',
          values: [
            {
              name: 'name',
              displayName: 'Metric Name',
              type: 'options',
              required: true,
              default: 'activeUsers',
              options: [
                { name: 'Active Users', value: 'activeUsers' },
                { name: 'New Users', value: 'newUsers' },
                { name: 'Sessions', value: 'sessions' },
                { name: 'Engaged Sessions', value: 'engagedSessions' },
                { name: 'Screen Page Views', value: 'screenPageViews' },
                { name: 'Views', value: 'views' },
                { name: 'Bounce Rate', value: 'bounceRate' },
                { name: 'Session Duration', value: 'averageSessionDuration' },
                { name: 'Event Count', value: 'eventCount' },
                { name: 'Conversions', value: 'conversions' },
                { name: 'Total Revenue', value: 'totalRevenue' },
                { name: 'Purchase Revenue', value: 'purchaseRevenue' },
                { name: 'ECPM', value: 'publisherAdImpressionClicks' },
                { name: 'Ad Revenue', value: 'adUnitExposure' },
                { name: 'Engagement Rate', value: 'engagementRate' },
                { name: 'Events Per Session', value: 'eventsPerSession' }
              ],
              description: 'The metric to include in the report'
            }
          ]
        }
      ]
    },

    // Filters
    {
      name: 'dimensionFilter',
      displayName: 'Dimension Filter',
      type: 'string',
      required: false,
      default: '',
      displayOptions: {
        show: { 
          resource: ['report'],
          reportOperation: ['run', 'runPivot']
        }
      },
      description: 'Filter expression for dimensions (e.g., "country==US")'
    },

    {
      name: 'metricFilter',
      displayName: 'Metric Filter',
      type: 'string',
      required: false,
      default: '',
      displayOptions: {
        show: { 
          resource: ['report'],
          reportOperation: ['run', 'runPivot']
        }
      },
      description: 'Filter expression for metrics (e.g., "sessions>100")'
    },

    // Order by
    {
      name: 'orderBys',
      displayName: 'Order By',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['report'],
          reportOperation: ['run', 'runPivot']
        }
      },
      description: 'Define how to sort the report results',
      options: [
        {
          name: 'orderBy',
          displayName: 'Order By',
          values: [
            {
              name: 'dimension',
              displayName: 'Dimension Name',
              type: 'string',
              required: false,
              default: '',
              description: 'Dimension to order by'
            },
            {
              name: 'metric',
              displayName: 'Metric Name',
              type: 'string',
              required: false,
              default: '',
              description: 'Metric to order by'
            },
            {
              name: 'desc',
              displayName: 'Descending',
              type: 'boolean',
              required: false,
              default: true,
              description: 'Sort in descending order'
            }
          ]
        }
      ]
    },

    // Limit and offset
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 10000,
      displayOptions: {
        show: { 
          resource: ['report', 'realtimeReport'],
          operation: ['run', 'runPivot']
        }
      },
      description: 'Maximum number of rows to return'
    },

    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      displayOptions: {
        show: { 
          resource: ['report'],
          reportOperation: ['run', 'runPivot']
        }
      },
      description: 'Number of rows to skip'
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},description: 'Configure additional report options and settings',
      options: [
        {
          name: 'keepEmptyRows',
          displayName: 'Keep Empty Rows',
          type: 'boolean',
          required: false,
          description: 'Include rows with no data'
        },
        {
          name: 'returnPropertyQuota',
          displayName: 'Return Property Quota',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Include quota information in response'
        },
        {
          name: 'currencyCode',
          displayName: 'Currency Code',
          type: 'string',
          required: false,
          default: 'USD',
          description: 'Currency code for revenue metrics'
        },
        {
          name: 'cohortSpec',
          displayName: 'Cohort Specification',
          type: 'string',
          required: false,
          default: '',
          description: 'JSON specification for cohort analysis'
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
      displayName: 'Output',
      description: 'Google Analytics report data'
    }
  ],

  credentials: [
    {
      name: 'googleAnalyticsOAuth2',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Google Analytics'
  },

  aliases: ['analytics', 'ga4', 'web analytics', 'reporting', 'metrics'],
  
  examples: [
    {
      name: 'Get Page Views by Country',
      description: 'Get page views broken down by country for the last 7 days',
      workflow: {
        nodes: [
          {
            name: 'Get Page Views',
            type: 'n8n-nodes-base.googleAnalytics',
            parameters: {
              propertyId: 'properties/123456789',
              resource: 'report',
              reportOperation: 'run',
              dateRanges: {
                dateRange: [
                  {
                    startDate: '7daysAgo',
                    endDate: 'today',
                    name: 'last_7_days'
                  }
                ]
              },
              dimensions: {
                dimension: [
                  { name: 'country' }
                ]
              },
              metrics: {
                metric: [
                  { name: 'screenPageViews' },
                  { name: 'activeUsers' }
                ]
              },
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Get Real-time Users',
      description: 'Get current active users on the website',
      workflow: {
        nodes: [
          {
            name: 'Real-time Users',
            type: 'n8n-nodes-base.googleAnalytics',
            parameters: {
              propertyId: 'properties/123456789',
              resource: 'realtimeReport',
              realtimeOperation: 'run',
              dimensions: {
                dimension: [
                  { name: 'country' },
                  { name: 'deviceCategory' }
                ]
              },
              metrics: {
                metric: [
                  { name: 'activeUsers' }
                ]
              },
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Get Traffic Sources',
      description: 'Analyze traffic sources and mediums',
      workflow: {
        nodes: [
          {
            name: 'Traffic Sources',
            type: 'n8n-nodes-base.googleAnalytics',
            parameters: {
              propertyId: 'properties/123456789',
              resource: 'report',
              reportOperation: 'run',
              dateRanges: {
                dateRange: [
                  {
                    startDate: '30daysAgo',
                    endDate: 'today'
                  }
                ]
              },
              dimensions: {
                dimension: [
                  { name: 'source' },
                  { name: 'medium' },
                  { name: 'campaignName' }
                ]
              },
              metrics: {
                metric: [
                  { name: 'sessions' },
                  { name: 'newUsers' },
                  { name: 'conversions' }
                ]
              },
              orderBys: {
                orderBy: [
                  {
                    metric: 'sessions',
                    desc: true
                  }
                ]
              },
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Get E-commerce Performance',
      description: 'Analyze e-commerce metrics and revenue',
      workflow: {
        nodes: [
          {
            name: 'E-commerce Report',
            type: 'n8n-nodes-base.googleAnalytics',
            parameters: {
              propertyId: 'properties/123456789',
              resource: 'report',
              reportOperation: 'run',
              dateRanges: {
                dateRange: [
                  {
                    startDate: '7daysAgo',
                    endDate: 'today'
                  }
                ]
              },
              dimensions: {
                dimension: [
                  { name: 'date' }
                ]
              },
              metrics: {
                metric: [
                  { name: 'totalRevenue' },
                  { name: 'purchaseRevenue' },
                  { name: 'conversions' },
                  { name: 'sessions' }
                ]
              },
              options: {
                currencyCode: 'USD'
              }
            }
          }
        ]
      }
    }
  ]
};

export default googleAnalyticsNode;