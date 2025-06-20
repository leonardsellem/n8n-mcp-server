import { NodeTypeInfo } from '../node-types.js';

export const profitwellNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.profitwell',
  displayName: 'ProfitWell',
  description: 'Use the ProfitWell node to automate work in ProfitWell, and integrate ProfitWell with other applications. n8n supports getting your company\'s account settings and retrieving financial metrics from ProfitWell.',
  category: 'Finance & Accounting',
  subcategory: 'Analytics',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'company',
      description: 'The resource to operate on',
      options: [
        { name: 'Company', value: 'company', description: 'Work with company account settings' },
        { name: 'Metric', value: 'metric', description: 'Retrieve financial metrics' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        // Company operations
        { name: 'Get', value: 'get', description: 'Get your company\'s ProfitWell account settings' },
        // Metric operations
        { name: 'Get', value: 'get', description: 'Retrieve financial metric broken down by day' }
      ]
    },
    {
      name: 'metricType',
      displayName: 'Metric Type',
      type: 'options',
      required: false,
      default: 'monthly_recurring_revenue',
      description: 'The type of financial metric to retrieve',
      options: [
        { name: 'Monthly Recurring Revenue', value: 'monthly_recurring_revenue', description: 'Get MRR data' },
        { name: 'Annual Recurring Revenue', value: 'annual_recurring_revenue', description: 'Get ARR data' },
        { name: 'Customer Lifetime Value', value: 'customer_lifetime_value', description: 'Get CLV data' },
        { name: 'Average Revenue Per User', value: 'average_revenue_per_user', description: 'Get ARPU data' },
        { name: 'Churn Rate', value: 'churn_rate', description: 'Get churn rate data' },
        { name: 'Active Customers', value: 'active_customers', description: 'Get active customer count' },
        { name: 'New Customers', value: 'new_customers', description: 'Get new customer count' },
        { name: 'Churned Customers', value: 'churned_customers', description: 'Get churned customer count' }
      ]
    },
    {
      name: 'period',
      displayName: 'Period',
      type: 'options',
      required: false,
      default: 'current_month',
      description: 'The time period for the metric data',
      options: [
        { name: 'Current Month', value: 'current_month', description: 'Data for the current month' },
        { name: 'Last Month', value: 'last_month', description: 'Data for the last month' },
        { name: 'Last 3 Months', value: 'last_3_months', description: 'Data for the last 3 months' },
        { name: 'Last 6 Months', value: 'last_6_months', description: 'Data for the last 6 months' },
        { name: 'Last 12 Months', value: 'last_12_months', description: 'Data for the last 12 months' }
      ]
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Start date for metric data (YYYY-MM-DD format)'
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      type: 'string',
      required: false,
      default: '',
      description: 'End date for metric data (YYYY-MM-DD format)'
    },
    {
      name: 'currency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'Currency code for financial metrics'
    },
    {
      name: 'planId',
      displayName: 'Plan ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter metrics by specific plan ID'
    },
    {
      name: 'interval',
      displayName: 'Interval',
      type: 'options',
      required: false,
      default: 'day',
      description: 'Time interval for data aggregation',
      options: [
        { name: 'Day', value: 'day', description: 'Daily breakdown' },
        { name: 'Week', value: 'week', description: 'Weekly breakdown' },
        { name: 'Month', value: 'month', description: 'Monthly breakdown' }
      ]
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
      description: 'The processed ProfitWell data'
    }
  ],
  credentials: ['profitwell'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Company Settings',
      description: 'Retrieve your company\'s ProfitWell account settings',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'company',
              operation: 'get'
            }
          }
        ]
      }
    },
    {
      name: 'Get Monthly Recurring Revenue',
      description: 'Retrieve MRR data for the current month',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'metric',
              operation: 'get',
              metricType: 'monthly_recurring_revenue',
              period: 'current_month',
              interval: 'day'
            }
          }
        ]
      }
    },
    {
      name: 'Get Churn Rate Analysis',
      description: 'Retrieve churn rate data for the last 6 months',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'metric',
              operation: 'get',
              metricType: 'churn_rate',
              period: 'last_6_months',
              interval: 'month'
            }
          }
        ]
      }
    },
    {
      name: 'Get Customer Metrics',
      description: 'Retrieve active customer count data',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'metric',
              operation: 'get',
              metricType: 'active_customers',
              period: 'current_month',
              interval: 'day'
            }
          }
        ]
      }
    },
    {
      name: 'Get Plan-Specific Metrics',
      description: 'Retrieve metrics filtered by specific plan',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'metric',
              operation: 'get',
              metricType: 'monthly_recurring_revenue',
              period: 'last_3_months',
              interval: 'month',
              planId: 'plan_123',
              currency: 'USD'
            }
          }
        ]
      }
    },
    {
      name: 'Get Custom Date Range Metrics',
      description: 'Retrieve metrics for a custom date range',
      workflow: {
        nodes: [
          {
            name: 'ProfitWell',
            type: 'n8n-nodes-base.profitwell',
            parameters: {
              resource: 'metric',
              operation: 'get',
              metricType: 'average_revenue_per_user',
              startDate: '2024-01-01',
              endDate: '2024-03-31',
              interval: 'week'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const profitwellNodes: NodeTypeInfo[] = [profitwellNode];

// Export individual actions for the ProfitWell node
export const profitwellActions = [
  // Company actions
  'get_company_settings',
  // Metric actions
  'get_monthly_recurring_revenue',
  'get_annual_recurring_revenue',
  'get_customer_lifetime_value',
  'get_average_revenue_per_user',
  'get_churn_rate',
  'get_active_customers',
  'get_new_customers',
  'get_churned_customers'
];

// No trigger node exists for ProfitWell (based on documentation)
export const profitwellTriggers: string[] = [];