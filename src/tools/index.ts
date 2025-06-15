import { userTools } from './users/index.js';
import { tagTools } from './tags/index.js';
import { projectTools } from './projects/index.js';
import { variableTools } from './variables/index.js';
import { sourceControlTools } from './source-control/index.js';
import { auditingTools } from './auditing/index.js';

export const allTools = [
  ...userTools,
  ...tagTools,
  ...projectTools,
  ...variableTools,
  ...sourceControlTools,
  ...auditingTools,
];
