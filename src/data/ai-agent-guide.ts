/**
 * AI Agent Usage Guide for n8n MCP Server
 * 
 * This guide provides AI agents with essential information for effectively
 * using the n8n node catalog to create workflows and automations.
 */

export interface AgentGuidance {
  nodeUsage: NodeUsageGuide;
  workflowPatterns: WorkflowPattern[];
  bestPractices: BestPractice[];
  troubleshooting: TroubleshootingGuide;
}

export interface NodeUsageGuide {
  category: string;
  nodes: {
    name: string;
    whenToUse: string;
    commonParams: string[];
    examples: string[];
  }[];
}

export interface WorkflowPattern {
  name: string;
  description: string;
  useCase: string;
  complexity: 'simple' | 'moderate' | 'complex';
  nodes: string[];
  structure: string;
}

export interface BestPractice {
  category: string;
  title: string;
  description: string;
  examples: string[];
}

export interface TroubleshootingGuide {
  commonErrors: {
    error: string;
    cause: string;
    solution: string;
  }[];
  debuggingTips: string[];
}

export const AI_AGENT_GUIDANCE: AgentGuidance = {
  nodeUsage: {
    category: "Core Node Usage Patterns",
    nodes: [
      {
        name: "Manual Trigger",
        whenToUse: "Start workflows manually or for testing. Always use as the first node in test workflows.",
        commonParams: ["executionsLimit: 0 (unlimited)"],
        examples: [
          "Testing new workflows",
          "One-time data processing",
          "Manual approval processes"
        ]
      },
      {
        name: "Schedule Trigger",
        whenToUse: "Run workflows on a schedule (cron-like). Use for recurring automation tasks.",
        commonParams: [
          "rule: '0 9 * * 1-5' (weekdays at 9 AM)",
          "timezone: 'America/New_York'"
        ],
        examples: [
          "Daily report generation",
          "Weekly data backups",
          "Monthly cleanup tasks"
        ]
      },
      {
        name: "HTTP Request",
        whenToUse: "Call external APIs, send data to webhooks, or fetch data from web services.",
        commonParams: [
          "method: 'GET'|'POST'|'PUT'|'DELETE'",
          "url: 'https://api.example.com/endpoint'",
          "authentication: for secured APIs"
        ],
        examples: [
          "Fetching data from REST APIs",
          "Sending notifications to external services",
          "Integrating with third-party platforms"
        ]
      },
      {
        name: "Code",
        whenToUse: "Custom data processing, complex logic, or transformations not available in other nodes.",
        commonParams: [
          "language: 'javascript'|'python'",
          "mode: 'runOnceForAllItems'|'runOnceForEachItem'"
        ],
        examples: [
          "Data transformation and cleaning",
          "Complex calculations",
          "Custom business logic"
        ]
      },
      {
        name: "IF",
        whenToUse: "Route data based on conditions. Essential for conditional workflow logic.",
        commonParams: [
          "conditions: array of condition objects",
          "combinator: 'and'|'or'"
        ],
        examples: [
          "Processing only high-priority items",
          "Different actions based on data values",
          "Error handling and fallback logic"
        ]
      },
      {
        name: "Edit Fields (Set)",
        whenToUse: "Add, modify, or remove fields from data. Use for data preparation and formatting.",
        commonParams: [
          "mode: 'manual'|'expression'",
          "fields: array of field definitions"
        ],
        examples: [
          "Adding timestamps to data",
          "Formatting data for external APIs",
          "Creating computed fields"
        ]
      },
      {
        name: "Slack",
        whenToUse: "Send notifications, create channels, or manage team communication.",
        commonParams: [
          "resource: 'message'|'channel'|'file'",
          "operation: 'send'|'create'|'upload'",
          "channel: '#channel' or '@user'"
        ],
        examples: [
          "Workflow completion notifications",
          "Error alerts to team channels",
          "Status updates for long-running processes"
        ]
      },
      {
        name: "GitHub",
        whenToUse: "Manage repositories, issues, pull requests, and automate development workflows.",
        commonParams: [
          "resource: 'issue'|'pullRequest'|'repository'",
          "repository: 'owner/repo' format",
          "authentication: personal access token"
        ],
        examples: [
          "Creating issues from monitoring alerts",
          "Automating pull request workflows",
          "Release management and tagging"
        ]
      },
      {
        name: "OpenAI",
        whenToUse: "AI-powered text generation, image creation, or audio processing.",
        commonParams: [
          "resource: 'text'|'image'|'audio'",
          "model: 'gpt-4o'|'gpt-3.5-turbo'|'dall-e-3'",
          "temperature: 0.0-1.0 (creativity level)"
        ],
        examples: [
          "Content generation and writing assistance",
          "Data analysis and summarization",
          "Image generation for marketing",
          "Audio transcription and processing"
        ]
      }
    ]
  },

  workflowPatterns: [
    {
      name: "Simple Notification",
      description: "Send a notification based on a trigger",
      useCase: "Alert teams when something happens",
      complexity: "simple",
      nodes: ["Trigger", "Condition (optional)", "Notification"],
      structure: "Trigger → [IF] → Slack/Email/Webhook"
    },
    {
      name: "Data Processing Pipeline",
      description: "Fetch, transform, and store data",
      useCase: "ETL operations, data synchronization",
      complexity: "moderate",
      nodes: ["Trigger", "HTTP Request", "Code/Set", "Storage"],
      structure: "Schedule → HTTP Request → Code/Set → Database/File"
    },
    {
      name: "API Integration",
      description: "Connect two services via their APIs",
      useCase: "Sync data between platforms",
      complexity: "moderate",
      nodes: ["Trigger", "Source API", "Transform", "Target API"],
      structure: "Webhook → HTTP Request (fetch) → Set → HTTP Request (send)"
    },
    {
      name: "Error Handling Workflow",
      description: "Robust workflow with error recovery",
      useCase: "Production workflows requiring reliability",
      complexity: "complex",
      nodes: ["Trigger", "Main Logic", "Error Handler", "Notification"],
      structure: "Trigger → Main Flow → [Error Catch] → Slack Alert"
    },
    {
      name: "AI Content Generation",
      description: "Generate content using AI models",
      useCase: "Automated content creation, analysis",
      complexity: "moderate",
      nodes: ["Trigger", "Data Prep", "OpenAI", "Post-process"],
      structure: "Manual/Schedule → Set (prepare prompt) → OpenAI → Set (format)"
    },
    {
      name: "GitHub DevOps Automation",
      description: "Automate development and release processes",
      useCase: "CI/CD, issue management, code review",
      complexity: "complex",
      nodes: ["Webhook", "Condition", "GitHub", "Slack", "HTTP Request"],
      structure: "GitHub Webhook → IF → GitHub (action) → Slack (notify)"
    }
  ],

  bestPractices: [
    {
      category: "Workflow Design",
      title: "Start Simple, Then Enhance",
      description: "Begin with a basic workflow and gradually add complexity",
      examples: [
        "Start with Manual Trigger for testing",
        "Add error handling after core logic works",
        "Implement rate limiting for production use"
      ]
    },
    {
      category: "Data Handling",
      title: "Always Validate Input Data",
      description: "Check data structure and content before processing",
      examples: [
        "Use IF nodes to check for required fields",
        "Validate API responses before using data",
        "Set default values for missing data"
      ]
    },
    {
      category: "Error Management",
      title: "Implement Comprehensive Error Handling",
      description: "Plan for failures and provide recovery mechanisms",
      examples: [
        "Use Try/Catch patterns with IF nodes",
        "Send error notifications to monitoring channels",
        "Implement retry logic for transient failures"
      ]
    },
    {
      category: "Security",
      title: "Protect Credentials and Sensitive Data",
      description: "Use proper authentication and avoid exposing secrets",
      examples: [
        "Store API keys in credential manager",
        "Use OAuth2 when available",
        "Avoid logging sensitive information"
      ]
    },
    {
      category: "Performance",
      title: "Optimize for Efficiency",
      description: "Design workflows to minimize resource usage and execution time",
      examples: [
        "Use pagination for large datasets",
        "Implement conditional processing to skip unnecessary operations",
        "Cache frequently accessed data"
      ]
    },
    {
      category: "Monitoring",
      title: "Add Visibility and Logging",
      description: "Make workflows observable and debuggable",
      examples: [
        "Add status notifications at key points",
        "Log important data transformations",
        "Use meaningful node names for clarity"
      ]
    }
  ],

  troubleshooting: {
    commonErrors: [
      {
        error: "Authentication Failed",
        cause: "Invalid API keys, expired tokens, or insufficient permissions",
        solution: "Verify credentials, check token expiration, ensure proper scopes/permissions"
      },
      {
        error: "Rate Limit Exceeded",
        cause: "Too many API requests in a short time period",
        solution: "Implement delays between requests, use pagination, consider upgrading API limits"
      },
      {
        error: "Data Not Found",
        cause: "Trying to access non-existent resources or incorrect identifiers",
        solution: "Validate IDs/names, check if resources exist, handle missing data gracefully"
      },
      {
        error: "Invalid JSON/Data Format",
        cause: "Malformed data structure or unexpected response format",
        solution: "Validate data structure, use Code node to handle edge cases, check API documentation"
      },
      {
        error: "Timeout Error",
        cause: "Network issues or slow external services",
        solution: "Increase timeout settings, implement retry logic, check service status"
      },
      {
        error: "Workflow Execution Failed",
        cause: "Node configuration errors or data processing issues",
        solution: "Check node parameters, validate input data, use debug mode to trace execution"
      }
    ],
    debuggingTips: [
      "Use Manual Trigger for testing individual workflow components",
      "Enable debug mode to see data flow between nodes",
      "Check execution logs for error details and stack traces",
      "Validate data structure at each step using Set node with debug output",
      "Test API endpoints independently before integrating into workflows",
      "Use IF nodes to handle edge cases and unexpected data",
      "Implement gradual rollout for production workflows",
      "Monitor execution times and resource usage for optimization opportunities"
    ]
  }
};

