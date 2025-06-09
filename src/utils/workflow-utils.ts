/**
 * Workflow utility helpers
 */

/**
 * Remove read-only and unsupported properties from a workflow object
 * before sending it to the n8n API.
 */
export function sanitizeWorkflowForApi(workflow: Record<string, any>): Record<string, any> {
  const sanitized = { ...workflow };
  delete sanitized.id;
  delete sanitized.createdAt;
  delete sanitized.updatedAt;
  delete sanitized.tags;
  delete sanitized.pinData;
  return sanitized;
}
