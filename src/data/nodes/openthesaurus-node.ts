import { NodeTypeInfo } from '../node-types.js';

export const openthesaurusNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openthesaurus',
  displayName: 'OpenThesaurus',
  description: 'Use the OpenThesaurus node to automate work in OpenThesaurus, and integrate OpenThesaurus with other applications. n8n supports synonym look-up for German words.',
  category: 'Language & Translation',
  subcategory: 'Dictionary & Thesaurus',
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'getSynonyms',
      description: 'The operation to perform',
      options: [
        { name: 'Get Synonyms', value: 'getSynonyms', description: 'Get synonyms for a German word in German' }
      ]
    },
    {
      name: 'word',
      displayName: 'Word',
      type: 'string',
      required: true,
      default: '',
      description: 'The German word to find synonyms for (e.g. Haus, schnell, schön)'
    },
    {
      name: 'format',
      displayName: 'Response Format',
      type: 'options',
      required: false,
      default: 'application/json',
      description: 'The format of the response data',
      options: [
        { name: 'JSON', value: 'application/json', description: 'Return data in JSON format' },
        { name: 'XML', value: 'application/xml', description: 'Return data in XML format' }
      ]
    },
    {
      name: 'similar',
      displayName: 'Include Similar Words',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include similar words in addition to exact synonyms'
    },
    {
      name: 'baseform',
      displayName: 'Search Base Form',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Search for the base form of the word if exact match is not found'
    },
    {
      name: 'substring',
      displayName: 'Substring Search',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Allow substring matching when exact word is not found'
    },
    {
      name: 'supersynsets',
      displayName: 'Include Supersynsets',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include supersynsets (broader terms) in the results'
    },
    {
      name: 'subsynsets',
      displayName: 'Include Subsynsets',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include subsynsets (more specific terms) in the results'
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
      description: 'The retrieved German synonyms and related words'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Synonyms for German Word',
      description: 'Find German synonyms for a specific word',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'Haus',
              format: 'application/json',
              similar: false,
              baseform: false
            }
          }
        ]
      }
    },
    {
      name: 'Get Synonyms with Similar Words',
      description: 'Find synonyms and include similar words in the results',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'schnell',
              format: 'application/json',
              similar: true,
              baseform: true,
              substring: false
            }
          }
        ]
      }
    },
    {
      name: 'Comprehensive Synonym Search',
      description: 'Perform a comprehensive search including supersynsets and subsynsets',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'schön',
              format: 'application/json',
              similar: true,
              baseform: true,
              supersynsets: true,
              subsynsets: true
            }
          }
        ]
      }
    },
    {
      name: 'Flexible Word Search',
      description: 'Search with substring matching for partial word matches',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'auto',
              format: 'application/json',
              similar: true,
              baseform: true,
              substring: true
            }
          }
        ]
      }
    },
    {
      name: 'XML Format Response',
      description: 'Get synonyms in XML format instead of JSON',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'Wasser',
              format: 'application/xml',
              similar: false,
              baseform: false
            }
          }
        ]
      }
    },
    {
      name: 'German Language Learning Assistant',
      description: 'Use OpenThesaurus to expand German vocabulary',
      workflow: {
        nodes: [
          {
            name: 'OpenThesaurus',
            type: 'n8n-nodes-base.openthesaurus',
            parameters: {
              operation: 'getSynonyms',
              word: 'lernen',
              format: 'application/json',
              similar: true,
              baseform: true,
              supersynsets: false,
              subsynsets: true
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the OpenThesaurus node
export const openthesaurusActions = [
  'get_synonyms_for_german_word'
];

// Export OpenThesaurus categories
export const openthesaurusCategories = [
  'german_synonyms',
  'german_language',
  'dictionary_lookup',
  'thesaurus_search',
  'language_processing'
];