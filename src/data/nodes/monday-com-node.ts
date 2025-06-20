import { NodeTypeInfo } from '../node-types.js';

export const mondayComNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mondaycom',
  displayName: 'Monday.com',
  description: 'Use the monday.com node to automate work in monday.com, and integrate monday.com with other applications. n8n has built-in support for a wide range of monday.com features, including creating a new board, and adding, deleting, and getting items on the board.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'board',
      description: 'The resource to operate on',
      options: [
        { name: 'Board', value: 'board', description: 'Work with Monday.com boards' },
        { name: 'Board Column', value: 'boardColumn', description: 'Manage board columns' },
        { name: 'Board Group', value: 'boardGroup', description: 'Manage board groups' },
        { name: 'Board Item', value: 'boardItem', description: 'Work with board items' }
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
        // Board operations
        { name: 'Archive', value: 'archive', description: 'Archive a board' },
        { name: 'Create', value: 'create', description: 'Create a new board' },
        { name: 'Get', value: 'get', description: 'Get a board' },
        { name: 'Get All', value: 'getAll', description: 'Get all boards' },
        // Board Column operations
        { name: 'Create', value: 'create', description: 'Create a new column' },
        { name: 'Get All', value: 'getAll', description: 'Get all columns' },
        // Board Group operations
        { name: 'Delete', value: 'delete', description: 'Delete a group in a board' },
        { name: 'Create', value: 'create', description: 'Create a group in a board' },
        { name: 'Get All', value: 'getAll', description: 'Get list of groups in a board' },
        // Board Item operations
        { name: 'Add Update', value: 'addUpdate', description: 'Add an update to an item' },
        { name: 'Change Column Value', value: 'changeColumnValue', description: 'Change a column value for a board item' },
        { name: 'Change Multiple Column Values', value: 'changeMultipleColumnValues', description: 'Change multiple column values for a board item' },
        { name: 'Create', value: 'create', description: 'Create an item in a board\'s group' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get All', value: 'getAll', description: 'Get all items' },
        { name: 'Get by Column Value', value: 'getByColumnValue', description: 'Get items by column value' },
        { name: 'Move to Group', value: 'moveToGroup', description: 'Move item to group' }
      ]
    },
    {
      name: 'boardId',
      displayName: 'Board ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the board to operate on'
    },
    {
      name: 'itemId',
      displayName: 'Item ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the item to operate on'
    },
    {
      name: 'groupId',
      displayName: 'Group ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the group to operate on'
    },
    {
      name: 'columnId',
      displayName: 'Column ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the column to operate on'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the resource (board, item, group, column)'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'The description of the resource'
    },
    {
      name: 'boardKind',
      displayName: 'Board Kind',
      type: 'options',
      required: false,
      default: 'public',
      description: 'The kind of board to create',
      options: [
        { name: 'Public', value: 'public' },
        { name: 'Private', value: 'private' },
        { name: 'Share', value: 'share' }
      ]
    },
    {
      name: 'columnTitle',
      displayName: 'Column Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the column'
    },
    {
      name: 'columnType',
      displayName: 'Column Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'The type of column to create',
      options: [
        { name: 'Text', value: 'text' },
        { name: 'Numbers', value: 'numbers' },
        { name: 'Status', value: 'status' },
        { name: 'Date', value: 'date' },
        { name: 'People', value: 'people' },
        { name: 'Timeline', value: 'timeline' },
        { name: 'Tags', value: 'tags' },
        { name: 'Email', value: 'email' },
        { name: 'Phone', value: 'phone' },
        { name: 'Link', value: 'link' },
        { name: 'Rating', value: 'rating' },
        { name: 'Checkbox', value: 'checkbox' },
        { name: 'Location', value: 'location' },
        { name: 'Formula', value: 'formula' },
        { name: 'Creation Log', value: 'creation_log' },
        { name: 'Last Updated', value: 'last_updated' }
      ]
    },
    {
      name: 'columnValue',
      displayName: 'Column Value',
      type: 'string',
      required: false,
      default: '',
      description: 'The value to set for the column'
    },
    {
      name: 'columnValues',
      displayName: 'Column Values',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with multiple column values to update'
    },
    {
      name: 'updateText',
      displayName: 'Update Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text content for the update'
    },
    {
      name: 'workspaceId',
      displayName: 'Workspace ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the workspace'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder'
    },
    {
      name: 'templateId',
      displayName: 'Template ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the template to use'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
      description: 'Page number for pagination'
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
      description: 'The processed Monday.com data'
    }
  ],
  credentials: ['mondayComApi', 'mondayComOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Board',
      description: 'Create a new board in Monday.com',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'board',
              operation: 'create',
              name: 'New Project Board',
              description: 'Project management board',
              boardKind: 'public'
            }
          }
        ]
      }
    },
    {
      name: 'Create Item',
      description: 'Create a new item in a board group',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'boardItem',
              operation: 'create',
              boardId: '{{$json["boardId"]}}',
              groupId: '{{$json["groupId"]}}',
              name: 'New Task Item'
            }
          }
        ]
      }
    },
    {
      name: 'Update Column Value',
      description: 'Change a column value for a board item',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'boardItem',
              operation: 'changeColumnValue',
              boardId: '{{$json["boardId"]}}',
              itemId: '{{$json["itemId"]}}',
              columnId: 'status',
              columnValue: 'Done'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Items',
      description: 'Get all items from a board',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'boardItem',
              operation: 'getAll',
              boardId: '{{$json["boardId"]}}',
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Create Column',
      description: 'Create a new column in a board',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'boardColumn',
              operation: 'create',
              boardId: '{{$json["boardId"]}}',
              columnTitle: 'Priority',
              columnType: 'status'
            }
          }
        ]
      }
    },
    {
      name: 'Add Update to Item',
      description: 'Add an update/comment to a board item',
      workflow: {
        nodes: [
          {
            name: 'Monday.com',
            type: 'n8n-nodes-base.mondaycom',
            parameters: {
              resource: 'boardItem',
              operation: 'addUpdate',
              itemId: '{{$json["itemId"]}}',
              updateText: 'Task has been completed successfully'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Monday.com node
export const mondayComActions = [
  // Board actions
  'archive_board',
  'create_board',
  'get_board',
  'get_all_boards',
  // Board Column actions
  'create_board_column',
  'get_all_board_columns',
  // Board Group actions
  'delete_board_group',
  'create_board_group',
  'get_all_board_groups',
  // Board Item actions
  'add_item_update',
  'change_item_column_value',
  'change_multiple_item_column_values',
  'create_board_item',
  'delete_board_item',
  'get_board_item',
  'get_all_board_items',
  'get_items_by_column_value',
  'move_item_to_group'
];

// Note: No Monday.com trigger node found in documentation
// Only the regular Monday.com node is available
export const mondayComNodes: NodeTypeInfo[] = [mondayComNode];