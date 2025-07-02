/**
 * Expression Validator for n8n expressions
 * Validates expression syntax, variable references, and context availability
 */

interface ExpressionValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  usedVariables: Set<string>;
  usedNodes: Set<string>;
}

interface ExpressionContext {
  availableNodes: string[];
  currentNodeName?: string;
  isInLoop?: boolean;
  hasInputData?: boolean;
}

export class ExpressionValidator {
  // Common n8n expression patterns
  private static readonly EXPRESSION_PATTERN = /\{\{(.+?)\}\}/g;
  private static readonly VARIABLE_PATTERNS = {
    json: /\$json(\.[a-zA-Z_][\w]*|\["[^"]+"\]|\['[^']+'\]|\[\d+\])*/g,
    node: /\$node\["([^"]+)"\]\.json/g,
    input: /\$input\.item(\.[a-zA-Z_][\w]*|\["[^"]+"\]|\['[^']+'\]|\[\d+\])*/g,
    items: /\$items\("([^"]+)"(?:,\s*(\d+))?\)/g,
    parameter: /\$parameter\["([^"]+)"\]/g,
    env: /\$env\.([a-zA-Z_][\w]*)/g,
    workflow: /\$workflow\.(id|name|active)/g,
    execution: /\$execution\.(id|mode|resumeUrl)/g,
    prevNode: /\$prevNode\.(name|outputIndex|runIndex)/g,
    itemIndex: /\$itemIndex/g,
    runIndex: /\$runIndex/g,
    now: /\$now/g,
    today: /\$today/g,
  };

  /**
   * Validate a single expression
   */
  static validateExpression(
    expression: string,
    context: ExpressionContext
  ): ExpressionValidationResult {
    const result: ExpressionValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      usedVariables: new Set(),
      usedNodes: new Set(),
    };

    // Check for basic syntax errors
    const syntaxErrors = this.checkSyntaxErrors(expression);
    result.errors.push(...syntaxErrors);

    // Extract all expressions
    const expressions = this.extractExpressions(expression);
    
    for (const expr of expressions) {
      // Validate each expression
      this.validateSingleExpression(expr, context, result);
    }

    // Check for undefined node references
    this.checkNodeReferences(result, context);

    result.valid = result.errors.length === 0;
    return result;
  }

  /**
   * Check for basic syntax errors
   */
  private static checkSyntaxErrors(expression: string): string[] {
    const errors: string[] = [];

    // Check for unmatched brackets
    const openBrackets = (expression.match(/\{\{/g) || []).length;
    const closeBrackets = (expression.match(/\}\}/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      errors.push('Unmatched expression brackets {{ }}');
    }

    // Check for nested expressions (not supported in n8n)
    if (expression.includes('{{') && expression.includes('{{', expression.indexOf('{{') + 2)) {
      const match = expression.match(/\{\{.*\{\{/);
      if (match) {
        errors.push('Nested expressions are not supported');
      }
    }

    // Check for empty expressions
    if (expression.includes('{{}}')) {
      errors.push('Empty expression found');
    }

    return errors;
  }

  /**
   * Extract all expressions from a string
   */
  private static extractExpressions(text: string): string[] {
    const expressions: string[] = [];
    let match;
    
    while ((match = this.EXPRESSION_PATTERN.exec(text)) !== null) {
      expressions.push(match[1].trim());
    }
    
    return expressions;
  }

  /**
   * Validate a single expression content
   */
  private static validateSingleExpression(
    expr: string,
    context: ExpressionContext,
    result: ExpressionValidationResult
  ): void {
    // Check for $json usage
    let match;
    while ((match = this.VARIABLE_PATTERNS.json.exec(expr)) !== null) {
      result.usedVariables.add('$json');
      
      if (!context.hasInputData && !context.isInLoop) {
        result.warnings.push(
          'Using $json but node might not have input data'
        );
      }
    }

    // Check for $node references
    while ((match = this.VARIABLE_PATTERNS.node.exec(expr)) !== null) {
      const nodeName = match[1];
      result.usedNodes.add(nodeName);
      result.usedVariables.add('$node');
    }

    // Check for $input usage
    while ((match = this.VARIABLE_PATTERNS.input.exec(expr)) !== null) {
      result.usedVariables.add('$input');
      
      if (!context.hasInputData) {
        result.errors.push(
          '$input is only available when the node has input data'
        );
      }
    }

    // Check for $items usage
    while ((match = this.VARIABLE_PATTERNS.items.exec(expr)) !== null) {
      const nodeName = match[1];
      result.usedNodes.add(nodeName);
      result.usedVariables.add('$items');
    }

    // Check for other variables
    for (const [varName, pattern] of Object.entries(this.VARIABLE_PATTERNS)) {
      if (['json', 'node', 'input', 'items'].includes(varName)) continue;
      
      if (pattern.test(expr)) {
        result.usedVariables.add(`$${varName}`);
      }
    }

    // Check for common mistakes
    this.checkCommonMistakes(expr, result);
  }

  /**
   * Check for common expression mistakes
   */
  private static checkCommonMistakes(
    expr: string,
    result: ExpressionValidationResult
  ): void {
    // Check for missing $ prefix - but exclude cases where $ is already present
    const missingPrefixPattern = /(?<!\$)\b(json|node|input|items|workflow|execution)\b(?!\s*:)/;
    if (expr.match(missingPrefixPattern)) {
      result.warnings.push(
        'Possible missing $ prefix for variable (e.g., use $json instead of json)'
      );
    }

    // Check for incorrect array access
    if (expr.includes('$json[') && !expr.match(/\$json\[\d+\]/)) {
      result.warnings.push(
        'Array access should use numeric index: $json[0] or property access: $json.property'
      );
    }

    // Check for Python-style property access
    if (expr.match(/\$json\['[^']+'\]/)) {
      result.warnings.push(
        "Consider using dot notation: $json.property instead of $json['property']"
      );
    }

    // Check for undefined/null access attempts
    if (expr.match(/\?\./)) {
      result.warnings.push(
        'Optional chaining (?.) is not supported in n8n expressions'
      );
    }

    // Check for template literals
    if (expr.includes('${')) {
      result.errors.push(
        'Template literals ${} are not supported. Use string concatenation instead'
      );
    }
  }

  /**
   * Check that all referenced nodes exist
   */
  private static checkNodeReferences(
    result: ExpressionValidationResult,
    context: ExpressionContext
  ): void {
    for (const nodeName of result.usedNodes) {
      if (!context.availableNodes.includes(nodeName)) {
        result.errors.push(
          `Referenced node "${nodeName}" not found in workflow`
        );
      }
    }
  }

  /**
   * Validate all expressions in a node's parameters
   */
  static validateNodeExpressions(
    parameters: any,
    context: ExpressionContext
  ): ExpressionValidationResult {
    const combinedResult: ExpressionValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      usedVariables: new Set(),
      usedNodes: new Set(),
    };

    this.validateParametersRecursive(parameters, context, combinedResult);
    
    combinedResult.valid = combinedResult.errors.length === 0;
    return combinedResult;
  }

  /**
   * Recursively validate expressions in parameters
   */
  private static validateParametersRecursive(
    obj: any,
    context: ExpressionContext,
    result: ExpressionValidationResult,
    path: string = ''
  ): void {
    if (typeof obj === 'string') {
      if (obj.includes('{{')) {
        const validation = this.validateExpression(obj, context);
        
        // Add path context to errors
        validation.errors.forEach(error => {
          result.errors.push(`${path}: ${error}`);
        });
        
        validation.warnings.forEach(warning => {
          result.warnings.push(`${path}: ${warning}`);
        });
        
        // Merge used variables and nodes
        validation.usedVariables.forEach(v => result.usedVariables.add(v));
        validation.usedNodes.forEach(n => result.usedNodes.add(n));
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.validateParametersRecursive(
          item,
          context,
          result,
          `${path}[${index}]`
        );
      });
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        this.validateParametersRecursive(value, context, result, newPath);
      });
    }
  }
}