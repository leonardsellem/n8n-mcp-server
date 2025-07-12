// Enhanced Visual Verification Types

export interface EnhancedVisualIssue {
  id: string;
  type: 'layout' | 'execution' | 'security' | 'performance' | 'connectivity' | 'data_flow' | 'best_practice';
  subtype: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  coordinates: { x: number, y: number, width: number, height: number };
  screenshot: string; // Base64 annotated image
  recommendation: string;
  autoFixable: boolean;
  relatedNodes: string[];
  impact: 'blocks_execution' | 'performance' | 'maintenance' | 'security' | 'data_loss' | 'user_experience';
  detectionMethod: 'visual' | 'api_cross_reference' | 'pattern_analysis' | 'ocr';
  confidence: number; // 0-1 confidence score
  context: {
    surroundingNodes: string[];
    workflowSection: 'trigger' | 'processing' | 'output' | 'error_handling';
    executionContext?: ExecutionContext;
  };
  fixInstructions: FixInstruction[];
}

export interface FixInstruction {
  step: number;
  action: 'click' | 'type' | 'drag' | 'configure' | 'delete' | 'add_node' | 'connect';
  target: string;
  value?: any;
  description: string;
  automated: boolean;
}

export interface WorkflowVisualAnalysis {
  workflowId: string;
  timestamp: Date;
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical' | 'broken';
  flowPattern: 'linear' | 'branched' | 'complex' | 'cyclic' | 'invalid';
  triggerValidation: {
    hasTrigger: boolean;
    triggerType: string;
    isConfigured: boolean;
    issues: string[];
  };
  errorHandling: {
    level: 'none' | 'partial' | 'comprehensive';
    coverage: number; // percentage of nodes with error handling
    missingNodes: string[];
  };
  dataFlowIssues: DataFlowIssue[];
  performanceRisks: PerformanceRisk[];
  bestPracticeViolations: BestPracticeViolation[];
  securityIssues: SecurityIssue[];
  layoutQuality: LayoutQuality;
  executionReadiness: ExecutionReadiness;
}

export interface DataFlowIssue {
  type: 'data_loss' | 'type_mismatch' | 'missing_mapping' | 'circular_reference' | 'dead_end';
  sourceNode: string;
  targetNode?: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  suggestedFix: string;
}

export interface PerformanceRisk {
  type: 'large_dataset' | 'sync_operation' | 'external_dependency' | 'memory_intensive' | 'cpu_intensive';
  affectedNodes: string[];
  estimatedImpact: 'severe' | 'moderate' | 'minor';
  description: string;
  optimization: string;
  priority: number;
}

export interface BestPracticeViolation {
  practice: string;
  violation: string;
  affectedNodes: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  recommendation: string;
  examples: string[];
}

