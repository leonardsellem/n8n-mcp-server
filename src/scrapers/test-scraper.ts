/**
 * Test Scraper Script
 * 
 * Validates the scraping approach with a small subset of nodes
 * and demonstrates the complete pipeline functionality.
 */

import { MainScraper } from './main-scraper.js';
import { NodeValidator } from './validator.js';
import { NodeTypeInfo } from '../data/node-types.js';

/**
 * Test runner for the scraping system
 */
export class ScraperTester {
  private mainScraper: MainScraper;
  private validator: NodeValidator;
  private testResults: any = {};

  constructor() {
    this.mainScraper = new MainScraper();
    this.validator = new NodeValidator();
  }

  /**
   * Run comprehensive test suite
   */
  async runAllTests(): Promise<boolean> {
    console.log('🧪 Starting Scraper Test Suite');
    console.log('=' .repeat(50));

    let allTestsPassed = true;

    try {
      // Test 1: Validate scraping approach
      console.log('\n📋 Test 1: Validating scraping approach...');
      const approachValid = await this.testScrapingApproach();
      allTestsPassed = allTestsPassed && approachValid;
      
      // Test 2: Test node discovery
      console.log('\n🔍 Test 2: Testing node discovery...');
      const discoveryValid = await this.testNodeDiscovery();
      allTestsPassed = allTestsPassed && discoveryValid;
      
      // Test 3: Test data transformation
      console.log('\n🔄 Test 3: Testing data transformation...');
      const transformationValid = await this.testDataTransformation();
      allTestsPassed = allTestsPassed && transformationValid;
      
      // Test 4: Test data validation
      console.log('\n✅ Test 4: Testing data validation...');
      const validationValid = await this.testDataValidation();
      allTestsPassed = allTestsPassed && validationValid;
      
      // Test 5: End-to-end test
      console.log('\n🚀 Test 5: End-to-end test...');
      const e2eValid = await this.testEndToEnd();
      allTestsPassed = allTestsPassed && e2eValid;
      
      // Print final results
      this.printFinalResults(allTestsPassed);
      
      return allTestsPassed;
      
    } catch (error) {
      console.error('❌ Test suite failed with error:', error);
      return false;
    } finally {
      this.mainScraper.cleanup();
    }
  }

  /**
   * Test the basic scraping approach
   */
  async testScrapingApproach(): Promise<boolean> {
    try {
      const isValid = await this.mainScraper.validateApproach();
      
      if (isValid) {
        console.log('✅ Scraping approach validation PASSED');
        this.testResults.approachValidation = { passed: true, details: 'Basic functionality confirmed' };
      } else {
        console.log('❌ Scraping approach validation FAILED');
        this.testResults.approachValidation = { passed: false, details: 'Basic functionality issues detected' };
      }
      
      return isValid;
      
    } catch (error) {
      console.error('❌ Approach validation error:', error);
      this.testResults.approachValidation = { passed: false, error: String(error) };
      return false;
    }
  }

  /**
   * Test node discovery functionality
   */
  async testNodeDiscovery(): Promise<boolean> {
    try {
      const discoveryStats = await this.mainScraper.getDiscoveryStats();
      
      const hasNodes = discoveryStats.total > 0;
      const hasCategories = Object.keys(discoveryStats.categories).length > 0;
      const hasHighPriority = discoveryStats.highPriority > 0;
      
      const passed = hasNodes && hasCategories && hasHighPriority;
      
      console.log(`  Total nodes discovered: ${discoveryStats.total}`);
      console.log(`  Categories found: ${Object.keys(discoveryStats.categories).length}`);
      console.log(`  High priority nodes: ${discoveryStats.highPriority}`);
      
      if (passed) {
        console.log('✅ Node discovery test PASSED');
        this.testResults.nodeDiscovery = { 
          passed: true, 
          stats: discoveryStats,
          details: `Found ${discoveryStats.total} nodes across ${Object.keys(discoveryStats.categories).length} categories`
        };
      } else {
        console.log('❌ Node discovery test FAILED');
        this.testResults.nodeDiscovery = { 
          passed: false, 
          stats: discoveryStats,
          details: 'Insufficient node discovery results'
        };
      }
      
      return passed;
      
    } catch (error) {
      console.error('❌ Node discovery error:', error);
      this.testResults.nodeDiscovery = { passed: false, error: String(error) };
      return false;
    }
  }

