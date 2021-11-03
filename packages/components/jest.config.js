module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    '^.+.(css|scss)$': 'identity-obj-proxy',
  },
};
