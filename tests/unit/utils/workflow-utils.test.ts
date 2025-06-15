import { describe, it, expect } from '@jest/globals';
import { sanitizeWorkflowForApi } from '../../../src/utils/workflow-utils.js';

describe('sanitizeWorkflowForApi', () => {
  it('removes read-only properties', () => {
    const workflow = {
      id: '1',
      name: 'Test',
      createdAt: 'date',
      updatedAt: 'date',
      tags: ['a'],
      pinData: { a: 1 },
      nodes: [],
      connections: {},
    };

    const sanitized = sanitizeWorkflowForApi(workflow);
    expect(sanitized).toEqual({ name: 'Test', nodes: [], connections: {} });
  });
});
