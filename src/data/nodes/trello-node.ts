import { NodeTypeInfo } from '../node-types.js';

export const trelloNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.trello',
  displayName: 'Trello',
  description: 'Use the Trello node to automate work in Trello, and integrate Trello with other applications. n8n has built-in support for a wide range of Trello features, including creating and updating cards, and adding and removing members.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'card',
      description: 'The resource to operate on',
      options: [
        { name: 'Attachment', value: 'attachment', description: 'Work with card attachments' },
        { name: 'Board', value: 'board', description: 'Manage Trello boards' },
        { name: 'Board Member', value: 'boardMember', description: 'Manage board members' },
        { name: 'Card', value: 'card', description: 'Work with Trello cards' },
        { name: 'Card Comment', value: 'cardComment', description: 'Manage card comments' },
        { name: 'Checklist', value: 'checklist', description: 'Work with checklists' },
        { name: 'Label', value: 'label', description: 'Manage labels' },
        { name: 'List', value: 'list', description: 'Work with lists' }
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
        // Attachment operations
        { name: 'Create', value: 'create', description: 'Create a new attachment for a card' },
        { name: 'Delete', value: 'delete', description: 'Delete an attachment' },
        { name: 'Get', value: 'get', description: 'Get the data of an attachment' },
        { name: 'Get All', value: 'getAll', description: 'Returns all attachments for the card' },
        // Board operations
        { name: 'Create', value: 'create', description: 'Create a new board' },
        { name: 'Delete', value: 'delete', description: 'Delete a board' },
        { name: 'Get', value: 'get', description: 'Get the data of a board' },
        { name: 'Update', value: 'update', description: 'Update a board' },
        // Board Member operations
        { name: 'Add', value: 'add', description: 'Add a member to a board' },
        { name: 'Get All', value: 'getAll', description: 'Get all board members' },
        { name: 'Invite', value: 'invite', description: 'Invite a member to a board' },
        { name: 'Remove', value: 'remove', description: 'Remove a member from a board' },
        // Card operations
        { name: 'Create', value: 'create', description: 'Create a new card' },
        { name: 'Delete', value: 'delete', description: 'Delete a card' },
        { name: 'Get', value: 'get', description: 'Get the data of a card' },
        { name: 'Update', value: 'update', description: 'Update a card' },
        // Card Comment operations
        { name: 'Create', value: 'create', description: 'Create a comment on a card' },
        { name: 'Delete', value: 'delete', description: 'Delete a comment from a card' },
        { name: 'Update', value: 'update', description: 'Update a comment on a card' },
        // Checklist operations
        { name: 'Create', value: 'create', description: 'Create a new checklist' },
        { name: 'Create Item', value: 'createItem', description: 'Create a checklist item' },
        { name: 'Delete', value: 'delete', description: 'Delete a checklist' },
        { name: 'Delete Item', value: 'deleteItem', description: 'Delete a checklist item' },
        { name: 'Get', value: 'get', description: 'Get the data of a checklist' },
        { name: 'Get All', value: 'getAll', description: 'Returns all checklists for the card' },
        { name: 'Get Checklist', value: 'getChecklist', description: 'Get a specific checklist on a card' },
        { name: 'Get Completed Items', value: 'getCompletedItems', description: 'Get the completed checklist items on a card' },
        { name: 'Update Item', value: 'updateItem', description: 'Update an item in a checklist on a card' },
        // Label operations
        { name: 'Add to Card', value: 'addToCard', description: 'Add a label to a card' },
        { name: 'Create', value: 'create', description: 'Create a new label' },
        { name: 'Delete', value: 'delete', description: 'Delete a label' },
        { name: 'Get', value: 'get', description: 'Get the data of a label' },
        { name: 'Get All', value: 'getAll', description: 'Returns all labels for the board' },
        { name: 'Remove from Card', value: 'removeFromCard', description: 'Remove a label from a card' },
        { name: 'Update', value: 'update', description: 'Update a label' },
        // List operations
        { name: 'Archive', value: 'archive', description: 'Archive a list' },
        { name: 'Create', value: 'create', description: 'Create a new list' },
        { name: 'Get', value: 'get', description: 'Get the data of a list' },
        { name: 'Get All', value: 'getAll', description: 'Get all the lists' },
        { name: 'Get Cards', value: 'getCards', description: 'Get all the cards in a list' },
        { name: 'Unarchive', value: 'unarchive', description: 'Unarchive a list' },
        { name: 'Update', value: 'update', description: 'Update a list' }
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
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the list to operate on'
    },
    {
      name: 'cardId',
      displayName: 'Card ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the card to operate on'
    },
    {
      name: 'attachmentId',
      displayName: 'Attachment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the attachment to operate on'
    },
    {
      name: 'checklistId',
      displayName: 'Checklist ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the checklist to operate on'
    },
    {
      name: 'checklistItemId',
      displayName: 'Checklist Item ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the checklist item to operate on'
    },
    {
      name: 'labelId',
      displayName: 'Label ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the label to operate on'
    },
    {
      name: 'memberId',
      displayName: 'Member ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the member to operate on'
    },
    {
      name: 'commentId',
      displayName: 'Comment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the comment to operate on'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the resource (board, list, card, etc.)'
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
      name: 'position',
      displayName: 'Position',
      type: 'string',
      required: false,
      default: 'bottom',
      description: 'The position of the resource'
    },
    {
      name: 'due',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'The due date for the card'
    },
    {
      name: 'dueComplete',
      displayName: 'Due Complete',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the due date is marked as complete'
    },
    {
      name: 'closed',
      displayName: 'Closed',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the resource is closed/archived'
    },
    {
      name: 'subscribed',
      displayName: 'Subscribed',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to subscribe to the resource'
    },
    {
      name: 'labels',
      displayName: 'Labels',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of label IDs'
    },
    {
      name: 'members',
      displayName: 'Members',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of member IDs'
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL for attachment or link'
    },
    {
      name: 'mimeType',
      displayName: 'MIME Type',
      type: 'string',
      required: false,
      default: '',
      description: 'MIME type of the attachment'
    },
    {
      name: 'file',
      displayName: 'File',
      type: 'string',
      required: false,
      default: '',
      description: 'File to attach'
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'Text content for comments or updates'
    },
    {
      name: 'color',
      displayName: 'Color',
      type: 'options',
      required: false,
      default: '',
      description: 'Color for labels or boards',
      options: [
        { name: 'Yellow', value: 'yellow' },
        { name: 'Purple', value: 'purple' },
        { name: 'Blue', value: 'blue' },
        { name: 'Red', value: 'red' },
        { name: 'Green', value: 'green' },
        { name: 'Orange', value: 'orange' },
        { name: 'Black', value: 'black' },
        { name: 'Sky', value: 'sky' },
        { name: 'Pink', value: 'pink' },
        { name: 'Lime', value: 'lime' }
      ]
    },
    {
      name: 'prefs',
      displayName: 'Preferences',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with board preferences'
    },
    {
      name: 'powerUps',
      displayName: 'Power-Ups',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of Power-Up IDs'
    },
    {
      name: 'keepFromSource',
      displayName: 'Keep From Source',
      type: 'string',
      required: false,
      default: '',
      description: 'Properties to keep when copying from source'
    },
    {
      name: 'idCardSource',
      displayName: 'Source Card ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the card to copy from'
    },
    {
      name: 'pos',
      displayName: 'Position',
      type: 'string',
      required: false,
      default: 'bottom',
      description: 'Position in the list (top, bottom, or number)'
    },
    {
      name: 'state',
      displayName: 'State',
      type: 'options',
      required: false,
      default: 'incomplete',
      description: 'State of checklist item',
      options: [
        { name: 'Complete', value: 'complete' },
        { name: 'Incomplete', value: 'incomplete' }
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
      description: 'The processed Trello data'
    }
  ],
  credentials: ['trelloApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Card',
      description: 'Create a new card in a Trello list',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'card',
              operation: 'create',
              boardId: 'your-board-id',
              listId: 'your-list-id',
              name: 'New Task',
              description: 'Task description here'
            }
          }
        ]
      }
    },
    {
      name: 'Update Card',
      description: 'Update an existing Trello card',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'card',
              operation: 'update',
              cardId: '{{$json["cardId"]}}',
              name: 'Updated Task Name',
              description: 'Updated description',
              due: '2024-12-31T23:59:59.000Z'
            }
          }
        ]
      }
    },
    {
      name: 'Create Board',
      description: 'Create a new Trello board',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'board',
              operation: 'create',
              name: 'Project Board',
              description: 'Board for managing project tasks'
            }
          }
        ]
      }
    },
    {
      name: 'Add Checklist',
      description: 'Add a checklist to a card',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'checklist',
              operation: 'create',
              cardId: '{{$json["cardId"]}}',
              name: 'Task Checklist'
            }
          }
        ]
      }
    },
    {
      name: 'Add Comment',
      description: 'Add a comment to a card',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'cardComment',
              operation: 'create',
              cardId: '{{$json["cardId"]}}',
              text: 'This is a comment on the card'
            }
          }
        ]
      }
    },
    {
      name: 'Create Label',
      description: 'Create a new label for a board',
      workflow: {
        nodes: [
          {
            name: 'Trello',
            type: 'n8n-nodes-base.trello',
            parameters: {
              resource: 'label',
              operation: 'create',
              boardId: 'your-board-id',
              name: 'Priority',
              color: 'red'
            }
          }
        ]
      }
    }
  ]
};

