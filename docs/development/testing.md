# Testing

This document describes the testing approach for the n8n MCP Server and provides guidelines for writing effective tests.

## Overview

The n8n MCP Server uses Jest as its testing framework and follows a multi-level testing approach:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test the entire system as a whole

Tests are organized in the `tests/` directory, with a structure that mirrors the `src/` directory.

## Running Tests

### Running All Tests

To run all tests:

```bash
npm test
```

This command runs all tests and outputs a summary of the results.

### Running Tests with Coverage

To run tests with coverage reporting:

```bash
npm run test:coverage
```

This generates coverage reports in the `coverage/` directory, including HTML reports that you can view in a browser.

### Running Tests in Watch Mode

During development, you can run tests in watch mode, which will automatically rerun tests when files change:

```bash
npm run test:watch
```

### Running Specific Tests

To run tests in a specific file or directory:

```bash
npx jest path/to/test-file.test.ts
```

Or to run tests matching a specific pattern:

```bash
npx jest -t "test pattern"
```

## Test Structure

Tests are organized into the following directories:

- `tests/unit/`: Unit tests for individual components
- `tests/integration/`: Integration tests that test interactions between components
- `tests/e2e/`: End-to-end tests that test the entire system
- `tests/mocks/`: Shared test fixtures and mocks

### Unit Tests

Unit tests are organized in a structure that mirrors the `src/` directory. For example:

- `src/api/n8n-client.ts` has a corresponding test at `tests/unit/api/n8n-client.test.ts`
- `src/tools/workflow/list.ts` has a corresponding test at `tests/unit/tools/workflow/list.test.ts`

### Integration Tests

Integration tests focus on testing interactions between components, such as:

- Testing that tools correctly use the API client
- Testing that resources correctly format data from the API

### End-to-End Tests

End-to-end tests test the entire system, from the transport layer to the API client and back.

## Writing Effective Tests

### Unit Test Example

Here's an example of a unit test for a workflow tool:

```typescript
// tests/unit/tools/workflow/list.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import { getListWorkflowsToolDefinition, handleListWorkflows } from '../../../../src/tools/workflow/list.js';
import { N8nClient } from '../../../../src/api/n8n-client.js';

// Mock data
const mockWorkflows = [
  {
    id: '1234abc',
    name: 'Test Workflow 1',
    active: true,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-02T14:30:00.000Z'
  },
  {
    id: '5678def',
    name: 'Test Workflow 2',
    active: false,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-12T10:15:00.000Z'
  }
];

describe('Workflow List Tool', () => {
  describe('getListWorkflowsToolDefinition', () => {
    it('should return the correct tool definition', () => {
      const definition = getListWorkflowsToolDefinition();
      
      expect(definition.name).toBe('workflow_list');
      expect(definition.description).toBeTruthy();
      expect(definition.inputSchema).toBeDefined();
      expect(definition.inputSchema.properties).toHaveProperty('active');
      expect(definition.inputSchema.required).toEqual([]);
    });
  });
  
  describe('handleListWorkflows', () => {
    it('should return all workflows when no filter is provided', async () => {
      // Mock the API client
      const mockClient = {
        getWorkflows: jest.fn().mockResolvedValue(mockWorkflows)
      };
      
      const result = await handleListWorkflows(mockClient as unknown as N8nClient, {});
      
      expect(mockClient.getWorkflows).toHaveBeenCalledWith(undefined);
      expect(result.isError).toBeFalsy();
      
      // Parse the JSON text to check the content
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveLength(2);
      expect(content[0].id).toBe('1234abc');
      expect(content[1].id).toBe('5678def');
    });
    
    it('should filter workflows by active status', async () => {
      // Mock the API client
      const mockClient = {
        getWorkflows: jest.fn().mockResolvedValue(mockWorkflows)
      };
      
      const result = await handleListWorkflows(mockClient as unknown as N8nClient, { active: true });
      
      expect(mockClient.getWorkflows).toHaveBeenCalledWith(true);
      expect(result.isError).toBeFalsy();
      
      // Parse the JSON text to check the content
      const content = JSON.parse(result.content[0].text);
      expect(content).toHaveLength(2);
    });
    
    it('should handle API errors', async () => {
      // Mock the API client to throw an error
      const mockClient = {
        getWorkflows: jest.fn().mockRejectedValue(new Error('API error'))
      };
      
      const result = await handleListWorkflows(mockClient as unknown as N8nClient, {});
      
      expect(result.isError).toBeTruthy();
      expect(result.content[0].text).toContain('API error');
    });
  });
});
```

