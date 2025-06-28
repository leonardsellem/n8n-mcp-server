# n8n Core Nodes

Core nodes are the fundamental building blocks of n8n workflows. They provide essential functionality for data manipulation, flow control, and workflow orchestration.

## Node Categories

### Data Manipulation
- **Aggregate**: Combine and summarize data from multiple items
- **Compare Datasets**: Compare two datasets and find differences
- **Compression**: Compress and decompress data
- **Convert**: Transform data between different formats
- **Date & Time**: Work with dates, times, and timestamps
- **Edit Fields**: Modify, add, or remove fields from data items

### Flow Control
- **If**: Conditional branching based on data evaluation
- **Merge**: Combine data from multiple workflow branches
- **Switch**: Multi-branch conditional routing
- **Stop and Error**: Control workflow execution and error handling

### Text Processing
- **Extract from File**: Extract data from various file formats
- **HTML**: Parse and manipulate HTML content
- **Summarize**: Create summaries of text content
- **Text**: Advanced text manipulation and processing

### Communication
- **Send Email**: Send emails with attachments and formatting
- **Respond to Webhook**: Send HTTP responses to webhook calls

### Development & Debugging
- **Code**: Execute custom JavaScript/Python code
- **Debug**: Debug and inspect workflow data
- **Manual Trigger**: Manually trigger workflows for testing

### File Operations
- **Read/Write Binary File**: Handle binary file operations
- **Local File Trigger**: Monitor local file system changes

### Workflow Management
- **Execute Workflow**: Run other workflows
- **n8n Trigger**: Create workflow dependencies
- **Set**: Set workflow variables and context

## Documentation Status

✅ **Completed** (45/58 nodes documented)
🚧 **In Progress** (13 remaining nodes)

### Remaining Nodes to Document:
46. Rename Keys
47. Respond to Webhook
48. RSS Read
49. RSS Feed Trigger
50. Schedule Trigger
51. Send Email
52. Sort
53. Split Out
54. SSE Trigger
55. SSH
56. Stop And Error
57. Summarize
58. Switch

## Quick Reference

### Most Commonly Used Core Nodes
1. **HTTP Request** - Make API calls and web requests
2. **If** - Conditional logic and branching
3. **Set** - Modify and set data values
4. **Code** - Custom JavaScript execution
5. **Merge** - Combine data from multiple sources

### Data Processing Pipeline
```
Manual Trigger → HTTP Request → If → Set → Send Email
```

### Error Handling Pattern
```
Any Node → Stop and Error (on error) → Send Email (notification)
```

## Navigation

Browse individual node documentation:
- Each node has its own detailed documentation file
- Use the file browser or search to find specific nodes
- All nodes follow the standardized template format

---

*This index provides an overview of all core nodes. Individual node documentation contains detailed configuration, examples, and use cases.*
