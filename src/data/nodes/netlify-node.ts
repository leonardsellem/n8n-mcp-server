import { NodeTypeInfo } from '../node-types.js';

export const netlifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.netlify',
  displayName: 'Netlify',
  description: 'Use the Netlify node to automate work in Netlify, and integrate Netlify with other applications. n8n has built-in support for a wide range of Netlify features, including getting and cancelling deployments, as well as deleting, and getting sites.',
  category: 'Hosting',
  subcategory: 'Platform',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'deploy',
      description: 'The resource to operate on',
      options: [
        { name: 'Deploy', value: 'deploy', description: 'Operations on deployments' },
        { name: 'Site', value: 'site', description: 'Operations on sites' }
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
        // Deploy operations
        { name: 'Cancel a deployment', value: 'cancel', description: 'Cancel a specific deployment' },
        { name: 'Create a new deployment', value: 'create', description: 'Create a new deployment' },
        { name: 'Get a deployment', value: 'get', description: 'Get information about a deployment' },
        { name: 'Get all deployments', value: 'getAll', description: 'Get all deployments for a site' },
        // Site operations
        { name: 'Delete a site', value: 'delete', description: 'Delete a site' },
        { name: 'Get a site', value: 'getSite', description: 'Get information about a site' },
        { name: 'Get all sites', value: 'getAllSites', description: 'Get all sites' }
      ]
    },
    {
      name: 'siteId',
      displayName: 'Site ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the site'
    },
    {
      name: 'deployId',
      displayName: 'Deploy ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the deployment'
    },
    {
      name: 'files',
      displayName: 'Files',
      type: 'json',
      required: false,
      default: '{}',
      description: 'Files to deploy (for create deployment operation)'
    },
    {
      name: 'draft',
      displayName: 'Draft',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to create a draft deployment'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title for the deployment'
    },
    {
      name: 'returnAll',
      displayName: 'Return All',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to return all results or limit them'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
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
      description: 'The processed Netlify data'
    }
  ],
  credentials: ['netlify'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get All Sites',
      description: 'Retrieve all sites from your Netlify account',
      workflow: {
        nodes: [
          {
            name: 'Netlify',
            type: 'n8n-nodes-base.netlify',
            parameters: {
              resource: 'site',
              operation: 'getAllSites'
            }
          }
        ]
      }
    },
    {
      name: 'Get Site Information',
      description: 'Get detailed information about a specific site',
      workflow: {
        nodes: [
          {
            name: 'Netlify',
            type: 'n8n-nodes-base.netlify',
            parameters: {
              resource: 'site',
              operation: 'getSite',
              siteId: 'your-site-id'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Deployments',
      description: 'Get all deployments for a specific site',
      workflow: {
        nodes: [
          {
            name: 'Netlify',
            type: 'n8n-nodes-base.netlify',
            parameters: {
              resource: 'deploy',
              operation: 'getAll',
              siteId: 'your-site-id',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Create New Deployment',
      description: 'Create a new deployment for a site',
      workflow: {
        nodes: [
          {
            name: 'Netlify',
            type: 'n8n-nodes-base.netlify',
            parameters: {
              resource: 'deploy',
              operation: 'create',
              siteId: 'your-site-id',
              title: 'Automated deployment',
              files: '{"index.html": "<html><body>Hello World</body></html>"}'
            }
          }
        ]
      }
    },
    {
      name: 'Cancel Deployment',
      description: 'Cancel a specific deployment',
      workflow: {
        nodes: [
          {
            name: 'Netlify',
            type: 'n8n-nodes-base.netlify',
            parameters: {
              resource: 'deploy',
              operation: 'cancel',
              deployId: 'your-deploy-id'
            }
          }
        ]
      }
    }
  ]
};

export const netlifyTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.netlifytrigger',
  displayName: 'Netlify Trigger',
  description: 'Netlify offers hosting and serverless backend services for web applications and static websites. Use this trigger to listen for Netlify webhook events.',
  category: 'Hosting',
  subcategory: 'Platform',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['deploy_created'],
      description: 'The events to listen for',
      options: [
        { name: 'Deploy Created', value: 'deploy_created', description: 'Triggered when a new deployment is created' },
        { name: 'Deploy Started', value: 'deploy_started', description: 'Triggered when a deployment starts building' },
        { name: 'Deploy Building', value: 'deploy_building', description: 'Triggered when a deployment is building' },
        { name: 'Deploy Ready', value: 'deploy_ready', description: 'Triggered when a deployment is ready' },
        { name: 'Deploy Failed', value: 'deploy_failed', description: 'Triggered when a deployment fails' },
        { name: 'Site Created', value: 'site_created', description: 'Triggered when a new site is created' },
        { name: 'Site Deleted', value: 'site_deleted', description: 'Triggered when a site is deleted' }
      ]
    },
    {
      name: 'siteId',
      displayName: 'Site ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Only trigger for events from this specific site (leave empty for all sites)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Netlify webhook event data'
    }
  ],
  credentials: ['netlify'],
  regularNode: false,
  codeable: false,
  triggerNode: true,
  examples: [
    {
      name: 'Deploy Status Notifications',
      description: 'Get notified when deployments succeed or fail',
      workflow: {
        nodes: [
          {
            name: 'Netlify Trigger',
            type: 'n8n-nodes-base.netlifytrigger',
            parameters: {
              events: ['deploy_ready', 'deploy_failed']
            }
          }
        ]
      }
    },
    {
      name: 'Site Specific Deploy Trigger',
      description: 'Monitor deployments for a specific site',
      workflow: {
        nodes: [
          {
            name: 'Netlify Trigger',
            type: 'n8n-nodes-base.netlifytrigger',
            parameters: {
              events: ['deploy_created', 'deploy_ready'],
              siteId: 'your-site-id'
            }
          }
        ]
      }
    }
  ]
};

// Export all Netlify nodes as an array for easier importing
export const netlifyNodes: NodeTypeInfo[] = [
  netlifyNode,
  netlifyTriggerNode
];

// Export individual actions for the main Netlify node
export const netlifyActions = [
  'cancel_deployment',
  'create_deployment',
  'get_deployment',
  'get_all_deployments',
  'delete_site',
  'get_site',
  'get_all_sites'
];

// Export trigger events
export const netlifyTriggerEvents = [
  'deploy_created',
  'deploy_started',
  'deploy_building',
  'deploy_ready',
  'deploy_failed',
  'site_created',
  'site_deleted'
];

// Export supported authentication methods
export const netlifyAuthMethods = [
  'api_access_token'
];

// Template workflows for common Netlify patterns
export const netlifyTemplates = [
  {
    name: 'Deploy site when new content gets added',
    description: 'Automatically deploy your Netlify site when content changes',
    category: 'Automation'
  },
  {
    name: 'Send notification when deployment fails',
    description: 'Get alerts when your Netlify deployments fail',
    category: 'Monitoring'
  },
  {
    name: 'Add Netlify Form submissions to Airtable',
    description: 'Store form submissions from Netlify in Airtable',
    category: 'Integration'
  },
  {
    name: 'Site Status Dashboard',
    description: 'Monitor all your Netlify sites and deployments',
    category: 'Monitoring'
  }
];