### Integration Test Example

Here's an example of an integration test that tests the interaction between a resource handler and the API client:

```typescript
// tests/integration/resources/static/workflows.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import { handleWorkflowsRequest, WORKFLOWS_URI } from '../../../../src/resources/static/workflows.js';
import { N8nClient } from '../../../../src/api/n8n-client.js';

// Mock data
const mockWorkflows = [
  {
    id: '1234abc',
    name: 'Test Workflow 1',
    active: true,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-02T14:30:00.000Z'
  },
  {
    id: '5678def',
    name: 'Test Workflow 2',
    active: false,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-12T10:15:00.000Z'
  }
];

describe('Workflows Resource Handler', () => {
  it('should return a properly formatted response', async () => {
    // Mock the API client
    const mockClient = {
      getWorkflows: jest.fn().mockResolvedValue(mockWorkflows)
    };
    
    const response = await handleWorkflowsRequest(mockClient as unknown as N8nClient);
    
    expect(mockClient.getWorkflows).toHaveBeenCalled();
    expect(response.contents).toHaveLength(1);
    expect(response.contents[0].uri).toBe(WORKFLOWS_URI);
    expect(response.contents[0].mimeType).toBe('application/json');
    
    // Parse the JSON text to check the content
    const content = JSON.parse(response.contents[0].text);
    expect(content).toHaveProperty('workflows');
    expect(content.workflows).toHaveLength(2);
    expect(content.count).toBe(2);
    expect(content.workflows[0].id).toBe('1234abc');
  });
  
  it('should handle API errors', async () => {
    // Mock the API client to throw an error
    const mockClient = {
      getWorkflows: jest.fn().mockRejectedValue(new Error('API error'))
    };
    
    await expect(handleWorkflowsRequest(mockClient as unknown as N8nClient))
      .rejects
      .toThrow('Failed to retrieve workflows');
  });
});
```

### End-to-End Test Example

Here's an example of an end-to-end test that tests the entire system:

```typescript
// tests/e2e/workflow-operations.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { MemoryServerTransport } from '@modelcontextprotocol/sdk/server/memory.js';
import { createServer } from '../../src/index.js';

describe('End-to-End Workflow Operations', () => {
  let server: Server;
  let transport: MemoryServerTransport;
  
  beforeAll(async () => {
    // Mock the environment
    process.env.N8N_API_URL = 'http://localhost:5678/api/v1';
    process.env.N8N_API_KEY = 'test-api-key';
    
    // Create the server with a memory transport
    transport = new MemoryServerTransport();
    server = await createServer(transport);
  });
  
  afterAll(async () => {
    await server.close();
  });
  
  it('should list workflows', async () => {
    // Send a request to list workflows
    const response = await transport.sendRequest({
      jsonrpc: '2.0',
      id: '1',
      method: 'callTool',
      params: {
        name: 'workflow_list',
        arguments: {}
      }
    });
    
    expect(response.result).toBeDefined();
    expect(response.result.content).toHaveLength(1);
    expect(response.result.content[0].type).toBe('text');
    
    // Parse the JSON text to check the content
    const content = JSON.parse(response.result.content[0].text);
    expect(Array.isArray(content)).toBe(true);
  });
  
  it('should retrieve a workflow by ID', async () => {
    // Send a request to get a workflow
    const response = await transport.sendRequest({
      jsonrpc: '2.0',
      id: '2',
      method: 'callTool',
      params: {
        name: 'workflow_get',
        arguments: {
          id: '1234abc'
        }
      }
    });
    
    expect(response.result).toBeDefined();
    expect(response.result.content).toHaveLength(1);
    expect(response.result.content[0].type).toBe('text');
    
    // Parse the JSON text to check the content
    const content = JSON.parse(response.result.content[0].text);
    expect(content).toHaveProperty('id');
    expect(content.id).toBe('1234abc');
  });
});
```

## Test Fixtures and Mocks

To avoid duplication and improve test maintainability, common test fixtures and mocks are stored in the `tests/mocks/` directory.

### Axios Mock

