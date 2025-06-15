import { BaseCollaborationToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface CommentOptions {
  workflowId: string;
  operation: 'add_comment' | 'edit_comment' | 'delete_comment' | 'list_comments' | 'resolve_comment' | 'add_annotation';
  commentId?: string;
  content?: string;
  nodeId?: string;
  position?: { x: number; y: number };
  commentType?: 'general' | 'suggestion' | 'issue' | 'question' | 'annotation';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  mentions?: string[];
  attachments?: string[];
  parentCommentId?: string;
}

interface WorkflowComment {
  id: string;
  workflowId: string;
  workflowName: string;
  nodeId?: string;
  nodeName?: string;
  content: string;
  commentType: 'general' | 'suggestion' | 'issue' | 'question' | 'annotation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  mentions: string[];
  attachments: string[];
  position?: { x: number; y: number };
  createdAt: string;
  updatedAt?: string;
  isResolved: boolean;
  resolvedBy?: {
    id: string;
    name: string;
    resolvedAt: string;
  };
  replies: WorkflowComment[];
  parentCommentId?: string;
  metadata: {
    version: string;
    context: string;
    tags: string[];
  };
}

interface CommentResult {
  success: boolean;
  operation: string;
  comment?: WorkflowComment;
  comments?: WorkflowComment[];
  message?: string;
  statistics?: {
    totalComments: number;
    unresolvedComments: number;
    commentsByType: Record<string, number>;
    commentsByPriority: Record<string, number>;
    activeDiscussions: number;
  };
}

export class CommentOnWorkflowHandler extends BaseCollaborationToolHandler {
  private workflowComments: Map<string, WorkflowComment[]> = new Map();
  private commentCounter = 1;

  constructor() {
    super();
    this.initializeSampleComments();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId', 'operation']);
      const options = args as CommentOptions;
      const result = await this.commentOnWorkflow(options);
      return this.formatSuccess(result, `Comment operation '${options.operation}' completed successfully`);
    }, args);
  }

  async commentOnWorkflow(options: CommentOptions): Promise<CommentResult> {
    try {
      switch (options.operation) {
        case 'add_comment':
          return await this.addComment(options);
        case 'edit_comment':
          return await this.editComment(options);
        case 'delete_comment':
          return await this.deleteComment(options);
        case 'list_comments':
          return await this.listComments(options);
        case 'resolve_comment':
          return await this.resolveComment(options);
        case 'add_annotation':
          return await this.addAnnotation(options);
        default:
          throw new Error(`Unsupported operation: ${options.operation}`);
      }
    } catch (error) {
      return {
        success: false,
        operation: options.operation,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async addComment(options: CommentOptions): Promise<CommentResult> {
    if (!options.content) {
      throw new Error('Content is required for add_comment operation');
    }

    // Get workflow details
    const workflow = await this.apiService.getWorkflow(options.workflowId);
    
    // Find node details if nodeId is provided
    let nodeName: string | undefined;
    if (options.nodeId) {
      const node = workflow.nodes?.find((n: any) => n.id === options.nodeId);
      nodeName = node?.name || node?.type || 'Unknown Node';
    }

    const comment: WorkflowComment = {
      id: `comment_${this.commentCounter++}`,
      workflowId: options.workflowId,
      workflowName: workflow.name,
      nodeId: options.nodeId,
      nodeName,
      content: options.content,
      commentType: options.commentType || 'general',
      priority: options.priority || 'medium',
      author: {
        id: 'current_user',
        name: 'Current User',
        email: 'user@example.com',
        avatar: 'https://example.com/avatar.jpg'
      },
      mentions: options.mentions || [],
      attachments: options.attachments || [],
      position: options.position,
      createdAt: new Date().toISOString(),
      isResolved: false,
      replies: [],
      parentCommentId: options.parentCommentId,
      metadata: {
        version: workflow.versionId || '1.0',
        context: options.nodeId ? 'node' : 'workflow',
        tags: this.extractHashtags(options.content)
      }
    };

    // Handle reply to existing comment
    if (options.parentCommentId) {
      const parentComment = this.findComment(options.workflowId, options.parentCommentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      } else {
        throw new Error(`Parent comment ${options.parentCommentId} not found`);
      }
    } else {
      // Add as top-level comment
      const existingComments = this.workflowComments.get(options.workflowId) || [];
      this.workflowComments.set(options.workflowId, [...existingComments, comment]);
    }

    // Send notifications for mentions
    await this.sendMentionNotifications(comment);

    return {
      success: true,
      operation: 'add_comment',
      comment,
      message: 'Comment added successfully'
    };
  }

  private async editComment(options: CommentOptions): Promise<CommentResult> {
    if (!options.commentId || !options.content) {
      throw new Error('commentId and content are required for edit_comment operation');
    }

    const comment = this.findComment(options.workflowId, options.commentId);
    if (!comment) {
      throw new Error(`Comment ${options.commentId} not found`);
    }

    // Check if user can edit (in real implementation, check permissions)
    if (comment.author.id !== 'current_user') {
      throw new Error('You can only edit your own comments');
    }

    comment.content = options.content;
    comment.updatedAt = new Date().toISOString();
    comment.mentions = options.mentions || comment.mentions;
    comment.metadata.tags = this.extractHashtags(options.content);

    return {
      success: true,
      operation: 'edit_comment',
      comment,
      message: 'Comment updated successfully'
    };
  }

  private async deleteComment(options: CommentOptions): Promise<CommentResult> {
    if (!options.commentId) {
      throw new Error('commentId is required for delete_comment operation');
    }

    const comments = this.workflowComments.get(options.workflowId) || [];
    const commentIndex = comments.findIndex(c => c.id === options.commentId);

    if (commentIndex === -1) {
      // Check if it's a reply
      for (const comment of comments) {
        const replyIndex = comment.replies.findIndex(r => r.id === options.commentId);
        if (replyIndex !== -1) {
          comment.replies.splice(replyIndex, 1);
          return {
            success: true,
            operation: 'delete_comment',
            message: 'Reply deleted successfully'
          };
        }
      }
      throw new Error(`Comment ${options.commentId} not found`);
    }

    const comment = comments[commentIndex];
    
    // Check if user can delete (in real implementation, check permissions)
    if (comment.author.id !== 'current_user') {
      throw new Error('You can only delete your own comments');
    }

    comments.splice(commentIndex, 1);
    this.workflowComments.set(options.workflowId, comments);

    return {
      success: true,
      operation: 'delete_comment',
      message: 'Comment deleted successfully'
    };
  }

  private async listComments(options: CommentOptions): Promise<CommentResult> {
    const comments = this.workflowComments.get(options.workflowId) || [];
    
    // Filter by node if specified
    const filteredComments = options.nodeId 
      ? comments.filter(c => c.nodeId === options.nodeId)
      : comments;

    // Sort by creation date (newest first)
    const sortedComments = filteredComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Generate statistics
    const allComments = this.getAllCommentsIncludingReplies(comments);
    const statistics = {
      totalComments: allComments.length,
      unresolvedComments: allComments.filter(c => !c.isResolved).length,
      commentsByType: this.groupByProperty(allComments, 'commentType'),
      commentsByPriority: this.groupByProperty(allComments, 'priority'),
      activeDiscussions: comments.filter(c => c.replies.length > 0).length
    };

    return {
      success: true,
      operation: 'list_comments',
      comments: sortedComments,
      statistics
    };
  }

  private async resolveComment(options: CommentOptions): Promise<CommentResult> {
    if (!options.commentId) {
      throw new Error('commentId is required for resolve_comment operation');
    }

    const comment = this.findComment(options.workflowId, options.commentId);
    if (!comment) {
      throw new Error(`Comment ${options.commentId} not found`);
    }

    comment.isResolved = true;
    comment.resolvedBy = {
      id: 'current_user',
      name: 'Current User',
      resolvedAt: new Date().toISOString()
    };

    return {
      success: true,
      operation: 'resolve_comment',
      comment,
      message: 'Comment resolved successfully'
    };
  }

  private async addAnnotation(options: CommentOptions): Promise<CommentResult> {
    if (!options.content || !options.position) {
      throw new Error('content and position are required for add_annotation operation');
    }

    const annotationOptions: CommentOptions = {
      ...options,
      commentType: 'annotation',
      operation: 'add_comment'
    };

    return await this.addComment(annotationOptions);
  }

  private findComment(workflowId: string, commentId: string): WorkflowComment | null {
    const comments = this.workflowComments.get(workflowId) || [];
    
    // Search top-level comments
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      
      // Search replies
      for (const reply of comment.replies) {
        if (reply.id === commentId) {
          return reply;
        }
      }
    }
    
    return null;
  }

  private getAllCommentsIncludingReplies(comments: WorkflowComment[]): WorkflowComment[] {
    const allComments: WorkflowComment[] = [];
    
    for (const comment of comments) {
      allComments.push(comment);
      allComments.push(...comment.replies);
    }
    
    return allComments;
  }

  private groupByProperty(items: any[], property: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = item[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }
    
    return hashtags;
  }

  private async sendMentionNotifications(comment: WorkflowComment): Promise<void> {
    // Simulate sending notifications for mentions
    for (const mention of comment.mentions) {
      console.error(`Notification sent to ${mention}: You were mentioned in a comment on workflow "${comment.workflowName}"`);
    }
  }

  private initializeSampleComments(): void {
    // Initialize with some sample comments for demonstration
    const sampleComments: WorkflowComment[] = [
      {
        id: 'comment_1',
        workflowId: 'workflow_1',
        workflowName: 'Sample Workflow',
        nodeId: 'node_1',
        nodeName: 'HTTP Request',
        content: 'This HTTP request node needs better error handling. Consider adding retry logic.',
        commentType: 'suggestion',
        priority: 'medium',
        author: {
          id: 'user_reviewer',
          name: 'Code Reviewer',
          email: 'reviewer@example.com'
        },
        mentions: ['developer'],
        attachments: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isResolved: false,
        replies: [
          {
            id: 'comment_reply_1',
            workflowId: 'workflow_1',
            workflowName: 'Sample Workflow',
            content: 'Good point! I\'ll add a retry mechanism with exponential backoff.',
            commentType: 'general',
            priority: 'low',
            author: {
              id: 'user_developer',
              name: 'Developer',
              email: 'dev@example.com'
            },
            mentions: [],
            attachments: [],
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            isResolved: false,
            replies: [],
            parentCommentId: 'comment_1',
            metadata: {
              version: '1.0',
              context: 'node',
              tags: []
            }
          }
        ],
        metadata: {
          version: '1.0',
          context: 'node',
          tags: ['error-handling', 'improvement']
        }
      },
      {
        id: 'comment_2',
        workflowId: 'workflow_1',
        workflowName: 'Sample Workflow',
        content: 'Overall workflow looks good! Ready for production deployment. #approved',
        commentType: 'general',
        priority: 'low',
        author: {
          id: 'user_approver',
          name: 'Project Approver',
          email: 'approver@example.com'
        },
        mentions: [],
        attachments: [],
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isResolved: true,
        resolvedBy: {
          id: 'user_approver',
          name: 'Project Approver',
          resolvedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        },
        replies: [],
        metadata: {
          version: '1.0',
          context: 'workflow',
          tags: ['approved']
        }
      }
    ];

    this.workflowComments.set('workflow_1', sampleComments);
  }
}
