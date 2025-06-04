/**
 * Resource formatter utility tests
 */

import { describe, it, expect } from '@jest/globals';
import { formatResourceUri } from '../../../src/utils/resource-formatter.js';

describe('formatResourceUri', () => {
  it('appends "s" for singular resource types', () => {
    expect(formatResourceUri('workflow', '1')).toBe('n8n://workflows/1');
    expect(formatResourceUri('execution', '2')).toBe('n8n://executions/2');
  });

  it('does not append "s" for already plural resource types', () => {
    expect(formatResourceUri('workflows', '3')).toBe('n8n://workflows/3');
    expect(formatResourceUri('execution-stats', '4')).toBe('n8n://execution-stats/4');
  });

  it('returns URI without id when none is provided', () => {
    expect(formatResourceUri('workflow')).toBe('n8n://workflow');
    expect(formatResourceUri('workflows')).toBe('n8n://workflows');
  });
});
