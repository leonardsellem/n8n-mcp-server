import { safeJsonParse, N8nApiError } from '../errors/index.js';

/**
 * Parse JSON if the provided value is a string containing JSON.
 * Returns the original value if parsing fails or the value is not a string.
 */
export function parseIfJsonString(
  value: any,
  options?: { throwOnError?: boolean; paramName?: string },
): any {
  if (typeof value !== 'string') return value;
  const parsed = safeJsonParse(value);
  if (parsed === null) {
    if (options?.throwOnError) {
      const name = options.paramName ?? 'value';
      throw new N8nApiError(`Invalid JSON string for ${name} parameter`);
    }
    return value;
  }
  return parsed;
}

