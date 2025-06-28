# n8n Node Documentation

This directory contains comprehensive documentation for all n8n nodes, organized by category for easy navigation and maintenance.

## Structure Overview

```
src/data/nodes/
├── core/              # Core built-in nodes (58 nodes)
├── triggers/          # Trigger nodes that start workflows
├── actions/           # Action nodes that perform operations  
├── clusters/          # Cluster management nodes
├── *-template.md      # Documentation templates
└── README.md          # This file
```

## Quick Navigation

### 📁 [Core Nodes](./core/index.md)
Essential built-in nodes for data manipulation, flow control, and workflow orchestration.
- **Status**: 45/58 nodes documented (78% complete)
- **Priority**: Complete remaining 13 nodes first
- **Examples**: If, HTTP Request, Code, Set, Merge

### 🔄 [Trigger Nodes](./triggers/index.md)  
Nodes that start workflows automatically when events occur.
- **Status**: Basic registry created, expanding to detailed docs
- **Examples**: Schedule Trigger, Webhook, Email Trigger, RSS Feed Trigger

### ⚡ [Action Nodes](./actions/index.md)
Nodes that perform operations and integrate with external services.
- **Status**: Planning phase, building comprehensive documentation
- **Examples**: Send Email, Slack, Google Sheets, GitHub, OpenAI

### 🏗️ [Cluster Nodes](./clusters/index.md)
Nodes for container orchestration and cluster management.
- **Status**: Early planning phase
- **Examples**: Kubernetes, Docker, Prometheus, Helm

## Documentation Standards

### Templates
Each node category has a standardized template:
- `core-node-template.md` - For core functionality nodes
- `trigger-node-template.md` - For trigger/event nodes  
- `action-node-template.md` - For integration/action nodes
- `cluster-node-template.md` - For orchestration nodes

### Content Structure
Each node document includes:
- **Overview** - Purpose and functionality
- **Configuration** - Required and optional parameters
- **Operations** - Available operations and methods
- **Authentication** - Setup and credentials (if applicable)
- **Use Cases** - Real-world scenarios and examples
- **Best Practices** - Recommendations and patterns
- **Examples** - Code snippets and configurations

## Current Progress

### Completion Status
- ✅ **Core Nodes**: 78% complete (45/58)
- 🚧 **Trigger Nodes**: Registry created, expanding
- 🚧 **Action Nodes**: Planning phase
- 🚧 **Cluster Nodes**: Early planning

### Next Steps
1. **Complete Core Nodes**: Finish remaining 13 core nodes
2. **Expand Trigger Nodes**: Add detailed documentation for priority triggers
3. **Build Action Nodes**: Start with most commonly used integrations
4. **Plan Cluster Nodes**: Define scope and priority nodes

## Benefits of New Structure

### ✅ Solved Problems
- **Context Window Issues**: No more massive files hitting token limits
- **Maintainability**: Easy to update individual nodes
- **Scalability**: Can add hundreds of nodes without issues
- **Navigation**: Better organization and findability
- **Collaboration**: Multiple people can work simultaneously

### 🎯 Improved Workflow
- Process one node at a time (no context limits)
- Resume where we left off
- Update individual nodes without affecting others
- More efficient resource management

## Contributing Guidelines

### Adding New Nodes
1. Use the appropriate template for the node category
2. Follow the standardized content structure
3. Include practical examples and use cases
4. Update the category index file

### Updating Existing Nodes
1. Use the existing node file as base
2. Maintain the established format
3. Add new sections as needed
4. Update modification date

## Resource Optimization

### Efficient Documentation Strategy
- **Batch Processing**: 3-4 nodes per session maximum
- **Template Reuse**: Standardized formats reduce duplication
- **Smart Scraping**: Targeted information gathering
- **Progressive Enhancement**: Start basic, add detail incrementally

### Priority Framework
- **Tier 1**: Most commonly used nodes (detailed documentation)
- **Tier 2**: Moderately used nodes (standard documentation)  
- **Tier 3**: Specialized nodes (basic documentation)

---

*This restructured approach enables comprehensive node documentation while managing resources efficiently and maintaining high quality standards.*
