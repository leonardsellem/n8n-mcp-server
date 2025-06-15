import { listVariablesTool } from './list.js';
import { createVariableTool } from './create.js';
import { getVariableTool } from './get.js';
import { deleteVariableTool } from './delete.js';
import { updateVariableTool } from './update.js';

export const variableTools = [
  listVariablesTool,
  createVariableTool,
  getVariableTool,
  deleteVariableTool,
  updateVariableTool,
];