export const trelloTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.trelloTrigger',
  displayName: 'Trello Trigger',
  description: 'Trello is a web-based Kanban-style list-making application which is a subsidiary of Atlassian. Users can create their task boards with different columns and move the tasks between them.',
  category: 'Productivity',
  subcategory: 'Project Management',
  properties: [
    {
      name: 'modelId',
      displayName: 'Model ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The model ID is the ID of any model in Trello. Depending on the use-case, it could be the User ID, List ID, Board ID, etc.'
    },
    {
      name: 'webhookId',
      displayName: 'Webhook ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional webhook ID for managing webhooks'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the webhook'
    },
    {
      name: 'callbackURL',
      displayName: 'Callback URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to receive webhook notifications'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Trello events occur'
    }
  ],
  credentials: ['trelloApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Card Changes',
      description: 'Trigger workflow when cards are created or updated in a list',
      workflow: {
        nodes: [
          {
            name: 'Trello Trigger',
            type: 'n8n-nodes-base.trelloTrigger',
            parameters: {
              modelId: 'your-list-id',
              description: 'Monitor list for card changes'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Board Activity',
      description: 'Trigger when any activity happens on a board',
      workflow: {
        nodes: [
          {
            name: 'Trello Trigger',
            type: 'n8n-nodes-base.trelloTrigger',
            parameters: {
              modelId: 'your-board-id',
              description: 'Monitor board activity'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor User Activity',
      description: 'Trigger when a specific user performs actions',
      workflow: {
        nodes: [
          {
            name: 'Trello Trigger',
            type: 'n8n-nodes-base.trelloTrigger',
            parameters: {
              modelId: 'your-user-id',
              description: 'Monitor user activity'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const trelloNodes: NodeTypeInfo[] = [trelloNode, trelloTriggerNode];

// Export individual actions for the regular Trello node
export const trelloActions = [
  // Attachment actions
  'create_attachment',
  'delete_attachment',
  'get_attachment',
  'get_all_attachments',
  // Board actions
  'create_board',
  'delete_board',
  'get_board',
  'update_board',
  // Board Member actions
  'add_board_member',
  'get_all_board_members',
  'invite_board_member',
  'remove_board_member',
  // Card actions
  'create_card',
  'delete_card',
  'get_card',
  'update_card',
  // Card Comment actions
  'create_card_comment',
  'delete_card_comment',
  'update_card_comment',
  // Checklist actions
  'create_checklist',
  'create_checklist_item',
  'delete_checklist',
  'delete_checklist_item',
  'get_checklist',
  'get_all_checklists',
  'get_checklist_on_card',
  'get_completed_checklist_items',
  'update_checklist_item',
  // Label actions
  'add_label_to_card',
  'create_label',
  'delete_label',
  'get_label',
  'get_all_labels',
  'remove_label_from_card',
  'update_label',
  // List actions
  'archive_list',
  'create_list',
  'get_list',
  'get_all_lists',
  'get_list_cards',
  'unarchive_list',
  'update_list'
];

// Export trigger events
export const trelloTriggers = [
  'card_created',
  'card_updated',
  'card_moved',
  'card_deleted',
  'list_created',
  'list_updated',
  'board_updated',
  'member_added',
  'member_removed',
  'comment_added',
  'checklist_updated',
  'attachment_added',
  'label_added',
  'due_date_updated'
];