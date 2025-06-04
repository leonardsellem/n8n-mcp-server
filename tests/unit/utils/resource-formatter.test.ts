import { describe, it, expect } from '@jest/globals';
import { formatResourceUri } from '../../../src/utils/resource-formatter.js';

describe('formatResourceUri', () => {
  it('should format workflow resource URIs', () => {
    expect(formatResourceUri('workflow', '123')).toBe('n8n://workflows/123');
  });

  it('should format execution resource URIs', () => {
    expect(formatResourceUri('execution', '456')).toBe('n8n://executions/456');
  });

  it('should not double pluralize when resourceType is already plural', () => {
    expect(formatResourceUri('workflows', '789')).toBe('n8n://workflows/789');
  });

  it('should handle execution-stats with id', () => {
    expect(formatResourceUri('execution-stats', 'abc')).toBe('n8n://execution-stats/abc');
  });
});
