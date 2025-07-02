#!/usr/bin/env node

const markdown = `
## Operations

* **Channel**
    * **Archive** a channel.
    * **Close** a direct message or multi-person direct message.
    * **Create** a public or private channel-based conversation.
    * **Get** information about a channel.
    * **Get Many**: Get a list of channels in Slack.
* **File**
    * **Get** a file.
    * **Get Many**: Get and filter team files.
    * **Upload**: Create or upload an existing file.

## Templates and examples
`;

function extractOperations(markdown) {
  const operations = [];
  
  // Find operations section
  const operationsMatch = markdown.match(/##\s+Operations\s*\n([\s\S]*?)(?=\n##|\n#|$)/i);
  if (!operationsMatch) {
    console.log('No operations section found');
    return operations;
  }
  
  const operationsText = operationsMatch[1];
  console.log('Operations text:', operationsText.substring(0, 200));
  
  // Parse operation structure
  let currentResource = null;
  const lines = operationsText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Resource level (e.g., "* **Channel**")
    if (trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*/)) {
      currentResource = trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*/)[1].trim();
      console.log(`Found resource: ${currentResource}`);
      continue;
    }
    
    // Skip if we don't have a current resource
    if (!currentResource) continue;
    
    // Operation level - look for indented bullets (4 spaces + *)
    if (line.match(/^\s{4}\*\s+/)) {
      console.log(`Found operation line: "${line}"`);
      
      // Extract operation name and description
      const operationMatch = trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*(.*)$/);
      if (operationMatch) {
        const operation = operationMatch[1].trim();
        let description = operationMatch[2].trim();
        
        // Clean up description
        description = description.replace(/^:\s*/, '').replace(/\.$/, '').trim();
        
        operations.push({
          resource: currentResource,
          operation,
          description: description || operation,
        });
        console.log(`  Parsed: ${operation} - ${description}`);
      }
    }
  }
  
  return operations;
}

const operations = extractOperations(markdown);
console.log('\nTotal operations found:', operations.length);
console.log('\nOperations:');
operations.forEach(op => {
  console.log(`- ${op.resource}.${op.operation}: ${op.description}`);
});