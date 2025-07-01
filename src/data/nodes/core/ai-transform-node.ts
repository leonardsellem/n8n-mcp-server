/**
 * # AI Transform
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Use AI Transform to leverage artificial intelligence for data transformation tasks. This node allows you to 
 * process and transform data using AI models, making it easy to clean, format, extract insights, or generate 
 * content from your workflow data.
 * 
 * ## Key Features
 * 
 * - **AI-Powered Transformation**: Use natural language descriptions to transform data
 * - **Multiple AI Providers**: Support for OpenAI, Anthropic, Google, and other AI services
 * - **Flexible Processing**: Handle text, JSON, arrays, and complex data structures
 * - **Schema Validation**: Ensure transformed data meets specific requirements
 * - **Batch Processing**: Transform multiple items efficiently
 * - **Error Handling**: Robust error handling for AI service failures
 * - **Cost Optimization**: Efficient token usage and request batching
 * - **Custom Prompts**: Full control over AI prompts and instructions
 * - **Data Extraction**: Extract specific information from unstructured data
 * - **Content Generation**: Generate new content based on input data
 * - **Language Processing**: Text analysis, translation, and summarization
 * - **Classification**: Categorize and tag data automatically
 * 
 * ## Operations
 * 
 * ### Transform Data
 * - **Description-based Transformation**: Describe what you want to do in natural language
 * - **Structured Output**: Generate data in specific formats (JSON, CSV, etc.)
 * - **Content Enrichment**: Add context and additional information to existing data
 * - **Data Cleaning**: Remove duplicates, fix formatting, standardize values
 * - **Information Extraction**: Pull specific details from text or documents
 * - **Language Translation**: Translate content between languages
 * - **Sentiment Analysis**: Analyze emotional tone and sentiment
 * - **Categorization**: Automatically classify and organize data
 * - **Summarization**: Create concise summaries of longer content
 * - **Format Conversion**: Convert between different data formats
 * - **Validation**: Verify data quality and completeness
 * - **Normalization**: Standardize data across different sources
 * 
 * ## AI Model Integration
 * 
 * ### Supported Models
 * - **OpenAI GPT**: GPT-4, GPT-3.5 for text and reasoning tasks
 * - **Anthropic Claude**: Claude for complex analysis and reasoning
 * - **Google Gemini**: Advanced multimodal AI capabilities
 * - **Custom Models**: Integration with custom fine-tuned models
 * - **Local Models**: Support for self-hosted AI models
 * 
 * ### Optimization Features
 * - **Token Management**: Efficient use of AI service tokens
 * - **Request Batching**: Combine multiple transformations for efficiency
 * - **Caching**: Cache results to reduce API calls and costs
 * - **Fallback Models**: Use alternative models if primary fails
 * - **Rate Limiting**: Respect API rate limits automatically
 * 
 * ## Use Cases
 * 
 * - **Data Cleaning**: Clean and standardize messy data from various sources
 * - **Content Creation**: Generate blog posts, product descriptions, or marketing copy
 * - **Email Processing**: Classify, prioritize, and extract information from emails
 * - **Customer Support**: Analyze support tickets and generate responses
 * - **Research Analysis**: Process research data and generate insights
 * - **Lead Qualification**: Score and categorize sales leads automatically
 * - **Document Processing**: Extract key information from invoices, contracts, reports
 * - **Social Media Analysis**: Analyze posts, comments, and engagement
 * - **Product Catalog Management**: Enhance product descriptions and categorization
 * - **Survey Analysis**: Process survey responses and generate insights
 * - **Knowledge Base Creation**: Transform raw content into structured knowledge
 * - **Translation Workflows**: Translate content for international audiences
 * 
 * ## Integration Patterns
 * 
 * ### Data Pipeline Enhancement
 * - **ETL Augmentation**: Add AI processing to extract-transform-load workflows
 * - **Real-time Processing**: Transform data as it flows through your system
 * - **Quality Assurance**: Validate and improve data quality automatically
 * - **Enrichment Layer**: Add context and insights to existing data
 * 
 * ### Content Workflows
 * - **Publishing Pipeline**: Generate and optimize content for publication
 * - **Localization**: Translate and adapt content for different markets
 * - **SEO Optimization**: Enhance content for search engine optimization
 * - **Personalization**: Customize content for different audiences
 * 
 * ### Business Intelligence
 * - **Report Generation**: Create executive summaries and reports
 * - **Trend Analysis**: Identify patterns and trends in business data
 * - **Competitive Analysis**: Process competitor information and insights
 * - **Market Research**: Analyze market data and customer feedback
 * 
 * ## Advanced Features
 * 
 * ### Prompt Engineering
 * - **Template Library**: Pre-built prompts for common tasks
 * - **Custom Prompts**: Full control over AI instructions
 * - **Dynamic Prompts**: Context-aware prompt generation
 * - **Prompt Optimization**: Automatic prompt improvement suggestions
 * 
 * ### Output Control
 * - **Schema Enforcement**: Ensure output matches specific structures
 * - **Format Validation**: Validate output format and quality
 * - **Error Recovery**: Handle and retry failed transformations
 * - **Quality Scoring**: Assess transformation quality automatically
 * 
 * ### Performance Optimization
 * - **Parallel Processing**: Handle multiple items simultaneously
 * - **Smart Batching**: Optimize API usage for cost and speed
 * - **Result Caching**: Store results to avoid redundant processing
 * - **Load Balancing**: Distribute requests across multiple AI services
 */

import { NodeTypeInfo } from '../../node-types.js';

