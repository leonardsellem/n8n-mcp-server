import { NodeTypeInfo } from '../../node-types.js';

export const codeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.code',
  displayName: 'Code',
  description: 'Run custom JavaScript or Python code to process, transform, and manipulate data within your workflows.',
  category: 'Core',
  subcategory: 'Data Processing',
  properties: [
    {
      name: 'language',
      displayName: 'Language',
      type: 'options',
      required: true,
      default: 'javascript',
      description: 'The programming language to use',
      options: [
        { name: 'JavaScript', value: 'javascript', description: 'Run JavaScript code' },
        { name: 'Python', value: 'python', description: 'Run Python code' }
      ]
    },
    {
      name: 'jsCode',
      displayName: 'JavaScript Code',
      type: 'string',
      required: false,
      default: '// Loop over input items and add a new field to each\n// Available data:\n// - $input.all() - all input data\n// - $input.first() - first input item\n// - $input.item - current item (in .map() calls)\n\nfor (const item of $input.all()) {\n  item.json.myNewField = \'Hello World!\';\n}\n\nreturn $input.all();',
      description: 'JavaScript code to execute. Use $input to access data and return the result.'
    },
    {
      name: 'pythonCode',
      displayName: 'Python Code',
      type: 'string',
      required: false,
      default: '# Loop over input items and add a new field to each\n# Available data:\n# - _input.all() - all input data\n# - _input.first() - first input item\n# - _input.item - current item (in .map() calls)\n\nfor item in _input.all():\n    item[\'json\'][\'myNewField\'] = \'Hello World!\'\n\nreturn _input.all()',
      description: 'Python code to execute. Use _input to access data and return the result.'
    },
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: false,
      default: 'runOnceForAllItems',
      description: 'Whether to run the code once for all items or once per item',
      options: [
        { name: 'Run Once for All Items', value: 'runOnceForAllItems', description: 'Execute code once with all input items' },
        { name: 'Run Once for Each Item', value: 'runOnceForEachItem', description: 'Execute code separately for each input item' }
      ]
    },
    {
      name: 'continueOnFail',
      displayName: 'Continue on Fail',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Continue execution even if the code fails'
    },
    {
      name: 'onError',
      displayName: 'On Error',
      type: 'options',
      required: false,
      default: 'stopWorkflow',
      description: 'What to do when the code execution fails',
      options: [
        { name: 'Stop Workflow', value: 'stopWorkflow', description: 'Stop the entire workflow execution' },
        { name: 'Continue with Empty Result', value: 'continueEmpty', description: 'Continue with empty result' },
        { name: 'Continue with Error Info', value: 'continueErrorOutput', description: 'Continue and output error information' }
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
      description: 'The result of the code execution'
    }
  ],
  regularNode: true,
  codeable: true,
  examples: [
    {
      name: 'Data Transformation',
      description: 'Transform input data by adding calculated fields',
      workflow: {
        nodes: [
          {
            name: 'Code',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javascript',
              jsCode: `// Add calculated fields to each item
for (const item of $input.all()) {
  const data = item.json;
  
  // Add timestamp
  data.timestamp = new Date().toISOString();
  
  // Calculate total if price and quantity exist
  if (data.price && data.quantity) {
    data.total = data.price * data.quantity;
  }
  
  // Add formatted name
  if (data.firstName && data.lastName) {
    data.fullName = \`\${data.firstName} \${data.lastName}\`;
  }
}

return $input.all();`
            }
          }
        ]
      }
    },
    {
      name: 'Data Filtering',
      description: 'Filter items based on custom conditions',
      workflow: {
        nodes: [
          {
            name: 'Code',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javascript',
              jsCode: `// Filter items based on custom conditions
const filteredItems = $input.all().filter(item => {
  const data = item.json;
  
  // Keep items where status is 'active' and score > 50
  return data.status === 'active' && data.score > 50;
});

return filteredItems;`
            }
          }
        ]
      }
    },
    {
      name: 'API Response Processing',
      description: 'Process and clean API response data',
      workflow: {
        nodes: [
          {
            name: 'Code',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javascript',
              jsCode: `// Process API response data
for (const item of $input.all()) {
  const apiData = item.json;
  
  // Extract nested data
  if (apiData.results && Array.isArray(apiData.results)) {
    // Flatten results array
    const processedResults = apiData.results.map(result => ({
      id: result.id,
      name: result.name || result.title,
      description: result.description?.substring(0, 100),
      url: result.html_url || result.url,
      createdAt: new Date(result.created_at).toLocaleDateString()
    }));
    
    item.json = { processedResults };
  }
}

return $input.all();`
            }
          }
        ]
      }
    },
    {
      name: 'Python Data Analysis',
      description: 'Use Python for data analysis and statistics',
      workflow: {
        nodes: [
          {
            name: 'Code',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'python',
              pythonCode: `# Python data analysis example
import statistics
from datetime import datetime

# Extract numeric values for analysis
values = []
for item in _input.all():
    data = item['json']
    if 'value' in data and isinstance(data['value'], (int, float)):
        values.append(data['value'])

# Calculate statistics
if values:
    stats = {
        'count': len(values),
        'sum': sum(values),
        'mean': statistics.mean(values),
        'median': statistics.median(values),
        'min': min(values),
        'max': max(values),
        'stdev': statistics.stdev(values) if len(values) > 1 else 0,
        'analysis_date': datetime.now().isoformat()
    }
    
    return [{'json': stats}]
else:
    return [{'json': {'error': 'No numeric values found'}}]`
            }
          }
        ]
      }
    },
    {
      name: 'Text Processing',
      description: 'Advanced text processing and manipulation',
      workflow: {
        nodes: [
          {
            name: 'Code',
            type: 'n8n-nodes-base.code',
            parameters: {
              language: 'javascript',
              jsCode: `// Advanced text processing
for (const item of $input.all()) {
  const data = item.json;
  
  if (data.text) {
    // Clean and process text
    let processedText = data.text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\\s]/g, '') // Remove special characters
      .replace(/\\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Extract keywords (simple example)
    const words = processedText.split(' ');
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 3) { // Only count words longer than 3 characters
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    // Get top 5 most frequent words
    const topWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
    
    // Add processed data
    data.processedText = processedText;
    data.wordCount = Object.keys(wordCount).length;
    data.topWords = topWords;
    data.characterCount = data.text.length;
  }
}

return $input.all();`
            }
          }
        ]
      }
    }
  ]
};

// Export useful JavaScript utilities for the Code node
export const codeNodeUtilities = {
  dataTransformation: [
    'flattenObject',
    'groupBy',
    'sortBy',
    'unique',
    'merge'
  ],
  dateTime: [
    'formatDate',
    'parseDate',
    'addDays',
    'diffDays',
    'timezone'
  ],
  textProcessing: [
    'slugify',
    'capitalize',
    'camelCase',
    'snakeCase',
    'extractEmails'
  ],
  math: [
    'sum',
    'average',
    'median',
    'min',
    'max',
    'round'
  ]
};

// Export Python libraries commonly used in n8n Code nodes
export const pythonLibraries = [
  'json',
  'datetime',
  'statistics',
  'math',
  'random',
  'string',
  're',
  'urllib',
  'base64',
  'hashlib'
];