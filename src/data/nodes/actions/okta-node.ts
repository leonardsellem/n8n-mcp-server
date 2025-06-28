import { NodeTypeInfo } from '../../node-types.js';

export const oktaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.okta',
  displayName: 'Okta',
  description: 'Use the Okta node to automate work in Okta and integrate Okta with other applications. n8n has built-in support for a wide range of Okta features, which includes creating, updating, and deleting users.',
  category: 'Identity & Access Management',
  subcategory: 'Identity Provider',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'user',
      description: 'The resource to operate on',
      options: [
        { name: 'User', value: 'user', description: 'Work with Okta users' }
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
        // User operations
        { name: 'Create a new user', value: 'create', description: 'Create a new user in Okta' },
        { name: 'Delete an existing user', value: 'delete', description: 'Delete an existing user from Okta' },
        { name: 'Get details of a user', value: 'get', description: 'Get details of a specific user' },
        { name: 'Get many users', value: 'getAll', description: 'Get multiple users from Okta' },
        { name: 'Update an existing user', value: 'update', description: 'Update an existing user in Okta' }
      ]
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'login',
      displayName: 'Login',
      type: 'string',
      required: false,
      default: '',
      description: 'The login/email address of the user'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address of the user'
    },
    {
      name: 'firstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The first name of the user'
    },
    {
      name: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The last name of the user'
    },
    {
      name: 'mobilePhone',
      displayName: 'Mobile Phone',
      type: 'string',
      required: false,
      default: '',
      description: 'The mobile phone number of the user'
    },
    {
      name: 'password',
      displayName: 'Password',
      type: 'string',
      required: false,
      default: '',
      description: 'The password for the user account'
    },
    {
      name: 'activate',
      displayName: 'Activate User',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to activate the user upon creation'
    },
    {
      name: 'sendEmail',
      displayName: 'Send Email',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to send an activation email to the user'
    },
    {
      name: 'profile',
      displayName: 'Profile',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing additional profile attributes'
    },
    {
      name: 'credentials',
      displayName: 'Credentials',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing user credentials'
    },
    {
      name: 'groupIds',
      displayName: 'Group IDs',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of group IDs to assign the user to'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 200,
      description: 'Maximum number of users to return'
    },
    {
      name: 'search',
      displayName: 'Search',
      type: 'string',
      required: false,
      default: '',
      description: 'Search expression to filter users'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter expression to filter users'
    },
    {
      name: 'after',
      displayName: 'After',
      type: 'string',
      required: false,
      default: '',
      description: 'Cursor for pagination'
    },
    {
      name: 'sortBy',
      displayName: 'Sort By',
      type: 'options',
      required: false,
      default: '',
      description: 'Property to sort users by',
      options: [
        { name: 'Default', value: '', description: 'Default sorting' },
        { name: 'Created', value: 'created', description: 'Sort by creation date' },
        { name: 'Last Updated', value: 'lastUpdated', description: 'Sort by last update date' },
        { name: 'Last Login', value: 'lastLogin', description: 'Sort by last login date' },
        { name: 'Status', value: 'status', description: 'Sort by user status' }
      ]
    },
    {
      name: 'sortOrder',
      displayName: 'Sort Order',
      type: 'options',
      required: false,
      default: 'asc',
      description: 'Sort order for results',
      options: [
        { name: 'Ascending', value: 'asc', description: 'Sort in ascending order' },
        { name: 'Descending', value: 'desc', description: 'Sort in descending order' }
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
      description: 'The processed Okta user data'
    }
  ],
  credentials: ['oktaApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create User',
      description: 'Create a new user in Okta',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'create',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              login: 'john.doe@example.com',
              activate: true,
              sendEmail: false
            }
          }
        ]
      }
    },
    {
      name: 'Get User Details',
      description: 'Get details of a specific user',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'get',
              userId: '{{$json["userId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Many Users',
      description: 'Get multiple users with filtering',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'getAll',
              limit: 50,
              search: 'profile.firstName eq "John"',
              sortBy: 'created',
              sortOrder: 'desc'
            }
          }
        ]
      }
    },
    {
      name: 'Update User',
      description: 'Update an existing user\'s profile',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'update',
              userId: '{{$json["userId"]}}',
              firstName: 'Jane',
              lastName: 'Smith',
              mobilePhone: '+1-555-123-4567'
            }
          }
        ]
      }
    },
    {
      name: 'Delete User',
      description: 'Delete an existing user from Okta',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'delete',
              userId: '{{$json["userId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Search Users by Email Domain',
      description: 'Find all users with a specific email domain',
      workflow: {
        nodes: [
          {
            name: 'Okta',
            type: 'n8n-nodes-base.okta',
            parameters: {
              resource: 'user',
              operation: 'getAll',
              search: 'profile.email sw "@company.com"',
              limit: 100,
              sortBy: 'lastLogin',
              sortOrder: 'desc'
            }
          }
        ]
      }
    }
  ]
};

// Export the node
export default oktaNode;

// Export individual actions for the Okta node
export const oktaActions = [
  // User actions
  'create_user',
  'delete_user',
  'get_user',
  'get_many_users',
  'update_user'
];

// Note: No trigger node exists for Okta as confirmed by browser verification
export const oktaTriggers: string[] = [];