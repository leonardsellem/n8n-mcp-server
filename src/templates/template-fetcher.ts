import axios from 'axios';
import { logger } from '../utils/logger';

export interface TemplateNode {
  id: number;
  name: string;
  icon: string;
}

export interface TemplateUser {
  id: number;
  name: string;
  username: string;
  verified: boolean;
}

export interface TemplateWorkflow {
  id: number;
  name: string;
  description: string;
  totalViews: number;
  createdAt: string;
  user: TemplateUser;
  nodes: TemplateNode[];
}

export interface TemplateDetail {
  id: number;
  name: string;
  description: string;
  views: number;
  createdAt: string;
  workflow: {
    nodes: any[];
    connections: any;
    settings?: any;
  };
}

export class TemplateFetcher {
  private readonly baseUrl = 'https://api.n8n.io/api/templates';
  private readonly pageSize = 100;
  
  async fetchTemplates(progressCallback?: (current: number, total: number) => void): Promise<TemplateWorkflow[]> {
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);
    
    const allTemplates: TemplateWorkflow[] = [];
    let page = 1;
    let hasMore = true;
    
    logger.info('Starting template fetch from n8n.io API');
    
    while (hasMore) {
      try {
        const response = await axios.get(`${this.baseUrl}/search`, {
          params: {
            page,
            rows: this.pageSize,
            sort_by: 'last-updated'
          }
        });
        
        const { workflows, totalWorkflows } = response.data;
        
        // Filter templates by date
        const recentTemplates = workflows.filter((w: TemplateWorkflow) => {
          const createdDate = new Date(w.createdAt);
          return createdDate >= oneYearAgo;
        });
        
        // If we hit templates older than 1 year, stop fetching
        if (recentTemplates.length < workflows.length) {
          hasMore = false;
          logger.info(`Reached templates older than 1 year at page ${page}`);
        }
        
        allTemplates.push(...recentTemplates);
        
        if (progressCallback) {
          progressCallback(allTemplates.length, Math.min(totalWorkflows, allTemplates.length + 500));
        }
        
        // Check if there are more pages
        if (workflows.length < this.pageSize || allTemplates.length >= totalWorkflows) {
          hasMore = false;
        }
        
        page++;
        
        // Rate limiting - be nice to the API
        if (hasMore) {
          await this.sleep(500); // 500ms between requests
        }
      } catch (error) {
        logger.error(`Error fetching templates page ${page}:`, error);
        throw error;
      }
    }
    
    logger.info(`Fetched ${allTemplates.length} templates from last year`);
    return allTemplates;
  }
  
  async fetchTemplateDetail(workflowId: number): Promise<TemplateDetail> {
    try {
      const response = await axios.get(`${this.baseUrl}/workflows/${workflowId}`);
      return response.data.workflow;
    } catch (error) {
      logger.error(`Error fetching template detail for ${workflowId}:`, error);
      throw error;
    }
  }
  
  async fetchAllTemplateDetails(
    workflows: TemplateWorkflow[], 
    progressCallback?: (current: number, total: number) => void
  ): Promise<Map<number, TemplateDetail>> {
    const details = new Map<number, TemplateDetail>();
    
    logger.info(`Fetching details for ${workflows.length} templates`);
    
    for (let i = 0; i < workflows.length; i++) {
      const workflow = workflows[i];
      
      try {
        const detail = await this.fetchTemplateDetail(workflow.id);
        details.set(workflow.id, detail);
        
        if (progressCallback) {
          progressCallback(i + 1, workflows.length);
        }
        
        // Rate limiting
        await this.sleep(200); // 200ms between requests
      } catch (error) {
        logger.error(`Failed to fetch details for workflow ${workflow.id}:`, error);
        // Continue with other templates
      }
    }
    
    logger.info(`Successfully fetched ${details.size} template details`);
    return details;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}