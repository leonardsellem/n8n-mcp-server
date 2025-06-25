import { NodeTypeInfo } from '../node-types.js';

export const phantombusterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.phantombuster',
  displayName: 'PhantomBuster',
  description: 'Use the PhantomBuster node to automate work in PhantomBuster, and integrate PhantomBuster with other applications. n8n has built-in support for a wide range of PhantomBuster features, including adding, deleting, and getting agents.',
  category: 'Marketing & Sales',
  subcategory: 'Automation',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Delete Agent', value: 'delete', description: 'Delete an agent by ID' },
        { name: 'Get Agent', value: 'get', description: 'Get an agent by ID' },
        { name: 'Get All Agents', value: 'getAll', description: 'Get all agents of the current user\'s organization' },
        { name: 'Get Agent Output', value: 'getOutput', description: 'Get the output of the most recent container of an agent' },
        { name: 'Launch Agent', value: 'launch', description: 'Add an agent to the launch queue' }
      ]
    },
    {
      name: 'agentId',
      displayName: 'Agent ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the agent to operate on (required for delete, get, getOutput, launch operations)'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of agents to return (for getAll operation)'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of agents to skip for pagination (for getAll operation)'
    },
    {
      name: 'includeInactive',
      displayName: 'Include Inactive',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include inactive agents in the results (for getAll operation)'
    },
    {
      name: 'arguments',
      displayName: 'Arguments',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of arguments to pass to the agent when launching (for launch operation)'
    },
    {
      name: 'bonusArgument',
      displayName: 'Bonus Argument',
      type: 'string',
      required: false,
      default: '',
      description: 'Additional argument to pass to the agent (for launch operation)'
    },
    {
      name: 'saveArgument',
      displayName: 'Save Argument',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to save the argument for future launches (for launch operation)'
    },
    {
      name: 'outputFormat',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'json',
      description: 'Format for the agent output (for getOutput operation)',
      options: [
        { name: 'JSON', value: 'json', description: 'Return output as JSON' },
        { name: 'CSV', value: 'csv', description: 'Return output as CSV' },
        { name: 'Raw', value: 'raw', description: 'Return raw output' }
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
      description: 'The processed PhantomBuster data'
    }
  ],
  credentials: ['phantombusterApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Agent Information',
      description: 'Get details about a specific PhantomBuster agent',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'get',
              agentId: '{{$json["agentId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'Launch Agent',
      description: 'Launch a PhantomBuster agent with custom arguments',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'launch',
              agentId: '{{$json["agentId"]}}',
              arguments: '{"sessionCookie": "{{$json["sessionCookie"]}}", "numberOfProfilesToProcess": 50}',
              saveArgument: true
            }
          }
        ]
      }
    },
    {
      name: 'Get All Agents',
      description: 'Retrieve all agents from your PhantomBuster organization',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'getAll',
              limit: 50,
              includeInactive: false
            }
          }
        ]
      }
    },
    {
      name: 'Get Agent Output',
      description: 'Get the latest output from a PhantomBuster agent',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'getOutput',
              agentId: '{{$json["agentId"]}}',
              outputFormat: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Delete Agent',
      description: 'Delete a PhantomBuster agent by ID',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'delete',
              agentId: '{{$json["agentId"]}}'
            }
          }
        ]
      }
    },
    {
      name: 'LinkedIn Profile Scraper Workflow',
      description: 'Launch LinkedIn profile scraper with specific targets',
      workflow: {
        nodes: [
          {
            name: 'PhantomBuster',
            type: 'n8n-nodes-base.phantombuster',
            parameters: {
              operation: 'launch',
              agentId: 'linkedin-profile-scraper-agent-id',
              arguments: '{"spreadsheetUrl": "{{$json["spreadsheetUrl"]}}", "numberOfLinesPerLaunch": 10, "csvName": "LinkedIn Profiles"}',
              saveArgument: false
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the PhantomBuster node
export const phantombusterActions = [
  'delete_agent',
  'get_agent',
  'get_all_agents',
  'get_agent_output',
  'launch_agent'
];

// PhantomBuster doesn't have trigger nodes - confirmed by browser verification
export const phantombusterTriggers: string[] = [];

// Export the node for easier importing
export const phantombusterNodes: NodeTypeInfo[] = [phantombusterNode];