  /**
   * Test data transformation
   */
  async testDataTransformation(): Promise<boolean> {
    try {
      // Get a small sample for testing
      const testNodes = await this.mainScraper.scrapeTest(3);
      
      const hasResults = testNodes.length > 0;
      const hasValidStructure = testNodes.every(node => 
        node.name && node.displayName && node.description && node.category
      );
      const hasProperties = testNodes.every(node => 
        node.properties && node.properties.length > 0
      );
      
      const passed = hasResults && hasValidStructure && hasProperties;
      
      console.log(`  Nodes transformed: ${testNodes.length}`);
      console.log(`  Structure valid: ${hasValidStructure}`);
      console.log(`  Has properties: ${hasProperties}`);
      
      if (passed) {
        console.log('✅ Data transformation test PASSED');
        this.testResults.dataTransformation = { 
          passed: true, 
          nodeCount: testNodes.length,
          sampleNode: testNodes[0] ? {
            name: testNodes[0].name,
            displayName: testNodes[0].displayName,
            category: testNodes[0].category,
            propertyCount: testNodes[0].properties.length
          } : null
        };
      } else {
        console.log('❌ Data transformation test FAILED');
        this.testResults.dataTransformation = { 
          passed: false, 
          nodeCount: testNodes.length,
          issues: {
            hasResults,
            hasValidStructure,
            hasProperties
          }
        };
      }
      
      return passed;
      
    } catch (error) {
      console.error('❌ Data transformation error:', error);
      this.testResults.dataTransformation = { passed: false, error: String(error) };
      return false;
    }
  }

  /**
   * Test data validation
   */
  async testDataValidation(): Promise<boolean> {
    try {
      // Get sample nodes for validation testing
      const testNodes = await this.mainScraper.scrapeTest(5);
      
      if (testNodes.length === 0) {
        console.log('❌ No nodes available for validation testing');
        return false;
      }
      
      // Run validation
      const validationResults = this.validator.validateBatch(testNodes);
      const validationStats = this.validator.getValidationStats(validationResults);
      
      const passed = validationStats.validationRate >= 0.6; // At least 60% should be valid
      
      console.log(`  Nodes validated: ${validationStats.total}`);
      console.log(`  Valid nodes: ${validationStats.valid}`);
      console.log(`  Validation rate: ${Math.round(validationStats.validationRate * 100)}%`);
      console.log(`  Average score: ${validationStats.averageScore}`);
      
      if (passed) {
        console.log('✅ Data validation test PASSED');
        this.testResults.dataValidation = { 
          passed: true, 
          stats: validationStats,
          details: `${validationStats.validationRate * 100}% validation rate with ${validationStats.averageScore} average score`
        };
      } else {
        console.log('❌ Data validation test FAILED');
        this.testResults.dataValidation = { 
          passed: false, 
          stats: validationStats,
          details: 'Validation rate below acceptable threshold'
        };
      }
      
      return passed;
      
    } catch (error) {
      console.error('❌ Data validation error:', error);
      this.testResults.dataValidation = { passed: false, error: String(error) };
      return false;
    }
  }

  /**
   * Test end-to-end functionality
   */
  async testEndToEnd(): Promise<boolean> {
    try {
      console.log('  Running complete pipeline with 5 nodes...');
      
      const startTime = Date.now();
      const results = await this.mainScraper.scrapeTest(5);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      const stats = this.mainScraper.getStats();
      
      const passed = results.length >= 3; // At least 3 successful results
      
      console.log(`  Processing time: ${Math.round(duration / 1000)}s`);
      console.log(`  Success rate: ${Math.round((1 - stats.errorRate) * 100)}%`);
      console.log(`  Results generated: ${results.length}`);
      
      if (passed) {
        console.log('✅ End-to-end test PASSED');
        this.testResults.endToEnd = { 
          passed: true, 
          duration,
          resultCount: results.length,
          stats,
          details: `Successfully processed ${results.length} nodes in ${Math.round(duration / 1000)}s`
        };
      } else {
        console.log('❌ End-to-end test FAILED');
        this.testResults.endToEnd = { 
          passed: false, 
          duration,
          resultCount: results.length,
          stats,
          details: 'Insufficient successful results'
        };
      }
      
      return passed;
      
    } catch (error) {
      console.error('❌ End-to-end test error:', error);
      this.testResults.endToEnd = { passed: false, error: String(error) };
      return false;
    }
  }