export interface SecurityIssue {
  type: 'exposed_credentials' | 'insecure_connection' | 'data_leakage' | 'insufficient_validation';
  description: string;
  affectedNodes: string[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  mitigation: string;
  complianceImpact: string[];
}

export interface LayoutQuality {
  score: number; // 0-100
  nodeSpacing: 'excellent' | 'good' | 'cramped' | 'scattered';
  alignment: 'excellent' | 'good' | 'poor';
  grouping: 'logical' | 'mixed' | 'chaotic';
  readability: number; // 0-100
  suggestions: string[];
}

export interface ExecutionReadiness {
  ready: boolean;
  blockers: string[];
  warnings: string[];
  estimatedSuccessRate: number; // 0-100
  dependencies: DependencyCheck[];
}

export interface DependencyCheck {
  type: 'credential' | 'connection' | 'webhook' | 'external_service';
  name: string;
  status: 'available' | 'unavailable' | 'unknown' | 'misconfigured';
  lastChecked: Date;
  details: string;
}

export interface ExecutionContext {
  isRunning: boolean;
  currentStep?: string;
  executionId?: string;
  startTime?: Date;
  status: 'waiting' | 'running' | 'success' | 'error' | 'canceled';
  performance: {
    duration: number;
    memoryUsage: number;
    stepTimes: Record<string, number>;
  };
}

export interface ExecutionVisualization {
  workflowId: string;
  executionId: string;
  startTime: Date;
  currentStatus: 'waiting' | 'running' | 'success' | 'error' | 'canceled';
  steps: ExecutionStep[];
  realTimeScreenshots: TimestampedScreenshot[];
  performanceMetrics: ExecutionPerformanceMetrics;
  issues: ExecutionIssue[];
}

export interface ExecutionStep {
  nodeId: string;
  nodeName: string;
  status: 'waiting' | 'running' | 'success' | 'error' | 'skipped';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  inputData?: any;
  outputData?: any;
  error?: string;
  visualState: NodeVisualState;
}

export interface TimestampedScreenshot {
  timestamp: Date;
  screenshot: string; // Base64
  annotations: ScreenshotAnnotation[];
  context: string;
}

export interface ScreenshotAnnotation {
  type: 'highlight' | 'arrow' | 'text' | 'circle' | 'rectangle';
  coordinates: { x: number, y: number, width?: number, height?: number };
  color: string;
  text?: string;
  purpose: 'error' | 'success' | 'info' | 'warning' | 'focus';
}

export interface NodeVisualState {
  position: { x: number, y: number };
  status: 'idle' | 'running' | 'success' | 'error' | 'disabled';
  hasError: boolean;
  hasWarning: boolean;
  isConnected: boolean;
  visualElements: {
    errorBadge?: boolean;
    warningIcon?: boolean;
    loadingSpinner?: boolean;
    successIndicator?: boolean;
    dataPreview?: boolean;
  };
  extractedText?: string[]; // OCR results
}

export interface ExecutionPerformanceMetrics {
  totalDuration: number;
  averageStepTime: number;
  slowestStep: { nodeId: string, duration: number };
  memoryPeakUsage: number;
  networkRequests: number;
  errorRate: number;
  throughput: number;
}

export interface ExecutionIssue {
  type: 'performance' | 'error' | 'warning' | 'timeout' | 'memory';
  nodeId: string;
  message: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  resolved: boolean;
}

export interface OCRResult {
  text: string;
  confidence: number;
  coordinates: { x: number, y: number, width: number, height: number };
  language?: string;
  context: 'node_label' | 'error_message' | 'tooltip' | 'dialog' | 'other';
}

export interface ComputerVisionAnalysis {
  elements: DetectedElement[];
  colors: ColorAnalysis;
  layout: LayoutAnalysis;
  text: OCRResult[];
  patterns: PatternRecognition;
}

export interface DetectedElement {
  type: 'node' | 'connection' | 'error_badge' | 'warning_icon' | 'button' | 'input' | 'dialog';
  confidence: number;
  coordinates: { x: number, y: number, width: number, height: number };
  properties: Record<string, any>;
  state: 'active' | 'inactive' | 'error' | 'warning' | 'success';
}

export interface ColorAnalysis {
  dominantColors: string[];
  errorIndicators: string[];
  successIndicators: string[];
  warningIndicators: string[];
  statusColors: Record<string, string>;
}

export interface LayoutAnalysis {
  nodeAlignment: 'grid' | 'organic' | 'scattered';
  grouping: GroupAnalysis[];
  spacing: {
    average: number;
    minimum: number;
    maximum: number;
    standardDeviation: number;
  };
  flow: 'left_to_right' | 'top_to_bottom' | 'mixed' | 'unclear';
}

export interface GroupAnalysis {
  nodes: string[];
  type: 'functional' | 'visual' | 'logical';
  cohesion: number; // 0-1
  separation: number; // distance from other groups
}

export interface PatternRecognition {
  commonPatterns: RecognizedPattern[];
  antiPatterns: AntiPattern[];
  designPatterns: DesignPattern[];
}

export interface RecognizedPattern {
  name: string;
  confidence: number;
  nodes: string[];
  description: string;
  benefits: string[];
}

export interface AntiPattern {
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  nodes: string[];
  description: string;
  problems: string[];
  solution: string;
}

export interface DesignPattern {
  name: string;
  category: 'trigger' | 'processing' | 'output' | 'error_handling' | 'data_transformation';
  nodes: string[];
  description: string;
  bestPractices: string[];
  variations: string[];
}

export interface VisualVerificationConfig {
  analysis: {
    enableOCR: boolean;
    enableComputerVision: boolean;
    enablePatternRecognition: boolean;
    confidenceThreshold: number;
  };
  monitoring: {
    enableRealTime: boolean;
    screenshotInterval: number;
    performanceTracking: boolean;
  };
  detection: {
    layoutIssues: boolean;
    securityIssues: boolean;
    performanceIssues: boolean;
    bestPractices: boolean;
  };
  integration: {
    crossReferenceAPI: boolean;
    validateAgainstJSON: boolean;
    autoFix: boolean;
  };
}