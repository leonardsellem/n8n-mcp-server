import { NodeTypeInfo } from '../../node-types.js';

export const langchainOpenAINode: NodeTypeInfo = {
  name: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
  displayName: 'OpenAI Chat Model',
  description: 'Use OpenAI chat models like GPT-4, GPT-3.5-turbo for conversational AI, text generation, and advanced language processing within LangChain workflows.',
  category: 'AI',
  subcategory: 'Language Models',
  properties: [
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'gpt-4o-mini',
      description: 'The OpenAI model to use',
      options: [
        { name: 'GPT-4o', value: 'gpt-4o', description: 'Latest GPT-4 Omni model with vision and audio' },
        { name: 'GPT-4o Mini', value: 'gpt-4o-mini', description: 'Faster, cheaper version of GPT-4o' },
        { name: 'GPT-4 Turbo', value: 'gpt-4-turbo', description: 'Latest GPT-4 Turbo with improved performance' },
        { name: 'GPT-4', value: 'gpt-4', description: 'Standard GPT-4 model' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', description: 'Fast and efficient GPT-3.5 model' },
        { name: 'GPT-3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k', description: 'GPT-3.5 with 16k context window' }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional model configuration options',
      options: [
        {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      required: false,
          description: 'Controls randomness. Lower = more focused, Higher = more creative',
          typeOptions: {
            minValue: 0,
            maxValue: 2,
            numberPrecision: 2
    }
        },
        {
      name: 'maxTokens',
      displayName: 'Max Tokens',
      type: 'number',
      required: false,
      default: 1000,
          description: 'Maximum number of tokens to generate',
          typeOptions: {
            minValue: 1,
            maxValue: 4096
    }
        },
        {
      name: 'topP',
      displayName: 'Top P',
      type: 'number',
      required: false,
      default: 1,
          description: 'Nucleus sampling parameter',
          typeOptions: {
            minValue: 0,
            maxValue: 1,
            numberPrecision: 2
    }
        },
        {
      name: 'frequencyPenalty',
      displayName: 'Frequency Penalty',
      type: 'number',
      required: false,
      default: 0,
          description: 'Penalty for frequent tokens',
          typeOptions: {
            minValue: -2,
            maxValue: 2,
            numberPrecision: 2
    }
        },
        {
      name: 'presencePenalty',
      displayName: 'Presence Penalty',
      type: 'number',
      required: false,
      default: 0,
          description: 'Penalty for tokens that have appeared',
          typeOptions: {
            minValue: -2,
            maxValue: 2,
            numberPrecision: 2
    }
        },
        {
      name: 'responseFormat',
      displayName: 'Response Format',
      type: 'options',
      required: false,
      default: 'text',
          description: 'Format of the response',
          options: [
            { name: 'Text', value: 'text', description: 'Standard text response'
    },
            { name: 'JSON Object', value: 'json_object', description: 'Structured JSON response' }
          ]
        },
        {
      name: 'seed',
      displayName: 'Seed',
      type: 'number',
      required: false,
      default: '',
          description: 'Seed for deterministic outputs (optional)',
          typeOptions: {
            minValue: 0
    }
        },
        {
      name: 'timeout',
      displayName: 'Timeout (ms)',
      type: 'number',
      required: false,
      default: 60000,
          description: 'Request timeout in milliseconds',
          typeOptions: {
            minValue: 1000,
            maxValue: 300000
    }
        }
      ]
    }
  ],
  inputs: [
    {
      type: 'ai_languageModel',
      displayName: 'Language Model',
      required: false
    }
  ],
  outputs: [
    {
      type: 'ai_languageModel',
      displayName: 'Language Model',
      description: 'OpenAI language model for LangChain'
    }
  ],
  credentials: [
    {
      name: 'openAiApi',
      required: true,
      types: ['openAiApi'],
      description: 'OpenAI API credentials',
      documentationUrl: 'https://platform.openai.com/api-keys'
    }
  ],
  regularNode: false,
  codeable: false,
  triggerNode: false,
  langChainNode: true,
  version: [1],
  defaults: {
    name: 'OpenAI Chat Model',
    model: 'gpt-4o-mini'
  },
  aliases: ['gpt', 'chatgpt', 'openai chat', 'llm'],
  subtitle: '={{$parameter["model"]}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Conversational AI and chatbots',
      'Text generation and completion',
      'Content creation and editing',
      'Code generation and review',
      'Data analysis and insights',
      'Language translation',
      'Question answering systems',
      'Creative writing assistance'
    ],
    prerequisites: [
      'OpenAI API key with sufficient credits',
      'Understanding of LangChain workflow patterns',
      'Knowledge of prompt engineering'
    ],
    rateLimits: {
      requests: 3500,
      window: 'minute',
      unit: 'requests per minute (varies by model)'
    },
    errorHandling: {
      retryableErrors: ['Rate limit exceeded', 'Temporary server error', 'Timeout'],
      nonRetryableErrors: ['Invalid API key', 'Model not found', 'Content filter triggered'],
      documentation: 'Common issues include rate limits, content filtering, and token limits'
    }
  },
  examples: [
    {
      name: 'Basic Chat Model',
      description: 'Set up OpenAI chat model for LangChain workflows',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Chat Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o-mini',
              options: {
                temperature: 0.7,
                maxTokens: 1000
              }
            }
          }
        ]
      }
    },
    {
      name: 'Structured JSON Output',
      description: 'Configure model for structured JSON responses',
      workflow: {
        nodes: [
          {
            name: 'Structured OpenAI',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o',
              options: {
                temperature: 0,
                maxTokens: 2000,
                responseFormat: 'json_object'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Creative Writing Model',
      description: 'High temperature settings for creative content',
      workflow: {
        nodes: [
          {
            name: 'Creative OpenAI',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o',
              options: {
                temperature: 1.2,
                maxTokens: 3000,
                presencePenalty: 0.5,
                frequencyPenalty: 0.3
              }
            }
          }
        ]
      }
    }
  ]
};