  /**
   * Print comprehensive test results
   */
  private printFinalResults(allPassed: boolean): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(50));
    
    const testNames = [
      'approachValidation',
      'nodeDiscovery', 
      'dataTransformation',
      'dataValidation',
      'endToEnd'
    ];
    
    const testLabels = [
      'Scraping Approach',
      'Node Discovery',
      'Data Transformation', 
      'Data Validation',
      'End-to-End'
    ];
    
    let passedCount = 0;
    
    testNames.forEach((testName, index) => {
      const result = this.testResults[testName];
      const status = result?.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${testLabels[index]}: ${status}`);
      
      if (result?.passed) {
        passedCount++;
      }
      
      if (result?.details) {
        console.log(`  ${result.details}`);
      }
      
      if (result?.error) {
        console.log(`  Error: ${result.error}`);
      }
    });
    
    console.log('\n' + '-'.repeat(50));
    console.log(`Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log(`Test Success Rate: ${passedCount}/${testNames.length} (${Math.round((passedCount / testNames.length) * 100)}%)`);
    
    if (allPassed) {
      console.log('\n🎉 Scraping infrastructure is ready for production use!');
      console.log('   You can now proceed with full-scale scraping.');
    } else {
      console.log('\n⚠️  Some issues were detected. Please review and fix before production use.');
    }
    
    console.log('\n📋 Next Steps:');
    if (allPassed) {
      console.log('1. Run full scraping: mainScraper.scrapeAll()');
      console.log('2. Review and validate results');
      console.log('3. Merge with existing catalog');
      console.log('4. Deploy updated catalog');
    } else {
      console.log('1. Review failed tests and error messages');
      console.log('2. Fix identified issues');
      console.log('3. Re-run test suite');
      console.log('4. Proceed when all tests pass');
    }
  }

  /**
   * Get detailed test results
   */
  public getTestResults(): any {
    return this.testResults;
  }

  /**
   * Generate test report
   */
  public generateTestReport(): string {
    const timestamp = new Date().toISOString();
    let report = `# Scraper Test Report\n\n`;
    report += `Generated: ${timestamp}\n\n`;
    
    report += `## Test Summary\n\n`;
    
    const testNames = Object.keys(this.testResults);
    const passedTests = testNames.filter(name => this.testResults[name]?.passed);
    
    report += `- Total Tests: ${testNames.length}\n`;
    report += `- Passed: ${passedTests.length}\n`;
    report += `- Failed: ${testNames.length - passedTests.length}\n`;
    report += `- Success Rate: ${Math.round((passedTests.length / testNames.length) * 100)}%\n\n`;
    
    report += `## Detailed Results\n\n`;
    
    Object.entries(this.testResults).forEach(([testName, result]: [string, any]) => {
      report += `### ${testName}\n`;
      report += `Status: ${result.passed ? 'PASSED' : 'FAILED'}\n`;
      
      if (result.details) {
        report += `Details: ${result.details}\n`;
      }
      
      if (result.error) {
        report += `Error: ${result.error}\n`;
      }
      
      if (result.stats) {
        report += `Statistics: ${JSON.stringify(result.stats, null, 2)}\n`;
      }
      
      report += `\n`;
    });
    
    return report;
  }
}

/**
 * Main test execution function
 */
export async function runScraperTests(): Promise<boolean> {
  const tester = new ScraperTester();
  
  try {
    const success = await tester.runAllTests();
    
    // Generate and log report
    const report = tester.generateTestReport();
    console.log('\n📄 Test report generated');
    
    return success;
    
  } catch (error) {
    console.error('Test execution failed:', error);
    return false;
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runScraperTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}