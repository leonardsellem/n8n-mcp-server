import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const notionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.notion',
  displayName: 'Notion',
  description: 'Use the Notion node to automate work in Notion, and integrate Notion with other applications. n8n has built-in support for a wide range of Notion features, including getting and searching databases, creating pages, and getting users.',
  category: 'Productivity',
  subcategory: 'Knowledge Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'databasePage',
      description: 'The resource to operate on',
      options: [
        { name: 'Block', value: 'block', description: 'Work with Notion blocks' },
        { name: 'Database', value: 'database', description: 'Manage Notion databases' },
        { name: 'Database Page', value: 'databasePage', description: 'Handle pages within databases' },
        { name: 'Page', value: 'page', description: 'Work with Notion pages' },
        { name: 'User', value: 'user', description: 'Manage Notion users' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Block operations
        { name: 'Append After', value: 'appendAfter', description: 'Append a block after another block' },
        { name: 'Get Child Blocks', value: 'getChildren', description: 'Get child blocks of a parent block' },
        // Database operations
        { name: 'Get', value: 'get', description: 'Get a database' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple databases' },
        { name: 'Search', value: 'search', description: 'Search databases' },
        // Database Page operations
        { name: 'Create', value: 'create', description: 'Create a database page' },
        { name: 'Get', value: 'get', description: 'Get a database page' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple database pages' },
        { name: 'Update', value: 'update', description: 'Update a database page' },
        // Page operations
        { name: 'Archive', value: 'archive', description: 'Archive a page' },
        { name: 'Create', value: 'create', description: 'Create a page' },
        { name: 'Search', value: 'search', description: 'Search pages' },
        // User operations
        { name: 'Get', value: 'get', description: 'Get information about a user' },
        { name: 'Get Many', value: 'getAll', description: 'Get a list of users' }
      ]
    },
    {
      name: 'databaseId',
      displayName: 'Database ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the database to operate on'
    },
    {
      name: 'pageId',
      displayName: 'Page ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the page to operate on'
    },
    {
      name: 'blockId',
      displayName: 'Block ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the block to operate on'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to get information about'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the page'
    },
    {
      name: 'content',
      displayName: 'Content',
      type: 'string',
      required: false,
      default: '',
      description: 'The content to add'
    },
    {
      name: 'properties',
      displayName: 'Properties',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object containing the properties to set'
    },
    {
      name: 'children',
      displayName: 'Children',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of child blocks to add'
    },
    {
      name: 'blockType',
      displayName: 'Block Type',
      type: 'options',
      required: false,
      default: 'paragraph',
      description: 'The type of block to create',
      options: [
        { name: 'Paragraph', value: 'paragraph', description: 'A paragraph block' },
        { name: 'Heading 1', value: 'heading_1', description: 'A heading 1 block' },
        { name: 'Heading 2', value: 'heading_2', description: 'A heading 2 block' },
        { name: 'Heading 3', value: 'heading_3', description: 'A heading 3 block' },
        { name: 'Bulleted List Item', value: 'bulleted_list_item', description: 'A bulleted list item' },
        { name: 'Numbered List Item', value: 'numbered_list_item', description: 'A numbered list item' },
        { name: 'To Do', value: 'to_do', description: 'A to-do block' },
        { name: 'Code', value: 'code', description: 'A code block' },
        { name: 'Quote', value: 'quote', description: 'A quote block' },
        { name: 'Callout', value: 'callout', description: 'A callout block' },
        { name: 'Divider', value: 'divider', description: 'A divider block' }
      ]
    },
    {
      name: 'searchText',
      displayName: 'Search Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text to search for'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object representing the filter to apply'
    },
    {
      name: 'sorts',
      displayName: 'Sorts',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array representing the sorts to apply'
    },
    {
      name: 'startCursor',
      displayName: 'Start Cursor',
      type: 'string',
      required: false,
      default: '',
      description: 'Cursor for pagination'
    },
    {
      name: 'pageSize',
      displayName: 'Page Size',
      type: 'number',
      required: false,
      default: 100,
      description: 'Number of results to return per page'
    },
    {
      name: 'archived',
      displayName: 'Archived',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to archive the page'
    },
    {
      name: 'icon',
      displayName: 'Icon',
      type: 'string',
      required: false,
      default: '',
      description: 'Icon for the page (emoji or URL)'
    },
    {
      name: 'cover',
      displayName: 'Cover',
      type: 'string',
      required: false,
      default: '',
      description: 'Cover image URL for the page'
    },
    {
      name: 'parentType',
      displayName: 'Parent Type',
      type: 'options',
      required: false,
      default: 'database_id',
      description: 'The type of parent for the page',
      options: [
        { name: 'Database ID', value: 'database_id', description: 'The page belongs to a database' },
        { name: 'Page ID', value: 'page_id', description: 'The page is a child of another page' },
        { name: 'Workspace', value: 'workspace', description: 'The page is in the workspace root' }
      ]
    },
    {
      name: 'simple',
      displayName: 'Simplify',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to return a simplified version of the response'
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
      description: 'The processed Notion data'
    }
  ],
  credentials: ['notionApi', 'notionOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Database Page',
      description: 'Create a new page in a Notion database',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'databasePage',
              operation: 'create',
              databaseId: '{{$json["databaseId"]}}',
              title: 'New Task',
              properties: '{"Status": {"select": {"name": "Not started"}}, "Priority": {"select": {"name": "Medium"}}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get Database Pages',
      description: 'Get all pages from a Notion database',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'databasePage',
              operation: 'getAll',
              databaseId: '{{$json["databaseId"]}}',
              simple: true
            }
          }
        ]
      }
    },
    {
      name: 'Update Database Page',
      description: 'Update properties of a database page',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'databasePage',
              operation: 'update',
              pageId: '{{$json["pageId"]}}',
              properties: '{"Status": {"select": {"name": "In progress"}}}'
            }
          }
        ]
      }
    },
    {
      name: 'Search Pages',
      description: 'Search for pages in Notion workspace',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'page',
              operation: 'search',
              searchText: 'meeting notes',
              simple: true
            }
          }
        ]
      }
    },
    {
      name: 'Append Block to Page',
      description: 'Add a new block to an existing page',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'block',
              operation: 'appendAfter',
              blockId: '{{$json["blockId"]}}',
              blockType: 'paragraph',
              content: 'This is a new paragraph added to the page.'
            }
          }
        ]
      }
    },
    {
      name: 'Get Database Information',
      description: 'Retrieve information about a specific database',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'database',
              operation: 'get',
              databaseId: '{{$json["databaseId"]}}',
              simple: true
            }
          }
        ]
      }
    },
    {
      name: 'Get User Information',
      description: 'Get information about Notion users',
      workflow: {
        nodes: [
          {
            name: 'Notion',
            type: 'n8n-nodes-base.notion',
            parameters: {
              resource: 'user',
              operation: 'getAll',
              simple: true
            }
          }
        ]
      }
    }
  ]
};

