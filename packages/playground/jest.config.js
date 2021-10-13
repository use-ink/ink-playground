module.exports = {
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['^react-monaco-editor', '^monaco-editor'],
  moduleNameMapper: {
    '^.+.(css|scss)$': 'identity-obj-proxy',
    'monaco-editor': '<rootDir>/../../node_modules/react-monaco-editor',
  },
};