The Axios HTTP client is mocked using `axios-mock-adapter` to simulate HTTP responses without making actual API calls:

```typescript
// tests/mocks/axios-mock.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of the mock adapter
export const axiosMock = new MockAdapter(axios);

// Helper function to reset the mock adapter before each test
export function resetAxiosMock() {
  axiosMock.reset();
}
```

### n8n API Fixtures

Common fixtures for n8n API responses are stored in a shared file:

```typescript
// tests/mocks/n8n-fixtures.ts
export const mockWorkflows = [
  {
    id: '1234abc',
    name: 'Test Workflow 1',
    active: true,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-02T14:30:00.000Z',
    nodes: [
      {
        id: 'node1',
        name: 'Start',
        type: 'n8n-nodes-base.manualTrigger',
        position: [100, 200],
        parameters: {}
      }
    ],
    connections: {}
  },
  {
    id: '5678def',
    name: 'Test Workflow 2',
    active: false,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-12T10:15:00.000Z',
    nodes: [],
    connections: {}
  }
];

export const mockExecutions = [
  {
    id: 'exec123',
    workflowId: '1234abc',
    workflowName: 'Test Workflow 1',
    status: 'success',
    startedAt: '2025-03-10T15:00:00.000Z',
    finishedAt: '2025-03-10T15:01:00.000Z',
    mode: 'manual'
  },
  {
    id: 'exec456',
    workflowId: '1234abc',
    workflowName: 'Test Workflow 1',
    status: 'error',
    startedAt: '2025-03-09T12:00:00.000Z',
    finishedAt: '2025-03-09T12:00:10.000Z',
    mode: 'manual'
  }
];
```

## Test Environment

The test environment is configured in `jest.config.js` and `babel.config.js`. Key configurations include:

- TypeScript support via Babel
- ES module support
- Coverage reporting

The `tests/test-setup.ts` file contains global setup code that runs before tests:

```typescript
// tests/test-setup.ts
import { jest } from '@jest/globals';
import { resetAxiosMock } from './mocks/axios-mock';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  resetAxiosMock();
});
```

## Best Practices

### General Testing Guidelines

1. **Write tests first**: Follow a test-driven development (TDD) approach when possible.
2. **Test behavior, not implementation**: Focus on what a component does, not how it's implemented.
3. **Keep tests simple**: Each test should test one behavior or aspect of functionality.
4. **Use descriptive test names**: Test names should describe the expected behavior.
5. **Follow the AAA pattern**: Arrange, Act, Assert (setup, execute, verify).

### Mocking Best Practices

1. **Mock dependencies, not the unit under test**: Only mock external dependencies, not the code you're testing.
2. **Use the minimum viable mock**: Only mock the methods and behavior needed for the test.
3. **Ensure mock behavior is realistic**: Mocks should behave similarly to the real implementation.
4. **Verify interactions with mocks**: Use `expect(mock).toHaveBeenCalled()` to verify interactions.

### Error Testing Best Practices

1. **Test error cases**: Don't just test the happy path; test error handling too.
2. **Simulate errors with mocks**: Use mocks to simulate error scenarios.
3. **Verify error messages**: Ensure error messages are helpful and descriptive.

### Performance Testing Considerations

1. **Monitor test performance**: Slow tests can slow down development.
2. **Use test timeout values wisely**: Set appropriate timeout values for async tests.
3. **Minimize redundant setup**: Use `beforeEach` and `beforeAll` to avoid redundant setup.

## Continuous Integration

Tests are run automatically in CI environments on pull requests and commits to the main branch. The CI configuration ensures tests pass before code can be merged.

### CI Test Requirements

- All tests must pass
- Test coverage must not decrease
- Linting checks must pass

## Debugging Tests

### Console Output

You can use `console.log()` statements in your tests to debug issues:

```typescript
it('should do something', () => {
  const result = doSomething();
  console.log('Result:', result);
  expect(result).toBe(expectedValue);
});
```

When running tests with Jest, console output will be displayed for failing tests by default.

### Using the Debugger

You can also use the Node.js debugger with Jest:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand path/to/test
```

Then connect to the debugger with Chrome DevTools or VS Code.

## Conclusion

Thorough testing is essential for maintaining a reliable and robust n8n MCP Server. By following these guidelines and examples, you can write effective tests that help ensure your code works as expected and catches issues early.
