import { NodeTypeInfo } from '../../node-types.js';

export const langchainTextClassifierNode: NodeTypeInfo = {
  name: '@n8n/n8n-nodes-langchain.textClassifier',
  displayName: 'Text Classifier',
  description: 'Classify text into predefined categories using AI models. Perfect for content moderation, sentiment analysis, and automated tagging.',
  category: 'AI',
  subcategory: 'Text Processing',
  properties: [
    {
      name: 'classificationMode',
      displayName: 'Classification Mode',
      type: 'options',
      required: true,
      default: 'predefined',
      description: 'How to define the classification categories',
      options: [
        { name: 'Predefined Categories', value: 'predefined', description: 'Use a preset list of categories' },
        { name: 'Custom Categories', value: 'custom', description: 'Define your own categories' },
        { name: 'Binary Classification', value: 'binary', description: 'Simple yes/no classification' }
      ]
    },
    {
      name: 'predefinedType',
      displayName: 'Classification Type',
      type: 'options',
      required: true,
      default: 'sentiment',
      description: 'Type of predefined classification',
      displayOptions: {
        show: {
          classificationMode: ['predefined']
        }
      },
      options: [
        { name: 'Sentiment Analysis', value: 'sentiment', description: 'Positive, negative, neutral sentiment' },
        { name: 'Content Moderation', value: 'moderation', description: 'Safe, unsafe, questionable content' },
        { name: 'Language Detection', value: 'language', description: 'Detect text language' },
        { name: 'Spam Detection', value: 'spam', description: 'Spam vs legitimate content' },
        { name: 'Topic Classification', value: 'topic', description: 'General topic categories' },
        { name: 'Intent Recognition', value: 'intent', description: 'User intent classification' }
      ]
    },
    {
      name: 'customCategories',
      displayName: 'Custom Categories',
      type: 'fixedCollection',
      required: true,
      default: { categories: [] },
      description: 'Define custom classification categories',
      displayOptions: {
        show: {
          classificationMode: ['custom']
        }
      },
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      options: [
        {
          name: 'categories',
          displayName: 'Category',
          values: [
            {
              name: 'name',
              displayName: 'Category Name',
              type: 'string',
              required: true,
              default: '',
              description: 'Name of the classification category',
              placeholder: 'technology'
            },
            {
              name: 'description',
              displayName: 'Description',
              type: 'string',
              required: false,
              default: '',
              description: 'Description to help the AI understand this category',
              placeholder: 'Content related to technology, software, hardware, etc.'
            },
            {
              name: 'keywords',
              displayName: 'Keywords',
              type: 'string',
              required: false,
              default: '',
              description: 'Comma-separated keywords that indicate this category',
              placeholder: 'tech, software, computer, digital, AI'
            }
          ]
        }
      ]
    },
    {
      name: 'binaryQuestion',
      displayName: 'Classification Question',
      type: 'string',
      required: true,
      default: 'Is this text positive?',
      description: 'The yes/no question for binary classification',
      displayOptions: {
        show: {
          classificationMode: ['binary']
        }
      },
      typeOptions: {
        rows: 2
      }
    },
    {
      name: 'inputField',
      displayName: 'Input Field',
      type: 'string',
      required: true,
      default: 'text',
      description: 'Field name containing the text to classify'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional classification options',
      options: [
        {
      name: 'includeConfidence',
      displayName: 'Include Confidence Score',
      type: 'boolean',
      required: false,
          description: 'Include confidence score in the output'
    },
        {
      name: 'confidenceThreshold',
      displayName: 'Confidence Threshold',
      type: 'number',
      required: false,
      default: 0.5,
          description: 'Minimum confidence score to accept classification',
          typeOptions: {
            minValue: 0,
            maxValue: 1,
            numberPrecision: 2
    }
        },
        {
      name: 'fallbackCategory',
      displayName: 'Fallback Category',
      type: 'string',
      required: false,
      default: 'unknown',
          description: 'Category to use when confidence is below threshold'
    },
        {
      name: 'multiLabel',
      displayName: 'Multi-label Classification',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Allow multiple categories per text'
    },
        {
      name: 'maxCategories',
      displayName: 'Max Categories',
      type: 'number',
      required: false,
      default: 3,
          description: 'Maximum number of categories to return (multi-label mode)',
          displayOptions: {
            show: {
              multiLabel: [true]
    }
          },
          typeOptions: {
            minValue: 1,
            maxValue: 10
          }
        },
        {
      name: 'includeReasons',
      displayName: 'Include Reasoning',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Include explanation for the classification'
    },
        {
      name: 'customPrompt',
      displayName: 'Custom Prompt',
      type: 'string',
      required: false,
      default: '',
          description: 'Custom prompt template for classification',
          typeOptions: {
            rows: 3
    }
        }
      ]
    }
  ],
  inputs: [
    {
      type: 'ai_languageModel',
      displayName: 'Language Model',
      required: true
    },
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Classification results'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  langChainNode: true,
  version: [1],
  defaults: {
    name: 'Text Classifier',
    classificationMode: 'predefined',
    predefinedType: 'sentiment',
    inputField: 'text'
  },
  aliases: ['text classification', 'content classifier', 'sentiment analysis', 'categorize'],
  subtitle: '={{$parameter["classificationMode"] === "predefined" ? $parameter["predefinedType"] : $parameter["classificationMode"]}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Sentiment analysis for customer feedback',
      'Content moderation for user-generated content',
      'Email classification and routing',
      'Support ticket categorization',
      'Social media monitoring',
      'News article classification',
      'Product review analysis',
      'Intent recognition for chatbots'
    ],
    prerequisites: [
      'LangChain language model node connected',
      'Text data to classify',
      'Clear understanding of classification goals'
    ],
    errorHandling: {
      retryableErrors: ['Rate limit exceeded', 'Temporary model unavailable'],
      nonRetryableErrors: ['Invalid input field', 'Model not found', 'Authentication failed'],
      documentation: 'Ensure language model is connected and input field contains valid text data'
    }
  },
  examples: [
    {
      name: 'Sentiment Analysis',
      description: 'Analyze sentiment of customer reviews',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o-mini',
              options: {
                temperature: 0.1
              }
            }
          },
          {
            name: 'Sentiment Classifier',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            parameters: {
              classificationMode: 'predefined',
              predefinedType: 'sentiment',
              inputField: 'review_text',
              options: {
                includeConfidence: true,
                confidenceThreshold: 0.7,
                includeReasons: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Custom Topic Classification',
      description: 'Classify articles into custom business categories',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o',
              options: {
                temperature: 0
              }
            }
          },
          {
            name: 'Topic Classifier',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            parameters: {
              classificationMode: 'custom',
              customCategories: {
                categories: [
                  {
                    name: 'product_updates',
                    description: 'News about product features, releases, and improvements',
                    keywords: 'product, feature, release, update, version'
                  },
                  {
                    name: 'customer_success',
                    description: 'Customer stories, case studies, and testimonials',
                    keywords: 'customer, success, case study, testimonial'
                  },
                  {
                    name: 'industry_insights',
                    description: 'Industry trends, analysis, and market insights',
                    keywords: 'industry, trend, market, analysis, insight'
                  },
                  {
                    name: 'company_news',
                    description: 'Company announcements, hiring, and internal news',
                    keywords: 'company, announcement, hiring, team, internal'
                  }
                ]
              },
              inputField: 'article_content',
              options: {
                includeConfidence: true,
                confidenceThreshold: 0.6,
                multiLabel: true,
                maxCategories: 2
              }
            }
          }
        ]
      }
    },
    {
      name: 'Content Moderation',
      description: 'Moderate user-generated content for safety',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o-mini',
              options: {
                temperature: 0
              }
            }
          },
          {
            name: 'Content Moderator',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            parameters: {
              classificationMode: 'predefined',
              predefinedType: 'moderation',
              inputField: 'user_content',
              options: {
                includeConfidence: true,
                confidenceThreshold: 0.8,
                fallbackCategory: 'needs_review',
                includeReasons: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Binary Decision Classifier',
      description: 'Simple yes/no classification for specific criteria',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o-mini'
            }
          },
          {
            name: 'Urgency Classifier',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            parameters: {
              classificationMode: 'binary',
              binaryQuestion: 'Does this support ticket require immediate attention or urgent response?',
              inputField: 'ticket_description',
              options: {
                includeConfidence: true,
                confidenceThreshold: 0.7,
                includeReasons: true,
                customPrompt: 'You are analyzing support tickets for urgency. Consider factors like: customer impact, system downtime, security issues, revenue impact, and explicit urgency indicators.'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Multi-label Email Classification',
      description: 'Classify emails into multiple categories simultaneously',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o',
              options: {
                temperature: 0.1
              }
            }
          },
          {
            name: 'Email Classifier',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            parameters: {
              classificationMode: 'custom',
              customCategories: {
                categories: [
                  {
                    name: 'support_request',
                    description: 'Customer asking for help or reporting an issue',
                    keywords: 'help, issue, problem, bug, error, support'
                  },
                  {
                    name: 'sales_inquiry',
                    description: 'Interest in purchasing or pricing questions',
                    keywords: 'price, buy, purchase, quote, sales, demo'
                  },
                  {
                    name: 'feedback',
                    description: 'Customer providing feedback or suggestions',
                    keywords: 'feedback, suggestion, improvement, review'
                  },
                  {
                    name: 'urgent',
                    description: 'Requires immediate attention',
                    keywords: 'urgent, emergency, critical, asap, immediately'
                  }
                ]
              },
              inputField: 'email_body',
              options: {
                includeConfidence: true,
                confidenceThreshold: 0.5,
                multiLabel: true,
                maxCategories: 3,
                includeReasons: false
              }
            }
          }
        ]
      }
    }
  ]
};