/**
 * AI Agent Quick Reference for Common Tasks
 */
export const QUICK_REFERENCE = {
  // Most common workflow starting points
  commonTriggers: {
    testing: "Manual Trigger",
    scheduled: "Schedule Trigger (cron: '0 9 * * 1-5')",
    webhooks: "Webhook Trigger",
    fileChanges: "File Trigger"
  },

  // Common data operations
  dataOperations: {
    transform: "Code node (JavaScript/Python)",
    filter: "IF node with conditions",
    format: "Set node (manual mode)",
    validate: "IF node with validation logic"
  },

  // Popular integrations
  integrations: {
    notifications: "Slack (message to #channel)",
    storage: "Google Sheets, Airtable, Database nodes",
    apis: "HTTP Request node with authentication",
    ai: "OpenAI node (text/image/audio resources)",
    development: "GitHub node (issues, PRs, releases)",
    email: "Gmail, Outlook nodes",
    files: "Google Drive, Dropbox, local File nodes"
  },

  // Essential node combinations
  nodePatterns: {
    "API → Transform → Store": "HTTP Request → Code/Set → Database",
    "Schedule → Process → Notify": "Schedule → HTTP Request → Slack",
    "Webhook → Validate → Action": "Webhook → IF → GitHub/Slack",
    "Manual → AI → Format": "Manual → OpenAI → Set",
    "Trigger → Split → Merge": "Trigger → IF (multiple outputs) → Merge"
  }
};

export default AI_AGENT_GUIDANCE;