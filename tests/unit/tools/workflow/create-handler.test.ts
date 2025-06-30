import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateWorkflowHandler } from '../../../../src/tools/workflow/create.js';

class MockApiService {
  createWorkflow = jest.fn(async (workflow: any) => ({ id: '1', ...workflow }));
}

const envVars = {
  N8N_API_URL: 'https://n8n.example.com/api/v1',
  N8N_API_KEY: 'test-key',
};

describe('CreateWorkflowHandler', () => {
  beforeEach(() => {
    process.env.N8N_API_URL = envVars.N8N_API_URL;
    process.env.N8N_API_KEY = envVars.N8N_API_KEY;
  });

  it('parses nodes and connections from JSON strings', async () => {
    const handler = new CreateWorkflowHandler();
    const service = new MockApiService();
    (handler as any).apiService = service as any;

    await handler.execute({
      name: 'Test',
      nodes: '[{"id":1}]',
      connections: '{"main":[]}',
      tags: '["tag"]',
      active: true,
    });

    expect(service.createWorkflow).toHaveBeenCalledWith({
      name: 'Test',
      active: true,
      nodes: [{ id: 1 }],
      connections: { main: [] },
      tags: ['tag'],
    });
  });

  it('returns error when nodes is not an array after parsing', async () => {
    const handler = new CreateWorkflowHandler();
    const service = new MockApiService();
    (handler as any).apiService = service as any;

    const result = await handler.execute({
      name: 'Bad',
      nodes: '{"a":1}',
      connections: '{}',
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Parameter "nodes" must be an array');
  });

  it('returns error when nodes JSON is invalid', async () => {
    const handler = new CreateWorkflowHandler();
    const service = new MockApiService();
    (handler as any).apiService = service as any;

    const result = await handler.execute({
      name: 'Bad',
      nodes: '{invalid}',
      connections: '{}',
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Invalid JSON string for nodes parameter');
  });
});