export const notionTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.notionTrigger',
  displayName: 'Notion Trigger',
  description: 'Notion is an all-in-one workspace for your notes, tasks, wikis, and databases. Triggers the workflow when specified events occur in Notion.',
  category: 'Productivity',
  subcategory: 'Knowledge Management',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'pageAddedToDatabase',
      description: 'The event to trigger on',
      options: [
        { name: 'Page Added to Database', value: 'pageAddedToDatabase', description: 'Triggers when a new page is added to a database' },
        { name: 'Page Updated in Database', value: 'pageUpdatedInDatabase', description: 'Triggers when a page in a database is updated' }
      ]
    },
    {
      name: 'databaseId',
      displayName: 'Database ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The ID of the database to monitor for changes'
    },
    {
      name: 'pollTimes',
      displayName: 'Poll Times',
      type: 'fixedCollection',
      required: true,
      default: { mode: 'everyMinute' },
      description: 'How often to check for changes'
    },
    {
      name: 'simple',
      displayName: 'Simplify',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to return a simplified version of the response or the raw data'
    },
    {
      name: 'properties',
      displayName: 'Properties to Watch',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Specific properties to monitor for changes (for update events)'
    },
    {
      name: 'downloadFiles',
      displayName: 'Download Files',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to download files attached to pages'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Notion events occur'
    }
  ],
  credentials: ['notionApi', 'notionOAuth2Api'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor New Database Pages',
      description: 'Trigger workflow when new pages are added to a database',
      workflow: {
        nodes: [
          {
            name: 'Notion Trigger',
            type: 'n8n-nodes-base.notionTrigger',
            parameters: {
              event: 'pageAddedToDatabase',
              databaseId: '{{$json["databaseId"]}}',
              simple: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Database Page Updates',
      description: 'Trigger when pages in a database are updated',
      workflow: {
        nodes: [
          {
            name: 'Notion Trigger',
            type: 'n8n-nodes-base.notionTrigger',
            parameters: {
              event: 'pageUpdatedInDatabase',
              databaseId: '{{$json["databaseId"]}}',
              simple: true,
              downloadFiles: false
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const notionNodes: NodeTypeInfo[] = [notionNode, notionTriggerNode];

// Export individual actions for the regular Notion node
export const notionActions = [
  // Block actions
  'append_block_after',
  'get_child_blocks',
  // Database actions
  'get_database',
  'get_many_databases',
  'search_databases',
  // Database Page actions
  'create_database_page',
  'get_database_page',
  'get_many_database_pages',
  'update_database_page',
  // Page actions
  'archive_page',
  'create_page',
  'search_pages',
  // User actions
  'get_user',
  'get_many_users'
];

// Export trigger events
export const notionTriggers = [
  'page_added_to_database',
  'page_updated_in_database'
];