/**
 * Collaboration Tools Module
 * 
 * This module provides MCP tools for workflow collaboration and team development.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool handlers
import { ShareWorkflowHandler } from './share-workflow.js';
import { CommentOnWorkflowHandler } from './comment-on-workflow.js';
import { TrackWorkflowChangesHandler } from './track-workflow-changes.js';
import { MergeWorkflowChangesHandler } from './merge-workflow-changes.js';

// Export handlers
export {
  ShareWorkflowHandler,
  CommentOnWorkflowHandler,
  TrackWorkflowChangesHandler,
  MergeWorkflowChangesHandler,
};

/**
 * Tool definition functions
 */
export function getShareWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'share_workflow',
    description: 'Share workflows with users and groups with fine-grained permissions and access control',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to share'
        },
        operation: {
          type: 'string',
          enum: ['share', 'unshare', 'update_permissions', 'list_shares', 'get_share_link'],
          description: 'Sharing operation to perform'
        },
        shareWith: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of user IDs to share with'
            },
            groups: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of group IDs to share with'
            },
            emails: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of email addresses to share with'
            }
          },
          description: 'Recipients to share the workflow with'
        },
        permissions: {
          type: 'object',
          properties: {
            view: { type: 'boolean', description: 'Allow viewing the workflow' },
            edit: { type: 'boolean', description: 'Allow editing the workflow' },
            execute: { type: 'boolean', description: 'Allow executing the workflow' },
            share: { type: 'boolean', description: 'Allow sharing the workflow with others' },
            comment: { type: 'boolean', description: 'Allow commenting on the workflow' }
          },
          description: 'Permissions to grant to recipients'
        },
        shareType: {
          type: 'string',
          enum: ['internal', 'external', 'public'],
          description: 'Type of sharing (internal users, external users, or public)'
        },
        expirationDate: {
          type: 'string',
          description: 'Expiration date for the share (ISO format)'
        },
        requireAuthentication: {
          type: 'boolean',
          description: 'Require authentication to access shared workflow'
        },
        allowedDomains: {
          type: 'array',
          items: { type: 'string' },
          description: 'Allowed email domains for external sharing'
        },
        shareMessage: {
          type: 'string',
          description: 'Message to include with the share notification'
        }
      },
      required: ['workflowId', 'operation']
    }
  };
}

export function getCommentOnWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'comment_on_workflow',
    description: 'Add comments, annotations, and collaborative discussions to workflows with mentions and threading',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to comment on'
        },
        operation: {
          type: 'string',
          enum: ['add_comment', 'edit_comment', 'delete_comment', 'list_comments', 'resolve_comment', 'add_annotation'],
          description: 'Comment operation to perform'
        },
        commentId: {
          type: 'string',
          description: 'ID of the comment (required for edit, delete, resolve operations)'
        },
        content: {
          type: 'string',
          description: 'Comment content (supports markdown and @mentions)'
        },
        nodeId: {
          type: 'string',
          description: 'Optional node ID to attach comment to specific node'
        },
        position: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' }
          },
          description: 'Position for annotations (x, y coordinates)'
        },
        commentType: {
          type: 'string',
          enum: ['general', 'suggestion', 'issue', 'question', 'annotation'],
          description: 'Type of comment'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'urgent'],
          description: 'Priority level of the comment'
        },
        mentions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of user IDs to mention in the comment'
        },
        attachments: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of attachment URLs or file IDs'
        },
        parentCommentId: {
          type: 'string',
          description: 'ID of parent comment for replies'
        }
      },
      required: ['workflowId', 'operation']
    }
  };
}

export function getTrackWorkflowChangesToolDefinition(): ToolDefinition {
  return {
    name: 'track_workflow_changes',
    description: 'Track workflow changes with version control, diff analysis, and change history',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to track changes for'
        },
        operation: {
          type: 'string',
          enum: ['get_version_history', 'compare_versions', 'create_snapshot', 'restore_version', 'track_changes'],
          description: 'Change tracking operation to perform'
        },
        fromVersion: {
          type: 'string',
          description: 'Source version ID for comparison or restoration'
        },
        toVersion: {
          type: 'string',
          description: 'Target version ID for comparison'
        },
        snapshotName: {
          type: 'string',
          description: 'Name for manual snapshot creation'
        },
        includeDetails: {
          type: 'boolean',
          description: 'Include detailed change analysis in results'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of versions to return in history'
        }
      },
      required: ['workflowId', 'operation']
    }
  };
}

export function getMergeWorkflowChangesToolDefinition(): ToolDefinition {
  return {
    name: 'merge_workflow_changes',
    description: 'Merge workflow changes with conflict detection, resolution, and collaborative development support',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to perform merge operations on'
        },
        operation: {
          type: 'string',
          enum: ['merge_branches', 'resolve_conflicts', 'preview_merge', 'create_branch', 'list_branches'],
          description: 'Merge operation to perform'
        },
        sourceBranch: {
          type: 'string',
          description: 'Source branch name for merge operations'
        },
        targetBranch: {
          type: 'string',
          description: 'Target branch name for merge operations'
        },
        baseVersion: {
          type: 'string',
          description: 'Base version for branch creation'
        },
        branchName: {
          type: 'string',
          description: 'Name for new branch creation'
        },
        conflictResolutions: {
          type: 'object',
          description: 'Manual conflict resolutions (conflict ID -> resolution strategy)',
          additionalProperties: true
        },
        mergeStrategy: {
          type: 'string',
          enum: ['auto', 'manual', 'conservative', 'aggressive'],
          description: 'Strategy for resolving merge conflicts'
        },
        createMergeCommit: {
          type: 'boolean',
          description: 'Whether to create a merge commit'
        }
      },
      required: ['workflowId', 'operation']
    }
  };
}

/**
 * Set up workflow collaboration tools
 *
 * @returns Array of collaboration tool definitions
 */
export async function setupCollaborationTools(): Promise<ToolDefinition[]> {
  return [
    getShareWorkflowToolDefinition(),
    getCommentOnWorkflowToolDefinition(),
    getTrackWorkflowChangesToolDefinition(),
    getMergeWorkflowChangesToolDefinition()
  ];
}