/**
 * Real n8n Workflow Examples
 * 
 * These are complete, functional workflow examples using the actual node structures
 * that AI agents have implemented. Each workflow can be imported directly into n8n.
 */

export interface RealWorkflowExample {
  id: string;
  name: string;
  description: string;
  category: string;
  useCase: string;
  workflow: any; // Complete n8n workflow JSON
  setup: {
    credentials: string[];
    configuration: Array<{
      node: string;
      instructions: string;
    }>;
    testing: string[];
  };
  aiAgentNotes: string[];
}

export const REAL_WORKFLOW_EXAMPLES: RealWorkflowExample[] = [
  {
    id: 'slack_notification_system',
    name: 'Slack Notification System',
    description: 'Complete notification system using real Slack node structure with resource locators',
    category: 'Communication',
    useCase: 'Send formatted notifications to Slack channels with conditional logic',
    workflow: {
      "meta": {
        "instanceId": "n8n-workflow-example"
      },
      "nodes": [
        {
          "parameters": {},
          "id": "webhook-trigger",
          "name": "Webhook Trigger",
          "type": "n8n-nodes-base.webhook",
          "typeVersion": 1,
          "position": [100, 200]
        },
        {
          "parameters": {
            "conditions": {
              "options": {
                "version": 2,
                "caseSensitive": true,
                "typeValidation": "strict"
              },
              "combinator": "and",
              "conditions": [
                {
                  "id": "priority_check",
                  "operator": {
                    "type": "string",
                    "operation": "equals"
                  },
                  "leftValue": "={{$json.priority}}",
                  "rightValue": "high"
                }
              ]
            }
          },
          "id": "condition-check",
          "name": "Check Priority",
          "type": "n8n-nodes-base.if",
          "typeVersion": 2,
          "position": [300, 200]
        },
        {
          "parameters": {
            "mode": "manual",
            "duplicateItem": true,
            "assignments": {
              "assignments": [
                {
                  "id": "message_field",
                  "name": "formattedMessage",
                  "type": "string",
                  "value": "🚨 **{{$json.type}}**: {{$json.message}}\\n\\n**Priority**: {{$json.priority}}\\n**Time**: {{$now}}"
                },
                {
                  "id": "channel_field",
                  "name": "targetChannel",
                  "type": "string",
                  "value": "={{$json.priority === 'critical' ? 'alerts' : 'general'}}"
                }
              ]
            }
          },
          "id": "format-message",
          "name": "Format Message",
          "type": "n8n-nodes-base.set",
          "typeVersion": 3,
          "position": [500, 200]
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "post",
            "authentication": "accessToken",
            "select": "channel",
            "channelId": {
              "__rl": true,
              "mode": "name",
              "value": "={{$json.targetChannel}}"
            },
            "text": "={{$json.formattedMessage}}",
            "otherOptions": {
              "username": "n8n-bot",
              "icon_emoji": ":robot_face:",
              "link_names": true
            }
          },
          "id": "send-slack",
          "name": "Send to Slack",
          "type": "n8n-nodes-base.slack",
          "typeVersion": 2,
          "position": [700, 200],
          "credentials": {
            "slackApi": {
              "id": "slack-credentials",
              "name": "Slack API"
            }
          }
        }
      ],
      "connections": {
        "Webhook Trigger": {
          "main": [
            [
              {
                "node": "Check Priority",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Check Priority": {
          "main": [
            [
              {
                "node": "Format Message",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Format Message": {
          "main": [
            [
              {
                "node": "Send to Slack",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      },
      "settings": {
        "executionOrder": "v1"
      }
    },
    setup: {
      credentials: ["Slack API Token"],
      configuration: [
        {
          node: "Webhook Trigger",
          instructions: "Configure webhook path and HTTP method. Note the webhook URL for external systems."
        },
        {
          node: "Check Priority",
          instructions: "Update conditions based on your priority levels (high, medium, low, critical)."
        },
        {
          node: "Send to Slack",
          instructions: "Configure Slack credentials and verify channel permissions."
        }
      ],
      testing: [
        "Send test webhook with priority='high' to verify message formatting",
        "Test with different priority levels to ensure conditional routing works",
        "Verify Slack bot permissions and channel access"
      ]
    },
    aiAgentNotes: [
      "Uses real Slack node structure with __rl resource locators",
      "IF node uses version 2 conditions format with proper operators",
      "Set node uses assignments structure instead of manual fields",
      "Expression syntax follows n8n patterns: ={{expression}}",
      "Channel selection is dynamic based on priority level"
    ]
  },

  {
    id: 'ai_content_pipeline',
    name: 'AI Content Generation Pipeline',
    description: 'Complete AI workflow using LangChain nodes for content generation and classification',
    category: 'AI & Content',
    useCase: 'Generate, classify, and distribute AI-generated content with structured output',
    workflow: {
      "meta": {
        "instanceId": "ai-content-pipeline"
      },
      "nodes": [
        {
          "parameters": {},
          "id": "manual-trigger",
          "name": "Start Generation",
          "type": "n8n-nodes-base.manualTrigger",
          "typeVersion": 1,
          "position": [100, 200]
        },
        {
          "parameters": {
            "mode": "manual",
            "duplicateItem": false,
            "assignments": {
              "assignments": [
                {
                  "id": "prompt_field",
                  "name": "prompt",
                  "type": "string",
                  "value": "Write a comprehensive blog post about the benefits of automation in modern businesses. Include practical examples and actionable insights."
                },
                {
                  "id": "context_field",
                  "name": "context",
                  "type": "string",
                  "value": "Target audience: business managers and decision makers"
                },
                {
                  "id": "requestId_field",
                  "name": "requestId",
                  "type": "string",
                  "value": "={{$randomString(8)}}"
                }
              ]
            }
          },
          "id": "prepare-prompt",
          "name": "Prepare Prompt",
          "type": "n8n-nodes-base.set",
          "typeVersion": 3,
          "position": [300, 200]
        },
        {
          "parameters": {
            "model": "gpt-4o",
            "options": {
              "temperature": 0.7,
              "maxTokens": 2000,
              "responseFormat": "text"
            }
          },
          "id": "openai-model",
          "name": "OpenAI Chat Model",
          "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
          "typeVersion": 1,
          "position": [500, 150],
          "credentials": {
            "openAiApi": {
              "id": "openai-credentials",
              "name": "OpenAI API"
            }
          }
        },
        {
          "parameters": {
            "prompt": "You are an expert business content writer. Based on the following context and prompt, create engaging and informative content:\\n\\nContext: {{$json.context}}\\nPrompt: {{$json.prompt}}\\n\\nPlease provide well-structured, professional content.",
            "options": {
              "humanMessageKey": "prompt",
              "outputKey": "content",
              "verbose": false
            }
          },
          "id": "llm-chain",
          "name": "Content Generation Chain",
          "type": "@n8n/n8n-nodes-langchain.chainLlm",
          "typeVersion": 1,
          "position": [700, 200]
        },
        {
          "parameters": {
            "classificationMode": "custom",
            "customCategories": {
              "categories": [
                {
                  "name": "business_strategy",
                  "description": "Content related to business strategy, planning, and management",
                  "keywords": "strategy, planning, management, leadership"
                },
                {
                  "name": "technology",
                  "description": "Content about technology, automation, and digital transformation",
                  "keywords": "technology, automation, digital, software, AI"
                },
                {
                  "name": "productivity",
                  "description": "Content focused on productivity, efficiency, and optimization",
                  "keywords": "productivity, efficiency, optimization, workflow"
                }
              ]
            },
            "inputField": "content",
            "options": {
              "includeConfidence": true,
              "confidenceThreshold": 0.7,
              "includeReasons": true
            }
          },
          "id": "content-classifier",
          "name": "Classify Content",
          "type": "@n8n/n8n-nodes-langchain.textClassifier",
          "typeVersion": 1,
          "position": [900, 200]
        },
        {
          "parameters": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Extracted or generated title for the content"
                },
                "summary": {
                  "type": "string",
                  "description": "Brief summary of the content (max 200 characters)"
                },
                "key_points": {
                  "type": "array",
                  "items": {"type": "string"},
                  "description": "Main points or takeaways from the content"
                },
                "word_count": {
                  "type": "number",
                  "description": "Approximate word count"
                },
                "reading_time": {
                  "type": "number",
                  "description": "Estimated reading time in minutes"
                }
              },
              "required": ["title", "summary", "key_points"]
            },
            "options": {
              "strictMode": true,
              "includeRawOutput": false,
              "fixJsonErrors": true
            }
          },
          "id": "output-parser",
          "name": "Parse Content Metadata",
          "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
          "typeVersion": 1,
          "position": [1100, 200]
        },
        {
          "parameters": {
            "mode": "manual",
            "duplicateItem": true,
            "assignments": {
              "assignments": [
                {
                  "id": "final_content",
                  "name": "finalContent",
                  "type": "object",
                  "value": "={{{\n  requestId: $('Prepare Prompt').first().$json.requestId,\n  content: $('Content Generation Chain').first().$json.content,\n  classification: $('Classify Content').first().$json,\n  metadata: $json,\n  generatedAt: $now,\n  status: 'completed'\n}}}"
                }
              ]
            }
          },
          "id": "combine-results",
          "name": "Combine Results",
          "type": "n8n-nodes-base.set",
          "typeVersion": 3,
          "position": [1300, 200]
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "post",
            "authentication": "accessToken",
            "select": "channel",
            "channelId": {
              "__rl": true,
              "mode": "name",
              "value": "content-review"
            },
            "text": "🤖 **New AI-Generated Content Ready for Review**\\n\\n**Title**: {{$json.finalContent.metadata.title}}\\n**Category**: {{$json.finalContent.classification.category}}\\n**Confidence**: {{$json.finalContent.classification.confidence}}\\n**Summary**: {{$json.finalContent.metadata.summary}}\\n\\n**Key Points**:\\n{{$json.finalContent.metadata.key_points.map(point => '• ' + point).join('\\n')}}\\n\\n**Reading Time**: ~{{$json.finalContent.metadata.reading_time}} minutes\\n**Generated**: {{$json.finalContent.generatedAt}}",
            "otherOptions": {
              "username": "Content Bot",
              "icon_emoji": ":memo:"
            }
          },
          "id": "notify-team",
          "name": "Notify Content Team",
          "type": "n8n-nodes-base.slack",
          "typeVersion": 2,
          "position": [1500, 200],
          "credentials": {
            "slackApi": {
              "id": "slack-credentials",
              "name": "Slack API"
            }
          }
        }
      ],
      "connections": {
        "Start Generation": {
          "main": [
            [
              {
                "node": "Prepare Prompt",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Prepare Prompt": {
          "main": [
            [
              {
                "node": "OpenAI Chat Model",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "OpenAI Chat Model": {
          "main": [
            [
              {
                "node": "Content Generation Chain",
                "type": "ai_languageModel",
                "index": 0
              }
            ]
          ]
        },
        "Content Generation Chain": {
          "main": [
            [
              {
                "node": "Classify Content",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Classify Content": {
          "main": [
            [
              {
                "node": "Parse Content Metadata",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Parse Content Metadata": {
          "main": [
            [
              {
                "node": "Combine Results",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Combine Results": {
          "main": [
            [
              {
                "node": "Notify Content Team",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      },
      "settings": {
        "executionOrder": "v1"
      }
    },
    setup: {
      credentials: ["OpenAI API Key", "Slack API Token"],
      configuration: [
        {
          node: "OpenAI Chat Model",
          instructions: "Configure OpenAI API credentials and select appropriate model based on content complexity."
        },
        {
          node: "Content Generation Chain",
          instructions: "Customize prompt template based on your content requirements and brand voice."
        },
        {
          node: "Classify Content",
          instructions: "Update custom categories to match your content taxonomy and classification needs."
        },
        {
          node: "Parse Content Metadata",
          instructions: "Modify JSON schema to extract the metadata fields most relevant to your workflow."
        }
      ],
      testing: [
        "Test with different prompt types to ensure content quality",
        "Verify classification accuracy with sample content",
        "Check that structured output parser extracts metadata correctly",
        "Confirm Slack notifications include all required information"
      ]
    },
    aiAgentNotes: [
      "Demonstrates complete LangChain workflow with proper node connections",
      "Uses AI-specific connection types (ai_languageModel) between LangChain nodes",
      "Shows proper parameter structure for all LangChain nodes",
      "Combines multiple AI operations: generation, classification, and parsing",
      "Includes complex expression syntax for data transformation and aggregation",
      "Real-world example of AI content pipeline with quality control and team notification"
    ]
  },

  {
    id: 'email_processing_system',
    name: 'Email Processing with Gmail',
    description: 'Complete email automation using real Gmail node structure with proper operations',
    category: 'Communication',
    useCase: 'Process incoming emails, extract information, and trigger actions based on content',
    workflow: {
      "meta": {
        "instanceId": "email-processing-system"
      },
      "nodes": [
        {
          "parameters": {
            "rule": "0 */15 * * *",
            "timezone": "UTC"
          },
          "id": "schedule-trigger",
          "name": "Check Every 15 Minutes",
          "type": "n8n-nodes-base.scheduleTrigger",
          "typeVersion": 1,
          "position": [100, 200]
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "getAll",
            "returnAll": false,
            "limit": 50,
            "filters": {
              "q": "is:unread in:inbox",
              "labelIds": ["INBOX", "UNREAD"]
            },
            "options": {
              "includeSpamTrash": false,
              "format": "full"
            }
          },
          "id": "get-emails",
          "name": "Get Unread Emails",
          "type": "n8n-nodes-base.gmail",
          "typeVersion": 2,
          "position": [300, 200],
          "credentials": {
            "gmailOAuth2": {
              "id": "gmail-credentials",
              "name": "Gmail OAuth2"
            }
          }
        },
        {
          "parameters": {
            "conditions": {
              "options": {
                "version": 2,
                "caseSensitive": false,
                "typeValidation": "strict"
              },
              "combinator": "or",
              "conditions": [
                {
                  "id": "urgent_keyword",
                  "operator": {
                    "type": "string",
                    "operation": "contains"
                  },
                  "leftValue": "={{$json.payload.headers.find(h => h.name === 'Subject').value}}",
                  "rightValue": "urgent"
                },
                {
                  "id": "priority_keyword",
                  "operator": {
                    "type": "string",
                    "operation": "contains"
                  },
                  "leftValue": "={{$json.payload.headers.find(h => h.name === 'Subject').value}}",
                  "rightValue": "priority"
                }
              ]
            }
          },
          "id": "check-urgency",
          "name": "Check if Urgent",
          "type": "n8n-nodes-base.if",
          "typeVersion": 2,
          "position": [500, 200]
        },
        {
          "parameters": {
            "mode": "manual",
            "duplicateItem": true,
            "assignments": {
              "assignments": [
                {
                  "id": "email_data",
                  "name": "processedEmail",
                  "type": "object",
                  "value": "={{{\n  messageId: $json.id,\n  threadId: $json.threadId,\n  subject: $json.payload.headers.find(h => h.name === 'Subject').value,\n  from: $json.payload.headers.find(h => h.name === 'From').value,\n  date: $json.payload.headers.find(h => h.name === 'Date').value,\n  snippet: $json.snippet,\n  isUrgent: true,\n  processedAt: $now\n}}}"
                }
              ]
            }
          },
          "id": "extract-email-data",
          "name": "Extract Email Data",
          "type": "n8n-nodes-base.set",
          "typeVersion": 3,
          "position": [700, 150]
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "addLabels",
            "messageId": "={{$json.processedEmail.messageId}}",
            "labelIds": ["IMPORTANT"]
          },
          "id": "mark-important",
          "name": "Mark as Important",
          "type": "n8n-nodes-base.gmail",
          "typeVersion": 2,
          "position": [900, 150],
          "credentials": {
            "gmailOAuth2": {
              "id": "gmail-credentials",
              "name": "Gmail OAuth2"
            }
          }
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "post",
            "authentication": "accessToken",
            "select": "channel",
            "channelId": {
              "__rl": true,
              "mode": "name",
              "value": "urgent-emails"
            },
            "text": "📧 **Urgent Email Alert**\\n\\n**From**: {{$json.processedEmail.from}}\\n**Subject**: {{$json.processedEmail.subject}}\\n**Date**: {{$json.processedEmail.date}}\\n\\n**Preview**: {{$json.processedEmail.snippet}}\\n\\n**Message ID**: {{$json.processedEmail.messageId}}",
            "otherOptions": {
              "username": "Email Bot",
              "icon_emoji": ":email:"
            }
          },
          "id": "notify-urgent",
          "name": "Notify Team of Urgent Email",
          "type": "n8n-nodes-base.slack",
          "typeVersion": 2,
          "position": [1100, 150],
          "credentials": {
            "slackApi": {
              "id": "slack-credentials",
              "name": "Slack API"
            }
          }
        },
        {
          "parameters": {
            "mode": "manual",
            "duplicateItem": true,
            "assignments": {
              "assignments": [
                {
                  "id": "regular_email_data",
                  "name": "processedEmail",
                  "type": "object",
                  "value": "={{{\n  messageId: $json.id,\n  threadId: $json.threadId,\n  subject: $json.payload.headers.find(h => h.name === 'Subject').value,\n  from: $json.payload.headers.find(h => h.name === 'From').value,\n  date: $json.payload.headers.find(h => h.name === 'Date').value,\n  snippet: $json.snippet,\n  isUrgent: false,\n  processedAt: $now\n}}}"
                }
              ]
            }
          },
          "id": "process-regular",
          "name": "Process Regular Email",
          "type": "n8n-nodes-base.set",
          "typeVersion": 3,
          "position": [700, 250]
        },
        {
          "parameters": {
            "resource": "message",
            "operation": "markAsRead",
            "messageId": "={{$json.processedEmail.messageId}}"
          },
          "id": "mark-read",
          "name": "Mark as Read",
          "type": "n8n-nodes-base.gmail",
          "typeVersion": 2,
          "position": [900, 250],
          "credentials": {
            "gmailOAuth2": {
              "id": "gmail-credentials",
              "name": "Gmail OAuth2"
            }
          }
        }
      ],
      "connections": {
        "Check Every 15 Minutes": {
          "main": [
            [
              {
                "node": "Get Unread Emails",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Get Unread Emails": {
          "main": [
            [
              {
                "node": "Check if Urgent",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Check if Urgent": {
          "main": [
            [
              {
                "node": "Extract Email Data",
                "type": "main",
                "index": 0
              }
            ],
            [
              {
                "node": "Process Regular Email",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Extract Email Data": {
          "main": [
            [
              {
                "node": "Mark as Important",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Mark as Important": {
          "main": [
            [
              {
                "node": "Notify Team of Urgent Email",
                "type": "main",
                "index": 0
              }
            ]
          ]
        },
        "Process Regular Email": {
          "main": [
            [
              {
                "node": "Mark as Read",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      },
      "settings": {
        "executionOrder": "v1"
      }
    },
    setup: {
      credentials: ["Gmail OAuth2", "Slack API Token"],
      configuration: [
        {
          node: "Get Unread Emails",
          instructions: "Configure Gmail OAuth2 credentials and adjust email filters based on your needs."
        },
        {
          node: "Check if Urgent",
          instructions: "Update urgent keywords and conditions based on your email prioritization criteria."
        },
        {
          node: "Mark as Important",
          instructions: "Ensure the IMPORTANT label exists in Gmail or adjust to use custom labels."
        }
      ],
      testing: [
        "Send test emails with urgent keywords to verify detection",
        "Check that Gmail labels are applied correctly",
        "Verify Slack notifications contain all required email information",
        "Test with various email formats and senders"
      ]
    },
    aiAgentNotes: [
      "Uses real Gmail node structure with proper resource/operation combinations",
      "Demonstrates Gmail operations: getAll, addLabels, markAsRead",
      "Shows proper email data extraction using header arrays",
      "Includes branching workflow with IF node version 2 conditions",
      "Complex expressions for extracting email metadata from Gmail API response",
      "Proper OAuth2 credential configuration for Gmail access"
    ]
  }
];

/**
 * Get workflow example by ID
 */
export function getRealWorkflowExample(id: string): RealWorkflowExample | undefined {
  return REAL_WORKFLOW_EXAMPLES.find(example => example.id === id);
}

/**
 * Get workflow examples by category
 */
export function getRealWorkflowExamplesByCategory(category: string): RealWorkflowExample[] {
  return REAL_WORKFLOW_EXAMPLES.filter(example => example.category === category);
}

/**
 * Get all available workflow example categories
 */
export function getRealWorkflowCategories(): string[] {
  return [...new Set(REAL_WORKFLOW_EXAMPLES.map(example => example.category))];
}

/**
 * Search workflow examples by use case or description
 */
export function searchRealWorkflowExamples(query: string): RealWorkflowExample[] {
  const queryLower = query.toLowerCase();
  return REAL_WORKFLOW_EXAMPLES.filter(example =>
    example.name.toLowerCase().includes(queryLower) ||
    example.description.toLowerCase().includes(queryLower) ||
    example.useCase.toLowerCase().includes(queryLower) ||
    example.aiAgentNotes.some(note => note.toLowerCase().includes(queryLower))
  );
}

export default {
  REAL_WORKFLOW_EXAMPLES,
  getRealWorkflowExample,
  getRealWorkflowExamplesByCategory,
  getRealWorkflowCategories,
  searchRealWorkflowExamples
};