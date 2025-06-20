import { NodeTypeInfo } from '../node-types.js';

export const langchainOutputParserNode: NodeTypeInfo = {
  name: '@n8n/n8n-nodes-langchain.outputParserStructured',
  displayName: 'Structured Output Parser',
  description: 'Parse and structure LLM outputs into JSON format with schema validation for reliable data extraction and processing.',
  category: 'AI',
  subcategory: 'Output Parsers',
  properties: [
    {
      name: 'jsonSchema',
      displayName: 'JSON Schema',
      type: 'json',
      required: true,
      default: `{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The main answer or response"
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score from 0 to 1"
    }
  },
  "required": ["answer"]
}`,
      description: 'JSON Schema defining the expected output structure',
      typeOptions: {
        rows: 10
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Parser configuration options',
      options: [
        {
          name: 'strictMode',
          displayName: 'Strict Mode',
          type: 'boolean',
          default: true,
          description: 'Enforce strict schema validation'
        },
        {
          name: 'fallbackBehavior',
          displayName: 'Fallback Behavior',
          type: 'options',
          default: 'error',
          description: 'What to do when parsing fails',
          options: [
            { name: 'Throw Error', value: 'error' },
            { name: 'Return Raw Text', value: 'raw' },
            { name: 'Return Empty Object', value: 'empty' },
            { name: 'Return Default Values', value: 'default' }
          ]
        },
        {
          name: 'includeRawOutput',
          displayName: 'Include Raw Output',
          type: 'boolean',
          default: false,
          description: 'Include the original raw text in the output'
        },
        {
          name: 'trimWhitespace',
          displayName: 'Trim Whitespace',
          type: 'boolean',
          default: true,
          description: 'Remove leading/trailing whitespace from output'
        },
        {
          name: 'fixJsonErrors',
          displayName: 'Auto-fix JSON Errors',
          type: 'boolean',
          default: true,
          description: 'Attempt to automatically fix common JSON formatting errors'
        }
      ]
    }
  ],
  inputs: [
    {
      type: 'ai_outputParser',
      displayName: 'Output Parser',
      required: false
    }
  ],
  outputs: [
    {
      type: 'ai_outputParser',
      displayName: 'Output Parser',
      description: 'Structured output parser for LangChain'
    }
  ],
  credentials: [],
  regularNode: false,
  codeable: false,
  triggerNode: false,
  langChainNode: true,
  version: [1],
  defaults: {
    name: 'Structured Output Parser',
    jsonSchema: `{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The main answer or response"
    }
  },
  "required": ["answer"]
}`
  },
  aliases: ['output parser', 'json parser', 'structured parser', 'schema parser'],
  subtitle: '={{$parameter["options"]["strictMode"] ? "strict" : "flexible"}} mode',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Extract structured data from AI responses',
      'Validate LLM output format',
      'Parse sentiment analysis results',
      'Structure classification outputs',
      'Extract entities and relationships',
      'Format data for downstream processing',
      'Ensure consistent API responses'
    ],
    prerequisites: [
      'Understanding of JSON Schema format',
      'Knowledge of expected LLM output structure',
      'Clear schema definitions with descriptions'
    ],
    errorHandling: {
      retryableErrors: ['Temporary parsing failure', 'Invalid JSON format'],
      nonRetryableErrors: ['Invalid schema definition', 'Schema validation failed'],
      documentation: 'Most errors occur due to invalid JSON schema or unexpected LLM output format'
    }
  },
  examples: [
    {
      name: 'Simple Key-Value Extraction',
      description: 'Extract basic information into structured format',
      workflow: {
        nodes: [
          {
            name: 'Key-Value Parser',
            type: '@n8n/n8n-nodes-langchain.outputParserStructured',
            parameters: {
              jsonSchema: `{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Person's name"
    },
    "email": {
      "type": "string",
      "description": "Email address"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    }
  },
  "required": ["name", "email"]
}`,
              options: {
                strictMode: true,
                fallbackBehavior: 'error'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Sentiment Analysis Output',
      description: 'Structure sentiment analysis results with confidence scores',
      workflow: {
        nodes: [
          {
            name: 'Sentiment Parser',
            type: '@n8n/n8n-nodes-langchain.outputParserStructured',
            parameters: {
              jsonSchema: `{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["positive", "negative", "neutral"],
      "description": "Overall sentiment classification"
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Confidence score for the sentiment"
    },
    "emotions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "emotion": {"type": "string"},
          "intensity": {"type": "number", "minimum": 0, "maximum": 1}
        }
      },
      "description": "Detected emotions with intensity scores"
    },
    "keywords": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Key phrases that influenced the sentiment"
    }
  },
  "required": ["sentiment", "confidence"]
}`,
              options: {
                strictMode: true,
                includeRawOutput: false,
                fixJsonErrors: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Content Classification',
      description: 'Classify content with categories and metadata',
      workflow: {
        nodes: [
          {
            name: 'Classification Parser',
            type: '@n8n/n8n-nodes-langchain.outputParserStructured',
            parameters: {
              jsonSchema: `{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["technology", "business", "health", "entertainment", "sports", "politics"],
      "description": "Primary content category"
    },
    "subcategories": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Secondary categories or tags"
    },
    "summary": {
      "type": "string",
      "maxLength": 200,
      "description": "Brief content summary"
    },
    "entities": {
      "type": "object",
      "properties": {
        "people": {"type": "array", "items": {"type": "string"}},
        "organizations": {"type": "array", "items": {"type": "string"}},
        "locations": {"type": "array", "items": {"type": "string"}},
        "technologies": {"type": "array", "items": {"type": "string"}}
      },
      "description": "Named entities found in the content"
    },
    "relevance_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "description": "Content relevance score (0-10)"
    }
  },
  "required": ["category", "summary"]
}`,
              options: {
                strictMode: false,
                fallbackBehavior: 'default',
                includeRawOutput: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Data Extraction with Validation',
      description: 'Extract and validate complex data structures',
      workflow: {
        nodes: [
          {
            name: 'Data Extractor',
            type: '@n8n/n8n-nodes-langchain.outputParserStructured',
            parameters: {
              jsonSchema: `{
  "type": "object",
  "properties": {
    "invoice_data": {
      "type": "object",
      "properties": {
        "invoice_number": {"type": "string"},
        "date": {"type": "string", "format": "date"},
        "amount": {"type": "number", "minimum": 0},
        "currency": {"type": "string", "pattern": "^[A-Z]{3}$"},
        "vendor": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "address": {"type": "string"},
            "tax_id": {"type": "string"}
          },
          "required": ["name"]
        },
        "line_items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "description": {"type": "string"},
              "quantity": {"type": "number", "minimum": 0},
              "unit_price": {"type": "number", "minimum": 0},
              "total": {"type": "number", "minimum": 0}
            },
            "required": ["description", "quantity", "unit_price"]
          }
        }
      },
      "required": ["invoice_number", "date", "amount", "vendor"]
    },
    "extraction_confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Confidence in the extraction accuracy"
    }
  },
  "required": ["invoice_data"]
}`,
              options: {
                strictMode: true,
                fallbackBehavior: 'error',
                fixJsonErrors: true,
                trimWhitespace: true
              }
            }
          }
        ]
      }
    }
  ]
};