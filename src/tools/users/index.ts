/**
 * Users Tools Index
 * 
 * This module exports all users-related tools.
 */

import { CreateUserHandler, getCreateUserToolDefinition } from './create.js';
import { DeleteUserHandler, getDeleteUserToolDefinition } from './delete.js';
import { GetUserHandler, getGetUserToolDefinition } from './get.js';
import { ListUsersHandler, getListUsersToolDefinition } from './list.js';
import { UpdateUserRoleHandler, getUpdateUserRoleToolDefinition } from './update-role.js';

export const userTools = [
  {
    definition: getCreateUserToolDefinition(),
    handler: CreateUserHandler,
  },
  {
    definition: getDeleteUserToolDefinition(),
    handler: DeleteUserHandler,
  },
  {
    definition: getGetUserToolDefinition(),
    handler: GetUserHandler,
  },
  {
    definition: getListUsersToolDefinition(),
    handler: ListUsersHandler,
  },
  {
    definition: getUpdateUserRoleToolDefinition(),
    handler: UpdateUserRoleHandler,
  },
];
