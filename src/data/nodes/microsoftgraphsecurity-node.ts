import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const microsoftGraphSecurityNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftgraphsecurity',
  displayName: 'Microsoft Graph Security',
  description: 'Use the Microsoft Graph Security node to automate work in Microsoft Graph Security, and integrate Microsoft Graph Security with other applications. n8n has built-in support for a wide range of Microsoft Graph Security features, including getting, and updating scores, and profiles.',
  category: 'Security',
  subcategory: 'Microsoft Security',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'secureScore',
      description: 'Select the Microsoft Graph Security resource to work with',
      options: [
        { name: 'Secure Score', value: 'secureScore', description: 'Microsoft Secure Score operations' },
        { name: 'Secure Score Control Profile', value: 'secureScoreControlProfile', description: 'Secure Score Control Profile operations' }
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
        { name: 'Get', value: 'get', description: 'Get a specific item' },
        { name: 'Get All', value: 'getAll', description: 'Get all items' },
        { name: 'Update', value: 'update', description: 'Update an item' }
      ]
    },
    {
      name: 'secureScoreId',
      displayName: 'Secure Score ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the secure score to retrieve (for Get operation)'
    },
    {
      name: 'controlProfileId',
      displayName: 'Control Profile ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the control profile to retrieve or update'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of items to return (for Get All operations)'
    },
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional OData filter to apply to the query'
    },
    {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional field to order results by'
    },
    {
      name: 'select',
      displayName: 'Select Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to select'
    },
    {
      name: 'updateFields',
      displayName: 'Update Fields',
      type: 'json',
      required: false,
      default: '{}',
      description: 'JSON object with fields to update (for Update operations)'
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
      description: 'The Microsoft Graph Security data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get All Secure Scores',
      description: 'Retrieve all secure scores from Microsoft Graph Security',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoftgraphsecurity',
            parameters: {
              resource: 'secureScore',
              operation: 'getAll',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Get Specific Secure Score',
      description: 'Retrieve a specific secure score by ID',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoftgraphsecurity',
            parameters: {
              resource: 'secureScore',
              operation: 'get',
              secureScoreId: '${secure_score_id}'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Control Profiles',
      description: 'Retrieve all secure score control profiles',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoftgraphsecurity',
            parameters: {
              resource: 'secureScoreControlProfile',
              operation: 'getAll',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Update Control Profile',
      description: 'Update a secure score control profile',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoftgraphsecurity',
            parameters: {
              resource: 'secureScoreControlProfile',
              operation: 'update',
              controlProfileId: '${control_profile_id}',
              updateFields: '{"implementationStatus": "Implemented", "assignedTo": "admin@company.com"}'
            }
          }
        ]
      }
    },
    {
      name: 'Filter Secure Scores by Date',
      description: 'Get secure scores filtered by creation date',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Graph Security',
            type: 'n8n-nodes-base.microsoftgraphsecurity',
            parameters: {
              resource: 'secureScore',
              operation: 'getAll',
              filters: "createdDateTime ge 2024-01-01T00:00:00Z",
              orderBy: 'createdDateTime desc',
              limit: 5
            }
          }
        ]
      }
    }
  ]
};

// Export available resources
export const microsoftGraphSecurityResources = [
  'secure_score',
  'secure_score_control_profile'
];

// Export available operations
export const microsoftGraphSecurityOperations = [
  'get',
  'get_all',
  'update'
];

// Export OAuth2 scopes required for Microsoft Graph Security
export const microsoftGraphSecurityScopes = [
  'https://graph.microsoft.com/SecurityEvents.Read.All',
  'https://graph.microsoft.com/SecurityEvents.ReadWrite.All',
  'https://graph.microsoft.com/Directory.Read.All'
];

// Export common filters and fields
export const microsoftGraphSecurityFilters = {
  secureScore: [
    'createdDateTime',
    'currentScore',
    'maxScore',
    'averageComparativeScore'
  ],
  secureScoreControlProfile: [
    'title',
    'implementationStatus',
    'lastModifiedDateTime',
    'tier'
  ]
};

// Export field mappings for easier integration
export const microsoftGraphSecurityFields = {
  secureScore: {
    id: 'id',
    createdDateTime: 'createdDateTime',
    currentScore: 'currentScore',
    maxScore: 'maxScore',
    averageComparativeScore: 'averageComparativeScore',
    azureTenantId: 'azureTenantId',
    controlScores: 'controlScores'
  },
  secureScoreControlProfile: {
    id: 'id',
    title: 'title',
    implementationStatus: 'implementationStatus',
    lastModifiedDateTime: 'lastModifiedDateTime',
    tier: 'tier',
    userImpact: 'userImpact',
    complianceInformation: 'complianceInformation',
    actionType: 'actionType',
    service: 'service',
    maxScore: 'maxScore',
    actionUrl: 'actionUrl',
    controlCategory: 'controlCategory',
    assignedTo: 'assignedTo',
    remediation: 'remediation',
    remediationImpact: 'remediationImpact'
  }
};