import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Get the project version from package.json
 * This ensures we have a single source of truth for versioning
 */
function getProjectVersion(): string {
  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || '0.0.0';
  } catch (error) {
    console.error('Failed to read version from package.json:', error);
    return '0.0.0';
  }
}

export const PROJECT_VERSION = getProjectVersion();