import { NodeTypeInfo } from '../node-types.js';

export const langchainChainLlmNode: NodeTypeInfo = {
  name: '@n8n/n8n-nodes-langchain.chainLlm',
  displayName: 'LLM Chain',
  description: 'Chain language models together with prompts and output parsers for complex AI workflows and sequential processing.',
  category: 'AI',
  subcategory: 'Chains',
  properties: [
    {
      name: 'prompt',
      displayName: 'Prompt',
      type: 'string',
      required: true,
      default: 'You are a helpful AI assistant. Answer the following question:\n\n{input}',
      description: 'The prompt template to use with the language model',
      typeOptions: {
        rows: 4
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional chain configuration options',
      options: [
        {
      name: 'humanMessageKey',
      displayName: 'Human Message Key',
      type: 'string',
      required: false,
          description: 'Key for the human message in the prompt template'
    },
        {
      name: 'systemMessageKey',
      displayName: 'System Message Key',
      type: 'string',
      required: false,
      default: 'system',
          description: 'Key for the system message in the prompt template'
    },
        {
      name: 'outputKey',
      displayName: 'Output Key',
      type: 'string',
      required: false,
      default: 'response',
          description: 'Key for the output in the result'
    },
        {
      name: 'verbose',
      displayName: 'Verbose',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Enable verbose logging for debugging'
    },
        {
      name: 'memory',
      displayName: 'Use Memory',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Enable conversation memory'
    },
        {
      name: 'memoryKey',
      displayName: 'Memory Key',
      type: 'string',
      required: false,
      default: 'chat_history',
          description: 'Key for storing conversation history',
          displayOptions: {
            show: {
              memory: [true]
    }
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
      type: 'ai_outputParser',
      displayName: 'Output Parser',
      required: false
    },
    {
      type: 'ai_memory',
      displayName: 'Memory',
      required: false
    },
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
      description: 'Chain execution result'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  langChainNode: true,
  version: [1],
  defaults: {
    name: 'LLM Chain',
    prompt: 'You are a helpful AI assistant. Answer the following question:\n\n{input}'
  },
  aliases: ['llm chain', 'langchain', 'ai chain', 'prompt chain'],
  subtitle: '={{$parameter["options"]["outputKey"] || "response"}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Sequential AI processing',
      'Prompt-based text generation',
      'Conversational AI with memory',
      'Document Q&A systems',
      'Content generation pipelines',
      'AI-powered data analysis',
      'Multi-step reasoning workflows'
    ],
    prerequisites: [
      'LangChain language model node connected',
      'Understanding of prompt engineering',
      'Optional: Output parser for structured responses'
    ],
    errorHandling: {
      retryableErrors: ['Rate limit exceeded', 'Temporary model unavailable'],
      nonRetryableErrors: ['Invalid prompt template', 'Model not found', 'Authentication failed'],
      documentation: 'Ensure language model is properly connected and prompt template uses valid variables'
    }
  },
  examples: [
    {
      name: 'Simple Q&A Chain',
      description: 'Basic question-answering chain with OpenAI',
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
            name: 'Q&A Chain',
            type: '@n8n/n8n-nodes-langchain.chainLlm',
            parameters: {
              prompt: 'You are a helpful assistant. Answer this question clearly and concisely:\n\nQuestion: {input}\n\nAnswer:',
              options: {
                humanMessageKey: 'input',
                outputKey: 'answer'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Document Analysis Chain',
      description: 'Analyze documents with context and structured output',
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
            name: 'Document Analyzer',
            type: '@n8n/n8n-nodes-langchain.chainLlm',
            parameters: {
              prompt: `Analyze the following document and provide insights:

Document: {document}

Please provide:
1. A summary of key points
2. Main themes identified
3. Any actionable recommendations

Analysis:`,
              options: {
                humanMessageKey: 'document',
                outputKey: 'analysis',
                verbose: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Conversational Chain with Memory',
      description: 'Multi-turn conversation with context retention',
      workflow: {
        nodes: [
          {
            name: 'OpenAI Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
            parameters: {
              model: 'gpt-4o-mini',
              options: {
                temperature: 0.7
              }
            }
          },
          {
            name: 'Chat Chain',
            type: '@n8n/n8n-nodes-langchain.chainLlm',
            parameters: {
              prompt: `You are a helpful AI assistant. Use the conversation history to provide contextual responses.

Current conversation:
{chat_history}

User: {input}
Assistant: {response}`,
              options: {
                humanMessageKey: "input",
                outputKey: "response",
                memory: true,
                memoryKey: "chat_history"
              }
            }
          }
        ]
      }
    }
  ]
};
