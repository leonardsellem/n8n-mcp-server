/**
 * Compare Environments Tool
 *
 * This module provides functionality to compare workflow versions between environments.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseEnvironmentToolHandler } from './base-handler.js';

/**
 * Handler for comparing environments
 */
export class CompareEnvironmentsHandler extends BaseEnvironmentToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['environment1', 'environment2']);
      
      const { environment1, environment2, compareType = 'workflows' } = args;

      try {
        // Get API clients for both environments
        const client1 = this.getApiClientForEnvironment(environment1);
        const client2 = this.getApiClientForEnvironment(environment2);

        let comparison;
        switch (compareType) {
          case 'workflows':
            comparison = await this.compareWorkflows(client1, client2, environment1, environment2);
            break;
          case 'credentials':
            comparison = await this.compareCredentials(client1, client2, environment1, environment2);
            break;
          case 'variables':
            comparison = await this.compareVariables(client1, client2, environment1, environment2);
            break;
          case 'all':
            comparison = await this.compareAll(client1, client2, environment1, environment2);
            break;
          default:
            throw new Error(`Unknown comparison type: ${compareType}`);
        }

        const result = {
          environment1,
          environment2,
          compareType,
          comparison,
          summary: this.generateComparisonSummary(comparison)
        };

        return this.formatSuccess(result, `Comparison between ${environment1} and ${environment2} completed`);
      } catch (error) {
        throw new Error(`Failed to compare environments: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Compare workflows between environments
   */
  private async compareWorkflows(client1: any, client2: any, env1: string, env2: string): Promise<any> {
    const [workflows1, workflows2] = await Promise.all([
      client1.getWorkflows(),
      client2.getWorkflows()
    ]);

    const workflows1Map = new Map(workflows1.map((w: any) => [w.name, w]));
    const workflows2Map = new Map(workflows2.map((w: any) => [w.name, w]));

    const onlyIn1 = workflows1.filter((w: any) => !workflows2Map.has(w.name));
    const onlyIn2 = workflows2.filter((w: any) => !workflows1Map.has(w.name));
    const inBoth = workflows1.filter((w: any) => workflows2Map.has(w.name));

    const differences = inBoth.map((w1: any) => {
      const w2 = workflows2Map.get(w1.name);
      return this.compareWorkflowDetails(w1, w2, env1, env2);
    }).filter((diff: any) => diff.hasDifferences);

    return {
      type: 'workflows',
      [`only_in_${env1}`]: onlyIn1.map((w: any) => ({ name: w.name, id: w.id, active: w.active })),
      [`only_in_${env2}`]: onlyIn2.map((w: any) => ({ name: w.name, id: w.id, active: w.active })),
      different: differences,
      identical: inBoth.length - differences.length,
      totals: {
        [env1]: workflows1.length,
        [env2]: workflows2.length
      }
    };
  }

  /**
   * Compare credentials between environments
   */
  private async compareCredentials(client1: any, client2: any, env1: string, env2: string): Promise<any> {
    try {
      const [creds1, creds2] = await Promise.all([
        client1.getCredentials(),
        client2.getCredentials()
      ]);

      const creds1Map = new Map(creds1.map((c: any) => [c.name, c]));
      const creds2Map = new Map(creds2.map((c: any) => [c.name, c]));

      const onlyIn1 = creds1.filter((c: any) => !creds2Map.has(c.name));
      const onlyIn2 = creds2.filter((c: any) => !creds1Map.has(c.name));
      const inBoth = creds1.filter((c: any) => creds2Map.has(c.name));

      return {
        type: 'credentials',
        [`only_in_${env1}`]: onlyIn1.map((c: any) => ({ name: c.name, type: c.type })),
        [`only_in_${env2}`]: onlyIn2.map((c: any) => ({ name: c.name, type: c.type })),
        common: inBoth.map((c: any) => ({ name: c.name, type: c.type })),
        totals: {
          [env1]: creds1.length,
          [env2]: creds2.length
        }
      };
    } catch (error) {
      return {
        type: 'credentials',
        error: 'Unable to compare credentials - may not have sufficient permissions'
      };
    }
  }

  /**
   * Compare variables between environments
   */
  private async compareVariables(client1: any, client2: any, env1: string, env2: string): Promise<any> {
    try {
      const [vars1, vars2] = await Promise.all([
        client1.getVariables(),
        client2.getVariables()
      ]);

      const vars1Map = new Map(vars1.map((v: any) => [v.key, v]));
      const vars2Map = new Map(vars2.map((v: any) => [v.key, v]));

      const onlyIn1 = vars1.filter((v: any) => !vars2Map.has(v.key));
      const onlyIn2 = vars2.filter((v: any) => !vars1Map.has(v.key));
      const inBoth = vars1.filter((v: any) => vars2Map.has(v.key));

      const differentValues = inBoth.filter((v1: any) => {
        const v2 = vars2Map.get(v1.key) as any;
        return v1.value !== v2?.value;
      });

      return {
        type: 'variables',
        [`only_in_${env1}`]: onlyIn1.map((v: any) => ({ key: v.key, type: v.type })),
        [`only_in_${env2}`]: onlyIn2.map((v: any) => ({ key: v.key, type: v.type })),
        different_values: differentValues.map((v: any) => ({ key: v.key, type: v.type })),
        identical: inBoth.length - differentValues.length,
        totals: {
          [env1]: vars1.length,
          [env2]: vars2.length
        }
      };
    } catch (error) {
      return {
        type: 'variables',
        error: 'Unable to compare variables - may not be supported in this n8n version'
      };
    }
  }

  /**
   * Compare all aspects between environments
   */
  private async compareAll(client1: any, client2: any, env1: string, env2: string): Promise<any> {
    const [workflowComparison, credentialComparison, variableComparison] = await Promise.all([
      this.compareWorkflows(client1, client2, env1, env2),
      this.compareCredentials(client1, client2, env1, env2),
      this.compareVariables(client1, client2, env1, env2)
    ]);

    return {
      workflows: workflowComparison,
      credentials: credentialComparison,
      variables: variableComparison
    };
  }

  /**
   * Compare workflow details
   */
  private compareWorkflowDetails(w1: any, w2: any, env1: string, env2: string): any {
    const differences = [];

    if (w1.active !== w2.active) {
      differences.push({
        field: 'active',
        [env1]: w1.active,
        [env2]: w2.active
      });
    }

    if (w1.nodes?.length !== w2.nodes?.length) {
      differences.push({
        field: 'node_count',
        [env1]: w1.nodes?.length || 0,
        [env2]: w2.nodes?.length || 0
      });
    }

    if (JSON.stringify(w1.settings) !== JSON.stringify(w2.settings)) {
      differences.push({
        field: 'settings',
        [env1]: 'different',
        [env2]: 'different'
      });
    }

    const w1Updated = new Date(w1.updatedAt || w1.createdAt);
    const w2Updated = new Date(w2.updatedAt || w2.createdAt);
    
    return {
      name: w1.name,
      hasDifferences: differences.length > 0,
      differences,
      lastUpdated: {
        [env1]: w1Updated.toISOString(),
        [env2]: w2Updated.toISOString(),
        newer: w1Updated > w2Updated ? env1 : env2
      }
    };
  }

  /**
   * Generate comparison summary
   */
  private generateComparisonSummary(comparison: any): string {
    if (comparison.workflows) {
      // Summary for complete comparison
      const w = comparison.workflows;
      const c = comparison.credentials;
      const v = comparison.variables;

      return `Workflows: ${w.different.length} different, ${w.identical} identical. ` +
             `Credentials: ${c.error ? 'Cannot compare' : `${Object.keys(c).filter(k => k.startsWith('only_')).length} unique items`}. ` +
             `Variables: ${v.error ? 'Cannot compare' : `${v.different_values?.length || 0} value differences`}.`;
    } else if (comparison.type === 'workflows') {
      return `${comparison.different.length} workflows have differences, ${comparison.identical} are identical`;
    } else {
      return `Comparison completed for ${comparison.type}`;
    }
  }
}

/**
 * Get the tool definition for comparing environments
 */
export function getCompareEnvironmentsToolDefinition(): ToolDefinition {
  return {
    name: 'compare_environments',
    description: 'Compare workflow versions, credentials, and variables between different environments',
    inputSchema: {
      type: 'object',
      properties: {
        environment1: {
          type: 'string',
          description: 'First environment to compare'
        },
        environment2: {
          type: 'string',
          description: 'Second environment to compare'
        },
        compareType: {
          type: 'string',
          enum: ['workflows', 'credentials', 'variables', 'all'],
          description: 'What to compare between environments',
          default: 'workflows'
        }
      },
      required: ['environment1', 'environment2']
    }
  };
}