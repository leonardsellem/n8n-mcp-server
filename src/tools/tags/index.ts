/**
 * Tags Tools Index
 * 
 * This module exports all tags-related tools.
 */

import { CreateTagHandler, getCreateTagToolDefinition } from './create.js';
import { DeleteTagHandler, getDeleteTagToolDefinition } from './delete.js';
import { GetTagHandler, getGetTagToolDefinition } from './get.js';
import { ListTagsHandler, getListTagsToolDefinition } from './list.js';
import { UpdateTagHandler, getUpdateTagToolDefinition } from './update.js';

export const tagTools = [
  {
    definition: getCreateTagToolDefinition(),
    handler: CreateTagHandler,
  },
  {
    definition: getDeleteTagToolDefinition(),
    handler: DeleteTagHandler,
  },
  {
    definition: getGetTagToolDefinition(),
    handler: GetTagHandler,
  },
  {
    definition: getListTagsToolDefinition(),
    handler: ListTagsHandler,
  },
  {
    definition: getUpdateTagToolDefinition(),
    handler: UpdateTagHandler,
  },
];
