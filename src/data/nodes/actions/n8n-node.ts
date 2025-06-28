import { NodeTypeInfo } from '../../node-types.js';

export const n8nNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.n8n',
  displayName: 'n8n',
  description: 'A node to integrate with n8n itself. This node allows you to consume the n8n API in your workflows. Use it to manage workflows, executions, credentials, and generate security audits programmatically.',
  category: 'Core Nodes',
  subcategory: 'Development',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'workflow',
      description: 'The resource to operate on',
      options: [
        { name: 'Audit', value: 'audit', description: 'Generate security audit reports' },
        { name: 'Credential', value: 'credential', description: 'Manage n8n credentials' },
        { name: 'Execution', value: 'execution', description: 'Manage workflow executions' },
        { name: 'Workflow', value: 'workflow', description: 'Manage n8n workflows' }
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
        // Audit operations
        { name: 'Generate Audit', value: 'generateAudit', description: 'Generate a security audit report' },
        // Credential operations
        { name: 'Create Credential', value: 'createCredential', description: 'Create a new credential' },
        { name: 'Delete Credential', value: 'deleteCredential', description: 'Delete a credential' },
        { name: 'Get Credential Schema', value: 'getCredentialSchema', description: 'Get credential data schema for type' },
        // Execution operations
        { name: 'Get Execution', value: 'getExecution', description: 'Get a specific execution' },
        { name: 'Get Execution Option', value: 'getExecutionOption', description: 'Get execution option details' },
        { name: 'Get Many Executions', value: 'getManyExecutions', description: 'Get multiple executions' },
        { name: 'Get Many Executions Filters', value: 'getManyExecutionsFilters', description: 'Get executions with filters' },
        { name: 'Get Many Execution Options', value: 'getManyExecutionOptions', description: 'Get multiple execution options' },
        { name: 'Delete Execution', value: 'deleteExecution', description: 'Delete an execution' },
        // Workflow operations
        { name: 'Activate Workflow', value: 'activateWorkflow', description: 'Activate a workflow' },
        { name: 'Deactivate Workflow', value: 'deactivateWorkflow', description: 'Deactivate a workflow' },
        { name: 'Delete Workflow', value: 'deleteWorkflow', description: 'Delete a workflow' },
        { name: 'Get Workflow', value: 'getWorkflow', description: 'Get a specific workflow' },
        { name: 'Create Workflow', value: 'createWorkflow', description: 'Create a new workflow' },
        { name: 'Get Many Workflows', value: 'getManyWorkflows', description: 'Get multiple workflows' },
        { name: 'Get Many Workflows Filters', value: 'getManyWorkflowsFilters', description: 'Get workflows with filters' },
        { name: 'Update Workflow', value: 'updateWorkflow', description: 'Update an existing workflow' }
      ]
    },
    // Audit properties
    {
      name: 'categories',
      displayName: 'Categories',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Select the risk categories you want the audit to include',
      options: [
        { name: 'Database', value: 'database', description: 'Database security risks' },
        { name: 'Filesystem', value: 'filesystem', description: 'File system security risks' },
        { name: 'Node', value: 'node', description: 'Node-specific security risks' },
        { name: 'Credential', value: 'credential', description: 'Credential security risks' },
        { name: 'Instance', value: 'instance', description: 'Instance-level security risks' }
      ]
    },
    // Credential properties
    {
      name: 'credentialType',
      displayName: 'Credential Type',
      type: 'string',
      required: false,
      default: '',
      description: 'The type of credential (e.g., httpBasicAuth, apiKey)'
    },
    {
      name: 'credentialName',
      displayName: 'Credential Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the credential'
    },
    {
      name: 'credentialData',
      displayName: 'Credential Data',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing credential data'
    },
    {
      name: 'credentialId',
      displayName: 'Credential ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the credential to operate on'
    },
    // Execution properties
    {
      name: 'executionId',
      displayName: 'Execution ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the execution to operate on'
    },
    {
      name: 'workflowId',
      displayName: 'Workflow ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the workflow'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'success',
      description: 'Filter executions by status',
      options: [
        { name: 'Success', value: 'success', description: 'Successful executions' },
        { name: 'Error', value: 'error', description: 'Failed executions' },
        { name: 'Waiting', value: 'waiting', description: 'Waiting executions' },
        { name: 'Canceled', value: 'canceled', description: 'Canceled executions' }
      ]
    },
    {
      name: 'includeData',
      displayName: 'Include Data',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include execution data in the response'
    },
    // Workflow properties
    {
      name: 'workflowName',
      displayName: 'Workflow Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the workflow'
    },
    {
      name: 'workflowData',
      displayName: 'Workflow Data',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing workflow definition'
    },
    {
      name: 'active',
      displayName: 'Active',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the workflow should be active'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of workflow tags'
    },
    // Common properties
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 20,
      description: 'Maximum number of results to return'
    },
    {
      name: 'cursor',
      displayName: 'Cursor',
      type: 'string',
      required: false,
      default: '',
      description: 'Cursor for pagination'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing filter criteria'
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
      description: 'The processed n8n API data'
    }
  ],
  credentials: ['n8nApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Generate Security Audit',
      description: 'Generate a comprehensive security audit report',
      workflow: {
        nodes: [
          {
            name: 'n8n Audit',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'audit',
              operation: 'generateAudit',
              categories: ['database', 'filesystem', 'credential']
            }
          }
        ]
      }
    },
    {
      name: 'Create Credential',
      description: 'Create a new API credential in n8n',
      workflow: {
        nodes: [
          {
            name: 'n8n Create Credential',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'credential',
              operation: 'createCredential',
              credentialName: 'My API Key',
              credentialType: 'httpBasicAuth',
              credentialData: '{"user": "username", "password": "password"}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Workflow Executions',
      description: 'Get recent executions for a specific workflow',
      workflow: {
        nodes: [
          {
            name: 'n8n Get Executions',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'execution',
              operation: 'getManyExecutions',
              workflowId: 'workflow-123',
              status: 'success',
              limit: 10,
              includeData: false
            }
          }
        ]
      }
    },
    {
      name: 'Create Workflow',
      description: 'Create a new workflow programmatically',
      workflow: {
        nodes: [
          {
            name: 'n8n Create Workflow',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'workflow',
              operation: 'createWorkflow',
              workflowName: 'Automated Workflow',
              workflowData: '{"nodes": [], "connections": {}}',
              active: false,
              tags: 'automation,api'
            }
          }
        ]
      }
    },
    {
      name: 'Activate Workflow',
      description: 'Activate a workflow to start processing triggers',
      workflow: {
        nodes: [
          {
            name: 'n8n Activate Workflow',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'workflow',
              operation: 'activateWorkflow',
              workflowId: 'workflow-123'
            }
          }
        ]
      }
    },
    {
      name: 'Get Many Workflows',
      description: 'Get all workflows with optional filtering',
      workflow: {
        nodes: [
          {
            name: 'n8n Get Workflows',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'workflow',
              operation: 'getManyWorkflows',
              active: true,
              limit: 50,
              tags: 'production'
            }
          }
        ]
      }
    },
    {
      name: 'Update Workflow',
      description: 'Update an existing workflow configuration',
      workflow: {
        nodes: [
          {
            name: 'n8n Update Workflow',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'workflow',
              operation: 'updateWorkflow',
              workflowId: 'workflow-123',
              workflowName: 'Updated Workflow Name',
              workflowData: '{"nodes": [{"name": "Manual Trigger", "type": "n8n-nodes-base.manualTrigger"}], "connections": {}}'
            }
          }
        ]
      }
    },
    {
      name: 'Delete Execution',
      description: 'Delete a specific workflow execution',
      workflow: {
        nodes: [
          {
            name: 'n8n Delete Execution',
            type: 'n8n-nodes-base.n8n',
            parameters: {
              resource: 'execution',
              operation: 'deleteExecution',
              executionId: 'execution-456'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the n8n node
export const n8nActions = [
  // Audit actions
  'generate_audit',
  // Credential actions
  'create_credential',
  'delete_credential',
  'get_credential_schema',
  // Execution actions
  'get_execution',
  'get_execution_option',
  'get_many_executions',
  'get_many_executions_filters',
  'get_many_execution_options',
  'delete_execution',
  // Workflow actions
  'activate_workflow',
  'deactivate_workflow',
  'delete_workflow',
  'get_workflow',
  'create_workflow',
  'get_many_workflows',
  'get_many_workflows_filters',
  'update_workflow'
];