export const aiTransformNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aiTransform',
  displayName: 'AI Transform',
  description: 'Transform data using artificial intelligence for cleaning, formatting, extraction, and generation tasks.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'transform',
      description: 'Type of AI transformation to perform',
      options: [
        {
          name: 'Transform Data',
          value: 'transform',
          description: 'Transform data using AI based on instructions'
        },
        {
          name: 'Extract Information',
          value: 'extract',
          description: 'Extract specific information from unstructured data'
        },
        {
          name: 'Generate Content',
          value: 'generate',
          description: 'Generate new content based on input data'
        },
        {
          name: 'Classify Data',
          value: 'classify',
          description: 'Categorize and classify data automatically'
        },
        {
          name: 'Summarize',
          value: 'summarize',
          description: 'Create summaries of text or data'
        },
        {
          name: 'Translate',
          value: 'translate',
          description: 'Translate text to different languages'
        }
      ]
    },
    {
      name: 'aiProvider',
      displayName: 'AI Provider',
      type: 'options',
      required: true,
      default: 'openai',
      description: 'AI service provider to use',
      options: [
        {
          name: 'OpenAI',
          value: 'openai',
          description: 'Use OpenAI GPT models'
        },
        {
          name: 'Anthropic',
          value: 'anthropic',
          description: 'Use Anthropic Claude models'
        },
        {
          name: 'Google',
          value: 'google',
          description: 'Use Google Gemini models'
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Use custom AI endpoint'
        }
      ]
    },
    {
      name: 'model',
      displayName: 'Model',
      type: 'options',
      required: true,
      default: 'gpt-4',
      description: 'AI model to use for transformation',
      displayOptions: {
        show: {
          aiProvider: ['openai']
        }
      },
      options: [
        {
          name: 'GPT-4',
          value: 'gpt-4',
          description: 'Most capable model for complex tasks'
        },
        {
          name: 'GPT-4 Turbo',
          value: 'gpt-4-turbo',
          description: 'Faster and more cost-effective'
        },
        {
          name: 'GPT-3.5 Turbo',
          value: 'gpt-3.5-turbo',
          description: 'Good balance of speed and capability'
        }
      ]
    },
    {
      name: 'instructions',
      displayName: 'Instructions',
      type: 'string',
      typeOptions: {
        rows: 10
      },
      required: true,
      default: '',
      description: 'Describe what you want the AI to do with your data',
      placeholder: 'Extract the email address and company name from each contact record...'
    },
    {
      name: 'outputFormat',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'auto',
      description: 'Desired format for the output data',
      options: [
        {
          name: 'Auto-detect',
          value: 'auto',
          description: 'Let AI determine the best format'
        },
        {
          name: 'JSON',
          value: 'json',
          description: 'Structured JSON output'
        },
        {
          name: 'Text',
          value: 'text',
          description: 'Plain text output'
        },
        {
          name: 'Array',
          value: 'array',
          description: 'Array of items'
        },
        {
          name: 'CSV',
          value: 'csv',
          description: 'Comma-separated values'
        }
      ]
    },
    {
      name: 'temperature',
      displayName: 'Creativity Level',
      type: 'number',
      required: false,
      default: 0.1,
      description: 'How creative/random the AI should be (0-1)',
      typeOptions: {
        minValue: 0,
        maxValue: 1
      }
    },
    {
      name: 'maxTokens',
      displayName: 'Max Response Length',
      type: 'number',
      required: false,
      default: 1000,
      description: 'Maximum length of AI response in tokens',
      typeOptions: {
        minValue: 1,
        maxValue: 4000
      }
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'openAi',
      required: false,
      displayOptions: {
        show: {
          aiProvider: ['openai']
        }
      }
    },
    {
      name: 'anthropicApi',
      required: false,
      displayOptions: {
        show: {
          aiProvider: ['anthropic']
        }
      }
    }
  ],

  version: [1],
  defaults: {
    name: 'AI Transform'
  },

  aliases: ['ai', 'artificial intelligence', 'transform', 'gpt', 'claude'],
  
  examples: [
    {
      name: 'Extract Contact Information',
      description: 'Extract structured contact information from unstructured text',
      workflow: {
        nodes: [
          {
            name: 'AI Transform',
            type: 'n8n-nodes-base.aiTransform',
            parameters: {
              operation: 'extract',
              aiProvider: 'openai',
              model: 'gpt-4',
              instructions: 'Extract the following information from each contact: name, email, phone number, company. Return as JSON.',
              outputFormat: 'json'
            }
          }
        ]
      }
    },
    {
      name: 'Generate Product Descriptions',
      description: 'Generate compelling product descriptions from basic product data',
      workflow: {
        nodes: [
          {
            name: 'AI Transform',
            type: 'n8n-nodes-base.aiTransform',
            parameters: {
              operation: 'generate',
              aiProvider: 'openai',
              model: 'gpt-4',
              instructions: 'Create an engaging product description for this item, highlighting key features and benefits',
              outputFormat: 'text',
              temperature: 0.7
            }
          }
        ]
      }
    },
    {
      name: 'Classify Customer Feedback',
      description: 'Automatically categorize customer feedback as positive, negative, or neutral',
      workflow: {
        nodes: [
          {
            name: 'AI Transform',
            type: 'n8n-nodes-base.aiTransform',
            parameters: {
              operation: 'classify',
              aiProvider: 'openai',
              model: 'gpt-3.5-turbo',
              instructions: 'Classify this feedback as: positive, negative, or neutral. Also identify the main topic.',
              outputFormat: 'json'
            }
          }
        ]
      }
    }
  ]
};

export default aiTransformNode;
