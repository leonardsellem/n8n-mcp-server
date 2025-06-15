import { ListProjectsHandler, getListProjectsToolDefinition } from './list.js';
import { CreateProjectHandler, getCreateProjectToolDefinition } from './create.js';
import { GetProjectHandler, getGetProjectToolDefinition } from './get.js';
import { DeleteProjectHandler, getDeleteProjectToolDefinition } from './delete.js';
import { UpdateProjectHandler, getUpdateProjectToolDefinition } from './update.js';

export const projectHandlers = {
  ListProjectsHandler,
  CreateProjectHandler,
  GetProjectHandler,
  DeleteProjectHandler,
  UpdateProjectHandler,
};

export const projectToolDefinitions = [
  getListProjectsToolDefinition(),
  getCreateProjectToolDefinition(),
  getGetProjectToolDefinition(),
  getDeleteProjectToolDefinition(),
  getUpdateProjectToolDefinition(),
];

export const projectTools = [
  {
    definition: getListProjectsToolDefinition(),
    handler: ListProjectsHandler,
  },
  {
    definition: getCreateProjectToolDefinition(),
    handler: CreateProjectHandler,
  },
  {
    definition: getGetProjectToolDefinition(),
    handler: GetProjectHandler,
  },
  {
    definition: getDeleteProjectToolDefinition(),
    handler: DeleteProjectHandler,
  },
  {
    definition: getUpdateProjectToolDefinition(),
    handler: UpdateProjectHandler,
  },
];

export {
  ListProjectsHandler,
  CreateProjectHandler,
  GetProjectHandler,
  DeleteProjectHandler,
  UpdateProjectHandler,
  getListProjectsToolDefinition,
  getCreateProjectToolDefinition,
  getGetProjectToolDefinition,
  getDeleteProjectToolDefinition,
  getUpdateProjectToolDefinition,
};
