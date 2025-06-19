/**
 * Monday.com Node Documentation
 * Generated from verified n8n documentation
 */

export const mondayNode = {
  "name": "Monday.com",
  "description": "Use the monday.com node to automate work in monday.com, and integrate monday.com with other applications. n8n has built-in support for a wide range of monday.com features, including creating a new board, and adding, deleting, and getting items on the board.",
  "iconUrl": "https://docs.n8n.io/favicon.ico",
  "categories": ["Productivity", "Project Management"],
  "primaryDocumentationUrl": "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.monday/",
  "nodeVersion": "1.0",
  "codeName": "n8n-nodes-base.monday",
  "resources": {
    "credentialsDocumentationUrl": "https://docs.n8n.io/integrations/builtin/credentials/monday/",
    "primaryDocumentationUrl": "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.monday/"
  },
  "credentials": [
    {
      "name": "mondayApi",
      "required": true,
      "authType": "api_token",
      "description": "Monday.com API credentials supporting API token and OAuth2 authentication methods"
    }
  ],
  "supportedAuthMethods": [
    "API token",
    "OAuth2"
  ],
  "minVersion": "1.22.6",
  "supportsAiAgent": true,
  "nodeType": "action",
  "hasWebhooks": false,
  "hasTriggers": false,
  "supportsStreaming": false,
  "operations": [
    {
      "name": "Create Board",
      "description": "Create a new board in Monday.com",
      "action": "createBoard"
    },
    {
      "name": "Get Board",
      "description": "Get information about a board",
      "action": "getBoard"
    },
    {
      "name": "Get Boards",
      "description": "Get all boards",
      "action": "getBoards"
    },
    {
      "name": "Create Item",
      "description": "Create a new item on a board",
      "action": "createItem"
    },
    {
      "name": "Delete Item",
      "description": "Delete an item from a board",
      "action": "deleteItem"
    },
    {
      "name": "Get Item",
      "description": "Get information about an item",
      "action": "getItem"
    },
    {
      "name": "Get Items",
      "description": "Get all items from a board",
      "action": "getItems"
    },
    {
      "name": "Update Item",
      "description": "Update an existing item",
      "action": "updateItem"
    },
    {
      "name": "Create Column",
      "description": "Create a new column on a board",
      "action": "createColumn"
    },
    {
      "name": "Get Columns",
      "description": "Get all columns from a board",
      "action": "getColumns"
    },
    {
      "name": "Get Users",
      "description": "Get all users in the workspace",
      "action": "getUsers"
    },
    {
      "name": "Get Teams",
      "description": "Get all teams in the workspace",
      "action": "getTeams"
    }
  ],
  "commonParameters": [
    {
      "name": "boardId",
      "type": "string",
      "required": true,
      "description": "The ID of the board to operate on"
    },
    {
      "name": "itemId",
      "type": "string",
      "required": false,
      "description": "The ID of the item to operate on"
    },
    {
      "name": "columnId",
      "type": "string",
      "required": false,
      "description": "The ID of the column to operate on"
    }
  ],
  "outputFormat": {
    "type": "object",
    "description": "Monday.com API response containing the requested data"
  },
  "errorHandling": {
    "commonErrors": [
      {
        "code": "401",
        "message": "Unauthorized - Check your API credentials"
      },
      {
        "code": "403",
        "message": "Forbidden - Insufficient permissions"
      },
      {
        "code": "404",
        "message": "Not Found - Board or item does not exist"
      },
      {
        "code": "429",
        "message": "Rate limit exceeded"
      }
    ]
  },
  "examples": [
    {
      "name": "Create a new board",
      "description": "Creates a new board with specified name",
      "parameters": {
        "operation": "createBoard",
        "boardName": "My New Project",
        "boardKind": "public"
      }
    },
    {
      "name": "Add item to board",
      "description": "Creates a new item on an existing board",
      "parameters": {
        "operation": "createItem",
        "boardId": "123456789",
        "itemName": "New Task",
        "columnValues": {
          "status": "Working on it",
          "person": "john@example.com"
        }
      }
    },
    {
      "name": "Get all items from board",
      "description": "Retrieves all items from a specific board",
      "parameters": {
        "operation": "getItems",
        "boardId": "123456789",
        "limit": 50
      }
    }
  ],
  "bestPractices": [
    "Use appropriate rate limiting to avoid API quota exhaustion",
    "Handle errors gracefully with proper error checking",
    "Use specific board and item IDs for better performance",
    "Consider using Monday.com webhooks for real-time updates when possible",
    "Always validate required parameters before making API calls"
  ],
  "relatedNodes": [
    "HTTP Request",
    "Webhook",
    "Merge",
    "Set"
  ],
  "tags": [
    "monday.com",
    "project-management",
    "productivity",
    "boards",
    "items",
    "collaboration",
    "workflow-automation"
  ],
  "aiOptimization": {
    "supported": true,
    "description": "This node can be used to enhance AI agent capabilities. When used this way, many parameters can be set automatically or with information directed by AI.",
    "capabilities": [
      "Automatic board creation based on project requirements",
      "Smart item categorization and tagging",
      "Intelligent status updates based on context",
      "Dynamic column value assignment"
    ]
  },
  "integrationPatterns": [
    {
      "name": "Project Setup Automation",
      "description": "Automatically create boards and structure for new projects",
      "useCase": "When a new project is created in another system, automatically set up the Monday.com workspace"
    },
    {
      "name": "Status Synchronization",
      "description": "Keep Monday.com items in sync with external systems",
      "useCase": "Update Monday.com item status when tasks are completed in development tools"
    },
    {
      "name": "Reporting and Analytics",
      "description": "Extract data from Monday.com for reporting purposes",
      "useCase": "Generate weekly progress reports based on Monday.com board data"
    }
  ],
  "troubleshooting": {
    "commonIssues": [
      {
        "issue": "Authentication failures",
        "solution": "Verify API token is valid and has appropriate permissions"
      },
      {
        "issue": "Board not found errors",
        "solution": "Check board ID is correct and accessible with current credentials"
      },
      {
        "issue": "Rate limiting",
        "solution": "Implement proper delays between requests and use batch operations when possible"
      }
    ]
  }
};

export default mondayNode;