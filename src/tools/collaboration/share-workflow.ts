import { BaseCollaborationToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface ShareWorkflowOptions {
  workflowId: string;
  operation: 'share' | 'unshare' | 'update_permissions' | 'list_shares' | 'get_share_link';
  shareWith?: {
    users?: string[];
    groups?: string[];
    emails?: string[];
  };
  permissions?: {
    view?: boolean;
    edit?: boolean;
    execute?: boolean;
    share?: boolean;
    comment?: boolean;
  };
  shareType?: 'internal' | 'external' | 'public';
  expirationDate?: string;
  requireAuthentication?: boolean;
  allowedDomains?: string[];
  shareMessage?: string;
}

interface WorkflowShare {
  id: string;
  workflowId: string;
  workflowName: string;
  sharedBy: {
    id: string;
    name: string;
    email: string;
  };
  sharedWith: {
    type: 'user' | 'group' | 'email' | 'public';
    identifier: string;
    name?: string;
  };
  permissions: {
    view: boolean;
    edit: boolean;
    execute: boolean;
    share: boolean;
    comment: boolean;
  };
  shareType: 'internal' | 'external' | 'public';
  createdAt: string;
  expiresAt?: string;
  lastAccessed?: string;
  accessCount: number;
  status: 'active' | 'expired' | 'revoked';
  shareLink?: string;
}

interface ShareResult {
  success: boolean;
  operation: string;
  shares?: WorkflowShare[];
  shareLink?: string;
  message?: string;
  permissions?: {
    granted: string[];
    denied: string[];
  };
  statistics?: {
    totalShares: number;
    activeShares: number;
    expiredShares: number;
    totalUsers: number;
    totalAccesses: number;
  };
}

export class ShareWorkflowHandler extends BaseCollaborationToolHandler {
  private workflowShares: Map<string, WorkflowShare[]> = new Map();

  constructor() {
    super();
    this.initializeSampleShares();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflowId', 'operation']);
      const options = args as ShareWorkflowOptions;
      const result = await this.shareWorkflow(options);
      return this.formatSuccess(result, `Workflow sharing operation '${options.operation}' completed successfully`);
    }, args);
  }

  async shareWorkflow(options: ShareWorkflowOptions): Promise<ShareResult> {
    try {
      switch (options.operation) {
        case 'share':
          return await this.createWorkflowShare(options);
        case 'unshare':
          return await this.removeWorkflowShare(options);
        case 'update_permissions':
          return await this.updateSharePermissions(options);
        case 'list_shares':
          return await this.listWorkflowShares(options);
        case 'get_share_link':
          return await this.generateShareLink(options);
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

  private async createWorkflowShare(options: ShareWorkflowOptions): Promise<ShareResult> {
    if (!options.shareWith) {
      throw new Error('shareWith parameter is required for share operation');
    }

    // Get workflow details
    const workflow = await this.apiService.getWorkflow(options.workflowId);
    const shares: WorkflowShare[] = [];
    const permissions = options.permissions || {
      view: true,
      edit: false,
      execute: false,
      share: false,
      comment: true
    };

    // Process user shares
    if (options.shareWith.users) {
      for (const userId of options.shareWith.users) {
        const share = this.createShare({
          workflowId: options.workflowId,
          workflowName: workflow.name,
          shareWith: { type: 'user', identifier: userId, name: `User ${userId}` },
          permissions,
          shareType: options.shareType || 'internal',
          expirationDate: options.expirationDate
        });
        shares.push(share);
      }
    }

    // Process group shares
    if (options.shareWith.groups) {
      for (const groupId of options.shareWith.groups) {
        const share = this.createShare({
          workflowId: options.workflowId,
          workflowName: workflow.name,
          shareWith: { type: 'group', identifier: groupId, name: `Group ${groupId}` },
          permissions,
          shareType: options.shareType || 'internal',
          expirationDate: options.expirationDate
        });
        shares.push(share);
      }
    }

    // Process email shares
    if (options.shareWith.emails) {
      for (const email of options.shareWith.emails) {
        const share = this.createShare({
          workflowId: options.workflowId,
          workflowName: workflow.name,
          shareWith: { type: 'email', identifier: email, name: email },
          permissions,
          shareType: options.shareType || 'external',
          expirationDate: options.expirationDate
        });
        shares.push(share);
      }
    }

    // Store shares
    const existingShares = this.workflowShares.get(options.workflowId) || [];
    this.workflowShares.set(options.workflowId, [...existingShares, ...shares]);

    // Send notifications (simulated)
    await this.sendShareNotifications(shares, options.shareMessage);

    return {
      success: true,
      operation: 'share',
      shares,
      message: `Workflow shared with ${shares.length} recipient(s)`,
      permissions: {
        granted: Object.keys(permissions).filter(key => permissions[key as keyof typeof permissions]),
        denied: Object.keys(permissions).filter(key => !permissions[key as keyof typeof permissions])
      }
    };
  }

  private async removeWorkflowShare(options: ShareWorkflowOptions): Promise<ShareResult> {
    const shares = this.workflowShares.get(options.workflowId) || [];
    let removedCount = 0;

    if (options.shareWith) {
      // Remove specific shares
      const identifiers = [
        ...(options.shareWith.users || []),
        ...(options.shareWith.groups || []),
        ...(options.shareWith.emails || [])
      ];

      const updatedShares = shares.filter(share => {
        if (identifiers.includes(share.sharedWith.identifier)) {
          share.status = 'revoked';
          removedCount++;
          return false;
        }
        return true;
      });

      this.workflowShares.set(options.workflowId, updatedShares);
    } else {
      // Remove all shares
      removedCount = shares.length;
      this.workflowShares.delete(options.workflowId);
    }

    return {
      success: true,
      operation: 'unshare',
      message: `Removed ${removedCount} share(s) for workflow`
    };
  }

  private async updateSharePermissions(options: ShareWorkflowOptions): Promise<ShareResult> {
    if (!options.permissions || !options.shareWith) {
      throw new Error('Both permissions and shareWith are required for update_permissions operation');
    }

    const shares = this.workflowShares.get(options.workflowId) || [];
    const identifiers = [
      ...(options.shareWith.users || []),
      ...(options.shareWith.groups || []),
      ...(options.shareWith.emails || [])
    ];

    let updatedCount = 0;
    const updatedShares = shares.map(share => {
      if (identifiers.includes(share.sharedWith.identifier)) {
        share.permissions = { ...share.permissions, ...options.permissions };
        updatedCount++;
      }
      return share;
    });

    this.workflowShares.set(options.workflowId, updatedShares);

    return {
      success: true,
      operation: 'update_permissions',
      message: `Updated permissions for ${updatedCount} share(s)`,
      permissions: {
        granted: Object.keys(options.permissions).filter(key => options.permissions![key as keyof typeof options.permissions]),
        denied: Object.keys(options.permissions).filter(key => !options.permissions![key as keyof typeof options.permissions])
      }
    };
  }

  private async listWorkflowShares(options: ShareWorkflowOptions): Promise<ShareResult> {
    const shares = this.workflowShares.get(options.workflowId) || [];
    const activeShares = shares.filter(share => share.status === 'active');
    const expiredShares = shares.filter(share => share.status === 'expired');

    const statistics = {
      totalShares: shares.length,
      activeShares: activeShares.length,
      expiredShares: expiredShares.length,
      totalUsers: new Set(shares.map(s => s.sharedWith.identifier)).size,
      totalAccesses: shares.reduce((sum, share) => sum + share.accessCount, 0)
    };

    return {
      success: true,
      operation: 'list_shares',
      shares: activeShares,
      statistics
    };
  }

  private async generateShareLink(options: ShareWorkflowOptions): Promise<ShareResult> {
    const workflow = await this.apiService.getWorkflow(options.workflowId);
    const shareId = `share_${options.workflowId}_${Date.now()}`;
    
    const shareLink = options.shareType === 'public' 
      ? `https://n8n.example.com/workflow/public/${shareId}`
      : `https://n8n.example.com/workflow/shared/${shareId}`;

    // Create a public share entry
    const publicShare = this.createShare({
      workflowId: options.workflowId,
      workflowName: workflow.name,
      shareWith: { type: 'public', identifier: 'public' },
      permissions: options.permissions || { view: true, edit: false, execute: false, share: false, comment: false },
      shareType: options.shareType || 'public',
      expirationDate: options.expirationDate,
      shareLink
    });

    const existingShares = this.workflowShares.get(options.workflowId) || [];
    this.workflowShares.set(options.workflowId, [...existingShares, publicShare]);

    return {
      success: true,
      operation: 'get_share_link',
      shareLink,
      message: 'Share link generated successfully'
    };
  }

  private createShare(params: {
    workflowId: string;
    workflowName: string;
    shareWith: { type: 'user' | 'group' | 'email' | 'public'; identifier: string; name?: string };
    permissions: any;
    shareType: 'internal' | 'external' | 'public';
    expirationDate?: string;
    shareLink?: string;
  }): WorkflowShare {
    const shareId = `share_${params.workflowId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: shareId,
      workflowId: params.workflowId,
      workflowName: params.workflowName,
      sharedBy: {
        id: 'current_user',
        name: 'Current User',
        email: 'user@example.com'
      },
      sharedWith: params.shareWith,
      permissions: params.permissions,
      shareType: params.shareType,
      createdAt: new Date().toISOString(),
      expiresAt: params.expirationDate,
      accessCount: 0,
      status: 'active',
      shareLink: params.shareLink
    };
  }

  private async sendShareNotifications(shares: WorkflowShare[], message?: string): Promise<void> {
    // Simulate sending notifications
    for (const share of shares) {
      console.error(`Notification sent to ${share.sharedWith.identifier}: Workflow "${share.workflowName}" has been shared with you.`);
      if (message) {
        console.error(`Message: ${message}`);
      }
    }
  }

  private initializeSampleShares(): void {
    // Initialize with some sample shares for demonstration
    const sampleShare: WorkflowShare = {
      id: 'sample_share_1',
      workflowId: 'workflow_1',
      workflowName: 'Sample Workflow',
      sharedBy: {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@example.com'
      },
      sharedWith: {
        type: 'user',
        identifier: 'user_developer',
        name: 'Developer User'
      },
      permissions: {
        view: true,
        edit: true,
        execute: false,
        share: false,
        comment: true
      },
      shareType: 'internal',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      accessCount: 5,
      status: 'active'
    };

    this.workflowShares.set('workflow_1', [sampleShare]);
  }
}
