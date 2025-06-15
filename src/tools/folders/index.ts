/**
 * Folders Tools Module
 * 
 * This module exports all folder management tools and their definitions.
 */

import { ToolDefinition } from '../../types/index.js';

// Import all folder tool handlers and definitions
export {
  CreateFolderHandler,
  ListFoldersHandler,
  MoveWorkflowToFolderHandler,
  GetFolderContentsHandler,
  DeleteFolderHandler,
  RenameFolderHandler
} from './folders.js';

export {
  getCreateFolderToolDefinition,
  getListFoldersToolDefinition,
  getMoveWorkflowToFolderToolDefinition,
  getGetFolderContentsToolDefinition,
  getDeleteFolderToolDefinition,
  getRenameFolderToolDefinition
} from './folders.js';

/**
 * Set up all folder management tools
 * 
 * @returns Array of folder tool definitions
 */
export async function setupFolderTools(): Promise<ToolDefinition[]> {
  const { 
    getCreateFolderToolDefinition,
    getListFoldersToolDefinition,
    getMoveWorkflowToFolderToolDefinition,
    getGetFolderContentsToolDefinition,
    getDeleteFolderToolDefinition,
    getRenameFolderToolDefinition
  } = await import('./folders.js');

  return [
    getCreateFolderToolDefinition(),
    getListFoldersToolDefinition(),
    getMoveWorkflowToFolderToolDefinition(),
    getGetFolderContentsToolDefinition(),
    getDeleteFolderToolDefinition(),
    getRenameFolderToolDefinition()
  ];
}