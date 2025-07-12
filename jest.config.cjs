module.exports = {
  // Use commonjs style export
  preset: 'ts-jest/presets/default-esm', // Using ESM preset for ts-jest
  testEnvironment: 'node',
  // transform: { // Removed to let ts-jest handle transformation via preset
  //   '^.+\\.tsx?$': 'babel-jest',
  // },
  // globals: { // Deprecated way to configure ts-jest
  //   'ts-jest': {
  //     useESM: true,
  //   }
  // },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tests/tsconfig.json', // Point to the tsconfig in the tests directory
      // babelConfig: true, // If babel.config.cjs is still needed for some features not in ts-jest
    }],
  },
  // Allow src and test folders to resolve imports properly
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // For ESM, Jest might need help resolving module paths if they are not fully specified
    // or if there are conditions in package.json exports.
    // Example: '(@modelcontextprotocol/sdk)(.*)': '<rootDir>/node_modules/$1/dist$2.js'
    // This line below is a guess, might need adjustment or might not be needed.
    // '^(@modelcontextprotocol/sdk/.*)\\.js$': '<rootDir>/node_modules/$1.js',
  },
  // Handle the modelcontextprotocol SDK
  // Default is /node_modules/, so we want to NOT transform anything in node_modules
  transformIgnorePatterns: [
    "node_modules/"
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.ts', '**/src/tests/**/*.test.ts'],
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts']
};
